
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface QRadarConfig {
  qradar_host: string;
  port?: string;
  username?: string;
  password?: string;
  auth_token?: string;
  domain_id?: string;
  version?: string;
}

interface QRadarAsset {
  id: number;
  domain_id: number;
  hostname?: string;
  ip_addresses: Array<{ value: string; type: string }>;
  mac_addresses?: Array<{ value: string; interface: string }>;
  products?: Array<{ product_variant_id: number; product_name: string }>;
  vulnerabilities?: Array<{ id: string; name: string; severity: number }>;
  properties?: Array<{ name: string; value: string }>;
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

    console.log(`Starting QRadar collection for data source: ${dataSourceId}`)

    // Get data source configuration
    const { data: dataSource, error: sourceError } = await supabaseClient
      .from('data_sources')
      .select('*')
      .eq('id', dataSourceId)
      .single()

    if (sourceError) throw sourceError

    const config = dataSource.config as QRadarConfig
    console.log(`QRadar config loaded for host: ${config.qradar_host}`)

    // Create ETL job record
    const { data: job, error: jobError } = await supabaseClient
      .from('etl_jobs')
      .insert([{
        data_source_id: dataSourceId,
        job_type: 'qradar_collection',
        status: 'running',
        started_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (jobError) throw jobError

    console.log(`Created ETL job: ${job.id}`)

    try {
      // Build headers for QRadar API
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Version': config.version || '19.0'
      }

      // Add authentication
      if (config.auth_token) {
        headers['SEC'] = config.auth_token
      } else if (config.username && config.password) {
        const credentials = btoa(`${config.username}:${config.password}`)
        headers['Authorization'] = `Basic ${credentials}`
      } else {
        throw new Error('Either auth_token or username/password must be provided')
      }

      const port = config.port || '443'
      const protocol = port === '443' ? 'https' : 'http'
      const baseUrl = `${protocol}://${config.qradar_host}:${port}/api`

      // Fetch assets from QRadar
      const assetsUrl = `${baseUrl}/asset_model/assets`
      const params = new URLSearchParams({
        domain_id: config.domain_id || '0',
        Range: 'items=0-999'
      })

      const assetsResponse = await fetch(`${assetsUrl}?${params}`, {
        headers,
        // Disable SSL verification for self-signed certificates (common in QRadar)
        // Note: In production, proper certificate handling should be implemented
      })

      if (!assetsResponse.ok) {
        throw new Error(`Failed to fetch QRadar assets: ${assetsResponse.statusText}`)
      }

      const assets: QRadarAsset[] = await assetsResponse.json()

      console.log(`Found ${assets.length} QRadar assets`)

      let processedCount = 0
      const nodes = []
      const connections = []

      // Process each asset
      for (const asset of assets) {
        try {
          // Determine node type based on asset properties
          let nodeType = 'device'
          const products = asset.products || []
          
          if (products.some(p => p.product_name.toLowerCase().includes('server'))) {
            nodeType = 'service'
          } else if (products.some(p => p.product_name.toLowerCase().includes('network'))) {
            nodeType = 'service'
          } else if (products.some(p => p.product_name.toLowerCase().includes('application'))) {
            nodeType = 'application'
          }

          // Determine status based on vulnerabilities
          let status = 'healthy'
          const vulnerabilities = asset.vulnerabilities || []
          if (vulnerabilities.length > 0) {
            const highSeverity = vulnerabilities.some(v => v.severity >= 7)
            status = highSeverity ? 'critical' : 'warning'
          }

          // Get primary IP address
          const primaryIp = asset.ip_addresses?.[0]?.value || 'unknown'
          const hostname = asset.hostname || `asset-${asset.id}`

          // Create network node
          const nodeData = {
            external_id: asset.id.toString(),
            source_system: 'qradar',
            node_type: nodeType,
            label: hostname,
            status: status,
            metadata: {
              ip_addresses: asset.ip_addresses || [],
              mac_addresses: asset.mac_addresses || [],
              products: products,
              vulnerabilities: vulnerabilities,
              properties: asset.properties || [],
              domain_id: asset.domain_id,
              primary_ip: primaryIp
            }
          }

          // Check if node already exists
          const { data: existingNode } = await supabaseClient
            .from('network_nodes')
            .select('id')
            .eq('external_id', asset.id.toString())
            .eq('source_system', 'qradar')
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

          // Create connections based on IP addresses and MAC addresses
          if (asset.mac_addresses && asset.mac_addresses.length > 0) {
            for (const macAddr of asset.mac_addresses) {
              const connectionData = {
                source_node_id: nodes[nodes.length - 1].id,
                target_node_id: nodes[nodes.length - 1].id, // Self-reference for now
                connection_type: 'network',
                protocol: 'ethernet',
                metadata: {
                  mac_address: macAddr.value,
                  interface: macAddr.interface,
                  ip_addresses: asset.ip_addresses?.map(ip => ip.value) || []
                }
              }

              connections.push(connectionData)
            }
          }

          processedCount++

        } catch (error) {
          console.error(`Error processing asset ${asset.id}:`, error)
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
            total_assets: assets.length,
            nodes_created: nodes.length,
            connections_created: connections.length,
            qradar_host: config.qradar_host
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

      console.log(`QRadar collection completed successfully. Processed ${processedCount} assets.`)

      return new Response(
        JSON.stringify({
          success: true,
          message: `QRadar collection completed successfully`,
          processed: processedCount,
          nodes_created: nodes.length,
          connections_created: connections.length
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } catch (collectionError) {
      console.error('QRadar collection error:', collectionError)

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
    console.error('QRadar collector function error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        message: 'QRadar collection failed'
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
