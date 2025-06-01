
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

    // Get all enabled data sources
    const { data: dataSources, error: sourcesError } = await supabaseClient
      .from('data_sources')
      .select('*')
      .eq('enabled', true)

    if (sourcesError) throw sourcesError

    const results = []

    for (const source of dataSources) {
      try {
        let functionName = ''
        
        switch (source.type) {
          case 'nmap':
            functionName = 'nmap-scanner'
            break
          case 'aws':
            functionName = 'aws-discovery'
            break
          case 'splunk':
            functionName = 'splunk-collector'
            break
          case 'azure':
            functionName = 'azure-discovery'
            break
          default:
            console.log(`No ETL function for source type: ${source.type}`)
            continue
        }

        // Call the appropriate ETL function
        const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/${functionName}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
            'data-source-id': source.id,
            'Content-Type': 'application/json'
          }
        })

        const result = await response.json()
        results.push({
          source: source.name,
          type: source.type,
          success: response.ok,
          result
        })

      } catch (error) {
        console.error(`Error processing source ${source.name}:`, error)
        results.push({
          source: source.name,
          type: source.type,
          success: false,
          error: error.message
        })
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        processed: results.length,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Orchestrator error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
