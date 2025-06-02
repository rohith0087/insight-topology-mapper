
import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ConfigFormProps } from '../../types/dataSourceTypes';

const NmapConfigForm: React.FC<ConfigFormProps> = ({ config, onChange }) => {
  return (
    <div className="grid gap-4">
      <div>
        <Label htmlFor="target_ranges" className="text-slate-300">Target IP Ranges *</Label>
        <Input
          id="target_ranges"
          placeholder="192.168.1.0/24, 10.0.0.0/8"
          value={config.target_ranges || ''}
          onChange={(e) => onChange({ ...config, target_ranges: e.target.value })}
          className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="scan_type" className="text-slate-300">Scan Type</Label>
          <Select value={config.scan_type || 'tcp_syn'} onValueChange={(value) => 
            onChange({ ...config, scan_type: value })
          }>
            <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-600">
              <SelectItem value="tcp_syn" className="text-white hover:bg-slate-700">TCP SYN Scan</SelectItem>
              <SelectItem value="tcp_connect" className="text-white hover:bg-slate-700">TCP Connect Scan</SelectItem>
              <SelectItem value="udp" className="text-white hover:bg-slate-700">UDP Scan</SelectItem>
              <SelectItem value="ping" className="text-white hover:bg-slate-700">Ping Scan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="ports" className="text-slate-300">Port Range</Label>
          <Input
            id="ports"
            placeholder="1-1000, 22, 80, 443"
            value={config.ports || ''}
            onChange={(e) => onChange({ ...config, ports: e.target.value })}
            className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
          />
        </div>
      </div>
    </div>
  );
};

export default NmapConfigForm;
