
import React, { useState, useEffect } from 'react';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { ConfigFormProps } from '../../types/dataSourceTypes';

const CustomApiConfigForm: React.FC<ConfigFormProps> = ({ config, onChange }) => {
  const [textValue, setTextValue] = useState('');

  // Initialize textarea with formatted JSON or default template
  useEffect(() => {
    if (Object.keys(config).length > 0) {
      setTextValue(JSON.stringify(config, null, 2));
    } else {
      setTextValue(`{
  "endpoint": "https://jsonplaceholder.typicode.com/users",
  "method": "GET",
  "auth_type": "none",
  "node_mapping": {
    "id_field": "id",
    "name_field": "name"
  }
}`);
    }
  }, []);

  const handleChange = (value: string) => {
    setTextValue(value);
    
    // Try to parse JSON and update parent if valid
    try {
      const newConfig = JSON.parse(value);
      onChange(newConfig);
    } catch (error) {
      // Invalid JSON, keep typing but don't update parent yet
    }
  };

  return (
    <div>
      <Label htmlFor="custom_config" className="text-slate-300">Configuration (JSON)</Label>
      <Textarea
        id="custom_config"
        placeholder='{"endpoint": "https://jsonplaceholder.typicode.com/users", "method": "GET", "auth_type": "none"}'
        value={textValue}
        onChange={(e) => handleChange(e.target.value)}
        className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500 min-h-[200px] font-mono text-sm"
        rows={10}
      />
    </div>
  );
};

export default CustomApiConfigForm;
