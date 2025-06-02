
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SentinelOneConfig {
  console_url: string;
  api_token: string;
  site_id?: string;
  account_id?: string;
}

interface SentinelOneAgent {
  id: string;
  computerName: string;
  networkStatus: string;
  osType: string;
  ip: string;
  networkInterfaces: any[];
  lastActiveDate: string;
  isActive: boolean;
  domain: string;
  machineType: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const dataSourceId = req.headers.get('data-source-id')
    if (!dataSourceId) {
      throw new Error('Missing data-source-id header')
    }

    console.log(`Starting SentinelOne collection for data source: ${dataSourceId}`)

    // Get data source configuration
    const { data: dataSource, error: sourceError } = await supabaseClient
      .from('data_sources')
      .select('*')
      .eq('id', dataSourceId)
      .single()

    if (sourceError) throw sourceError

    const config = dataSource.config as SentinelOneConfig
    console.log(`SentinelOne config loaded for console: ${config.console_url}`)

    // Create ETL job record
    const { data: job, error: jobError } = await supabaseClient
      .from('etl_jobs')
      .insert([{
        data_source_id: dataSourceId,
        job_type: 'sentinelone_collection',
        status: 'running',
        started_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (jobError) throw jobError

    console.log(`Created ETL job: ${job.id}`)

    try {
      // Build API URL
      let apiUrl = `${config.console_url}/web/api/v2.1/agents`
      const params = new URLSearchParams({
        limit: '1000',
        isActive: 'true'
      })
      
      if (config.site_id) params.append('siteIds', config.site_id)
      if (config.account_id) params.append('accountIds', config.account_id)

      // Fetch agents from SentinelOne
      const agentsResponse = await fetch(`${apiUrl}?${params}`, {
        headers: {
          'Authorization': `ApiToken ${config.api_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!agentsResponse.ok) {
        throw new Error(`Failed to fetch SentinelOne agents: ${agentsResponse.statusText}`)
      }

      const agentsData = await agentsResponse.json()
      const agents: SentinelOneAgent[] = agentsData.data || []

      console.log(`Found ${agents.length} SentinelOne agents`)

      let processedCount = 0
      const nodes = []
      const connections = []

      // Process each agent
      for (const agent of agents) {
        try {
          // Determine node type based on machine type and OS
          let nodeType = 'device'
          if (agent.machineType === 'server') nodeType = 'service'
          else if (agent.osType.toLowerCase().includes('windows')) nodeType = 'device'
          else if (agent.osType.toLowerCase().includes('linux')) nodeType = 'device'

          // Determine status based on activity
          const status = agent.isActive ? 'healthy' : 'warning'

          // Create network node
          const nodeData = {
            external_id: agent.id,
            source_system: 'sentinelone',
            node_type: nodeType,
            label: agent.computerName,
            status: status,
            metadata: {
              ip_address: agent.ip,
              os_type: agent.osType,
              machine_type: agent.machineType,
              domain: agent.domain,
              network_status: agent.networkStatus,
              last_active: agent.lastActiveDate,
              network_interfaces: agent.networkInterfaces || [],
              is_active: agent.isActive
            }
          }

          // Check if node already exists
          const { data: existingNode } = await supabaseClient
            .from('network_nodes')
            .select('id')
            .eq('external_id', agent.id)
            .eq('source_system', 'sentinelone')
            .single()

          if (existingNode) {
            // Update existing node
            await supabaseClient
              .from('network_nodes')
              .update({
                ...nodeData,
                updated_at: new Date().toISOString(),
                last_seen: new Date().toISOString()
              })
              .eq('id', existingNode.id)

            nodes.push({ ...nodeData, id: existingNode.id })
          } else {
            // Insert new node
            const { data: newNode, error: nodeError } = await supabaseClient
              .from('network_nodes')
              .insert([nodeData])
              .select()
              .single()

            if (nodeError) {
              console.error('Error inserting node:', nodeError)
              continue
            }

            nodes.push(newNode)
          }

          // Create connections based on network interfaces
          if (agent.networkInterfaces && agent.networkInterfaces.length > 0) {
            for (const netInterface of agent.networkInterfaces) {
              if (netInterface.inet && netInterface.inet.length > 0) {
                for (const inet of netInterface.inet) {
                  const connectionData = {
                    source_node_id: nodes[nodes.length - 1].id,
                    target_node_id: nodes[nodes.length - 1].id, // Self-reference for now
                    connection_type: 'network',
                    protocol: 'ethernet',
                    metadata: {
                      interface_name: netInterface.name,
                      ip_address: inet,
                      mac_address: netInterface.physical,
                      gateway: netInterface.gatewayIp,
                      subnet: netInterface.gatewayMacAddress
                    }
                  }

                  connections.push(connectionData)
                }
              }
            }
          }

          processedCount++

        } catch (error) {
          console.error(`Error processing agent ${agent.computerName}:`, error)
        }
      }

      // Insert connections
      if (connections.length > 0) {
        const { error: connectionsError } = await supabaseClient
          .from('network_connections')
          .insert(connections)

        if (connectionsError) {
          console.error('Error inserting connections:', connectionsError)
        } else {
          console.log(`Inserted ${connections.length} connections`)
        }
      }

      // Update job as completed
      await supabaseClient
        .from('etl_jobs')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          records_processed: processedCount,
          metadata: {
            total_agents: agents.length,
            nodes_created: nodes.length,
            connections_created: connections.length,
            console_url: config.console_url
          }
        })
        .eq('id', job.id)

      // Update data source sync status
      await supabaseClient
        .from('data_sources')
        .update({
          last_sync: new Date().toISOString(),
          sync_status: 'success'
        })
        .eq('id', dataSourceId)

      console.log(`SentinelOne collection completed successfully. Processed ${processedCount} agents.`)

      return new Response(
        JSON.stringify({
          success: true,
          message: `SentinelOne collection completed successfully`,
          processed: processedCount,
          nodes_created: nodes.length,
          connections_created: connections.length
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } catch (collectionError) {
      console.error('SentinelOne collection error:', collectionError)

      // Update job as failed
      await supabaseClient
        .from('etl_jobs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_details: { error: collectionError.message },
          errors_count: 1
        })
        .eq('id', job.id)

      // Update data source sync status
      await supabaseClient
        .from('data_sources')
        .update({
          sync_status: 'error'
        })
        .eq('id', dataSourceId)

      throw collectionError
    }

  } catch (error) {
    console.error('SentinelOne collector function error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        message: 'SentinelOne collection failed'
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
