
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, TestTube, Save, X } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DataSourceConfig {
  name: string;
  type: string;
  config: any;
  enabled: boolean;
}

interface DataSourceConfigDialogProps {
  onSourceAdded?: () => void;
  editingSource?: any;
  onClose?: () => void;
  children?: React.ReactNode;
}

const DataSourceConfigDialog: React.FC<DataSourceConfigDialogProps> = ({ 
  onSourceAdded, 
  editingSource, 
  onClose,
  children 
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<DataSourceConfig>({
    name: '',
    type: 'nmap',
    config: {},
    enabled: true
  });
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const { toast } = useToast();

  const sourceTypes = [
    { value: 'nmap', label: 'Nmap Network Scanner' },
    { value: 'aws', label: 'AWS Discovery' },
    { value: 'azure', label: 'Azure Monitor' },
    { value: 'splunk', label: 'Splunk SIEM' },
    { value: 'snmp', label: 'SNMP Monitoring' },
    { value: 'api', label: 'Custom API' }
  ];

  useEffect(() => {
    if (editingSource) {
      setFormData({
        name: editingSource.name,
        type: editingSource.type,
        config: editingSource.config,
        enabled: editingSource.enabled
      });
      setOpen(true);
    }
  }, [editingSource]);

  const renderConfigFields = () => {
    switch (formData.type) {
      case 'nmap':
        return (
          <div className="grid gap-4">
            <div>
              <Label htmlFor="target_ranges" className="text-slate-300">Target IP Ranges *</Label>
              <Input
                id="target_ranges"
                placeholder="192.168.1.0/24, 10.0.0.0/8"
                value={formData.config.target_ranges || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, target_ranges: e.target.value }
                })}
                className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="scan_type" className="text-slate-300">Scan Type</Label>
                <Select value={formData.config.scan_type || 'tcp_syn'} onValueChange={(value) => 
                  setFormData({ ...formData, config: { ...formData.config, scan_type: value } })
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
                  value={formData.config.ports || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    config: { ...formData.config, ports: e.target.value }
                  })}
                  className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
                />
              </div>
            </div>
          </div>
        );

      case 'aws':
        return (
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="access_key" className="text-slate-300">Access Key ID *</Label>
                <Input
                  id="access_key"
                  type="password"
                  value={formData.config.access_key_id || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    config: { ...formData.config, access_key_id: e.target.value }
                  })}
                  className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
                />
              </div>
              <div>
                <Label htmlFor="secret_key" className="text-slate-300">Secret Access Key *</Label>
                <Input
                  id="secret_key"
                  type="password"
                  value={formData.config.secret_access_key || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    config: { ...formData.config, secret_access_key: e.target.value }
                  })}
                  className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="regions" className="text-slate-300">AWS Regions</Label>
              <Input
                id="regions"
                placeholder="us-east-1, us-west-2, eu-west-1"
                value={formData.config.regions || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, regions: e.target.value }
                })}
                className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
            <div>
              <Label htmlFor="services" className="text-slate-300">Services to Monitor</Label>
              <Textarea
                id="services"
                placeholder="ec2, vpc, rds, lambda, s3"
                value={formData.config.services || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, services: e.target.value }
                })}
                className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
          </div>
        );

      case 'splunk':
        return (
          <div className="grid gap-4">
            <div>
              <Label htmlFor="splunk_url" className="text-slate-300">Splunk Server URL *</Label>
              <Input
                id="splunk_url"
                placeholder="https://splunk.company.com:8089"
                value={formData.config.endpoint || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, endpoint: e.target.value }
                })}
                className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username" className="text-slate-300">Username *</Label>
                <Input
                  id="username"
                  value={formData.config.username || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    config: { ...formData.config, username: e.target.value }
                  })}
                  className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-slate-300">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.config.password || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    config: { ...formData.config, password: e.target.value }
                  })}
                  className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="index" className="text-slate-300">Search Index</Label>
              <Input
                id="index"
                placeholder="network, security, main"
                value={formData.config.index || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, index: e.target.value }
                })}
                className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
          </div>
        );

      case 'azure':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="subscription_id" className="text-slate-300">Azure Subscription ID</Label>
              <Input
                id="subscription_id"
                value={formData.config.subscription_id || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, subscription_id: e.target.value }
                })}
                className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
            <div>
              <Label htmlFor="tenant_id" className="text-slate-300">Tenant ID</Label>
              <Input
                id="tenant_id"
                value={formData.config.tenant_id || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, tenant_id: e.target.value }
                })}
                className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
            <div>
              <Label htmlFor="client_id" className="text-slate-300">Client ID</Label>
              <Input
                id="client_id"
                value={formData.config.client_id || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, client_id: e.target.value }
                })}
                className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
            <div>
              <Label htmlFor="client_secret" className="text-slate-300">Client Secret</Label>
              <Input
                id="client_secret"
                type="password"
                value={formData.config.client_secret || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, client_secret: e.target.value }
                })}
                className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
          </div>
        );

      case 'snmp':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="hosts" className="text-slate-300">SNMP Hosts (comma-separated)</Label>
              <Textarea
                id="hosts"
                placeholder="192.168.1.1, switch01.company.com, router02.company.com"
                value={formData.config.hosts || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, hosts: e.target.value }
                })}
                className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
            <div>
              <Label htmlFor="community" className="text-slate-300">SNMP Community String</Label>
              <Input
                id="community"
                type="password"
                placeholder="public"
                value={formData.config.community || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  config: { ...formData.config, community: e.target.value }
                })}
                className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
            <div>
              <Label htmlFor="version" className="text-slate-300">SNMP Version</Label>
              <Select value={formData.config.version || '2c'} onValueChange={(value) => 
                setFormData({ ...formData, config: { ...formData.config, version: value } })
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

      default:
        return (
          <div>
            <Label htmlFor="custom_config" className="text-slate-300">Configuration (JSON)</Label>
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
              className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>
        );
    }
  };

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      const response = await supabase.functions.invoke('test-connection', {
        body: { type: formData.type, config: formData.config }
      });
      
      if (response.error) throw response.error;
      
      setTestResult(response.data);
      
      if (response.data.success) {
        toast({
          title: "Connection Test Successful",
          description: response.data.message,
        });
      } else {
        toast({
          title: "Connection Test Failed",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      const result = { success: false, message: error.message || "Connection test failed" };
      setTestResult(result);
      toast({
        title: "Test Error",
        description: result.message,
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
      if (editingSource) {
        const { error } = await supabase
          .from('data_sources')
          .update({
            name: formData.name,
            type: formData.type,
            config: formData.config,
            enabled: formData.enabled
          })
          .eq('id', editingSource.id);

        if (error) throw error;

        toast({
          title: "Data Source Updated",
          description: "Successfully updated data source!",
        });
      } else {
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
      }

      setOpen(false);
      onSourceAdded?.();
      onClose?.();
      
      // Reset form
      setFormData({
        name: '',
        type: 'nmap',
        config: {},
        enabled: true
      });
      setTestResult(null);
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

  const handleClose = () => {
    setOpen(false);
    onClose?.();
    setFormData({
      name: '',
      type: 'nmap',
      config: {},
      enabled: true
    });
    setTestResult(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Data Source
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-600 text-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-cyan-400 text-xl">
              {editingSource ? 'Edit Data Source' : 'Add Data Source'}
            </DialogTitle>
            <Button variant="ghost" onClick={handleClose} className="text-slate-400 hover:text-white hover:bg-slate-700">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-slate-300">Data Source Name *</Label>
              <Input
                id="name"
                placeholder="My Network Scanner"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
            <div>
              <Label htmlFor="type" className="text-slate-300">Source Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData({ ...formData, type: value, config: {} })}
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

          {renderConfigFields()}

          {/* Test Results */}
          {testResult && (
            <div className={`p-4 rounded-lg border ${
              testResult.success 
                ? 'bg-green-900/20 border-green-600' 
                : 'bg-red-900/20 border-red-600'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${
                  testResult.success ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className={`font-medium ${
                  testResult.success ? 'text-green-200' : 'text-red-200'
                }`}>
                  {testResult.message}
                </span>
              </div>
              {testResult.details && (
                <div className="bg-slate-900 rounded p-3 mt-2">
                  <div className="text-xs text-slate-300 space-y-1">
                    {Object.entries(testResult.details).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="font-medium">{key}:</span>
                        <span className="text-cyan-400">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-slate-600">
            <Button 
              variant="outline" 
              onClick={testConnection}
              disabled={testing || saving}
              className="border-slate-600 hover:bg-slate-700 bg-slate-900 text-slate-300 hover:text-white"
            >
              <TestTube className={`w-4 h-4 mr-2 ${testing ? 'animate-pulse' : ''}`} />
              {testing ? 'Testing...' : 'Test Connection'}
            </Button>
            
            <div className="space-x-3">
              <Button 
                variant="outline" 
                onClick={handleClose}
                disabled={saving}
                className="border-slate-600 hover:bg-slate-700 bg-slate-900 text-slate-300 hover:text-white"
              >
                Cancel
              </Button>
              <Button 
                onClick={saveDataSource}
                disabled={saving || testing}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : (editingSource ? 'Update' : 'Save')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DataSourceConfigDialog;
