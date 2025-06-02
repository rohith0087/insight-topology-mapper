
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ExternalLink, Key, Settings, BookOpen, AlertTriangle, CheckCircle } from 'lucide-react';

interface DataSourceDoc {
  id: string;
  name: string;
  icon: string | React.ReactNode;
  category: string;
  description: string;
  credentialGuide: {
    title: string;
    steps: string[];
    links: { text: string; url: string }[];
  };
  configuration: {
    required: string[];
    optional: string[];
    examples: { [key: string]: string };
  };
  useCases: string[];
  limitations: string[];
  troubleshooting: { issue: string; solution: string }[];
}

const getTypeIcon = (type: string) => {
  const iconImages = {
    aws: <img src="/lovable-uploads/e1398d3d-578a-471e-bfde-4096d0238576.png" alt="AWS" className="w-6 h-6 object-contain" />,
    azure: <img src="/lovable-uploads/c8dd797a-375c-47db-991f-ea4bdbf311f1.png" alt="Azure" className="w-6 h-6 object-contain" />,
    datadog: <img src="/lovable-uploads/29d45e0c-b15e-4e77-89ae-28286dda410d.png" alt="DataDog" className="w-6 h-6 object-contain" />,
    'microsoft-sentinel': <img src="/lovable-uploads/09db2bdd-5525-47a7-aaa8-e30b98d6901d.png" alt="Microsoft Sentinel" className="w-6 h-6 object-contain" />,
    qradar: <img src="/lovable-uploads/88b0bf91-c943-4248-baf0-5e75ef46c244.png" alt="QRadar" className="w-6 h-6 object-contain" />,
    sentinelone: <img src="/lovable-uploads/fe727117-4df6-4009-85bb-536a2073baec.png" alt="SentinelOne" className="w-6 h-6 object-contain" />
  };

  if (iconImages[type]) {
    return iconImages[type];
  }

  const icons = {
    nmap: '🌐',
    splunk: '🟢',
    snmp: '📡',
    api: '🔌'
  };
  return icons[type] || '⚙️';
};

