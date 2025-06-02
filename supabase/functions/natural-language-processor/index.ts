
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NLQuery {
  query: string;
  user_id?: string;
  tenant_id?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { query }: NLQuery = await req.json()

    // Get user info
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      throw new Error('Unauthorized')
    }

    // Call OpenAI to process natural language query
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a network query translator. Convert natural language queries to structured filters for network topology data.

Available filters:
- node_type: 'device', 'service', 'application', 'cloud'
- status: 'healthy', 'warning', 'critical', 'unknown'
- metadata fields: ip_address, hostname, port, etc.

Return ONLY a JSON object with this exact structure:
{
  "filters": {
    "showDevices": boolean,
    "showServices": boolean, 
    "showApplications": boolean,
    "showCloudResources": boolean,
    "showConnections": boolean,
    "statusFilter": "all" | "healthy" | "warning" | "critical",
    "searchTerm": string,
    "customFilters": {}
  },
  "description": "Human readable description of what was found"
}

Examples:
"show critical servers" -> {"filters": {"showDevices": true, "showServices": false, "showApplications": false, "showCloudResources": false, "showConnections": true, "statusFilter": "critical", "searchTerm": "", "customFilters": {}}, "description": "Showing critical devices"}
"find all healthy applications" -> {"filters": {"showDevices": false, "showServices": false, "showApplications": true, "showCloudResources": false, "showConnections": true, "statusFilter": "healthy", "searchTerm": "", "customFilters": {}}, "description": "Showing healthy applications"}`
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.1,
        max_tokens: 500
      })
    })

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${openAIResponse.statusText}`)
    }

    const openAIData = await openAIResponse.json()
    const aiResponse = openAIData.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('No response from AI')
    }

    // Parse the AI response
    let translatedFilters
    try {
      translatedFilters = JSON.parse(aiResponse)
    } catch (e) {
      // Fallback if JSON parsing fails
      translatedFilters = {
        filters: {
          showDevices: true,
          showServices: true,
          showApplications: true,
          showCloudResources: true,
          showConnections: true,
          statusFilter: 'all',
          searchTerm: query,
          customFilters: {}
        },
        description: `Searching for: ${query}`
      }
    }

    // Store the query in database
    const { data: savedQuery, error: saveError } = await supabaseClient
      .from('natural_language_queries')
      .upsert({
        user_id: user.id,
        tenant_id: user.user_metadata?.tenant_id,
        query_text: query,
        translated_filters: translatedFilters,
        execution_count: 1,
        last_executed_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,query_text',
        ignoreDuplicates: false
      })

    if (saveError) {
      console.warn('Failed to save query:', saveError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        query: query,
        filters: translatedFilters.filters,
        description: translatedFilters.description,
        saved_query_id: savedQuery?.[0]?.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('NL processing error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        filters: {
          showDevices: true,
          showServices: true,
          showApplications: true,
          showCloudResources: true,
          showConnections: true,
          statusFilter: 'all',
          searchTerm: '',
          customFilters: {}
        },
        description: 'Failed to process query'
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
