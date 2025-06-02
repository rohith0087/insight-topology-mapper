
import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ConfigFormProps } from '../../types/dataSourceTypes';

const AzureConfigForm: React.FC<ConfigFormProps> = ({ config, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="subscription_id" className="text-slate-300">Azure Subscription ID</Label>
        <Input
          id="subscription_id"
          value={config.subscription_id || ''}
          onChange={(e) => onChange({ ...config, subscription_id: e.target.value })}
          className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
        />
      </div>
      <div>
        <Label htmlFor="tenant_id" className="text-slate-300">Tenant ID</Label>
        <Input
          id="tenant_id"
          value={config.tenant_id || ''}
          onChange={(e) => onChange({ ...config, tenant_id: e.target.value })}
          className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
        />
      </div>
      <div>
        <Label htmlFor="client_id" className="text-slate-300">Client ID</Label>
        <Input
          id="client_id"
          value={config.client_id || ''}
          onChange={(e) => onChange({ ...config, client_id: e.target.value })}
          className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
        />
      </div>
      <div>
        <Label htmlFor="client_secret" className="text-slate-300">Client Secret</Label>
        <Input
          id="client_secret"
          type="password"
          value={config.client_secret || ''}
          onChange={(e) => onChange({ ...config, client_secret: e.target.value })}
          className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
        />
      </div>
    </div>
  );
};

export default AzureConfigForm;
