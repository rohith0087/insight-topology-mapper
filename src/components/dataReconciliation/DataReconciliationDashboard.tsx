
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Database,
  GitBranch,
  Shield,
  BarChart3
} from 'lucide-react';
import { useDataConflicts, useDataSourcePriorities, useDataQualityMetrics } from '@/hooks/useDataReconciliation';
import ConflictResolutionDialog from './ConflictResolutionDialog';
import DataSourcePriorityManager from './DataSourcePriorityManager';
import DataLineageViewer from './DataLineageViewer';
import DataQualityMetrics from './DataQualityMetrics';
import { DataConflict } from '@/types/dataReconciliation';

interface DataReconciliationDashboardProps {
  onClose: () => void;
}

const DataReconciliationDashboard: React.FC<DataReconciliationDashboardProps> = ({
  onClose,
}) => {
  const [selectedConflict, setSelectedConflict] = useState<DataConflict | null>(null);
  const [showConflictDialog, setShowConflictDialog] = useState(false);

  const { data: conflicts, isLoading: conflictsLoading } = useDataConflicts();
  const { data: priorities, isLoading: prioritiesLoading } = useDataSourcePriorities();
  const { data: qualityMetrics, isLoading: metricsLoading } = useDataQualityMetrics();

  const pendingConflicts = conflicts?.filter(c => c.status === 'pending') || [];
  const resolvedConflicts = conflicts?.filter(c => c.status === 'resolved') || [];

  const handleConflictClick = (conflict: DataConflict) => {
    setSelectedConflict(conflict);
    setShowConflictDialog(true);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      resolved: 'bg-green-100 text-green-800 border-green-300',
      ignored: 'bg-gray-100 text-gray-800 border-gray-300',
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getConflictTypeIcon = (type: string) => {
    switch (type) {
      case 'value_mismatch':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'schema_conflict':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  if (conflictsLoading || prioritiesLoading || metricsLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-slate-800 rounded-lg p-8">
          <div className="text-white text-lg">Loading reconciliation data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-600 w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-semibold text-cyan-400 flex items-center space-x-2">
              <GitBranch className="w-6 h-6" />
              <span>Data Reconciliation Dashboard</span>
            </h2>
            <p className="text-slate-400 text-sm">
              Monitor conflicts, manage source priorities, and track data quality
            </p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            className="text-slate-400 hover:text-white hover:bg-slate-700"
          >
            ✕
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="p-6 border-b border-slate-700 flex-shrink-0">
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-slate-700 border-slate-600">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-sm text-slate-400">Pending Conflicts</p>
                    <p className="text-2xl font-bold text-white">{pendingConflicts.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-700 border-slate-600">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-slate-400">Resolved Conflicts</p>
                    <p className="text-2xl font-bold text-white">{resolvedConflicts.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-700 border-slate-600">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-slate-400">Data Sources</p>
                    <p className="text-2xl font-bold text-white">{priorities?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-700 border-slate-600">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-cyan-500" />
                  <div>
                    <p className="text-sm text-slate-400">Avg Quality Score</p>
                    <p className="text-2xl font-bold text-white">
                      {qualityMetrics?.length 
                        ? Math.round(qualityMetrics.reduce((acc, m) => acc + m.metric_value, 0) / qualityMetrics.length)
                        : 0
                      }%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden p-6">
          <Tabs defaultValue="conflicts" className="h-full flex flex-col">
            <TabsList className="bg-slate-700 border-slate-600">
              <TabsTrigger value="conflicts" className="data-[state=active]:bg-slate-600">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Conflicts
              </TabsTrigger>
              <TabsTrigger value="priorities" className="data-[state=active]:bg-slate-600">
                <Shield className="w-4 h-4 mr-2" />
                Source Priorities
              </TabsTrigger>
              <TabsTrigger value="lineage" className="data-[state=active]:bg-slate-600">
                <GitBranch className="w-4 h-4 mr-2" />
                Data Lineage
              </TabsTrigger>
              <TabsTrigger value="quality" className="data-[state=active]:bg-slate-600">
                <BarChart3 className="w-4 h-4 mr-2" />
                Quality Metrics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="conflicts" className="flex-1 overflow-hidden">
              <Card className="bg-slate-700 border-slate-600 h-full">
                <CardHeader>
                  <CardTitle className="text-slate-300">Data Conflicts</CardTitle>
                </CardHeader>
                <CardContent className="h-full overflow-auto">
                  <div className="space-y-3">
                    {pendingConflicts.map((conflict) => (
                      <div
                        key={conflict.id}
                        className="flex items-center justify-between p-4 bg-slate-600 rounded-lg hover:bg-slate-500 cursor-pointer transition-colors"
                        onClick={() => handleConflictClick(conflict)}
                      >
                        <div className="flex items-center space-x-3">
                          {getConflictTypeIcon(conflict.conflict_type)}
                          <div>
                            <p className="font-medium text-white">{conflict.field_name}</p>
                            <p className="text-sm text-slate-400">
                              {Object.keys(conflict.source_values).length} conflicting sources
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(conflict.status)}
                          <span className="text-sm text-slate-400">
                            {new Date(conflict.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                    {pendingConflicts.length === 0 && (
                      <div className="text-center py-8 text-slate-400">
                        <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                        <p>No pending conflicts found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="priorities" className="flex-1 overflow-hidden">
              <DataSourcePriorityManager />
            </TabsContent>

            <TabsContent value="lineage" className="flex-1 overflow-hidden">
              <DataLineageViewer />
            </TabsContent>

            <TabsContent value="quality" className="flex-1 overflow-hidden">
              <DataQualityMetrics />
            </TabsContent>
          </Tabs>
        </div>

        {/* Conflict Resolution Dialog */}
        <ConflictResolutionDialog
          conflict={selectedConflict}
          open={showConflictDialog}
          onOpenChange={setShowConflictDialog}
        />
      </div>
    </div>
  );
};

export default DataReconciliationDashboard;
