
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowRight, Database, Cloud, Shield, BarChart3, GitBranch } from 'lucide-react';
import { DataSourceDoc } from '../dataSource/DataSourceDocumentationData';

interface WorkflowDiagramProps {
  dataSource: DataSourceDoc;
}

const WorkflowDiagram: React.FC<WorkflowDiagramProps> = ({ dataSource }) => {
  const getWorkflowSteps = (sourceType: string) => {
    const commonSteps = [
      {
        id: 'credentials',
        title: 'Credential Setup',
        description: 'Configure authentication credentials',
        icon: Shield,
        color: 'bg-blue-500'
      },
      {
        id: 'connection',
        title: 'Connection Test',
        description: 'Validate connectivity to data source',
        icon: Cloud,
        color: 'bg-green-500'
      },
      {
        id: 'etl',
        title: 'Data Extraction',
        description: 'ETL process pulls raw data',
        icon: Database,
        color: 'bg-purple-500'
      },
      {
        id: 'processing',
        title: 'Data Processing',
        description: 'Transform and normalize data',
        icon: GitBranch,
        color: 'bg-orange-500'
      },
      {
        id: 'visualization',
        title: 'Topology Visualization',
        description: 'Display in network topology map',
        icon: BarChart3,
        color: 'bg-cyan-500'
      }
    ];

    // Customize descriptions based on source type
    switch (sourceType) {
      case 'nmap':
        return [
          { ...commonSteps[0], description: 'No credentials required - network access only' },
          { ...commonSteps[1], description: 'Test network connectivity to target ranges' },
          { ...commonSteps[2], description: 'Scan network ranges for active hosts and services' },
          { ...commonSteps[3], description: 'Parse scan results and identify devices/services' },
          { ...commonSteps[4], description: 'Create network nodes and connections' }
        ];
      
      case 'aws':
        return [
          { ...commonSteps[0], description: 'Configure AWS Access Key ID and Secret Key' },
          { ...commonSteps[1], description: 'Test AWS API connectivity and permissions' },
          { ...commonSteps[2], description: 'Discover EC2, VPC, RDS, and other AWS resources' },
          { ...commonSteps[3], description: 'Map AWS resources to network topology entities' },
          { ...commonSteps[4], description: 'Display cloud infrastructure in topology' }
        ];
      
      case 'splunk':
        return [
          { ...commonSteps[0], description: 'Setup Splunk username and password' },
          { ...commonSteps[1], description: 'Test Splunk REST API connectivity' },
          { ...commonSteps[2], description: 'Query security events and network logs' },
          { ...commonSteps[3], description: 'Extract network topology data from logs' },
          { ...commonSteps[4], description: 'Correlate security events with network map' }
        ];
      
      default:
        return commonSteps;
    }
  };

  const getDataTypes = (sourceType: string): string[] => {
    switch (sourceType) {
      case 'nmap':
        return ['Host IP addresses', 'Open ports', 'Service versions', 'OS fingerprints', 'Response times'];
      case 'aws':
        return ['EC2 instances', 'VPC configurations', 'Security groups', 'Load balancers', 'RDS databases'];
      case 'azure':
        return ['Virtual machines', 'Virtual networks', 'Resource groups', 'Network security groups', 'Storage accounts'];
      case 'splunk':
        return ['Security events', 'Network logs', 'Authentication logs', 'Traffic flows', 'Threat indicators'];
      case 'snmp':
        return ['Interface statistics', 'Device information', 'Performance metrics', 'Configuration data', 'Status information'];
      case 'sentinelone':
        return ['Endpoint data', 'Process information', 'Network connections', 'Threat detections', 'Agent status'];
      case 'qradar':
        return ['Security events', 'Flow data', 'Asset information', 'Vulnerability data', 'Threat intelligence'];
      case 'datadog':
        return ['Infrastructure metrics', 'Service dependencies', 'Performance data', 'Alert information', 'Tag metadata'];
      case 'microsoft-sentinel':
        return ['Security incidents', 'Log analytics data', 'Threat hunting results', 'Workbook data', 'Alert rules'];
      case 'api':
        return ['Custom endpoint data', 'JSON responses', 'API metrics', 'Authentication tokens', 'Rate limit info'];
      default:
        return ['Network data', 'Configuration info', 'Status updates', 'Performance metrics', 'Security events'];
    }
  };

  const steps = getWorkflowSteps(dataSource.id);
  const dataTypes = getDataTypes(dataSource.id);

  return (
    <div className="space-y-6">
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-blue-600 flex items-center">
            <GitBranch className="w-5 h-5 mr-2" />
            Integration Workflow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Workflow Steps */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {steps.map((step, index) => (
                <div key={step.id} className="relative">
                  <div className="text-center">
                    <div className={`${step.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                  
                  {/* Arrow */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-6 -right-8 z-10">
                      <ArrowRight className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-blue-600">Data Types Collected</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {dataTypes.map((dataType, index) => (
              <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-800 font-medium">{dataType}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-blue-600">Backend Processing Logic</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Data Normalization</h4>
              <p className="text-gray-700">Raw data is transformed into standardized network topology entities (nodes and connections) with consistent metadata structure.</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Reconciliation Engine</h4>
              <p className="text-gray-700">Multiple data sources are merged using confidence scoring and priority rules to create a unified view of the network.</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Real-time Updates</h4>
              <p className="text-gray-700">Changes are propagated to the topology visualization in real-time, with automatic conflict resolution and data quality monitoring.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowDiagram;
