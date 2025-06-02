
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SplunkConfig {
  endpoint: string;
  username: string;
  password: string;
  index?: string;
}

interface SplunkEvent {
  host?: string;
  source?: string;
  sourcetype?: string;
  _raw?: string;
  _time?: string;
  [key: string]: any;
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

    console.log(`Starting Splunk collection for data source: ${dataSourceId}`)

    // Get data source configuration
    const { data: dataSource, error: sourceError } = await supabaseClient
      .from('data_sources')
      .select('*')
      .eq('id', dataSourceId)
      .single()

    if (sourceError) throw sourceError

    const config = dataSource.config as SplunkConfig
    console.log(`Splunk config loaded for endpoint: ${config.endpoint}`)

    // Create ETL job record
    const { data: job, error: jobError } = await supabaseClient
      .from('etl_jobs')
      .insert([{
        data_source_id: dataSourceId,
        job_type: 'splunk_collection',
        status: 'running',
        started_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (jobError) throw jobError

    console.log(`Created ETL job: ${job.id}`)

    try {
      // Authenticate with Splunk
      const authUrl = `${config.endpoint}/services/auth/login`
      const authResponse = await fetch(authUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: config.username,
          password: config.password,
          output: 'json'
        })
      })

      if (!authResponse.ok) {
        throw new Error(`Splunk authentication failed: ${authResponse.statusText}`)
      }

      const authData = await authResponse.json()
      const sessionKey = authData.sessionKey

      console.log('Successfully authenticated with Splunk')

      // Define search queries for network topology discovery
      const searches = [
        {
          name: 'network_hosts',
          query: `search index=${config.index || '*'} earliest=-24h latest=now | eval host_info=if(isnotnull(host), host, src_ip) | stats count by host_info, sourcetype | where count > 0`,
          nodeType: 'device'
        },
        {
          name: 'network_services',
          query: `search index=${config.index || '*'} earliest=-24h latest=now port=* | stats count by dest_port, protocol, dest_ip | where count > 5`,
          nodeType: 'service'
        },
        {
          name: 'security_events',
          query: `search index=${config.index || '*'} earliest=-24h latest=now (sourcetype=*firewall* OR sourcetype=*ids* OR sourcetype=*ips*) | stats count by src_ip, dest_ip, action | where count > 0`,
          nodeType: 'device'
        },
        {
          name: 'application_logs',
          query: `search index=${config.index || '*'} earliest=-24h latest=now (sourcetype=*access* OR sourcetype=*app*) | stats count by host, source | where count > 0`,
          nodeType: 'application'
        }
      ]

      let totalProcessed = 0
      const discoveredNodes = new Map()
      const discoveredConnections = []

      // Execute each search
      for (const search of searches) {
        try {
          console.log(`Executing Splunk search: ${search.name}`)

          // Create search job
          const searchUrl = `${config.endpoint}/services/search/jobs`
          const searchResponse = await fetch(searchUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Splunk ${sessionKey}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              search: search.query,
              output_mode: 'json',
              earliest_time: '-24h',
              latest_time: 'now'
            })
          })

          if (!searchResponse.ok) {
            console.error(`Search creation failed for ${search.name}: ${searchResponse.statusText}`)
            continue
          }

          const searchData = await searchResponse.json()
          const searchId = searchData.sid

          console.log(`Created search job: ${searchId}`)

          // Wait for search to complete (simplified polling)
          let searchComplete = false
          let attempts = 0
          const maxAttempts = 30

          while (!searchComplete && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds

            const statusUrl = `${config.endpoint}/services/search/jobs/${searchId}`
            const statusResponse = await fetch(statusUrl, {
              headers: {
                'Authorization': `Splunk ${sessionKey}`,
                'Content-Type': 'application/json',
              }
            })

            if (statusResponse.ok) {
              const statusData = await statusResponse.json()
              const entry = statusData.entry[0]
              const content = entry.content

              if (content.isDone) {
                searchComplete = true
                console.log(`Search ${search.name} completed with ${content.resultCount} results`)
              }
            }

            attempts++
          }

          if (!searchComplete) {
            console.error(`Search ${search.name} did not complete in time`)
            continue
          }

          // Get search results
          const resultsUrl = `${config.endpoint}/services/search/jobs/${searchId}/results`
          const resultsResponse = await fetch(resultsUrl, {
            headers: {
              'Authorization': `Splunk ${sessionKey}`,
              'Content-Type': 'application/json',
            }
          })

          if (!resultsResponse.ok) {
            console.error(`Failed to get results for ${search.name}`)
            continue
          }

          const resultsData = await resultsResponse.json()
          const results = resultsData.results || []

