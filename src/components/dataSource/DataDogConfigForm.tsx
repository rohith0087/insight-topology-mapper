
import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ConfigFormProps } from '../../types/dataSourceTypes';

const DataDogConfigForm: React.FC<ConfigFormProps> = ({ config, onChange }) => {
  const updateConfig = (field: string, value: string) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-cyan-400">DataDog Monitoring Configuration</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="api_key" className="text-slate-300">API Key *</Label>
          <Input
            id="api_key"
            type="password"
            placeholder="Your DataDog API key"
            value={config.api_key || ''}
            onChange={(e) => updateConfig('api_key', e.target.value)}
            className="bg-slate-900 border-slate-600 text-white placeholder-slate-400"
          />
        </div>
        <div>
          <Label htmlFor="app_key" className="text-slate-300">Application Key *</Label>
          <Input
            id="app_key"
            type="password"
            placeholder="Your DataDog application key"
            value={config.app_key || ''}
            onChange={(e) => updateConfig('app_key', e.target.value)}
            className="bg-slate-900 border-slate-600 text-white placeholder-slate-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="site" className="text-slate-300">DataDog Site</Label>
          <Input
            id="site"
            placeholder="datadoghq.com"
            value={config.site || 'datadoghq.com'}
            onChange={(e) => updateConfig('site', e.target.value)}
            className="bg-slate-900 border-slate-600 text-white placeholder-slate-400"
          />
        </div>
        <div>
          <Label htmlFor="organization" className="text-slate-300">Organization (Optional)</Label>
          <Input
            id="organization"
            placeholder="Your organization name"
            value={config.organization || ''}
            onChange={(e) => updateConfig('organization', e.target.value)}
            className="bg-slate-900 border-slate-600 text-white placeholder-slate-400"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="tags_filter" className="text-slate-300">Tags Filter (Optional)</Label>
        <Input
          id="tags_filter"
          placeholder="env:production,team:infrastructure"
          value={config.tags_filter || ''}
          onChange={(e) => updateConfig('tags_filter', e.target.value)}
          className="bg-slate-900 border-slate-600 text-white placeholder-slate-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="metric_window" className="text-slate-300">Metric Window (hours)</Label>
          <Input
            id="metric_window"
            type="number"
            placeholder="24"
            value={config.metric_window || '24'}
            onChange={(e) => updateConfig('metric_window', e.target.value)}
            className="bg-slate-900 border-slate-600 text-white placeholder-slate-400"
          />
        </div>
        <div>
          <Label htmlFor="include_services" className="text-slate-300">Include APM Services</Label>
          <select
            value={config.include_services || 'true'}
            onChange={(e) => updateConfig('include_services', e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-md text-white"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>

      <div className="text-sm text-slate-400">
        <p>Connect to DataDog to extract infrastructure topology and service dependencies.</p>
      </div>
    </div>
  );
};

export default DataDogConfigForm;
