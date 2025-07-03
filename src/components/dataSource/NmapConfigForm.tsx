
import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { Info, Shield } from 'lucide-react';
import { ConfigFormProps } from '../../types/dataSourceTypes';

const NmapConfigForm: React.FC<ConfigFormProps> = ({ config, onChange }) => {
  return (
    <div className="space-y-4">
      <Alert className="border-green-200 bg-green-50">
        <Shield className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Real Network Scanning:</strong> This will perform actual TCP/UDP port scanning on your network. 
          Only private IP ranges are allowed for security.
        </AlertDescription>
      </Alert>

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
          <p className="text-xs text-slate-400 mt-1">
            Supported formats: CIDR (192.168.1.0/24), Range (192.168.1.1-192.168.1.50), Single IP (192.168.1.1)
          </p>
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
                <SelectItem value="tcp_syn" className="text-white hover:bg-slate-700">TCP SYN Scan (Fast)</SelectItem>
                <SelectItem value="tcp_connect" className="text-white hover:bg-slate-700">TCP Connect Scan</SelectItem>
                <SelectItem value="udp" className="text-white hover:bg-slate-700">UDP Scan (Slow)</SelectItem>
                <SelectItem value="ping" className="text-white hover:bg-slate-700">Ping Scan Only</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-400 mt-1">
              TCP SYN is recommended for speed and stealth
            </p>
          </div>

          <div>
            <Label htmlFor="ports" className="text-slate-300">Port Range</Label>
            <Input
              id="ports"
              placeholder="22,80,443,3389 or 1-1000"
              value={config.ports || ''}
              onChange={(e) => onChange({ ...config, ports: e.target.value })}
              className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
            />
            <p className="text-xs text-slate-400 mt-1">
              Leave empty to scan common ports (22, 80, 443, etc.)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="scan_timing" className="text-slate-300">Scan Timing</Label>
            <Select value={config.scan_timing || 'normal'} onValueChange={(value) => 
              onChange({ ...config, scan_timing: value })
            }>
              <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-600">
                <SelectItem value="slow" className="text-white hover:bg-slate-700">Slow (Stealthy)</SelectItem>
                <SelectItem value="normal" className="text-white hover:bg-slate-700">Normal</SelectItem>
                <SelectItem value="fast" className="text-white hover:bg-slate-700">Fast (Aggressive)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-400 mt-1">
              Slower scans are less likely to be detected
            </p>
          </div>

          <div>
            <Label htmlFor="max_hosts" className="text-slate-300">Max Concurrent Hosts</Label>
            <Input
              id="max_hosts"
              type="number"
              placeholder="50"
              value={config.max_hosts || ''}
              onChange={(e) => onChange({ ...config, max_hosts: parseInt(e.target.value) || 50 })}
              className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
              min="1"
              max="100"
            />
            <p className="text-xs text-slate-400 mt-1">
              Lower values reduce network impact (default: 50)
            </p>
          </div>
        </div>

        <div>
          <Label htmlFor="service_detection" className="text-slate-300">Service Detection</Label>
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              id="service_detection"
              checked={config.service_detection !== false}
              onChange={(e) => onChange({ ...config, service_detection: e.target.checked })}
              className="rounded border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-800"
            />
            <Label htmlFor="service_detection" className="text-slate-300 font-normal">
              Detect services and versions on open ports
            </Label>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enables banner grabbing and service fingerprinting for better device identification
          </p>
        </div>

        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Network Discovery Features:</strong>
            <br />
            • Real TCP/UDP port scanning with configurable timing
            <br />
            • Service detection and banner grabbing
            <br />
            • Device type fingerprinting based on open ports
            <br />
            • Hostname resolution and network mapping
            <br />
            • Safety controls prevent scanning public networks
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default NmapConfigForm;
