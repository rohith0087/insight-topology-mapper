
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

    const { username, password } = await req.json()

    console.log('Validating login for username:', username)

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

    // Basic input sanitization
    const sanitizedUsername = username.trim().toLowerCase()
    
    console.log('Calling validate_support_admin function')
    
    // Validate credentials using the database function
    const { data, error } = await supabaseClient.rpc('validate_support_admin', {
      p_username: sanitizedUsername,
      p_password: password
    })

    if (error) {
      console.error('Database validation error:', error)
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Database function returned:', data)

    if (data && data.valid) {
      console.log('Login successful for user:', data.username)
      return new Response(
        JSON.stringify({ 
          success: true, 
          admin: {
            id: data.admin_id,
            username: data.username,
            role: data.role
          }
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    } else {
      console.log('Invalid credentials provided')
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
  } catch (error) {
    console.error('Support login validation error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
