
import React, { useState } from 'react';
import { Database, Search, Network } from 'lucide-react';

const DataSourcePanel = () => {
  const [dataSources] = useState([
    {
      id: 'splunk',
      name: 'Splunk SIEM',
      type: 'SIEM',
      status: 'connected',
      lastSync: '2 minutes ago',
      icon: Database
    },
    {
      id: 'aws',
      name: 'AWS Cloud',
      type: 'Cloud',
      status: 'connected',
      lastSync: '5 minutes ago',
      icon: Database
    },
    {
      id: 'azure',
      name: 'Azure',
      type: 'Cloud',
      status: 'warning',
      lastSync: '15 minutes ago',
      icon: Database
    },
    {
      id: 'nmap',
      name: 'Network Scanner',
      type: 'Scanner',
      status: 'connected',
      lastSync: '1 minute ago',
      icon: Network
    },
    {
      id: 'cmdb',
      name: 'ServiceNow CMDB',
      type: 'CMDB',
      status: 'disconnected',
      lastSync: '2 hours ago',
      icon: Database
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'disconnected': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-400';
      case 'warning': return 'bg-yellow-400';
      case 'disconnected': return 'bg-red-400';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="p-6 border-t border-slate-700">
      <h3 className="text-lg font-semibold text-cyan-400 mb-4">Data Sources</h3>
      <div className="space-y-3">
        {dataSources.map((source) => {
          const IconComponent = source.icon;
          return (
            <div key={source.id} className="bg-slate-900 rounded-lg p-4 border border-slate-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <IconComponent className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-white font-medium text-sm">{source.name}</p>
                    <p className="text-slate-400 text-xs">{source.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusDot(source.status)}`}></div>
                  <span className={`text-xs ${getStatusColor(source.status)}`}>
                    {source.status}
                  </span>
                </div>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Last sync: {source.lastSync}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DataSourcePanel;
