
import React, { useState } from 'react';
import { Edit, Trash2, Power, PowerOff, TestTube, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useToast } from './ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const { toast } = useToast();

  const getTypeIcon = (type: string) => {
    const iconImages = {
      aws: '/lovable-uploads/e1398d3d-578a-471e-bfde-4096d0238576.png',
      azure: '/lovable-uploads/c8dd797a-375c-47db-991f-ea4bdbf311f1.png',
      datadog: '/lovable-uploads/29d45e0c-b15e-4e77-89ae-28286dda410d.png',
      'microsoft-sentinel': '/lovable-uploads/09db2bdd-5525-47a7-aaa8-e30b98d6901d.png',
      qradar: '/lovable-uploads/88b0bf91-c943-4248-baf0-5e75ef46c244.png',
      sentinelone: '/lovable-uploads/fe727117-4df6-4009-85bb-536a2073baec.png',
      splunk: '/lovable-uploads/0b9997af-4433-4058-bd76-6a42290c5299.png'
    };

    if (iconImages[type]) {
      return <img src={iconImages[type]} alt={type} className="w-8 h-8 object-contain" />;
    }

    const icons = {
      nmap: '🌐',
      snmp: '📡',
      api: '🔌'
    };
    return <span className="text-2xl">{icons[type] || '⚙️'}</span>;
  };

  const getStatusIcon = (status: string, enabled: boolean) => {
    if (!enabled) return <XCircle className="w-4 h-4 text-slate-400" />;
    
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'running':
        return <Clock className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string, enabled: boolean) => {
    if (!enabled) {
      return <Badge variant="secondary" className="bg-slate-600">Disabled</Badge>;
    }
    
    switch (status) {
      case 'success':
        return <Badge className="bg-green-600 hover:bg-green-700">Connected</Badge>;
      case 'running':
        return <Badge className="bg-blue-600 hover:bg-blue-700">Running</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Pending</Badge>;
    }
  };

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

  return (
    <Card className="bg-slate-900 border-slate-600 hover:border-slate-500 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8">{getTypeIcon(source.type)}</div>
            <div>
              <CardTitle className="text-white text-lg">{source.name}</CardTitle>
              <p className="text-slate-400 text-sm uppercase tracking-wide">{source.type}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(source.sync_status, source.enabled)}
            {getStatusBadge(source.sync_status, source.enabled)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Test Results */}
        {testResult && (
          <div className={`p-3 rounded-lg border ${
            testResult.success 
              ? 'bg-green-900/20 border-green-600 text-green-200' 
              : 'bg-red-900/20 border-red-600 text-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              {testResult.success ? 
                <CheckCircle className="w-4 h-4" /> : 
                <XCircle className="w-4 h-4" />
              }
              <span className="font-medium">{testResult.message}</span>
            </div>
            {testResult.details && (
              <div className="mt-2 text-xs opacity-80">
                {Object.entries(testResult.details).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span>{key}:</span>
                    <span>{String(value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="bg-slate-800 rounded p-2">
            <span className="text-slate-400 block">Last Sync</span>
            <span className="text-white text-xs">
              {source.last_sync ? new Date(source.last_sync).toLocaleString() : 'Never'}
            </span>
          </div>
          <div className="bg-slate-800 rounded p-2">
            <span className="text-slate-400 block">Interval</span>
            <span className="text-white text-xs">{source.sync_interval}s</span>
          </div>
          <div className="bg-slate-800 rounded p-2">
            <span className="text-slate-400 block">Updated</span>
            <span className="text-white text-xs">
              {new Date(source.updated_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={testConnection}
            disabled={testing}
            className="border-slate-600 hover:bg-slate-700"
          >
            <TestTube className={`w-4 h-4 mr-2 ${testing ? 'animate-pulse' : ''}`} />
            {testing ? 'Testing...' : 'Test'}
          </Button>

          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleEnabled}
              disabled={updating}
              className="text-slate-400 hover:text-white"
            >
              {source.enabled ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(source)}
              className="text-slate-400 hover:text-cyan-400"
            >
              <Edit className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(source.id, source.name)}
              className="text-slate-400 hover:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataSourceCard;
