
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GitBranch, Search, Database, Clock } from 'lucide-react';
import { useDataLineage } from '@/hooks/useDataReconciliation';

const DataLineageViewer: React.FC = () => {
  const [selectedEntity, setSelectedEntity] = useState<{
    id: string;
    type: 'node' | 'connection';
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: lineageData, isLoading } = useDataLineage(
    selectedEntity?.id || '',
    selectedEntity?.type || 'node'
  );

  const handleEntitySearch = () => {
    // In a real implementation, this would search for entities by name/ID
    // For demo purposes, we'll use a sample entity ID
    if (searchTerm) {
      setSelectedEntity({
        id: searchTerm,
        type: 'node'
      });
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-500';
    if (score >= 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card className="bg-slate-700 border-slate-600 h-full">
      <CardHeader>
        <CardTitle className="text-slate-300 flex items-center space-x-2">
          <GitBranch className="w-5 h-5" />
          <span>Data Lineage</span>
        </CardTitle>
        <div className="flex space-x-2">
          <Input
            placeholder="Enter entity ID to trace lineage..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-600 border-slate-500 text-white"
          />
          <Button
            onClick={handleEntitySearch}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-full overflow-auto">
        {!selectedEntity ? (
          <div className="text-center py-8 text-slate-400">
            <GitBranch className="w-12 h-12 mx-auto mb-3" />
            <p>Select an entity to view its data lineage</p>
            <p className="text-sm">Enter an entity ID in the search box above</p>
          </div>
        ) : isLoading ? (
          <div className="text-center py-8 text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-3"></div>
            <p>Loading lineage data...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-white">
                Lineage for {selectedEntity.type}: {selectedEntity.id}
              </h3>
              <Badge className="bg-slate-600 text-slate-300">
                {lineageData?.length || 0} records
              </Badge>
            </div>

            {lineageData?.map((record, index) => (
              <Card key={record.id} className="bg-slate-600 border-slate-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Database className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-white">{record.field_name}</span>
                        <Badge variant="outline" className="text-xs">
                          {record.data_sources?.name || 'Unknown Source'}
                        </Badge>
                      </div>
                      
                      <div className="bg-slate-700 p-3 rounded-lg mb-3">
                        <pre className="text-sm text-slate-300 overflow-x-auto">
                          {typeof record.field_value === 'object' 
                            ? JSON.stringify(record.field_value, null, 2)
                            : String(record.field_value)
                          }
                        </pre>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span className="text-slate-400">
                              {new Date(record.created_at).toLocaleString()}
                            </span>
                          </div>
                          <div className={`font-medium ${getConfidenceColor(record.confidence_score)}`}>
                            Confidence: {Math.round(record.confidence_score * 100)}%
                          </div>
                        </div>
                        <Badge className="bg-slate-500 text-slate-300">
                          {record.data_sources?.type || 'Unknown Type'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {lineageData?.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <Database className="w-12 h-12 mx-auto mb-3" />
                <p>No lineage data found for this entity</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataLineageViewer;
