
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DataDogConfig {
  api_key: string;
  app_key: string;
  site?: string;
  organization?: string;
  tags_filter?: string;
  metric_window?: string;
  include_services?: string;
}

interface DataDogHost {
  host_name: string;
  aliases?: string[];
  apps?: string[];
  aws?: any;
  azure?: any;
  gcp?: any;
  host_tags?: string[];
  last_reported_time?: number;
  meta?: any;
  metrics?: any;
  sources?: string[];
  up?: boolean;
  tags_by_source?: Record<string, string[]>;
}

interface DataDogService {
  service: string;
  env: string;
  type?: string;
  last_seen?: number;
  application?: string;
  tags?: string[];
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

    console.log(`Starting DataDog collection for data source: ${dataSourceId}`)

    // Get data source configuration
    const { data: dataSource, error: sourceError } = await supabaseClient
      .from('data_sources')
      .select('*')
      .eq('id', dataSourceId)
      .single()

    if (sourceError) throw sourceError

    const config = dataSource.config as DataDogConfig
    console.log(`DataDog config loaded for site: ${config.site || 'datadoghq.com'}`)

    // Create ETL job record
    const { data: job, error: jobError } = await supabaseClient
      .from('etl_jobs')
      .insert([{
        data_source_id: dataSourceId,
        job_type: 'datadog_collection',
        status: 'running',
        started_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (jobError) throw jobError

    console.log(`Created ETL job: ${job.id}`)

    try {
      const site = config.site || 'datadoghq.com'
      const baseUrl = `https://api.${site}/api/v1`

      const headers = {
        'DD-API-KEY': config.api_key,
        'DD-APPLICATION-KEY': config.app_key,
        'Content-Type': 'application/json'
      }

      // Fetch hosts from DataDog
      const hostsResponse = await fetch(`${baseUrl}/hosts`, {
        headers
      })

      if (!hostsResponse.ok) {
        throw new Error(`Failed to fetch DataDog hosts: ${hostsResponse.statusText}`)
      }

      const hostsData = await hostsResponse.json()
      const hosts: DataDogHost[] = hostsData.host_list || []

      console.log(`Found ${hosts.length} DataDog hosts`)

      let processedCount = 0
      const nodes = []
      const connections = []

      // Process each host
      for (const host of hosts) {
        try {
          // Determine node type based on tags and metadata
          let nodeType = 'device'
          const tags = host.host_tags || []
          
          if (tags.some(tag => tag.includes('database'))) {
            nodeType = 'service'
          } else if (tags.some(tag => tag.includes('web') || tag.includes('app'))) {
            nodeType = 'application'
          } else if (host.aws || host.azure || host.gcp) {
            nodeType = 'cloud'
          }

          // Determine status based on uptime and last reported
          let status = 'unknown'
          if (host.up !== undefined) {
            status = host.up ? 'healthy' : 'critical'
          } else if (host.last_reported_time) {
            const lastReported = new Date(host.last_reported_time * 1000)
            const hoursSinceReport = (Date.now() - lastReported.getTime()) / (1000 * 60 * 60)
            status = hoursSinceReport < 1 ? 'healthy' : 'warning'
          }

          // Create network node
          const nodeData = {
            external_id: host.host_name,
            source_system: 'datadog',
            node_type: nodeType,
            label: host.host_name,
            status: status,
            metadata: {
              aliases: host.aliases || [],
              apps: host.apps || [],
              tags: host.host_tags || [],
              sources: host.sources || [],
              aws_metadata: host.aws || null,
              azure_metadata: host.azure || null,
              gcp_metadata: host.gcp || null,
              last_reported_time: host.last_reported_time,
              up: host.up,
              tags_by_source: host.tags_by_source || {},
              meta: host.meta || {}
            }
          }

          // Check if node already exists
          const { data: existingNode } = await supabaseClient
            .from('network_nodes')
            .select('id')
            .eq('external_id', host.host_name)
            .eq('source_system', 'datadog')
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

        } catch (error) {
          console.error(`Error processing host ${host.host_name}:`, error)
        }
      }

      // Fetch and process APM services if enabled
      if (config.include_services === 'true') {
        try {
          const servicesResponse = await fetch(`${baseUrl}/services`, {
            headers
          })

          if (servicesResponse.ok) {
            const servicesData = await servicesResponse.json()
            const services: DataDogService[] = servicesData || []

            console.log(`Found ${services.length} DataDog services`)

            for (const service of services) {
              try {
                const serviceNodeData = {
                  external_id: `${service.service}-${service.env}`,
                  source_system: 'datadog',
                  node_type: 'application',
                  label: `${service.service} (${service.env})`,
                  status: 'healthy',
                  metadata: {
                    service_name: service.service,
                    environment: service.env,
                    service_type: service.type,
                    application: service.application,
                    tags: service.tags || [],
                    last_seen: service.last_seen
                  }
                }

                // Check if service node already exists
                const { data: existingServiceNode } = await supabaseClient
                  .from('network_nodes')
                  .select('id')
                  .eq('external_id', `${service.service}-${service.env}`)
                  .eq('source_system', 'datadog')
                  .single()

                if (existingServiceNode) {
                  await supabaseClient
                    .from('network_nodes')
                    .update({
                      ...serviceNodeData,
                      updated_at: new Date().toISOString(),
                      last_seen: new Date().toISOString()
                    })
                    .eq('id', existingServiceNode.id)

                  nodes.push({ ...serviceNodeData, id: existingServiceNode.id })
                } else {
                  const { data: newServiceNode, error: serviceNodeError } = await supabaseClient
                    .from('network_nodes')
                    .insert([serviceNodeData])
                    .select()
                    .single()

                  if (!serviceNodeError) {
                    nodes.push(newServiceNode)
                  }
                }

                processedCount++

              } catch (error) {
                console.error(`Error processing service ${service.service}:`, error)
              }
            }
          }
        } catch (error) {
          console.error('Error fetching DataDog services:', error)
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
            total_hosts: hosts.length,
            nodes_created: nodes.length,
            connections_created: connections.length,
            site: config.site || 'datadoghq.com'
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

      console.log(`DataDog collection completed successfully. Processed ${processedCount} items.`)

      return new Response(
        JSON.stringify({
          success: true,
          message: `DataDog collection completed successfully`,
          processed: processedCount,
          nodes_created: nodes.length,
          connections_created: connections.length
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } catch (collectionError) {
      console.error('DataDog collection error:', collectionError)

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
    console.error('DataDog collector function error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        message: 'DataDog collection failed'
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
