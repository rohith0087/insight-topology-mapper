
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
        job_type: 'aws_discovery',
        status: 'running'
      })
      .select()
      .single()

    if (etlError) throw etlError

    // Simulate AWS discovery (in production, this would use AWS SDK)
    const mockAwsResources = [
      {
        id: 'i-1234567890abcdef0',
        type: 'EC2',
        name: 'Web Server',
        region: 'us-east-1',
        vpc: 'vpc-12345678',
        status: 'running'
      },
      {
        id: 'rds-prod-mysql',
        type: 'RDS',
        name: 'Production Database',
        region: 'us-east-1',
        engine: 'MySQL',
        status: 'available'
      },
      {
        id: 'vpc-12345678',
        type: 'VPC',
        name: 'Production VPC',
        region: 'us-east-1',
        cidr: '10.0.0.0/16',
        status: 'available'
      }
    ]

    let recordsProcessed = 0
    let errorsCount = 0

    for (const resource of mockAwsResources) {
      try {
        const nodeType = resource.type === 'EC2' ? 'device' : 
                        resource.type === 'RDS' ? 'service' : 'cloud'

        const { error: nodeError } = await supabaseClient
          .from('network_nodes')
          .upsert({
            external_id: resource.id,
            source_system: 'aws',
            node_type: nodeType,
            label: resource.name,
            status: resource.status === 'running' || resource.status === 'available' ? 'healthy' : 'warning',
            metadata: {
              resource_type: resource.type,
              region: resource.region,
              vpc: resource.vpc,
              cidr: resource.cidr,
              engine: resource.engine
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
