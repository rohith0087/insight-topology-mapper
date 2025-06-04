
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { username, password, adminKey } = await req.json()

    console.log('Received setup request for username:', username)
    console.log('Admin key provided:', adminKey ? 'YES' : 'NO')

    // Check admin key for security
    const expectedAdminKey = Deno.env.get('SUPPORT_ADMIN_CREATION_KEY')
    console.log('Expected admin key exists:', expectedAdminKey ? 'YES' : 'NO')
    
    if (!expectedAdminKey) {
      console.error('SUPPORT_ADMIN_CREATION_KEY environment variable not set')
      return new Response(
        JSON.stringify({ error: 'Server configuration error: Admin key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!adminKey) {
      console.error('No admin key provided in request')
      return new Response(
        JSON.stringify({ error: 'Admin key is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Trim both keys to avoid whitespace issues
    const trimmedAdminKey = adminKey.trim()
    const trimmedExpectedKey = expectedAdminKey.trim()
    
    console.log('Admin key length provided:', trimmedAdminKey.length)
    console.log('Expected key length:', trimmedExpectedKey.length)
    
    if (trimmedAdminKey !== trimmedExpectedKey) {
      console.error('Admin key mismatch')
      console.log('Provided key (first 5 chars):', trimmedAdminKey.substring(0, 5))
      console.log('Expected key (first 5 chars):', trimmedExpectedKey.substring(0, 5))
      return new Response(
        JSON.stringify({ error: 'Invalid admin key provided' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Admin key validation successful')

    // Validate input
    if (!username || !password) {
      console.error('Missing username or password')
      return new Response(
        JSON.stringify({ error: 'Username and password are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Creating support admin with username:', username.trim().toLowerCase())

    // Create support admin using the database function
    const { data, error } = await supabaseClient.rpc('create_support_admin', {
      p_username: username.trim().toLowerCase(),
      p_password: password
    })

    if (error) {
      console.error('Database creation error:', error)
      
      if (error.code === '23505') { // Unique constraint violation
        return new Response(
          JSON.stringify({ error: 'Username already exists' }),
          { 
            status: 409, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to create support admin: ' + error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Support admin created successfully with ID:', data)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Support admin created successfully',
        adminId: data
      }),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Support admin creation error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error: ' + error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
