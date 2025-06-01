
export const generateMockTopologyData = () => {
  const nodes = [
    // Devices
    {
      id: 'fw-001',
      type: 'device',
      position: { x: 400, y: 100 },
      data: { 
        label: 'Firewall-001', 
        type: 'device', 
        status: 'healthy',
        metadata: {
          ip: '192.168.1.1',
          vendor: 'Cisco',
          model: 'ASA 5520',
          location: 'Data Center A'
        }
      }
    },
    {
      id: 'sw-001',
      type: 'device',
      position: { x: 200, y: 200 },
      data: { 
        label: 'Switch-001', 
        type: 'device', 
        status: 'healthy',
        metadata: {
          ip: '192.168.1.10',
          vendor: 'Cisco',
          model: 'Catalyst 3750',
          ports: 48
        }
      }
    },
    {
      id: 'sw-002',
      type: 'device',
      position: { x: 600, y: 200 },
      data: { 
        label: 'Switch-002', 
        type: 'device', 
        status: 'warning',
        metadata: {
          ip: '192.168.1.11',
          vendor: 'Cisco',
          model: 'Catalyst 3750',
          ports: 48
        }
      }
    },
    
    // Services
    {
      id: 'dns-svc',
      type: 'service',
      position: { x: 100, y: 300 },
      data: { 
        label: 'DNS Service', 
        type: 'service', 
        status: 'healthy',
        metadata: {
          port: 53,
          protocol: 'UDP/TCP',
          server: 'srv-dns-01'
        }
      }
    },
    {
      id: 'dhcp-svc',
      type: 'service',
      position: { x: 300, y: 300 },
      data: { 
        label: 'DHCP Service', 
        type: 'service', 
        status: 'healthy',
        metadata: {
          port: 67,
          protocol: 'UDP',
          scope: '192.168.1.0/24'
        }
      }
    },
    {
      id: 'web-svc',
      type: 'service',
      position: { x: 500, y: 300 },
      data: { 
        label: 'Web Service', 
        type: 'service', 
        status: 'critical',
        metadata: {
          port: 80,
          protocol: 'HTTP',
          server: 'srv-web-01'
        }
      }
    },
    
    // Applications
    {
      id: 'erp-app',
      type: 'application',
      position: { x: 200, y: 400 },
      data: { 
        label: 'ERP System', 
        type: 'application', 
        status: 'healthy',
        metadata: {
          version: '12.2.1',
          database: 'Oracle',
          users: 1250
        }
      }
    },
    {
      id: 'crm-app',
      type: 'application',
      position: { x: 400, y: 400 },
      data: { 
        label: 'CRM Platform', 
        type: 'application', 
        status: 'warning',
        metadata: {
          version: '5.1.2',
          database: 'PostgreSQL',
          users: 850
        }
      }
    },
    
    // Cloud Resources
    {
      id: 'aws-vpc',
      type: 'cloud',
      position: { x: 700, y: 100 },
      data: { 
        label: 'AWS VPC', 
        type: 'cloud', 
        status: 'healthy',
        metadata: {
          region: 'us-east-1',
          cidr: '10.0.0.0/16',
          subnets: 4
        }
      }
    },
    {
      id: 'azure-vnet',
      type: 'cloud',
      position: { x: 700, y: 300 },
      data: { 
        label: 'Azure VNet', 
        type: 'cloud', 
        status: 'healthy',
        metadata: {
          region: 'East US',
          cidr: '10.1.0.0/16',
          subnets: 3
        }
      }
    }
  ];

  const edges = [
    // Device connections
    { id: 'fw-sw1', source: 'fw-001', target: 'sw-001', type: 'smoothstep', style: { stroke: '#06b6d4' } },
    { id: 'fw-sw2', source: 'fw-001', target: 'sw-002', type: 'smoothstep', style: { stroke: '#06b6d4' } },
    { id: 'fw-aws', source: 'fw-001', target: 'aws-vpc', type: 'smoothstep', style: { stroke: '#f59e0b' } },
    
    // Service connections
    { id: 'sw1-dns', source: 'sw-001', target: 'dns-svc', type: 'smoothstep', style: { stroke: '#10b981' } },
    { id: 'sw1-dhcp', source: 'sw-001', target: 'dhcp-svc', type: 'smoothstep', style: { stroke: '#10b981' } },
    { id: 'sw2-web', source: 'sw-002', target: 'web-svc', type: 'smoothstep', style: { stroke: '#10b981' } },
    
    // Application dependencies
    { id: 'erp-dhcp', source: 'erp-app', target: 'dhcp-svc', type: 'smoothstep', style: { stroke: '#8b5cf6' } },
    { id: 'crm-web', source: 'crm-app', target: 'web-svc', type: 'smoothstep', style: { stroke: '#8b5cf6' } },
    
    // Cloud connections
    { id: 'azure-web', source: 'azure-vnet', target: 'web-svc', type: 'smoothstep', style: { stroke: '#f59e0b' } }
  ];

  return { nodes, edges };
};
