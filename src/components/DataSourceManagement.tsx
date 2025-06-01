
import React, { useState } from 'react';
import { RefreshCw, Plus } from 'lucide-react';
import { useDataSources, useRunETL } from '../hooks/useDataSources';
import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './ui/use-toast';
import DataSourceConfigDialog from './DataSourceConfigDialog';
import DataSourceCard from './DataSourceCard';

const DataSourceManagement = () => {
  const { data: dataSources, isLoading, refetch } = useDataSources();
  const runETL = useRunETL();
  const { toast } = useToast();
  const [editingSource, setEditingSource] = useState<any>(null);

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

  const handleSourceUpdated = () => {
    setEditingSource(null);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="flex items-center space-x-3 text-slate-400">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading data sources...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-cyan-400">Data Sources</h2>
          <p className="text-slate-400 text-sm">
            Manage your network monitoring tools and security systems
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => runETL.mutate()}
            disabled={runETL.isPending}
            variant="outline"
            className="border-slate-600 hover:bg-slate-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${runETL.isPending ? 'animate-spin' : ''}`} />
            {runETL.isPending ? 'Running...' : 'Sync All'}
          </Button>
          <DataSourceConfigDialog onSourceAdded={refetch} />
        </div>
      </div>

      {/* Content */}
      {!dataSources || dataSources.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-600 rounded-lg bg-slate-900/50">
          <div className="text-6xl mb-4">🔧</div>
          <h3 className="text-xl font-medium text-white mb-3">No Data Sources</h3>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Connect your first network monitoring tool or security system to start building your topology map.
          </p>
          <DataSourceConfigDialog onSourceAdded={refetch}>
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Data Source
            </Button>
          </DataSourceConfigDialog>
        </div>
      ) : (
        <div className="grid gap-6">
          {dataSources.map((source) => (
            <DataSourceCard
              key={source.id}
              source={source}
              onEdit={setEditingSource}
              onDelete={deleteDataSource}
              onRefresh={refetch}
            />
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      {editingSource && (
        <DataSourceConfigDialog
          editingSource={editingSource}
          onSourceAdded={handleSourceUpdated}
          onClose={() => setEditingSource(null)}
        />
      )}
    </div>
  );
};

export default DataSourceManagement;
