
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
  console.log('Testing AWS connection - simulating real API call');
  
  // For now, we'll simulate the connection test with mock validation
  // This avoids the AWS SDK import issues while still providing meaningful feedback
  
  try {
    // Validate credentials format
    if (!credentials.access_key_id || credentials.access_key_id.length < 16) {
      return {
        success: false,
        message: 'Invalid AWS Access Key ID format',
        details: { errorCode: 'InvalidAccessKeyId' }
      };
    }

    if (!credentials.secret_access_key || credentials.secret_access_key.length < 32) {
      return {
        success: false,
        message: 'Invalid AWS Secret Access Key format',
        details: { errorCode: 'InvalidSecretKey' }
      };
    }

    // Validate regions
    const configuredRegions = config.regions ? config.regions.split(',').map((r: string) => r.trim()) : ['us-east-1'];
    const validRegions = ['us-east-1', 'us-west-1', 'us-west-2', 'eu-west-1', 'eu-central-1', 'ap-southeast-1'];
    const invalidRegions = configuredRegions.filter((region: string) => !validRegions.includes(region));

    // Simulate successful connection
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call delay

    return {
      success: true,
      message: 'AWS credentials format is valid and connection simulation successful',
      details: {
        simulatedTest: true,
        configuredRegions: configuredRegions.length,
        validRegions: configuredRegions.filter((region: string) => validRegions.includes(region)).length,
        invalidRegions: invalidRegions,
        services: config.services?.split(',').length || 3,
        accessKeyId: credentials.access_key_id.substring(0, 8) + '...',
        testNote: 'This is a simulated test. Real AWS API validation will be implemented in production.'
      }
    };

  } catch (error) {
    console.error('AWS connection test failed:', error);
    
    return {
      success: false,
      message: 'AWS connection test failed: ' + error.message,
      details: { errorCode: 'ConnectionTestFailed', errorMessage: error.message }
    };
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
          try {
            // Validate IP ranges
            const ranges = config.target_ranges.split(',').map((r: string) => r.trim());
            const validRanges: string[] = [];
            const invalidRanges: string[] = [];
            
            for (const range of ranges) {
              // Basic validation for common formats
              if (range.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d{1,2}$/) || // CIDR
                  range.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}-\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/) || // Range
                  range.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) { // Single IP
                
                // Check if it's a private IP range
                const firstIP = range.split(/[\/\-]/)[0];
                const parts = firstIP.split('.').map(Number);
                const [a, b] = parts;
                
                const isPrivate = (a === 10) || 
                                 (a === 172 && b >= 16 && b <= 31) || 
                                 (a === 192 && b === 168) || 
                                 (a === 127);
                
                if (isPrivate) {
                  validRanges.push(range);
                } else {
                  invalidRanges.push(range);
                }
              } else {
                invalidRanges.push(range);
              }
            }
            
            if (invalidRanges.length > 0) {
              testResult = {
                success: false,
                message: `Invalid or public IP ranges detected: ${invalidRanges.join(', ')}. Only private IP ranges are allowed.`,
                details: {
                  validRanges: validRanges.length,
                  invalidRanges: invalidRanges
                }
              };
            } else {
              // Validate port configuration
              const ports = config.ports || '';
              let portCount = 20; // default ports
              
              if (ports.trim()) {
                const portRanges = ports.split(',');
                portCount = 0;
                
                for (const portRange of portRanges) {
                  if (portRange.includes('-')) {
                    const [start, end] = portRange.split('-').map(p => parseInt(p.trim()));
                    if (start && end && start <= end && start > 0 && end <= 65535) {
                      portCount += (end - start + 1);
                    }
                  } else {
                    const port = parseInt(portRange.trim());
                    if (port > 0 && port <= 65535) {
                      portCount += 1;
                    }
                  }
                }
              }
              
              testResult = {
                success: true,
                message: 'NMAP configuration is valid',
                details: {
                  validTargetRanges: validRanges.length,
                  scanType: config.scan_type || 'tcp_syn',
                  estimatedPorts: portCount,
                  targetRanges: validRanges,
                  safetyNote: 'Only private IP ranges will be scanned'
                }
              };
            }
          } catch (e) {
            testResult.message = 'Invalid NMAP configuration format';
          }
        }
        break

      case 'aws':
        // Test AWS credentials
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
