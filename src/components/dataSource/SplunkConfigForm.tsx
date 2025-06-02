
import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ConfigFormProps } from '../../types/dataSourceTypes';

const SplunkConfigForm: React.FC<ConfigFormProps> = ({ config, onChange }) => {
  return (
    <div className="grid gap-4">
      <div>
        <Label htmlFor="splunk_url" className="text-slate-300">Splunk Server URL *</Label>
        <Input
          id="splunk_url"
          placeholder="https://splunk.company.com:8089"
          value={config.endpoint || ''}
          onChange={(e) => onChange({ ...config, endpoint: e.target.value })}
          className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="username" className="text-slate-300">Username *</Label>
          <Input
            id="username"
            value={config.username || ''}
            onChange={(e) => onChange({ ...config, username: e.target.value })}
            className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
          />
        </div>
        <div>
          <Label htmlFor="password" className="text-slate-300">Password *</Label>
          <Input
            id="password"
            type="password"
            value={config.password || ''}
            onChange={(e) => onChange({ ...config, password: e.target.value })}
            className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="index" className="text-slate-300">Search Index</Label>
        <Input
          id="index"
          placeholder="network, security, main"
          value={config.index || ''}
          onChange={(e) => onChange({ ...config, index: e.target.value })}
          className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
        />
      </div>
    </div>
  );
};

export default SplunkConfigForm;
