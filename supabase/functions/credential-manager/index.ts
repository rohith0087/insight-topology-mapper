
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// AES-256-GCM encryption using Web Crypto API
async function encryptCredential(data: string): Promise<{ encrypted: string; iv: string }> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(Deno.env.get('CREDENTIAL_ENCRYPTION_KEY') || 'default-key-change-me-32-chars'),
    'AES-GCM',
    false,
    ['encrypt']
  )
  
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(data)
  )
  
  return {
    encrypted: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    iv: btoa(String.fromCharCode(...iv))
  }
}

async function decryptCredential(encryptedData: string, iv: string): Promise<string> {
  const decoder = new TextDecoder()
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(Deno.env.get('CREDENTIAL_ENCRYPTION_KEY') || 'default-key-change-me-32-chars'),
    'AES-GCM',
    false,
    ['decrypt']
  )
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(atob(iv).split('').map(c => c.charCodeAt(0))) },
    key,
    new Uint8Array(atob(encryptedData).split('').map(c => c.charCodeAt(0)))
  )
  
  return decoder.decode(decrypted)
}

function getTenantId(request: Request): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return null
  
  // This is a simplified version - in production, you'd decode the JWT properly
  try {
    const token = authHeader.replace('Bearer ', '')
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.tenant_id || null
  } catch {
    return null
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { action, credentialName, credentialType, credentialData, credentialId } = await req.json()

    switch (action) {
      case 'store': {
        // Encrypt and store new credential
        const { encrypted, iv } = await encryptCredential(JSON.stringify(credentialData))
        
        const { data: credential, error } = await supabaseClient
          .from('encrypted_credentials')
          .insert({
            credential_name: credentialName,
            credential_type: credentialType,
            encrypted_data: { encrypted, iv }
          })
          .select()
          .single()

        if (error) throw error

        // Log the creation
        await supabaseClient.rpc('log_credential_access', {
          p_credential_id: credential.id,
          p_action: 'created',
          p_metadata: { credential_type: credentialType }
        })

        return new Response(
          JSON.stringify({ success: true, credentialId: credential.id }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'retrieve': {
        // Retrieve and decrypt credential (only for backend use)
        const { data: credential, error } = await supabaseClient
          .from('encrypted_credentials')
          .select('*')
          .eq('id', credentialId)
          .single()

        if (error) throw error

        const decryptedData = await decryptCredential(
          credential.encrypted_data.encrypted,
          credential.encrypted_data.iv
        )

        // Log the access
        await supabaseClient.rpc('log_credential_access', {
          p_credential_id: credentialId,
          p_action: 'accessed'
        })

        return new Response(
          JSON.stringify({ success: true, credentialData: JSON.parse(decryptedData) }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'update': {
        // Update existing credential
        const { encrypted, iv } = await encryptCredential(JSON.stringify(credentialData))
        
        const { error } = await supabaseClient
          .from('encrypted_credentials')
          .update({
            encrypted_data: { encrypted, iv },
            updated_at: new Date().toISOString(),
            version: supabaseClient.raw('version + 1')
          })
          .eq('id', credentialId)

        if (error) throw error

        // Log the update
        await supabaseClient.rpc('log_credential_access', {
          p_credential_id: credentialId,
          p_action: 'updated'
        })

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'delete': {
        // Soft delete credential
        const { error } = await supabaseClient
          .from('encrypted_credentials')
          .update({ is_active: false })
          .eq('id', credentialId)

        if (error) throw error

        // Log the deletion
        await supabaseClient.rpc('log_credential_access', {
          p_credential_id: credentialId,
          p_action: 'deleted'
        })

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'list': {
        // List credential metadata (no sensitive data)
        const { data: credentials, error } = await supabaseClient
          .from('encrypted_credentials')
          .select('id, credential_name, credential_type, created_at, last_used, is_active')
          .eq('is_active', true)
          .order('created_at', { ascending: false })

        if (error) throw error

        return new Response(
          JSON.stringify({ success: true, credentials }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

  } catch (error) {
    console.error('Credential manager error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
