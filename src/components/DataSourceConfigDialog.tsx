
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Save, X } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DataSourceConfig, DataSourceConfigDialogProps, TestResult } from '../types/dataSourceTypes';
import DataSourceConfigForm from './dataSource/DataSourceConfigForm';
import TestConnectionComponent from './dataSource/TestConnectionComponent';

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
  const [testResult, setTestResult] = useState<TestResult | null>(null);
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

          <DataSourceConfigForm 
            type={formData.type}
            config={formData.config}
            onChange={(config) => setFormData({ ...formData, config })}
          />

          <TestConnectionComponent 
            testResult={testResult}
            testing={testing}
            onTest={testConnection}
          />

          <div className="flex justify-between pt-4 border-t border-slate-600">
            <div></div>
            
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
