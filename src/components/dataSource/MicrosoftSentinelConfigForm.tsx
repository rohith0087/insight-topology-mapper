
import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ConfigFormProps } from '../../types/dataSourceTypes';

const MicrosoftSentinelConfigForm: React.FC<ConfigFormProps> = ({ config, onChange }) => {
  const updateConfig = (field: string, value: string) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-cyan-400">Microsoft Sentinel Configuration</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="workspace_id" className="text-slate-300">Workspace ID *</Label>
          <Input
            id="workspace_id"
            placeholder="Your Log Analytics workspace ID"
            value={config.workspace_id || ''}
            onChange={(e) => updateConfig('workspace_id', e.target.value)}
            className="bg-slate-900 border-slate-600 text-white placeholder-slate-400"
          />
        </div>
        <div>
          <Label htmlFor="tenant_id" className="text-slate-300">Tenant ID *</Label>
          <Input
            id="tenant_id"
            placeholder="Azure AD tenant ID"
            value={config.tenant_id || ''}
            onChange={(e) => updateConfig('tenant_id', e.target.value)}
            className="bg-slate-900 border-slate-600 text-white placeholder-slate-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="client_id" className="text-slate-300">Client ID *</Label>
          <Input
            id="client_id"
            placeholder="Azure app registration client ID"
            value={config.client_id || ''}
            onChange={(e) => updateConfig('client_id', e.target.value)}
            className="bg-slate-900 border-slate-600 text-white placeholder-slate-400"
          />
        </div>
        <div>
          <Label htmlFor="client_secret" className="text-slate-300">Client Secret *</Label>
          <Input
            id="client_secret"
            type="password"
            placeholder="Azure app registration client secret"
            value={config.client_secret || ''}
            onChange={(e) => updateConfig('client_secret', e.target.value)}
            className="bg-slate-900 border-slate-600 text-white placeholder-slate-400"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="subscription_id" className="text-slate-300">Subscription ID *</Label>
        <Input
          id="subscription_id"
          placeholder="Azure subscription ID"
          value={config.subscription_id || ''}
          onChange={(e) => updateConfig('subscription_id', e.target.value)}
          className="bg-slate-900 border-slate-600 text-white placeholder-slate-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="resource_group" className="text-slate-300">Resource Group *</Label>
          <Input
            id="resource_group"
            placeholder="Sentinel resource group name"
            value={config.resource_group || ''}
            onChange={(e) => updateConfig('resource_group', e.target.value)}
            className="bg-slate-900 border-slate-600 text-white placeholder-slate-400"
          />
        </div>
        <div>
          <Label htmlFor="workspace_name" className="text-slate-300">Workspace Name *</Label>
          <Input
            id="workspace_name"
            placeholder="Log Analytics workspace name"
            value={config.workspace_name || ''}
            onChange={(e) => updateConfig('workspace_name', e.target.value)}
            className="bg-slate-900 border-slate-600 text-white placeholder-slate-400"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="query_timespan" className="text-slate-300">Query Timespan (hours)</Label>
        <Input
          id="query_timespan"
          type="number"
          placeholder="24"
          value={config.query_timespan || '24'}
          onChange={(e) => updateConfig('query_timespan', e.target.value)}
          className="bg-slate-900 border-slate-600 text-white placeholder-slate-400"
        />
      </div>

      <div className="text-sm text-slate-400">
        <p>Connect to Microsoft Sentinel to extract security insights and network topology data.</p>
      </div>
    </div>
  );
};

export default MicrosoftSentinelConfigForm;
