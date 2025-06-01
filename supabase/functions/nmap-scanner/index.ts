
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Create ETL job record
    const { data: etlJob, error: etlError } = await supabaseClient
      .from('etl_jobs')
      .insert({
        data_source_id: req.headers.get('data-source-id'),
        job_type: 'nmap_scan',
        status: 'running'
      })
      .select()
      .single()

    if (etlError) throw etlError

    // Simulate nmap scan (in production, this would call actual nmap)
    const mockScanResults = [
      {
        ip: '192.168.1.1',
        hostname: 'gateway.local',
        ports: [22, 80, 443],
        os: 'Linux',
        vendor: 'Cisco'
      },
      {
        ip: '192.168.1.10',
        hostname: 'server1.local',
        ports: [22, 80, 3306],
        os: 'Ubuntu',
        vendor: 'Dell'
      }
    ]

    let recordsProcessed = 0
    let errorsCount = 0

    for (const device of mockScanResults) {
      try {
        // Insert network node
        const { error: nodeError } = await supabaseClient
          .from('network_nodes')
          .upsert({
            external_id: device.ip,
            source_system: 'nmap',
            node_type: 'device',
            label: device.hostname || device.ip,
            status: 'healthy',
            metadata: {
              ip: device.ip,
              hostname: device.hostname,
              os: device.os,
              vendor: device.vendor,
              ports: device.ports.length
            }
          })

        if (nodeError) {
          errorsCount++
          console.error('Node insert error:', nodeError)
        } else {
          recordsProcessed++
        }
      } catch (error) {
        errorsCount++
        console.error('Processing error:', error)
      }
    }

    // Update ETL job status
    await supabaseClient
      .from('etl_jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        records_processed: recordsProcessed,
        errors_count: errorsCount
      })
      .eq('id', etlJob.id)

    // Update data source last sync
    await supabaseClient
      .from('data_sources')
      .update({
        last_sync: new Date().toISOString(),
        sync_status: 'success'
      })
      .eq('id', req.headers.get('data-source-id'))

    return new Response(
      JSON.stringify({ 
        success: true, 
        recordsProcessed, 
        errorsCount,
        jobId: etlJob.id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('ETL error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
