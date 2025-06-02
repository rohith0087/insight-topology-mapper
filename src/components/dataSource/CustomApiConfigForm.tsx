
import React from 'react';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { ConfigFormProps } from '../../types/dataSourceTypes';

const CustomApiConfigForm: React.FC<ConfigFormProps> = ({ config, onChange }) => {
  return (
    <div>
      <Label htmlFor="custom_config" className="text-slate-300">Configuration (JSON)</Label>
      <Textarea
        id="custom_config"
        placeholder='{"endpoint": "https://api.example.com", "api_key": "your-key"}'
        value={JSON.stringify(config, null, 2)}
        onChange={(e) => {
          try {
            const newConfig = JSON.parse(e.target.value);
            onChange(newConfig);
          } catch (error) {
            // Invalid JSON, don't update
          }
        }}
        className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
      />
    </div>
  );
};

export default CustomApiConfigForm;
