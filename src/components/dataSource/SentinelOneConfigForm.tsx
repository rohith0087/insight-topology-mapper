
import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ConfigFormProps } from '../../types/dataSourceTypes';

const SentinelOneConfigForm: React.FC<ConfigFormProps> = ({ config, onChange }) => {
  const updateConfig = (field: string, value: string) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-cyan-400">SentinelOne EDR Configuration</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="console_url" className="text-slate-300">Console URL *</Label>
          <Input
            id="console_url"
            placeholder="https://your-tenant.sentinelone.net"
            value={config.console_url || ''}
            onChange={(e) => updateConfig('console_url', e.target.value)}
            className="bg-slate-900 border-slate-600 text-white placeholder-slate-400"
          />
        </div>
        <div>
          <Label htmlFor="api_token" className="text-slate-300">API Token *</Label>
          <Input
            id="api_token"
            type="password"
            placeholder="Your SentinelOne API token"
            value={config.api_token || ''}
            onChange={(e) => updateConfig('api_token', e.target.value)}
            className="bg-slate-900 border-slate-600 text-white placeholder-slate-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="site_id" className="text-slate-300">Site ID (Optional)</Label>
          <Input
            id="site_id"
            placeholder="Specific site ID to monitor"
            value={config.site_id || ''}
            onChange={(e) => updateConfig('site_id', e.target.value)}
            className="bg-slate-900 border-slate-600 text-white placeholder-slate-400"
          />
        </div>
        <div>
          <Label htmlFor="account_id" className="text-slate-300">Account ID (Optional)</Label>
          <Input
            id="account_id"
            placeholder="Specific account ID to monitor"
            value={config.account_id || ''}
            onChange={(e) => updateConfig('account_id', e.target.value)}
            className="bg-slate-900 border-slate-600 text-white placeholder-slate-400"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="collection_interval" className="text-slate-300">Collection Interval (minutes)</Label>
        <Input
          id="collection_interval"
          type="number"
          placeholder="15"
          value={config.collection_interval || '15'}
          onChange={(e) => updateConfig('collection_interval', e.target.value)}
          className="bg-slate-900 border-slate-600 text-white placeholder-slate-400"
        />
      </div>

      <div className="text-sm text-slate-400">
        <p>Configure SentinelOne EDR integration to collect endpoint and network information.</p>
      </div>
    </div>
  );
};

export default SentinelOneConfigForm;
