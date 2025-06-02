
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, config } = await req.json()

    let testResult = { success: false, message: '', details: {} }

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
        // Test AWS credentials
        if (!config.access_key_id || !config.secret_access_key) {
          testResult.message = 'AWS credentials are required'
        } else {
          testResult = {
            success: true,
            message: 'AWS credentials format is valid',
            details: {
              regions: config.regions?.split(',').length || 0,
              services: config.services?.split(',').length || 0
            }
          }
        }
        break

      case 'splunk':
        // Test Splunk connection
        if (!config.endpoint || !config.username || !config.password) {
          testResult.message = 'Splunk endpoint and credentials are required'
        } else {
          try {
            const url = new URL(config.endpoint)
            testResult = {
              success: true,
              message: 'Splunk endpoint format is valid',
              details: {
                host: url.hostname,
                port: url.port,
                index: config.index || 'main'
              }
            }
          } catch (e) {
            testResult.message = 'Invalid Splunk endpoint URL format'
          }
        }
        break

      case 'azure':
        // Test Azure configuration
        if (!config.subscription_id || !config.tenant_id || !config.client_id || !config.client_secret) {
          testResult.message = 'Azure subscription, tenant, client ID and secret are required'
        } else {
          testResult = {
            success: true,
            message: 'Azure configuration format is valid',
            details: {
              subscription: config.subscription_id.substring(0, 8) + '...',
              tenant: config.tenant_id.substring(0, 8) + '...'
            }
          }
        }
        break

      case 'snmp':
        // Test SNMP configuration
        if (!config.hosts || !config.community) {
          testResult.message = 'SNMP hosts and community string are required'
        } else {
          testResult = {
            success: true,
            message: 'SNMP configuration is valid',
            details: {
              hosts: config.hosts.split(',').length,
              version: config.version || '2c'
            }
          }
        }
        break

      case 'sentinelone':
        // Test SentinelOne configuration
        if (!config.console_url || !config.api_token) {
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
                accountId: config.account_id || 'all'
              }
            }
          } catch (e) {
            testResult.message = 'Invalid SentinelOne console URL format'
          }
        }
        break

      case 'qradar':
        // Test QRadar configuration
        if (!config.qradar_host || (!config.username && !config.auth_token)) {
          testResult.message = 'QRadar host and credentials (username/password or auth token) are required'
        } else {
          testResult = {
            success: true,
            message: 'QRadar configuration is valid',
            details: {
              host: config.qradar_host,
              port: config.port || '443',
              authMethod: config.auth_token ? 'token' : 'username/password',
              version: config.version || '19.0'
            }
          }
        }
        break

      case 'datadog':
        // Test DataDog configuration
        if (!config.api_key || !config.app_key) {
          testResult.message = 'DataDog API key and application key are required'
        } else {
          testResult = {
            success: true,
            message: 'DataDog configuration is valid',
            details: {
              site: config.site || 'datadoghq.com',
              organization: config.organization || 'default',
              includeServices: config.include_services || 'true'
            }
          }
        }
        break

      case 'microsoft-sentinel':
        // Test Microsoft Sentinel configuration
        if (!config.workspace_id || !config.tenant_id || !config.client_id || !config.client_secret || !config.subscription_id) {
          testResult.message = 'Microsoft Sentinel requires workspace ID, tenant ID, client ID, client secret, and subscription ID'
        } else {
          testResult = {
            success: true,
            message: 'Microsoft Sentinel configuration is valid',
            details: {
              workspace: config.workspace_id.substring(0, 8) + '...',
              tenant: config.tenant_id.substring(0, 8) + '...',
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