          // Process results based on search type
          for (const result of results) {
            try {
              if (search.name === 'network_hosts' && result.host_info) {
                const nodeId = `splunk-host-${result.host_info}`
                if (!discoveredNodes.has(nodeId)) {
                  discoveredNodes.set(nodeId, {
                    external_id: nodeId,
                    source_system: 'splunk',
                    node_type: search.nodeType,
                    label: result.host_info,
                    status: 'healthy',
                    metadata: {
                      sourcetype: result.sourcetype,
                      event_count: parseInt(result.count) || 0,
                      discovery_method: 'host_analysis'
                    }
                  })
                }
              } else if (search.name === 'network_services' && result.dest_port) {
                const nodeId = `splunk-service-${result.dest_ip}-${result.dest_port}`
                if (!discoveredNodes.has(nodeId)) {
                  discoveredNodes.set(nodeId, {
                    external_id: nodeId,
                    source_system: 'splunk',
                    node_type: search.nodeType,
                    label: `${result.dest_ip}:${result.dest_port}`,
                    status: 'healthy',
                    metadata: {
                      port: parseInt(result.dest_port),
                      protocol: result.protocol,
                      connection_count: parseInt(result.count) || 0,
                      discovery_method: 'service_analysis'
                    }
                  })
                }
              } else if (search.name === 'security_events' && result.src_ip && result.dest_ip) {
                // Create connection between source and destination
                const sourceNodeId = `splunk-host-${result.src_ip}`
                const destNodeId = `splunk-host-${result.dest_ip}`

                // Ensure both nodes exist
                if (!discoveredNodes.has(sourceNodeId)) {
                  discoveredNodes.set(sourceNodeId, {
                    external_id: sourceNodeId,
                    source_system: 'splunk',
                    node_type: 'device',
                    label: result.src_ip,
                    status: 'warning',
                    metadata: {
                      ip_address: result.src_ip,
                      discovery_method: 'security_analysis'
                    }
                  })
                }

                if (!discoveredNodes.has(destNodeId)) {
                  discoveredNodes.set(destNodeId, {
                    external_id: destNodeId,
                    source_system: 'splunk',
                    node_type: 'device',
                    label: result.dest_ip,
                    status: 'warning',
                    metadata: {
                      ip_address: result.dest_ip,
                      discovery_method: 'security_analysis'
                    }
                  })
                }

                discoveredConnections.push({
                  source_external_id: sourceNodeId,
                  target_external_id: destNodeId,
                  connection_type: 'security',
                  metadata: {
                    action: result.action,
                    event_count: parseInt(result.count) || 0,
                    discovery_method: 'security_events'
                  }
                })
              }

              totalProcessed++
            } catch (resultError) {
              console.error('Error processing result:', resultError)
            }
          }

        } catch (searchError) {
          console.error(`Error executing search ${search.name}:`, searchError)
        }
      }

      // Insert/Update nodes in database
      const nodes = Array.from(discoveredNodes.values())
      const nodeIds = new Map()

      for (const nodeData of nodes) {
        try {
          // Check if node already exists
          const { data: existingNode } = await supabaseClient
            .from('network_nodes')
            .select('id')
            .eq('external_id', nodeData.external_id)
            .eq('source_system', 'splunk')
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

            nodeIds.set(nodeData.external_id, existingNode.id)
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

            nodeIds.set(nodeData.external_id, newNode.id)
          }
        } catch (nodeError) {
          console.error('Error processing node:', nodeError)
        }
      }

      // Insert connections
      const connectionsToInsert = []
      for (const conn of discoveredConnections) {
        const sourceId = nodeIds.get(conn.source_external_id)
        const targetId = nodeIds.get(conn.target_external_id)

        if (sourceId && targetId) {
          connectionsToInsert.push({
            source_node_id: sourceId,
            target_node_id: targetId,
            connection_type: conn.connection_type,
            metadata: conn.metadata
          })
        }
      }

      if (connectionsToInsert.length > 0) {
        const { error: connectionsError } = await supabaseClient
          .from('network_connections')
          .insert(connectionsToInsert)

        if (connectionsError) {
          console.error('Error inserting connections:', connectionsError)
        } else {
          console.log(`Inserted ${connectionsToInsert.length} connections`)
        }
      }

      // Update job as completed
      await supabaseClient
        .from('etl_jobs')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          records_processed: totalProcessed,
          metadata: {
            total_events: totalProcessed,
            nodes_created: nodes.length,
            connections_created: connectionsToInsert.length,
            searches_executed: searches.length
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

      console.log(`Splunk collection completed successfully. Processed ${totalProcessed} events.`)

      return new Response(
        JSON.stringify({
          success: true,
          message: `Splunk collection completed successfully`,
          processed: totalProcessed,
          nodes_created: nodes.length,
          connections_created: connectionsToInsert.length
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } catch (collectionError) {
      console.error('Splunk collection error:', collectionError)

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
    console.error('Splunk collector function error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        message: 'Splunk collection failed'
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
