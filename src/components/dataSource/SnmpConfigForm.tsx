
import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ConfigFormProps } from '../../types/dataSourceTypes';

const SnmpConfigForm: React.FC<ConfigFormProps> = ({ config, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="hosts" className="text-slate-300">SNMP Hosts (comma-separated)</Label>
        <Textarea
          id="hosts"
          placeholder="192.168.1.1, switch01.company.com, router02.company.com"
          value={config.hosts || ''}
          onChange={(e) => onChange({ ...config, hosts: e.target.value })}
          className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
        />
      </div>
      <div>
        <Label htmlFor="community" className="text-slate-300">SNMP Community String</Label>
        <Input
          id="community"
          type="password"
          placeholder="public"
          value={config.community || ''}
          onChange={(e) => onChange({ ...config, community: e.target.value })}
          className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
        />
      </div>
      <div>
        <Label htmlFor="version" className="text-slate-300">SNMP Version</Label>
        <Select value={config.version || '2c'} onValueChange={(value) => 
          onChange({ ...config, version: value })
        }>
          <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-600">
            <SelectItem value="1" className="text-white hover:bg-slate-700">SNMPv1</SelectItem>
            <SelectItem value="2c" className="text-white hover:bg-slate-700">SNMPv2c</SelectItem>
            <SelectItem value="3" className="text-white hover:bg-slate-700">SNMPv3</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SnmpConfigForm;
