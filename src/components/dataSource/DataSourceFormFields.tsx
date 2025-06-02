
import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DataSourceConfig } from '../../types/dataSourceTypes';

interface DataSourceFormFieldsProps {
  formData: DataSourceConfig;
  onFormDataChange: (data: DataSourceConfig) => void;
}

const DataSourceFormFields: React.FC<DataSourceFormFieldsProps> = ({ formData, onFormDataChange }) => {
  const sourceTypes = [
    { value: 'nmap', label: 'Nmap Network Scanner' },
    { value: 'aws', label: 'AWS Discovery' },
    { value: 'azure', label: 'Azure Monitor' },
    { value: 'splunk', label: 'Splunk SIEM' },
    { value: 'snmp', label: 'SNMP Monitoring' },
    { value: 'api', label: 'Custom API' },
    { value: 'sentinelone', label: 'SentinelOne EDR' },
    { value: 'qradar', label: 'IBM QRadar SIEM' },
    { value: 'datadog', label: 'DataDog Monitoring' },
    { value: 'microsoft-sentinel', label: 'Microsoft Sentinel' }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="name" className="text-slate-300">Data Source Name *</Label>
        <Input
          id="name"
          placeholder="My Network Scanner"
          value={formData.name}
          onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
          className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
        />
      </div>
      <div>
        <Label htmlFor="type" className="text-slate-300">Source Type</Label>
        <Select 
          value={formData.type} 
          onValueChange={(value) => onFormDataChange({ ...formData, type: value, config: {} })}
        >
          <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-600">
            {sourceTypes.map(type => (
              <SelectItem key={type.value} value={type.value} className="text-white hover:bg-slate-700">
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DataSourceFormFields;
