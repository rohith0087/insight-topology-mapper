
import React, { useState } from 'react';
import { RefreshCw, Plus, X } from 'lucide-react';
import { useDataSources, useRunETL } from '../hooks/useDataSources';
import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './ui/use-toast';
import { ScrollArea } from './ui/scroll-area';
import DataSourceConfigDialog from './DataSourceConfigDialog';
import DataSourceCard from './DataSourceCard';

interface DataSourceManagementProps {
  onClose: () => void;
}

const DataSourceManagement: React.FC<DataSourceManagementProps> = ({ onClose }) => {
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

  const handleSourceAdded = () => {
    refetch();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-600 w-full max-w-6xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-semibold text-cyan-400">Data Sources</h2>
            <p className="text-slate-400 text-sm">
              Manage your network monitoring tools and security systems
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => runETL.mutate()}
              disabled={runETL.isPending}
              variant="outline"
              className="border-slate-600 hover:bg-slate-700 bg-slate-900 text-slate-300 hover:text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${runETL.isPending ? 'animate-spin' : ''}`} />
              {runETL.isPending ? 'Running...' : 'Sync All'}
            </Button>
            <DataSourceConfigDialog onSourceAdded={handleSourceAdded}>
              <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Data Source
              </Button>
            </DataSourceConfigDialog>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center space-x-3 text-slate-400">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Loading data sources...</span>
              </div>
            </div>
          ) : !dataSources || dataSources.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔧</div>
                <h3 className="text-xl font-medium text-white mb-3">No Data Sources</h3>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                  Connect your first network monitoring tool or security system to start building your topology map.
                </p>
                <DataSourceConfigDialog onSourceAdded={handleSourceAdded}>
                  <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Data Source
                  </Button>
                </DataSourceConfigDialog>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-full">
              <div className="p-6">
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
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
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Edit Dialog */}
        {editingSource && (
          <DataSourceConfigDialog
            editingSource={editingSource}
            onSourceAdded={handleSourceUpdated}
            onClose={() => setEditingSource(null)}
          />
        )}
      </div>
    </div>
  );
};

export default DataSourceManagement;
