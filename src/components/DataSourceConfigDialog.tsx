
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, TestTube, Save } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DataSourceConfig {
  name: string;
  type: string;
  config: any;
  enabled: boolean;
}

const DataSourceConfigDialog = ({ onSourceAdded }: { onSourceAdded?: () => void }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<DataSourceConfig>({
    name: '',
    type: 'nmap',
    config: {},
    enabled: true
  });
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const sourceTypes = [
    { value: 'nmap', label: 'Nmap Network Scanner' },
    { value: 'aws', label: 'AWS Discovery' },
    { value: 'azure', label: 'Azure Monitor' },
    { value: 'splunk', label: 'Splunk SIEM' },
    { value: 'snmp', label: 'SNMP Monitoring' },
    { value: 'api', label: 'Custom API' }
  ];

  const renderConfigFields = () => {
    switch (formData.type) {
      case 'nmap':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="target_ranges">Target IP Ranges (comma-separated)</Label>
              <Input
                id="target_ranges"
                placeholder="192.168.1.0/24, 10.0.0.0/8"
                value={formData.config.target_ranges || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, target_ranges: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="scan_type">Scan Type</Label>
              <Select value={formData.config.scan_type || 'tcp_syn'} onValueChange={(value) => 
                setFormData({ ...formData, config: { ...formData.config, scan_type: value } })
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tcp_syn">TCP SYN Scan</SelectItem>
                  <SelectItem value="tcp_connect">TCP Connect Scan</SelectItem>
                  <SelectItem value="udp">UDP Scan</SelectItem>
                  <SelectItem value="ping">Ping Scan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="ports">Port Range (optional)</Label>
              <Input
                id="ports"
                placeholder="1-1000, 22, 80, 443"
                value={formData.config.ports || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, ports: e.target.value }
                })}
              />
            </div>
          </div>
        );

      case 'aws':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="access_key">AWS Access Key ID</Label>
              <Input
                id="access_key"
                type="password"
                value={formData.config.access_key_id || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, access_key_id: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="secret_key">AWS Secret Access Key</Label>
              <Input
                id="secret_key"
                type="password"
                value={formData.config.secret_access_key || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, secret_access_key: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="regions">AWS Regions (comma-separated)</Label>
              <Input
                id="regions"
                placeholder="us-east-1, us-west-2, eu-west-1"
                value={formData.config.regions || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, regions: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="services">AWS Services to Monitor</Label>
              <Textarea
                id="services"
                placeholder="ec2, vpc, rds, lambda, s3"
                value={formData.config.services || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, services: e.target.value }
                })}
              />
            </div>
          </div>
        );

      case 'splunk':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="splunk_url">Splunk Server URL</Label>
              <Input
                id="splunk_url"
                placeholder="https://splunk.company.com:8089"
                value={formData.config.endpoint || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, endpoint: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.config.username || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, username: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.config.password || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, password: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="index">Search Index</Label>
              <Input
                id="index"
                placeholder="network, security, main"
                value={formData.config.index || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, index: e.target.value }
                })}
              />
            </div>
          </div>
        );

      case 'azure':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="subscription_id">Azure Subscription ID</Label>
              <Input
                id="subscription_id"
                value={formData.config.subscription_id || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, subscription_id: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="tenant_id">Tenant ID</Label>
              <Input
                id="tenant_id"
                value={formData.config.tenant_id || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, tenant_id: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="client_id">Client ID</Label>
              <Input
                id="client_id"
                value={formData.config.client_id || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, client_id: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="client_secret">Client Secret</Label>
              <Input
                id="client_secret"
                type="password"
                value={formData.config.client_secret || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, client_secret: e.target.value }
                })}
              />
            </div>
          </div>
        );

      case 'snmp':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="hosts">SNMP Hosts (comma-separated)</Label>
              <Textarea
                id="hosts"
                placeholder="192.168.1.1, switch01.company.com, router02.company.com"
                value={formData.config.hosts || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, hosts: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="community">SNMP Community String</Label>
              <Input
                id="community"
                type="password"
                placeholder="public"
                value={formData.config.community || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, community: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="version">SNMP Version</Label>
              <Select value={formData.config.version || '2c'} onValueChange={(value) => 
                setFormData({ ...formData, config: { ...formData.config, version: value } })
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">SNMPv1</SelectItem>
                  <SelectItem value="2c">SNMPv2c</SelectItem>
                  <SelectItem value="3">SNMPv3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <Label htmlFor="custom_config">Configuration (JSON)</Label>
            <Textarea
              id="custom_config"
              placeholder='{"endpoint": "https://api.example.com", "api_key": "your-key"}'
              value={JSON.stringify(formData.config, null, 2)}
              onChange={(e) => {
                try {
                  const config = JSON.parse(e.target.value);
                  setFormData({ ...formData, config });
                } catch (error) {
                  // Invalid JSON, don't update
                }
              }}
            />
          </div>
        );
    }
  };

  const testConnection = async () => {
    setTesting(true);
    try {
      const response = await supabase.functions.invoke('test-connection', {
        body: { type: formData.type, config: formData.config }
      });
      
      if (response.error) throw response.error;
      
      toast({
        title: "Connection Test Successful",
        description: "Successfully connected to the data source!",
      });
    } catch (error) {
      toast({
        title: "Connection Test Failed",
        description: error.message || "Failed to connect to data source",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const saveDataSource = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a name for the data source",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('data_sources')
        .insert([{
          name: formData.name,
          type: formData.type,
          config: formData.config,
          enabled: formData.enabled
        }]);

      if (error) throw error;

      toast({
        title: "Data Source Added",
        description: "Successfully added new data source!",
      });

      setOpen(false);
      onSourceAdded?.();
      
      // Reset form
      setFormData({
        name: '',
        type: 'nmap',
        config: {},
        enabled: true
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save data source",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-cyan-600 hover:bg-cyan-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Data Source
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-800 border-slate-600">
        <DialogHeader>
          <DialogTitle className="text-cyan-400">Configure Data Source</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Data Source Name</Label>
              <Input
                id="name"
                placeholder="My Network Scanner"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="type">Source Type</Label>
              <Select value={formData.type} onValueChange={(value) => 
                setFormData({ ...formData, type: value, config: {} })
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sourceTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {renderConfigFields()}

          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={testConnection}
              disabled={testing}
              className="border-slate-600 hover:bg-slate-700"
            >
              <TestTube className="w-4 h-4 mr-2" />
              {testing ? 'Testing...' : 'Test Connection'}
            </Button>
            
            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="border-slate-600 hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button 
                onClick={saveDataSource}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save & Configure'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DataSourceConfigDialog;
