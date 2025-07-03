
import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { useToast } from './ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useRunIndividualETL } from '../hooks/useDataSources';
import DataSourceCardHeader from './dataSource/DataSourceCardHeader';
import DataSourceCardTestResults from './dataSource/DataSourceCardTestResults';
import DataSourceCardStats from './dataSource/DataSourceCardStats';
import DataSourceCardActions from './dataSource/DataSourceCardActions';

interface DataSourceCardProps {
  source: any;
  onEdit: (source: any) => void;
  onDelete: (id: string, name: string) => void;
  onRefresh: () => void;
}

const DataSourceCard: React.FC<DataSourceCardProps> = ({ source, onEdit, onDelete, onRefresh }) => {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [updating, setUpdating] = useState(false);
  const runIndividualETL = useRunIndividualETL();
  const { toast } = useToast();

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      const response = await supabase.functions.invoke('test-connection', {
        body: { type: source.type, config: source.config }
      });
      
      if (response.error) throw response.error;
      
      setTestResult(response.data);
      
      if (response.data.success) {
        toast({
          title: "Connection Successful",
          description: response.data.message,
        });
      } else {
        toast({
          title: "Connection Failed",
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

  const toggleEnabled = async () => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('data_sources')
        .update({ enabled: !source.enabled })
        .eq('id', source.id);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Data source ${!source.enabled ? 'enabled' : 'disabled'}`,
      });

      onRefresh();
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleScan = async () => {
    try {
      await runIndividualETL.mutateAsync(source.id);
      toast({
        title: "Scan Started",
        description: `${source.name} scan has been initiated`,
      });
      onRefresh();
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: error.message || "Failed to start scan",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-slate-900 border-slate-600 hover:border-slate-500 transition-colors">
      <DataSourceCardHeader source={source} />

      <CardContent className="space-y-4">
        <DataSourceCardTestResults testResult={testResult} />
        <DataSourceCardStats source={source} />
        <DataSourceCardActions
          source={source}
          testing={testing}
          updating={updating}
          scanning={runIndividualETL.isPending}
          onTestConnection={testConnection}
          onScan={handleScan}
          onToggleEnabled={toggleEnabled}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </CardContent>
    </Card>
  );
};

export default DataSourceCard;
