
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

    // Check if this is for a specific data source
    let specificDataSourceId = null;
    
    try {
      const body = await req.json();
      specificDataSourceId = body?.dataSourceId;
    } catch (e) {
      // No body or invalid JSON, continue with all sources
      console.log('No specific data source ID provided, processing all sources');
    }
    
    let dataSources;
    if (specificDataSourceId) {
      // Get specific data source
      const { data: singleSource, error: sourceError } = await supabaseClient
        .from('data_sources')
        .select('*')
        .eq('id', specificDataSourceId)
        .eq('enabled', true)
        .single();
      
      if (sourceError) throw sourceError;
      dataSources = singleSource ? [singleSource] : [];
    } else {
      // Get all enabled data sources
      const { data: allSources, error: sourcesError } = await supabaseClient
        .from('data_sources')
        .select('*')
        .eq('enabled', true);
      
      if (sourcesError) throw sourcesError;
      dataSources = allSources || [];
    }

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
          case 'azure':
            functionName = 'azure-discovery'
            break
          case 'splunk':
            functionName = 'splunk-collector'
            break
          case 'snmp':
            functionName = 'snmp-collector'
            break
          case 'api':
            functionName = 'custom-api-collector'
            break
          case 'sentinelone':
            functionName = 'sentinelone-collector'
            break
          case 'qradar':
            functionName = 'qradar-collector'
            break
          case 'datadog':
            functionName = 'datadog-collector'
            break
          case 'microsoft-sentinel':
            functionName = 'microsoft-sentinel-collector'
            break
          default:
            console.log(`No ETL function for source type: ${source.type}`)
            continue
        }

        console.log(`Invoking ${functionName} for data source: ${source.name}`)

        // Call the appropriate ETL function using Supabase client
        const { data: result, error: functionError } = await supabaseClient.functions.invoke(functionName, {
          body: { dataSourceId: source.id }
        })

        if (functionError) {
          console.error(`Error calling ${functionName}:`, functionError)
          results.push({
            source: source.name,
            type: source.type,
            success: false,
            error: functionError.message,
            function_name: functionName
          })
        } else {
          console.log(`Successfully called ${functionName} for ${source.name}`)
          results.push({
            source: source.name,
            type: source.type,
            success: true,
            result: result,
            function_name: functionName
          })
        }

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

    const successCount = results.filter(r => r.success).length
    const totalCount = results.length

    console.log(`ETL orchestration completed: ${successCount}/${totalCount} sources processed successfully`)

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `ETL orchestration completed: ${successCount}/${totalCount} sources processed successfully`,
        processed: totalCount,
        successful: successCount,
        failed: totalCount - successCount,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Orchestrator error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        message: 'ETL orchestration failed'
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