const dataSources: DataSourceDoc[] = [
  {
    id: 'nmap',
    name: 'Nmap Network Scanner',
    icon: '🌐',
    category: 'Network Discovery',
    description: 'Network discovery and security scanning tool for mapping network topology and identifying active hosts and services.',
    credentialGuide: {
      title: 'No credentials required',
      steps: [
        'Nmap is a network scanning tool that requires network access only',
        'Ensure the scanning system has network connectivity to target ranges',
        'Consider firewall rules that may block scanning traffic'
      ],
      links: [
        { text: 'Nmap Documentation', url: 'https://nmap.org/book/' },
        { text: 'Nmap Scanning Techniques', url: 'https://nmap.org/book/man-port-scanning-techniques.html' }
      ]
    },
    configuration: {
      required: ['target_ranges'],
      optional: ['scan_type', 'ports'],
      examples: {
        target_ranges: '192.168.1.0/24, 10.0.0.0/16',
        scan_type: 'tcp_syn',
        ports: '1-1000, 22, 80, 443, 8080'
      }
    },
    useCases: [
      'Network topology discovery',
      'Active host identification',
      'Service and port enumeration',
      'Network security assessment'
    ],
    limitations: [
      'Requires network access to target ranges',
      'May be blocked by firewalls',
      'Can be detected by intrusion detection systems',
      'Performance depends on network size and configuration'
    ],
    troubleshooting: [
      { issue: 'No hosts discovered', solution: 'Check network connectivity and firewall rules' },
      { issue: 'Scan taking too long', solution: 'Reduce target range or use faster scan types' },
      { issue: 'Permission denied', solution: 'Ensure proper network permissions and routing' }
    ]
  },
  {
    id: 'aws',
    name: 'AWS Discovery',
    icon: getTypeIcon('aws'),
    category: 'Cloud Infrastructure',
    description: 'Discover and map AWS cloud infrastructure including EC2 instances, VPCs, load balancers, and other AWS resources.',
    credentialGuide: {
      title: 'AWS Access Keys Setup',
      steps: [
        'Log in to AWS Management Console',
        'Navigate to IAM (Identity and Access Management)',
        'Create a new IAM user or use existing user',
        'Attach policies: EC2FullAccess, VPCFullAccess, ELBFullAccess (or create custom policy)',
        'Generate Access Key ID and Secret Access Key',
        'Store credentials securely'
      ],
      links: [
        { text: 'AWS IAM User Guide', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html' },
        { text: 'AWS Access Keys Best Practices', url: 'https://docs.aws.amazon.com/general/latest/gr/aws-access-keys-best-practices.html' },
        { text: 'AWS IAM Console', url: 'https://console.aws.amazon.com/iam/' }
      ]
    },
    configuration: {
      required: ['access_key_id', 'secret_access_key'],
      optional: ['regions', 'services'],
      examples: {
        access_key_id: 'AKIAIOSFODNN7EXAMPLE',
        secret_access_key: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
        regions: 'us-east-1, us-west-2, eu-west-1',
        services: 'ec2, vpc, rds, lambda, s3'
      }
    },
    useCases: [
      'Cloud infrastructure discovery',
      'Multi-region network mapping',
      'Resource inventory and tracking',
      'Compliance and security auditing'
    ],
    limitations: [
      'Requires appropriate IAM permissions',
      'API rate limits may affect discovery speed',
      'Cross-account access requires additional setup',
      'Some services may not be available in all regions'
    ],
    troubleshooting: [
      { issue: 'Access denied errors', solution: 'Verify IAM permissions and policy attachments' },
      { issue: 'Rate limiting', solution: 'Implement exponential backoff or reduce request frequency' },
      { issue: 'Empty results', solution: 'Check region configuration and resource availability' }
    ]
  },
  {
    id: 'azure',
    name: 'Azure Monitor',
    icon: getTypeIcon('azure'),
    category: 'Cloud Infrastructure',
    description: 'Discover and monitor Azure cloud resources including virtual machines, networks, and services.',
    credentialGuide: {
      title: 'Azure Service Principal Setup',
      steps: [
        'Log in to Azure Portal',
        'Navigate to Azure Active Directory',
        'Go to App registrations and create new registration',
        'Note the Application (client) ID and Directory (tenant) ID',
        'Go to Certificates & secrets and create new client secret',
        'Assign appropriate roles (Reader, Contributor) to the service principal',
        'Note the Subscription ID from the subscription overview'
      ],
      links: [
        { text: 'Azure Service Principal Guide', url: 'https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal' },
        { text: 'Azure RBAC Documentation', url: 'https://docs.microsoft.com/en-us/azure/role-based-access-control/' },
        { text: 'Azure Portal', url: 'https://portal.azure.com/' }
      ]
    },
    configuration: {
      required: ['subscription_id', 'tenant_id', 'client_id', 'client_secret'],
      optional: [],
      examples: {
        subscription_id: '12345678-1234-1234-1234-123456789012',
        tenant_id: '87654321-4321-4321-4321-210987654321',
        client_id: '11111111-1111-1111-1111-111111111111',
        client_secret: 'your-client-secret-value'
      }
    },
    useCases: [
      'Azure infrastructure discovery',
      'Virtual network mapping',
      'Resource group organization',
      'Cost and usage monitoring'
    ],
    limitations: [
      'Requires service principal with appropriate permissions',
      'API throttling may occur with large environments',
      'Some resources may require additional permissions',
      'Cross-tenant access requires special configuration'
    ],
    troubleshooting: [
      { issue: 'Authentication failures', solution: 'Verify tenant ID, client ID, and client secret' },
      { issue: 'Insufficient permissions', solution: 'Check RBAC assignments and scope' },
      { issue: 'Subscription not found', solution: 'Verify subscription ID and access rights' }
    ]
  },
  {
    id: 'splunk',
    name: 'Splunk SIEM',
    icon: '🟢',
    category: 'SIEM',
    description: 'Extract network topology and security insights from Splunk SIEM data and security events.',
    credentialGuide: {
      title: 'Splunk API Access Setup',
      steps: [
        'Log in to Splunk Web interface',
        'Navigate to Settings > Access controls > Users',
        'Create a new user or use existing user with appropriate roles',
        'Assign roles: admin, power, or custom role with search capabilities',
        'Ensure the user has access to relevant indexes',
        'Test API access using REST endpoints'
      ],
      links: [
        { text: 'Splunk REST API Guide', url: 'https://docs.splunk.com/Documentation/Splunk/latest/RESTREF/RESTprolog' },
        { text: 'Splunk User Roles', url: 'https://docs.splunk.com/Documentation/Splunk/latest/Security/Aboutusersandroles' },
        { text: 'Splunk Search Reference', url: 'https://docs.splunk.com/Documentation/Splunk/latest/SearchReference/' }
      ]
    },
    configuration: {
      required: ['endpoint', 'username', 'password'],
      optional: ['index'],
      examples: {
        endpoint: 'https://splunk.company.com:8089',
        username: 'api_user',
        password: 'secure_password',
        index: 'network, security, main'
      }
    },
    useCases: [
      'Security event correlation',
      'Network traffic analysis',
      'Incident response support',
      'Compliance reporting'
    ],
    limitations: [
      'Requires Splunk Enterprise or Cloud',
      'Search performance depends on data volume',
      'May require custom search queries for specific use cases',
      'License consumption based on data ingestion'
    ],
    troubleshooting: [
      { issue: 'Connection timeout', solution: 'Check Splunk server status and network connectivity' },
      { issue: 'Authentication failed', solution: 'Verify username, password, and user permissions' },
      { issue: 'No search results', solution: 'Check index permissions and data availability' }
    ]
  },
  {
    id: 'snmp',
    name: 'SNMP Monitoring',
    icon: '📡',
    category: 'Network Monitoring',
    description: 'Monitor network devices using SNMP protocol to gather device information, interface status, and performance metrics.',
    credentialGuide: {
      title: 'SNMP Configuration',
      steps: [
        'Enable SNMP on target network devices',
        'Configure SNMP community strings (v1/v2c) or users (v3)',
        'Set appropriate SNMP access permissions (read-only recommended)',
        'Document community strings or authentication credentials',
        'Test SNMP connectivity using tools like snmpwalk'
      ],
      links: [
        { text: 'SNMP Configuration Guide', url: 'https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/snmp/configuration/15-mt/snmp-15-mt-book.html' },
        { text: 'SNMP Best Practices', url: 'https://tools.ietf.org/html/rfc3410' },
        { text: 'Net-SNMP Tools', url: 'http://www.net-snmp.org/' }
      ]
    },
    configuration: {
      required: ['hosts', 'community'],
      optional: ['version'],
      examples: {
        hosts: '192.168.1.1, switch01.company.com, router02.company.com',
        community: 'public',
        version: '2c'
      }
    },
    useCases: [
      'Network device monitoring',
      'Interface utilization tracking',
      'Device health monitoring',
      'Network topology discovery'
    ],
    limitations: [
      'Requires SNMP to be enabled on target devices',
      'Security concerns with community strings',
      'Limited by device SNMP implementation',
      'Network connectivity required to all targets'
    ],
    troubleshooting: [
      { issue: 'SNMP timeout', solution: 'Check device connectivity and SNMP configuration' },
      { issue: 'Authentication failed', solution: 'Verify community string or SNMP credentials' },
      { issue: 'Access denied', solution: 'Check SNMP access control lists and permissions' }
    ]
  },
  {
    id: 'sentinelone',
    name: 'SentinelOne EDR',
    icon: getTypeIcon('sentinelone'),
    category: 'Endpoint Security',
    description: 'Collect endpoint and network information from SentinelOne EDR platform for security and topology analysis.',
    credentialGuide: {
      title: 'SentinelOne API Token Setup',
      steps: [
        'Log in to SentinelOne Management Console',
        'Navigate to Settings > Users',
        'Create a service user or use existing user',
        'Go to the user profile and generate API token',
        'Assign appropriate roles (Viewer, Admin, or custom role)',
        'Note the console URL and API token',
        'Test API access using the token'
      ],
      links: [
        { text: 'SentinelOne API Documentation', url: 'https://usea1-partners.sentinelone.net/docs/en/api-getting-started.html' },
        { text: 'SentinelOne Console', url: 'https://usea1-partners.sentinelone.net/' },
        { text: 'API Authentication Guide', url: 'https://usea1-partners.sentinelone.net/docs/en/api-authentication.html' }
      ]
    },
    configuration: {
      required: ['console_url', 'api_token'],
      optional: ['site_id', 'account_id', 'collection_interval'],
      examples: {
        console_url: 'https://your-tenant.sentinelone.net',
        api_token: 'your-api-token-here',
        site_id: '1234567890',
        account_id: '0987654321',
        collection_interval: '15'
      }
    },
    useCases: [
      'Endpoint security monitoring',
      'Threat detection and response',
      'Network behavior analysis',
      'Compliance and audit support'
    ],
    limitations: [
      'Requires SentinelOne license and deployment',
      'API rate limits apply',
      'Data retention based on license tier',
      'Network visibility limited to endpoint perspective'
    ],
    troubleshooting: [
      { issue: 'API authentication failed', solution: 'Verify API token and console URL' },
      { issue: 'Rate limit exceeded', solution: 'Reduce collection frequency or implement throttling' },
      { issue: 'No agents found', solution: 'Check site/account ID configuration and agent deployment' }
    ]
  },
  {
    id: 'qradar',
    name: 'IBM QRadar SIEM',
    icon: getTypeIcon('qradar'),
    category: 'SIEM',
    description: 'Extract network topology and security insights from IBM QRadar SIEM platform.',
    credentialGuide: {
      title: 'QRadar API Authentication Setup',
      steps: [
        'Log in to QRadar Console',
        'Navigate to Admin > System Configuration > Users',
        'Create a service account or use existing user',
        'Assign appropriate user roles (Analyst, Admin)',
        'Generate SEC (Security Event Collector) token for API access',
        'Alternatively, use username/password authentication',
        'Test API connectivity using the credentials'
      ],
      links: [
        { text: 'QRadar API Guide', url: 'https://www.ibm.com/docs/en/qradar-common?topic=overview-qradar-api' },
        { text: 'QRadar Authentication', url: 'https://www.ibm.com/docs/en/qradar-common?topic=api-authentication-methods' },
        { text: 'IBM QRadar Documentation', url: 'https://www.ibm.com/docs/en/qradar-common' }
      ]
    },
    configuration: {
      required: ['qradar_host', 'username', 'password'],
      optional: ['auth_token', 'port', 'domain_id', 'version'],
      examples: {
        qradar_host: 'qradar.company.com',
        username: 'api_user',
        password: 'secure_password',
        auth_token: 'SEC_TOKEN_HERE',
        port: '443',
        domain_id: '0',
        version: '19.0'
      }
    },
    useCases: [
      'Security event analysis',
      'Network traffic monitoring',
      'Threat intelligence correlation',
      'Compliance reporting'
    ],
    limitations: [
      'Requires QRadar license and deployment',
      'API performance depends on system load',
      'Data access limited by user permissions',
      'Large datasets may require pagination'
    ],
    troubleshooting: [
      { issue: 'SSL certificate errors', solution: 'Configure certificate validation or use trusted certificates' },
      { issue: 'API version mismatch', solution: 'Check QRadar version and update API version parameter' },
      { issue: 'Query timeout', solution: 'Optimize search queries or increase timeout values' }
    ]
  },
  {
    id: 'datadog',
    name: 'DataDog Monitoring',
    icon: getTypeIcon('datadog'),
    category: 'Infrastructure Monitoring',
    description: 'Extract infrastructure topology and service dependencies from DataDog monitoring platform.',
    credentialGuide: {
      title: 'DataDog API Keys Setup',
      steps: [
        'Log in to DataDog Console',
        'Navigate to Integrations > APIs',
        'Generate or copy API Key',
        'Navigate to Integrations > Application Keys',
        'Generate Application Key',
        'Ensure keys have appropriate permissions',
        'Test API access using the keys'
      ],
      links: [
        { text: 'DataDog API Documentation', url: 'https://docs.datadoghq.com/api/latest/' },
        { text: 'DataDog API Keys', url: 'https://app.datadoghq.com/organization-settings/api-keys' },
        { text: 'DataDog Application Keys', url: 'https://app.datadoghq.com/organization-settings/application-keys' }
      ]
    },
    configuration: {
      required: ['api_key', 'app_key'],
      optional: ['site', 'organization', 'tags_filter', 'metric_window', 'include_services'],
      examples: {
        api_key: 'your-api-key-here',
        app_key: 'your-application-key-here',
        site: 'datadoghq.com',
        organization: 'your-org-name',
        tags_filter: 'env:production,team:infrastructure',
        metric_window: '24',
        include_services: 'true'
      }
    },
    useCases: [
      'Infrastructure monitoring',
      'Application performance monitoring',
      'Service dependency mapping',
      'Alerting and notification'
    ],
    limitations: [
      'Requires DataDog subscription',
      'API rate limits apply',
      'Data retention based on plan',
      'Custom metrics may incur additional costs'
    ],
    troubleshooting: [
      { issue: 'API key invalid', solution: 'Verify API key and application key are correct' },
      { issue: 'Rate limit exceeded', solution: 'Implement request throttling or upgrade plan' },
      { issue: 'No metrics data', solution: 'Check agent deployment and metric collection' }
    ]
  },
  {
    id: 'microsoft-sentinel',
    name: 'Microsoft Sentinel',
    icon: getTypeIcon('microsoft-sentinel'),
    category: 'SIEM',
    description: 'Extract security insights and network topology data from Microsoft Sentinel cloud-native SIEM.',
    credentialGuide: {
      title: 'Azure App Registration for Sentinel',
      steps: [
        'Log in to Azure Portal',
        'Navigate to Azure Active Directory > App registrations',
        'Create new app registration',
        'Note Application (client) ID and Directory (tenant) ID',
        'Create client secret in Certificates & secrets',
        'Go to Subscriptions and note Subscription ID',
        'Assign appropriate roles to the app (Sentinel Reader, Contributor)',
        'Configure API permissions for Log Analytics'
      ],
      links: [
        { text: 'Microsoft Sentinel Documentation', url: 'https://docs.microsoft.com/en-us/azure/sentinel/' },
        { text: 'Azure App Registration', url: 'https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app' },
        { text: 'Sentinel API Reference', url: 'https://docs.microsoft.com/en-us/rest/api/securityinsights/' }
      ]
    },
    configuration: {
      required: ['workspace_id', 'tenant_id', 'client_id', 'client_secret', 'subscription_id', 'resource_group', 'workspace_name'],
      optional: ['query_timespan'],
      examples: {
        workspace_id: '12345678-1234-1234-1234-123456789012',
        tenant_id: '87654321-4321-4321-4321-210987654321',
        client_id: '11111111-1111-1111-1111-111111111111',
        client_secret: 'your-client-secret',
        subscription_id: '99999999-9999-9999-9999-999999999999',
        resource_group: 'sentinel-rg',
        workspace_name: 'sentinel-workspace',
        query_timespan: '24'
      }
    },
    useCases: [
      'Cloud security monitoring',
      'Threat hunting and analysis',
      'Security incident response',
      'Compliance and governance'
    ],
    limitations: [
      'Requires Azure subscription and Sentinel deployment',
      'Log Analytics workspace charges apply',
      'API throttling based on usage',
      'Data retention policies affect historical analysis'
    ],
    troubleshooting: [
      { issue: 'Workspace not found', solution: 'Verify workspace ID, resource group, and subscription' },
      { issue: 'Permission denied', solution: 'Check app registration roles and API permissions' },
      { issue: 'Query failed', solution: 'Validate KQL syntax and workspace connectivity' }
    ]
  },
  {
    id: 'api',
    name: 'Custom API',
    icon: '🔌',
    category: 'Custom Integration',
    description: 'Integrate with any custom REST API endpoint to collect network topology and infrastructure data.',
    credentialGuide: {
      title: 'Custom API Configuration',
      steps: [
        'Identify the API endpoint and documentation',
        'Obtain API credentials (API key, bearer token, etc.)',
        'Review API rate limits and authentication methods',
        'Test API connectivity using tools like curl or Postman',
        'Map API response structure to network topology data',
        'Configure JSON transformation rules if needed'
      ],
      links: [
        { text: 'REST API Best Practices', url: 'https://restfulapi.net/rest-api-design-tutorial-with-example/' },
        { text: 'JSON Processing Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON' },
        { text: 'HTTP Authentication Methods', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication' }
      ]
    },
    configuration: {
      required: ['endpoint', 'authentication'],
      optional: ['headers', 'query_parameters', 'data_mapping'],
      examples: {
        endpoint: 'https://api.example.com/v1/network/topology',
        api_key: 'your-api-key-here',
        headers: '{"Authorization": "Bearer token", "Content-Type": "application/json"}',
        query_parameters: '{"limit": 100, "include_inactive": false}'
      }
    },
    useCases: [
      'Custom system integration',
      'Proprietary tool connectivity',
      'Legacy system data extraction',
      'Third-party service integration'
    ],
    limitations: [
      'Requires custom API development or configuration',
      'Data format may need transformation',
      'API availability and reliability dependencies',
      'Authentication and security considerations'
    ],
    troubleshooting: [
      { issue: 'API endpoint unreachable', solution: 'Check network connectivity and endpoint URL' },
      { issue: 'Authentication failed', solution: 'Verify API credentials and authentication method' },
      { issue: 'Data format errors', solution: 'Review API response structure and data mapping configuration' }
    ]
  }
];

interface DataSourceDocumentationProps {
  onClose: () => void;
}

const DataSourceDocumentation: React.FC<DataSourceDocumentationProps> = ({ onClose }) => {
  const [selectedSource, setSelectedSource] = useState<string>('nmap');
  const [activeTab, setActiveTab] = useState<string>('overview');

  const currentSource = dataSources.find(source => source.id === selectedSource);

  const categories = [...new Set(dataSources.map(source => source.category))];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-600 w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-semibold text-cyan-400 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              Data Source Documentation
            </h2>
            <p className="text-slate-400 text-sm">
              Comprehensive guides for configuring and using each data source
            </p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white hover:bg-slate-700"
          >
            ✕
          </Button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 border-r border-slate-700 flex flex-col">
            <div className="p-4">
              <h3 className="text-lg font-medium text-white mb-4">Data Sources</h3>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {categories.map(category => (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">
                      {category}
                    </h4>
                    <div className="space-y-1">
                      {dataSources
                        .filter(source => source.category === category)
                        .map(source => (
                          <button
                            key={source.id}
                            onClick={() => {
                              setSelectedSource(source.id);
                              setActiveTab('overview');
                            }}
                            className={`w-full text-left p-3 rounded-lg transition-colors ${
                              selectedSource === source.id
                                ? 'bg-cyan-600 text-white'
                                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center justify-center w-6 h-6">
                                {typeof source.icon === 'string' ? (
                                  <span className="text-lg">{source.icon}</span>
                                ) : (
                                  source.icon
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{source.name}</div>
                                <div className="text-xs opacity-75">{source.category}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {currentSource && (
              <>
                {/* Source Header */}
                <div className="p-6 border-b border-slate-700 flex-shrink-0">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center justify-center w-8 h-8">
                      {typeof currentSource.icon === 'string' ? (
                        <span className="text-3xl">{currentSource.icon}</span>
                      ) : (
                        <div className="scale-125">{currentSource.icon}</div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{currentSource.name}</h3>
                      <Badge variant="outline" className="border-cyan-500 text-cyan-400">
                        {currentSource.category}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-slate-300">{currentSource.description}</p>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
                  <div className="px-6 pt-4 flex-shrink-0">
                    <TabsList className="grid w-full grid-cols-4 bg-slate-900">
                      <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-600">
                        Overview
                      </TabsTrigger>
                      <TabsTrigger value="credentials" className="data-[state=active]:bg-cyan-600">
                        <Key className="w-4 h-4 mr-2" />
                        Credentials
                      </TabsTrigger>
                      <TabsTrigger value="configuration" className="data-[state=active]:bg-cyan-600">
                        <Settings className="w-4 h-4 mr-2" />
                        Configuration
                      </TabsTrigger>
                      <TabsTrigger value="troubleshooting" className="data-[state=active]:bg-cyan-600">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Troubleshooting
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="flex-1 min-h-0">
                    <ScrollArea className="h-full">
                      <TabsContent value="overview" className="mt-0 p-6 space-y-6">
                        <Card className="bg-slate-900 border-slate-600">
                          <CardHeader>
                            <CardTitle className="text-cyan-400">Use Cases</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {currentSource.useCases.map((useCase, index) => (
                                <li key={index} className="flex items-center text-slate-300">
                                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                  {useCase}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        <Card className="bg-slate-900 border-slate-600">
                          <CardHeader>
                            <CardTitle className="text-yellow-400">Limitations</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {currentSource.limitations.map((limitation, index) => (
                                <li key={index} className="flex items-center text-slate-300">
                                  <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
                                  {limitation}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="credentials" className="mt-0 p-6">
                        <Card className="bg-slate-900 border-slate-600">
                          <CardHeader>
                            <CardTitle className="text-cyan-400">{currentSource.credentialGuide.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div>
                              <h4 className="font-medium text-white mb-3">Setup Steps:</h4>
                              <ol className="space-y-2">
                                {currentSource.credentialGuide.steps.map((step, index) => (
                                  <li key={index} className="flex text-slate-300">
                                    <span className="bg-cyan-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">
                                      {index + 1}
                                    </span>
                                    {step}
                                  </li>
                                ))}
                              </ol>
                            </div>

                            {currentSource.credentialGuide.links.length > 0 && (
                              <div>
                                <h4 className="font-medium text-white mb-3">Helpful Links:</h4>
                                <div className="space-y-2">
                                  {currentSource.credentialGuide.links.map((link, index) => (
                                    <a
                                      key={index}
                                      href={link.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
                                    >
                                      <ExternalLink className="w-4 h-4 mr-2" />
                                      {link.text}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="configuration" className="mt-0 p-6 space-y-6">
                        <Card className="bg-slate-900 border-slate-600">
                          <CardHeader>
                            <CardTitle className="text-cyan-400">Required Fields</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {currentSource.configuration.required.map((field, index) => (
                                <div key={index} className="bg-slate-800 p-3 rounded">
                                  <div className="font-medium text-white">{field}</div>
                                  {currentSource.configuration.examples[field] && (
                                    <div className="text-sm text-slate-400 mt-1">
                                      Example: <code className="bg-slate-700 px-2 py-1 rounded">
                                        {currentSource.configuration.examples[field]}
                                      </code>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {currentSource.configuration.optional.length > 0 && (
                          <Card className="bg-slate-900 border-slate-600">
                            <CardHeader>
                              <CardTitle className="text-slate-400">Optional Fields</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {currentSource.configuration.optional.map((field, index) => (
                                  <div key={index} className="bg-slate-800 p-3 rounded">
                                    <div className="font-medium text-white">{field}</div>
                                    {currentSource.configuration.examples[field] && (
                                      <div className="text-sm text-slate-400 mt-1">
                                        Example: <code className="bg-slate-700 px-2 py-1 rounded">
                                          {currentSource.configuration.examples[field]}
                                        </code>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </TabsContent>

                      <TabsContent value="troubleshooting" className="mt-0 p-6">
                        <Card className="bg-slate-900 border-slate-600">
                          <CardHeader>
                            <CardTitle className="text-cyan-400">Common Issues & Solutions</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {currentSource.troubleshooting.map((item, index) => (
                                <div key={index} className="border border-slate-700 rounded-lg p-4">
                                  <div className="font-medium text-red-400 mb-2 flex items-center">
                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                    Issue: {item.issue}
                                  </div>
                                  <div className="text-green-400 flex items-center">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Solution: {item.solution}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </ScrollArea>
                  </div>
                </Tabs>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSourceDocumentation;
