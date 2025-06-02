
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CustomAPIConfig {
  endpoint: string;
  method?: string;
  headers?: Record<string, string>;
  auth_type?: 'none' | 'bearer' | 'api_key' | 'basic';
  api_key?: string;
  bearer_token?: string;
  username?: string;
  password?: string;
  data_path?: string;
  node_mapping?: {
    id_field: string;
    name_field: string;
    type_field?: string;
    status_field?: string;
  };
  connection_mapping?: {
    source_field: string;
    target_field: string;
    type_field?: string;
  };
}

interface APIResponse {
  data?: any;
  nodes?: any[];
  connections?: any[];
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

    console.log(`Starting Custom API collection for data source: ${dataSourceId}`)

    // Get data source configuration
    const { data: dataSource, error: sourceError } = await supabaseClient
      .from('data_sources')
      .select('*')
      .eq('id', dataSourceId)
      .single()

    if (sourceError) throw sourceError

    const config = dataSource.config as CustomAPIConfig
    console.log(`Custom API config loaded for endpoint: ${config.endpoint}`)

    // Create ETL job record
    const { data: job, error: jobError } = await supabaseClient
      .from('etl_jobs')
      .insert([{
        data_source_id: dataSourceId,
        job_type: 'custom_api_collection',
        status: 'running',
        started_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (jobError) throw jobError

    console.log(`Created ETL job: ${job.id}`)

    try {
      // Prepare request headers
      const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'Supabase-Edge-Function/1.0',
        ...config.headers
      }

      // Add authentication
      if (config.auth_type === 'bearer' && config.bearer_token) {
        requestHeaders['Authorization'] = `Bearer ${config.bearer_token}`
      } else if (config.auth_type === 'api_key' && config.api_key) {
        requestHeaders['X-API-Key'] = config.api_key
      } else if (config.auth_type === 'basic' && config.username && config.password) {
        const credentials = btoa(`${config.username}:${config.password}`)
        requestHeaders['Authorization'] = `Basic ${credentials}`
      }

      console.log('Making API request to:', config.endpoint)

      // Make API request
      const response = await fetch(config.endpoint, {
        method: config.method || 'GET',
        headers: requestHeaders
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      const apiData: APIResponse = await response.json()
      console.log('API response received successfully')

      // Extract data based on configuration
      let rawData = apiData
      if (config.data_path) {
        const pathParts = config.data_path.split('.')
        for (const part of pathParts) {
          if (rawData && typeof rawData === 'object' && part in rawData) {
            rawData = rawData[part]
          } else {
            throw new Error(`Data path ${config.data_path} not found in API response`)
          }
        }
      }

      // Ensure we have an array to work with
      const dataArray = Array.isArray(rawData) ? rawData : 
                       (rawData && typeof rawData === 'object' ? [rawData] : [])

      console.log(`Processing ${dataArray.length} items from API response`)

      let totalProcessed = 0
      const discoveredNodes = []
      const discoveredConnections = []
      const nodeMapping = new Map() // external_id -> database_id

      // Process nodes
      if (config.node_mapping) {
        const { id_field, name_field, type_field, status_field } = config.node_mapping

        for (const item of dataArray) {
          try {
            if (!item[id_field] || !item[name_field]) {
              console.warn('Skipping item missing required fields:', item)
              continue
            }

            const externalId = `custom-api-${item[id_field]}`
            const nodeType = item[type_field] || 'device'
            const status = item[status_field] || 'unknown'

            // Ensure valid node type
            const validNodeType = ['device', 'service', 'application', 'cloud'].includes(nodeType) 
              ? nodeType : 'device'

            // Ensure valid status
            const validStatus = ['healthy', 'warning', 'critical', 'unknown'].includes(status)
              ? status : 'unknown'

            const nodeData = {
              external_id: externalId,
              source_system: 'custom_api',
              node_type: validNodeType,
              label: item[name_field],
              status: validStatus,
              metadata: {
                api_endpoint: config.endpoint,
                raw_data: item,
                discovered_at: new Date().toISOString()
              }
            }

            // Check if node already exists
            const { data: existingNode } = await supabaseClient
              .from('network_nodes')
              .select('id')
              .eq('external_id', externalId)
              .eq('source_system', 'custom_api')
              .single()

            let nodeId: string
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

              nodeId = existingNode.id
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

              nodeId = newNode.id
            }

            nodeMapping.set(item[id_field], nodeId)
            discoveredNodes.push({ ...nodeData, id: nodeId })
            totalProcessed++

          } catch (itemError) {
            console.error('Error processing node item:', itemError)
          }
        }
      }

      // Process connections if mapping is provided
      if (config.connection_mapping) {
        const { source_field, target_field, type_field } = config.connection_mapping

        for (const item of dataArray) {
          try {
            const sourceId = item[source_field]
            const targetId = item[target_field]

            if (!sourceId || !targetId) {
              continue // Skip items without connection information
            }

            const sourceDatabaseId = nodeMapping.get(sourceId)
            const targetDatabaseId = nodeMapping.get(targetId)

            if (sourceDatabaseId && targetDatabaseId && sourceDatabaseId !== targetDatabaseId) {
              const connectionData = {
                source_node_id: sourceDatabaseId,
                target_node_id: targetDatabaseId,
                connection_type: item[type_field] || 'api_discovered',
                metadata: {
                  api_endpoint: config.endpoint,
                  source_external_id: sourceId,
                  target_external_id: targetId,
                  raw_data: item,
                  discovered_at: new Date().toISOString()
                }
              }

              discoveredConnections.push(connectionData)
            }

          } catch (itemError) {
            console.error('Error processing connection item:', itemError)
          }
        }
      }

      // Insert connections
      if (discoveredConnections.length > 0) {
        const { error: connectionsError } = await supabaseClient
          .from('network_connections')
          .insert(discoveredConnections)

        if (connectionsError) {
          console.error('Error inserting connections:', connectionsError)
        } else {
          console.log(`Inserted ${discoveredConnections.length} connections`)
        }
      }

      // Handle cases where API returns pre-structured network data
      if (apiData.nodes && Array.isArray(apiData.nodes)) {
        console.log(`Processing ${apiData.nodes.length} pre-structured nodes`)

        for (const node of apiData.nodes) {
          try {
            const externalId = `custom-api-structured-${node.id || Math.random().toString(36).substring(7)}`
            
            const nodeData = {
              external_id: externalId,
              source_system: 'custom_api',
              node_type: ['device', 'service', 'application', 'cloud'].includes(node.type) ? node.type : 'device',
              label: node.name || node.label || node.id || 'Unknown',
              status: ['healthy', 'warning', 'critical', 'unknown'].includes(node.status) ? node.status : 'unknown',
              metadata: {
                api_endpoint: config.endpoint,
                structured_data: true,
                raw_data: node,
                discovered_at: new Date().toISOString()
              }
            }

            const { data: newNode, error: nodeError } = await supabaseClient
              .from('network_nodes')
              .upsert([nodeData], { 
                onConflict: 'external_id,source_system',
                ignoreDuplicates: false 
              })
              .select()
              .single()

            if (!nodeError && newNode) {
              nodeMapping.set(node.id, newNode.id)
              totalProcessed++
            }

          } catch (nodeError) {
            console.error('Error processing structured node:', nodeError)
          }
        }
      }

      if (apiData.connections && Array.isArray(apiData.connections)) {
        console.log(`Processing ${apiData.connections.length} pre-structured connections`)

        const structuredConnections = []
        for (const conn of apiData.connections) {
          const sourceDatabaseId = nodeMapping.get(conn.source)
          const targetDatabaseId = nodeMapping.get(conn.target)

          if (sourceDatabaseId && targetDatabaseId) {
            structuredConnections.push({
              source_node_id: sourceDatabaseId,
              target_node_id: targetDatabaseId,
              connection_type: conn.type || 'api_structured',
              protocol: conn.protocol,
              port: conn.port,
              metadata: {
                api_endpoint: config.endpoint,
                structured_data: true,
                raw_data: conn,
                discovered_at: new Date().toISOString()
              }
            })
          }
        }

        if (structuredConnections.length > 0) {
          const { error: structuredError } = await supabaseClient
            .from('network_connections')
            .insert(structuredConnections)

          if (!structuredError) {
            discoveredConnections.push(...structuredConnections)
          }
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
            api_endpoint: config.endpoint,
            total_items: dataArray.length,
            nodes_created: discoveredNodes.length,
            connections_created: discoveredConnections.length,
            has_structured_data: !!(apiData.nodes || apiData.connections),
            auth_type: config.auth_type || 'none'
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

      console.log(`Custom API collection completed successfully. Processed ${totalProcessed} items.`)

      return new Response(
        JSON.stringify({
          success: true,
          message: `Custom API collection completed successfully`,
          processed: totalProcessed,
          nodes_created: discoveredNodes.length,
          connections_created: discoveredConnections.length
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } catch (collectionError) {
      console.error('Custom API collection error:', collectionError)

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
    console.error('Custom API collector function error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        message: 'Custom API collection failed'
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
