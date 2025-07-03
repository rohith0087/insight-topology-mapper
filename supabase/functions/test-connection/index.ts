
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { EC2Client, DescribeRegionsCommand } from 'https://esm.sh/@aws-sdk/client-ec2@3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function getDecryptedCredentials(credentialId: string) {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  )

  const { data, error } = await supabaseClient.functions.invoke('credential-manager', {
    body: {
      action: 'retrieve',
      credentialId
    }
  })

  if (error) throw error
  if (!data?.success) throw new Error('Failed to retrieve credentials')

  return data.credentialData
}

async function testAWSConnection(credentials: any, config: any) {
  console.log('Testing AWS connection with real API call');
  
  const ec2Client = new EC2Client({
    region: 'us-east-1', // Use us-east-1 for testing, it's available in all AWS accounts
    credentials: {
      accessKeyId: credentials.access_key_id,
      secretAccessKey: credentials.secret_access_key,
      ...(credentials.session_token && { sessionToken: credentials.session_token })
    }
  });

  try {
    // Make a simple API call to test credentials
    const command = new DescribeRegionsCommand({});
    const response = await ec2Client.send(command);
    
    const availableRegions = response.Regions?.map(r => r.RegionName) || [];
    const configuredRegions = config.regions ? config.regions.split(',').map((r: string) => r.trim()) : ['us-east-1'];
    const validRegions = configuredRegions.filter((region: string) => availableRegions.includes(region));
    
    return {
      success: true,
      message: 'AWS credentials are valid and API is accessible',
      details: {
        availableRegions: availableRegions.length,
        configuredRegions: configuredRegions.length,
        validRegions: validRegions.length,
        invalidRegions: configuredRegions.filter((region: string) => !availableRegions.includes(region)),
        services: config.services?.split(',').length || 0,
        accessKeyId: credentials.access_key_id.substring(0, 8) + '...',
        testRegion: 'us-east-1'
      }
    };
  } catch (error) {
    console.error('AWS API test failed:', error);
    
    // Provide specific error messages based on AWS error codes
    if (error.name === 'InvalidUserID.NotFound') {
      return {
        success: false,
        message: 'AWS Access Key ID not found. Please verify your credentials.',
        details: { errorCode: error.name, errorMessage: error.message }
      };
    } else if (error.name === 'SignatureDoesNotMatch') {
      return {
        success: false,
        message: 'AWS Secret Access Key is incorrect. Please verify your credentials.',
        details: { errorCode: error.name, errorMessage: error.message }
      };
    } else if (error.name === 'TokenRefreshRequired') {
      return {
        success: false,
        message: 'AWS session token has expired. Please refresh your credentials.',
        details: { errorCode: error.name, errorMessage: error.message }
      };
    } else if (error.name === 'UnauthorizedOperation') {
      return {
        success: false,
        message: 'AWS credentials lack necessary permissions. Ensure the user has EC2:DescribeRegions permission.',
        details: { errorCode: error.name, errorMessage: error.message }
      };
    } else {
      return {
        success: false,
        message: 'AWS API connection failed: ' + error.message,
        details: { errorCode: error.name, errorMessage: error.message }
      };
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, config, credentialId } = await req.json()

    let testResult = { success: false, message: '', details: {} }
    let credentials = {}

    // Get decrypted credentials if provided
    if (credentialId) {
      try {
        credentials = await getDecryptedCredentials(credentialId)
      } catch (error) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Failed to retrieve credentials: ' + error.message 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    switch (type) {
      case 'nmap':
        // Test nmap configuration
        if (!config.target_ranges) {
          testResult.message = 'Target ranges are required for nmap'
        } else {
          testResult = {
            success: true,
            message: 'Nmap configuration is valid',
            details: {
              targets: config.target_ranges.split(',').length,
              scanType: config.scan_type || 'tcp_syn'
            }
          }
        }
        break

      case 'aws':
        // Test AWS credentials with real API call
        if (!credentials.access_key_id || !credentials.secret_access_key) {
          testResult.message = 'AWS credentials are required'
        } else {
          testResult = await testAWSConnection(credentials, config);
        }
        break

      case 'splunk':
        // Test Splunk connection
        if (!config.endpoint || !credentials.username || !credentials.password) {
          testResult.message = 'Splunk endpoint and credentials are required'
        } else {
          try {
            const url = new URL(config.endpoint)
            testResult = {
              success: true,
              message: 'Splunk configuration is valid',
              details: {
                host: url.hostname,
                port: url.port,
                index: config.index || 'main',
                username: credentials.username
              }
            }
          } catch (e) {
            testResult.message = 'Invalid Splunk endpoint URL format'
          }
        }
        break

      case 'azure':
        // Test Azure configuration
        if (!config.subscription_id || !credentials.tenant_id || !credentials.client_id || !credentials.client_secret) {
          testResult.message = 'Azure subscription and credentials are required'
        } else {
          testResult = {
            success: true,
            message: 'Azure configuration is valid',
            details: {
              subscription: config.subscription_id?.substring(0, 8) + '...',
              tenant: credentials.tenant_id?.substring(0, 8) + '...',
              clientId: credentials.client_id?.substring(0, 8) + '...'
            }
          }
        }
        break

      case 'sentinelone':
        // Test SentinelOne configuration
        if (!config.console_url || !credentials.api_token) {
          testResult.message = 'SentinelOne console URL and API token are required'
        } else {
          try {
            const url = new URL(config.console_url)
            testResult = {
              success: true,
              message: 'SentinelOne configuration is valid',
              details: {
                console: url.hostname,
                siteId: config.site_id || 'all',
                accountId: config.account_id || 'all',
                tokenPrefix: credentials.api_token?.substring(0, 8) + '...'
              }
            }
          } catch (e) {
            testResult.message = 'Invalid SentinelOne console URL format'
          }
        }
        break

      case 'qradar':
        // Test QRadar configuration
        if (!config.qradar_host || (!credentials.username && !credentials.auth_token)) {
          testResult.message = 'QRadar host and credentials (username/password or auth token) are required'
        } else {
          testResult = {
            success: true,
            message: 'QRadar configuration is valid',
            details: {
              host: config.qradar_host,
              port: config.port || '443',
              authMethod: credentials.auth_token ? 'token' : 'username/password',
              version: config.version || '19.0'
            }
          }
        }
        break

      case 'datadog':
        // Test DataDog configuration
        if (!credentials.api_key || !credentials.app_key) {
          testResult.message = 'DataDog API key and application key are required'
        } else {
          testResult = {
            success: true,
            message: 'DataDog configuration is valid',
            details: {
              site: config.site || 'datadoghq.com',
              organization: config.organization || 'default',
              includeServices: config.include_services || 'true',
              apiKeyPrefix: credentials.api_key?.substring(0, 8) + '...'
            }
          }
        }
        break

      case 'microsoft-sentinel':
        // Test Microsoft Sentinel configuration
        if (!config.workspace_id || !credentials.tenant_id || !credentials.client_id || !credentials.client_secret || !config.subscription_id) {
          testResult.message = 'Microsoft Sentinel requires workspace ID and credentials'
        } else {
          testResult = {
            success: true,
            message: 'Microsoft Sentinel configuration is valid',
            details: {
              workspace: config.workspace_id?.substring(0, 8) + '...',
              tenant: credentials.tenant_id?.substring(0, 8) + '...',
              resourceGroup: config.resource_group,
              workspaceName: config.workspace_name
            }
          }
        }
        break

      default:
        testResult.message = `Unsupported source type: ${type}`
    }

    return new Response(
      JSON.stringify(testResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Test connection error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Connection test failed',
        error: error.message 
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
