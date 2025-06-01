
import React, { useState } from 'react';
import { Edit, Trash2, Power, PowerOff, RefreshCw } from 'lucide-react';
import { useDataSources, useRunETL } from '../hooks/useDataSources';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './ui/use-toast';
import DataSourceConfigDialog from './DataSourceConfigDialog';

const DataSourceManagement = () => {
  const { data: dataSources, isLoading, refetch } = useDataSources();
  const runETL = useRunETL();
  const { toast } = useToast();
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const toggleDataSource = async (id: string, enabled: boolean) => {
    setUpdatingStatus(id);
    try {
      const { error } = await supabase
        .from('data_sources')
        .update({ enabled: !enabled })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Data source ${!enabled ? 'enabled' : 'disabled'} successfully`,
      });

      refetch();
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update data source",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const deleteDataSource = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('data_sources')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Data Source Deleted",
        description: `"${name}" has been removed successfully`,
      });

      refetch();
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete data source",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string, enabled: boolean) => {
    if (!enabled) {
      return <Badge variant="secondary" className="bg-slate-600">Disabled</Badge>;
    }
    
    switch (status) {
      case 'success':
        return <Badge className="bg-green-600">Connected</Badge>;
      case 'running':
        return <Badge className="bg-blue-600">Running</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Pending</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      nmap: '🌐',
      aws: '☁️',
      azure: '🔵',
      splunk: '📊',
      snmp: '📡',
      api: '🔌'
    };
    return icons[type] || '⚙️';
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-slate-800 rounded-lg">
        <div className="text-slate-400">Loading data sources...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-800 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-cyan-400">Data Source Management</h2>
          <p className="text-slate-400 text-sm">Configure and manage your network monitoring tools</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => runETL.mutate()}
            disabled={runETL.isPending}
            variant="outline"
            className="border-slate-600 hover:bg-slate-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${runETL.isPending ? 'animate-spin' : ''}`} />
            {runETL.isPending ? 'Running ETL...' : 'Run All ETL'}
          </Button>
          <DataSourceConfigDialog onSourceAdded={refetch} />
        </div>
      </div>

      {!dataSources || dataSources.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-600 rounded-lg">
          <div className="text-4xl mb-4">🔧</div>
          <h3 className="text-lg font-medium text-white mb-2">No Data Sources Configured</h3>
          <p className="text-slate-400 mb-6">
            Get started by adding your first network monitoring tool or security system.
          </p>
          <DataSourceConfigDialog onSourceAdded={refetch} />
        </div>
      ) : (
        <div className="grid gap-4">
          {dataSources.map((source) => (
            <div key={source.id} className="bg-slate-900 rounded-lg p-6 border border-slate-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{getTypeIcon(source.type)}</div>
                  <div>
                    <h3 className="text-lg font-medium text-white">{source.name}</h3>
                    <p className="text-slate-400 text-sm uppercase tracking-wide">{source.type}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {getStatusBadge(source.sync_status, source.enabled)}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleDataSource(source.id, source.enabled)}
                    disabled={updatingStatus === source.id}
                    className="text-slate-400 hover:text-white"
                  >
                    {source.enabled ? (
                      <PowerOff className="w-4 h-4" />
                    ) : (
                      <Power className="w-4 h-4" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteDataSource(source.id, source.name)}
                    className="text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Last Sync:</span>
                  <p className="text-white">
                    {source.last_sync ? new Date(source.last_sync).toLocaleString() : 'Never'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Sync Interval:</span>
                  <p className="text-white">{source.sync_interval}s</p>
                </div>
                <div>
                  <span className="text-slate-400">Updated:</span>
                  <p className="text-white">{new Date(source.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              {Object.keys(source.config).length > 0 && (
                <div className="mt-3">
                  <span className="text-slate-400 text-sm">Configuration:</span>
                  <div className="mt-1 bg-slate-800 rounded p-2 text-xs text-slate-300">
                    {Object.entries(source.config).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span>{key}:</span>
                        <span className="text-cyan-400">
                          {typeof value === 'string' && value.includes('secret') || key.includes('password') || key.includes('key') 
                            ? '••••••••' 
                            : String(value).substring(0, 50)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DataSourceManagement;
