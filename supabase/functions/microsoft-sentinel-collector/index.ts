
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MicrosoftSentinelConfig {
  workspace_id: string;
  tenant_id: string;
  client_id: string;
  client_secret: string;
  subscription_id: string;
  resource_group: string;
  workspace_name: string;
  query_timespan?: string;
}

interface SentinelIncident {
  name: string;
  properties: {
    title: string;
    description: string;
    severity: string;
    status: string;
    classification: string;
    entities: any[];
    relatedAnalyticRuleIds: string[];
    labels: any[];
    createdTimeUtc: string;
    lastActivityTimeUtc: string;
  };
}

interface KustoResult {
  tables: Array<{
    name: string;
    columns: Array<{ name: string; type: string }>;
    rows: any[][];
  }>;
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

    console.log(`Starting Microsoft Sentinel collection for data source: ${dataSourceId}`)

    // Get data source configuration
    const { data: dataSource, error: sourceError } = await supabaseClient
      .from('data_sources')
      .select('*')
      .eq('id', dataSourceId)
      .single()

    if (sourceError) throw sourceError

    const config = dataSource.config as MicrosoftSentinelConfig
    console.log(`Microsoft Sentinel config loaded for workspace: ${config.workspace_name}`)

    // Create ETL job record
    const { data: job, error: jobError } = await supabaseClient
      .from('etl_jobs')
      .insert([{
        data_source_id: dataSourceId,
        job_type: 'microsoft_sentinel_collection',
        status: 'running',
        started_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (jobError) throw jobError

    console.log(`Created ETL job: ${job.id}`)

    try {
      // Get Azure access token
      const tokenResponse = await fetch(`https://login.microsoftonline.com/${config.tenant_id}/oauth2/v2.0/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: config.client_id,
          client_secret: config.client_secret,
          scope: 'https://management.azure.com/.default'
        })
      })

      if (!tokenResponse.ok) {
        throw new Error(`Failed to get Azure token: ${tokenResponse.statusText}`)
      }

      const tokenData = await tokenResponse.json()
      const accessToken = tokenData.access_token

      console.log('Successfully obtained Azure access token for Sentinel')

      // Get Log Analytics token for querying
      const logAnalyticsTokenResponse = await fetch(`https://login.microsoftonline.com/${config.tenant_id}/oauth2/v2.0/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: config.client_id,
          client_secret: config.client_secret,
          scope: 'https://api.loganalytics.io/.default'
        })
      })

      if (!logAnalyticsTokenResponse.ok) {
        throw new Error(`Failed to get Log Analytics token: ${logAnalyticsTokenResponse.statusText}`)
      }

      const logAnalyticsTokenData = await logAnalyticsTokenResponse.json()
      const logAnalyticsToken = logAnalyticsTokenData.access_token

      let processedCount = 0
      const nodes = []
      const connections = []

      // Query SecurityIncident table for network topology insights
      const kustoQuery = `
        SecurityIncident
        | where TimeGenerated >= ago(${config.query_timespan || '24'}h)
        | join kind=leftouter (
            SecurityAlert
            | where TimeGenerated >= ago(${config.query_timespan || '24'}h)
            | mv-expand parse_json(Entities)
            | project AlertName, Entities
        ) on $left.AlertIds == $right.AlertName
        | extend SourceIP = tostring(parse_json(Entities).Address)
        | extend HostName = tostring(parse_json(Entities).HostName)
        | extend AccountName = tostring(parse_json(Entities).Name)
        | project IncidentName, Title, Severity, Status, SourceIP, HostName, AccountName, TimeGenerated
        | where isnotempty(SourceIP) or isnotempty(HostName)
        | summarize count() by SourceIP, HostName, Severity
      `

      // Execute Kusto query
      const queryResponse = await fetch(`https://api.loganalytics.io/v1/workspaces/${config.workspace_id}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${logAnalyticsToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: kustoQuery
        })
      })

      if (!queryResponse.ok) {
        throw new Error(`Failed to execute Kusto query: ${queryResponse.statusText}`)
      }

      const queryResult: KustoResult = await queryResponse.json()
      const rows = queryResult.tables[0]?.rows || []

      console.log(`Found ${rows.length} network entities from Sentinel`)

      // Process query results
      for (const row of rows) {
        try {
          const [sourceIP, hostName, severity, count] = row

          if (sourceIP || hostName) {
            // Determine node type and status
            let nodeType = 'device'
            let status = 'healthy'
            
            if (hostName && hostName.includes('server')) nodeType = 'service'
            
            // Map severity to status
            switch (severity) {
              case 'High':
                status = 'critical'
                break
              case 'Medium':
                status = 'warning'
                break
              case 'Low':
                status = 'healthy'
                break
              default:
                status = 'unknown'
            }

            const label = hostName || sourceIP || 'Unknown Entity'
            const externalId = `sentinel-${sourceIP || hostName || Math.random().toString(36)}`

            // Create network node
            const nodeData = {
              external_id: externalId,
              source_system: 'microsoft-sentinel',
              node_type: nodeType,
              label: label,
              status: status,
              metadata: {
                source_ip: sourceIP,
                hostname: hostName,
                severity: severity,
                incident_count: count,
                workspace_id: config.workspace_id,
                workspace_name: config.workspace_name,
                last_queried: new Date().toISOString()
              }
            }

            // Check if node already exists
            const { data: existingNode } = await supabaseClient
              .from('network_nodes')
              .select('id')
              .eq('external_id', externalId)
              .eq('source_system', 'microsoft-sentinel')
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

            processedCount++
          }

        } catch (error) {
          console.error(`Error processing Sentinel entity:`, error)
        }
      }

      // Query for network connections from CommonSecurityLog
      const networkConnectionsQuery = `
        CommonSecurityLog
        | where TimeGenerated >= ago(${config.query_timespan || '24'}h)
        | where isnotempty(SourceIP) and isnotempty(DestinationIP)
        | summarize count() by SourceIP, DestinationIP, DestinationPort, Protocol
        | top 100 by count_
      `

      const connectionsResponse = await fetch(`https://api.loganalytics.io/v1/workspaces/${config.workspace_id}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${logAnalyticsToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: networkConnectionsQuery
        })
      })

      if (connectionsResponse.ok) {
        const connectionsResult: KustoResult = await connectionsResponse.json()
        const connectionRows = connectionsResult.tables[0]?.rows || []

        // Process network connections
        for (const connectionRow of connectionRows) {
          try {
            const [sourceIP, destIP, destPort, protocol, connectionCount] = connectionRow

            // Find or create source and destination nodes
            const sourceNodeId = nodes.find(n => n.metadata.source_ip === sourceIP)?.id
            const destNodeId = nodes.find(n => n.metadata.source_ip === destIP)?.id

            if (sourceNodeId && destNodeId && sourceNodeId !== destNodeId) {
              const connectionData = {
                source_node_id: sourceNodeId,
                target_node_id: destNodeId,
                connection_type: 'network',
                protocol: protocol || 'unknown',
                port: destPort ? parseInt(destPort) : null,
                metadata: {
                  source_ip: sourceIP,
                  destination_ip: destIP,
                  destination_port: destPort,
                  connection_count: connectionCount,
                  discovered_via: 'sentinel-logs'
                }
              }

              connections.push(connectionData)
            }

          } catch (error) {
            console.error('Error processing network connection:', error)
          }
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
            total_entities: rows.length,
            nodes_created: nodes.length,
            connections_created: connections.length,
            workspace_id: config.workspace_id,
            workspace_name: config.workspace_name
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

      console.log(`Microsoft Sentinel collection completed successfully. Processed ${processedCount} entities.`)

      return new Response(
        JSON.stringify({
          success: true,
          message: `Microsoft Sentinel collection completed successfully`,
          processed: processedCount,
          nodes_created: nodes.length,
          connections_created: connections.length
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } catch (collectionError) {
      console.error('Microsoft Sentinel collection error:', collectionError)

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
    console.error('Microsoft Sentinel collector function error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        message: 'Microsoft Sentinel collection failed'
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
