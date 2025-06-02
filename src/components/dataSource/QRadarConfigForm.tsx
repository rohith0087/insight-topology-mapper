
import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ConfigFormProps } from '../../types/dataSourceTypes';

const QRadarConfigForm: React.FC<ConfigFormProps> = ({ config, onChange }) => {
  const updateConfig = (field: string, value: string) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-cyan-400">IBM QRadar SIEM Configuration</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="qradar_host" className="text-slate-300">QRadar Host *</Label>
          <Input
            id="qradar_host"
            placeholder="qradar.company.com"
            value={config.qradar_host || ''}
            onChange={(e) => updateConfig('qradar_host', e.target.value)}
            className="bg-slate-900 border-slate-600 text-white placeholder-slate-400"
          />
        </div>
        <div>
          <Label htmlFor="port" className="text-slate-300">Port</Label>
          <Input
            id="port"
            placeholder="443"
            value={config.port || '443'}
            onChange={(e) => updateConfig('port', e.target.value)}
            className="bg-slate-900 border-slate-600 text-white placeholder-slate-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="username" className="text-slate-300">Username *</Label>
          <Input
            id="username"
            placeholder="QRadar username"
            value={config.username || ''}
            onChange={(e) => updateConfig('username', e.target.value)}
            className="bg-slate-900 border-slate-600 text-white placeholder-slate-400"
          />
        </div>
        <div>
          <Label htmlFor="password" className="text-slate-300">Password *</Label>
          <Input
            id="password"
            type="password"
            placeholder="QRadar password"
            value={config.password || ''}
            onChange={(e) => updateConfig('password', e.target.value)}
            className="bg-slate-900 border-slate-600 text-white placeholder-slate-400"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="auth_token" className="text-slate-300">Auth Token (Alternative to username/password)</Label>
        <Input
          id="auth_token"
          type="password"
          placeholder="SEC token for API access"
          value={config.auth_token || ''}
          onChange={(e) => updateConfig('auth_token', e.target.value)}
          className="bg-slate-900 border-slate-600 text-white placeholder-slate-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="domain_id" className="text-slate-300">Domain ID</Label>
          <Input
            id="domain_id"
            placeholder="0"
            value={config.domain_id || '0'}
            onChange={(e) => updateConfig('domain_id', e.target.value)}
            className="bg-slate-900 border-slate-600 text-white placeholder-slate-400"
          />
        </div>
        <div>
          <Label htmlFor="version" className="text-slate-300">API Version</Label>
          <Input
            id="version"
            placeholder="19.0"
            value={config.version || '19.0'}
            onChange={(e) => updateConfig('version', e.target.value)}
            className="bg-slate-900 border-slate-600 text-white placeholder-slate-400"
          />
        </div>
      </div>

      <div className="text-sm text-slate-400">
        <p>Connect to IBM QRadar SIEM to extract network topology from security events and assets.</p>
      </div>
    </div>
  );
};

export default QRadarConfigForm;
