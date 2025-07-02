
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DataSourceConfig, DataSourceConfigDialogProps, TestResult } from '../types/dataSourceTypes';
import DataSourceConfigForm from './dataSource/DataSourceConfigForm';
import TestConnectionComponent from './dataSource/TestConnectionComponent';
import DataSourceDialogHeader from './dataSource/DataSourceDialogHeader';
import DataSourceFormFields from './dataSource/DataSourceFormFields';
import DataSourceActionButtons from './dataSource/DataSourceActionButtons';

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

  useEffect(() => {
    if (editingSource) {
      setFormData({
        name: editingSource.name,
        type: editingSource.type,
        config: editingSource.config,
        enabled: editingSource.enabled,
        credentialId: editingSource.credential_id
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
            enabled: formData.enabled,
            credential_id: formData.credentialId
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
            enabled: formData.enabled,
            credential_id: formData.credentialId
          }]);

        if (error) throw error;

        toast({
          title: "Data Source Added",
          description: "Successfully added new data source!",
        });
      }

      handleClose();
      onSourceAdded?.();
    } catch (error) {
      console.error('Save error:', error);
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

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      handleClose();
    } else {
      setOpen(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Data Source
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-600 text-white">
        <DataSourceDialogHeader isEditing={!!editingSource} />
        
        <div className="space-y-6">
          <DataSourceFormFields 
            formData={formData}
            onFormDataChange={setFormData}
          />

          <DataSourceConfigForm 
            type={formData.type}
            config={formData.config}
            onChange={(config) => setFormData({ ...formData, config })}
          />

          <TestConnectionComponent 
            sourceType={formData.type}
            config={formData.config}
            credentialId={formData.credentialId}
          />

          <DataSourceActionButtons
            onCancel={handleClose}
            onSave={saveDataSource}
            saving={saving}
            testing={testing}
            isEditing={!!editingSource}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DataSourceConfigDialog;
