
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, Edit, Save, X } from 'lucide-react';
import { useDataSourcePriorities, useUpdateSourcePriority } from '@/hooks/useDataReconciliation';
import { useDataSources } from '@/hooks/useDataSources';

const DataSourcePriorityManager: React.FC = () => {
  const [editingSource, setEditingSource] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({
    priorityLevel: 5,
    confidenceMultiplier: 1.0,
    fieldPriorities: {} as Record<string, number>
  });

  const { data: priorities, isLoading } = useDataSourcePriorities();
  const { data: dataSources } = useDataSources();
  const updatePriority = useUpdateSourcePriority();

  const handleEditStart = (sourceId: string) => {
    const existing = priorities?.find(p => p.data_source_id === sourceId);
    if (existing) {
      setEditValues({
        priorityLevel: existing.priority_level,
        confidenceMultiplier: existing.confidence_multiplier,
        fieldPriorities: existing.field_specific_priorities || {}
      });
    }
    setEditingSource(sourceId);
  };

  const handleSave = async (sourceId: string) => {
    try {
      await updatePriority.mutateAsync({
        sourceId,
        priorityLevel: editValues.priorityLevel,
        confidenceMultiplier: editValues.confidenceMultiplier,
        fieldPriorities: editValues.fieldPriorities
      });
      setEditingSource(null);
    } catch (error) {
      console.error('Failed to update priority:', error);
    }
  };

  const handleCancel = () => {
    setEditingSource(null);
    setEditValues({
      priorityLevel: 5,
      confidenceMultiplier: 1.0,
      fieldPriorities: {}
    });
  };

  const getPriorityBadge = (level: number) => {
    if (level >= 8) return <Badge className="bg-green-600 text-white">High</Badge>;
    if (level >= 5) return <Badge className="bg-yellow-600 text-white">Medium</Badge>;
    return <Badge className="bg-red-600 text-white">Low</Badge>;
  };

  const getSourceName = (sourceId: string) => {
    return dataSources?.find(ds => ds.id === sourceId)?.name || sourceId;
  };

  if (isLoading) {
    return <div className="text-white">Loading priorities...</div>;
  }

  return (
    <Card className="bg-slate-700 border-slate-600 h-full">
      <CardHeader>
        <CardTitle className="text-slate-300 flex items-center space-x-2">
          <Shield className="w-5 h-5" />
          <span>Data Source Priorities</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 h-full overflow-auto">
        {dataSources?.map((source) => {
          const priority = priorities?.find(p => p.data_source_id === source.id);
          const isEditing = editingSource === source.id;

          return (
            <Card key={source.id} className="bg-slate-600 border-slate-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-white">{source.name}</h3>
                    <p className="text-sm text-slate-400">{source.type}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {priority && getPriorityBadge(priority.priority_level)}
                    {!isEditing ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditStart(source.id)}
                        className="border-slate-400 text-slate-300 hover:bg-slate-500"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleSave(source.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={updatePriority.isPending}
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                          className="border-slate-400 text-slate-300 hover:bg-slate-500"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-slate-300">Priority Level: {editValues.priorityLevel}</Label>
                      <Slider
                        value={[editValues.priorityLevel]}
                        onValueChange={(value) => setEditValues(prev => ({ ...prev, priorityLevel: value[0] }))}
                        max={10}
                        min={1}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-slate-300">Confidence Multiplier</Label>
                      <Input
                        type="number"
                        value={editValues.confidenceMultiplier}
                        onChange={(e) => setEditValues(prev => ({ 
                          ...prev, 
                          confidenceMultiplier: parseFloat(e.target.value) 
                        }))}
                        min={0}
                        max={2}
                        step={0.1}
                        className="mt-1 bg-slate-500 border-slate-400 text-white"
                      />
                    </div>

                    <div>
                      <Label className="text-slate-300">Field-Specific Priorities</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {['ip_address', 'hostname', 'status', 'location'].map(field => (
                          <div key={field} className="space-y-1">
                            <Label className="text-xs text-slate-400">{field}</Label>
                            <Input
                              type="number"
                              value={editValues.fieldPriorities[field] || 1}
                              onChange={(e) => setEditValues(prev => ({
                                ...prev,
                                fieldPriorities: {
                                  ...prev.fieldPriorities,
                                  [field]: parseFloat(e.target.value)
                                }
                              }))}
                              min={0.1}
                              max={3}
                              step={0.1}
                              className="bg-slate-500 border-slate-400 text-white text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Priority Level:</span>
                      <span className="text-white">{priority?.priority_level || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Confidence Multiplier:</span>
                      <span className="text-white">{priority?.confidence_multiplier || 'Not set'}</span>
                    </div>
                    {priority?.field_specific_priorities && Object.keys(priority.field_specific_priorities).length > 0 && (
                      <div>
                        <span className="text-slate-400">Field Priorities:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {Object.entries(priority.field_specific_priorities).map(([field, value]) => (
                            <Badge key={field} variant="outline" className="text-xs">
                              {field}: {value}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default DataSourcePriorityManager;
