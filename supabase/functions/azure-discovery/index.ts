
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AzureConfig {
  subscription_id: string;
  tenant_id: string;
  client_id: string;
  client_secret: string;
}

interface AzureResource {
  id: string;
  name: string;
  type: string;
  location: string;
  resourceGroup: string;
  properties?: any;
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

    console.log(`Starting Azure discovery for data source: ${dataSourceId}`)

    // Get data source configuration
    const { data: dataSource, error: sourceError } = await supabaseClient
      .from('data_sources')
      .select('*')
      .eq('id', dataSourceId)
      .single()

    if (sourceError) throw sourceError

    const config = dataSource.config as AzureConfig
    console.log(`Azure config loaded for subscription: ${config.subscription_id}`)

    // Create ETL job record
    const { data: job, error: jobError } = await supabaseClient
      .from('etl_jobs')
      .insert([{
        data_source_id: dataSourceId,
        job_type: 'azure_discovery',
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

      console.log('Successfully obtained Azure access token')

      // Discover Azure resources
      const resourcesResponse = await fetch(
        `https://management.azure.com/subscriptions/${config.subscription_id}/resources?api-version=2021-04-01`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!resourcesResponse.ok) {
        throw new Error(`Failed to fetch Azure resources: ${resourcesResponse.statusText}`)
      }

      const resourcesData = await resourcesResponse.json()
      const resources: AzureResource[] = resourcesData.value || []

      console.log(`Found ${resources.length} Azure resources`)

      let processedCount = 0
      const nodes = []
      const connections = []

      // Process each resource
      for (const resource of resources) {
        try {
          // Determine node type based on Azure resource type
          let nodeType = 'cloud'
          if (resource.type.includes('virtualMachines')) nodeType = 'device'
          else if (resource.type.includes('networkInterfaces') || resource.type.includes('loadBalancers')) nodeType = 'service'
          else if (resource.type.includes('applications') || resource.type.includes('websites')) nodeType = 'application'

          // Determine status (simplified - in real implementation, check actual resource health)
          const status = 'healthy'

          // Create network node
          const nodeData = {
            external_id: resource.id,
            source_system: 'azure',
            node_type: nodeType,
            label: resource.name,
            status: status,
            metadata: {
              resource_type: resource.type,
              location: resource.location,
              resource_group: resource.resourceGroup,
              subscription_id: config.subscription_id,
              properties: resource.properties || {}
            }
          }

          // Check if node already exists
          const { data: existingNode } = await supabaseClient
            .from('network_nodes')
            .select('id')
            .eq('external_id', resource.id)
            .eq('source_system', 'azure')
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

          // For network interfaces and load balancers, try to discover connections
          if (resource.type.includes('networkInterfaces') || resource.type.includes('loadBalancers')) {
            try {
              // Get detailed resource information to find connections
              const detailResponse = await fetch(
                `https://management.azure.com${resource.id}?api-version=2021-02-01`,
                {
                  headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                  }
                }
              )

              if (detailResponse.ok) {
                const detailData = await detailResponse.json()
                
                // Look for connections in the properties
                if (detailData.properties && detailData.properties.ipConfigurations) {
                  for (const ipConfig of detailData.properties.ipConfigurations) {
                    if (ipConfig.properties && ipConfig.properties.subnet) {
                      // Create connection to subnet
                      const connectionData = {
                        source_node_id: nodes[nodes.length - 1].id,
                        target_node_id: nodes[nodes.length - 1].id, // Self-reference for now
                        connection_type: 'network',
                        protocol: 'azure-vnet',
                        metadata: {
                          subnet_id: ipConfig.properties.subnet.id,
                          private_ip: ipConfig.properties.privateIPAddress,
                          allocation_method: ipConfig.properties.privateIPAllocationMethod
                        }
                      }

                      connections.push(connectionData)
                    }
                  }
                }
              }
            } catch (detailError) {
              console.error('Error getting resource details:', detailError)
            }
          }

        } catch (error) {
          console.error(`Error processing resource ${resource.name}:`, error)
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
            total_resources: resources.length,
            nodes_created: nodes.length,
            connections_created: connections.length,
            subscription_id: config.subscription_id
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

      console.log(`Azure discovery completed successfully. Processed ${processedCount} resources.`)

      return new Response(
        JSON.stringify({
          success: true,
          message: `Azure discovery completed successfully`,
          processed: processedCount,
          nodes_created: nodes.length,
          connections_created: connections.length
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } catch (discoveryError) {
      console.error('Azure discovery error:', discoveryError)

      // Update job as failed
      await supabaseClient
        .from('etl_jobs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_details: { error: discoveryError.message },
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

      throw discoveryError
    }

  } catch (error) {
    console.error('Azure discovery function error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        message: 'Azure discovery failed'
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
