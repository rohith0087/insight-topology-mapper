
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { DataConflict } from '@/types/dataReconciliation';
import { useResolveConflict } from '@/hooks/useDataReconciliation';

interface ConflictResolutionDialogProps {
  conflict: DataConflict | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ConflictResolutionDialog: React.FC<ConflictResolutionDialogProps> = ({
  conflict,
  open,
  onOpenChange,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [selectedStrategy, setSelectedStrategy] = useState<string>('manual');
  const resolveConflict = useResolveConflict();

  if (!conflict) return null;

  const handleResolve = async () => {
    if (!selectedValue) return;

    try {
      const resolution = JSON.parse(selectedValue);
      await resolveConflict.mutateAsync({
        conflictId: conflict.id,
        resolution,
        strategy: selectedStrategy,
      });
      onOpenChange(false);
      setSelectedValue('');
      setSelectedStrategy('manual');
    } catch (error) {
      console.error('Failed to resolve conflict:', error);
    }
  };

  const getConflictTypeIcon = (type: string) => {
    switch (type) {
      case 'value_mismatch':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'schema_conflict':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getConflictTypeBadge = (type: string) => {
    const variants = {
      value_mismatch: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      schema_conflict: 'bg-red-100 text-red-800 border-red-300',
      timestamp_conflict: 'bg-blue-100 text-blue-800 border-blue-300',
      source_priority_conflict: 'bg-purple-100 text-purple-800 border-purple-300',
    };

    return (
      <Badge className={variants[type as keyof typeof variants] || variants.value_mismatch}>
        {type.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-slate-800 border-slate-600 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getConflictTypeIcon(conflict.conflict_type)}
            <span>Resolve Data Conflict</span>
            {getConflictTypeBadge(conflict.conflict_type)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Conflict Details */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-300">
                Conflict Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Field:</span>
                <span className="font-mono text-cyan-400">{conflict.field_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Type:</span>
                <span>{conflict.conflict_type.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Detected:</span>
                <span>{new Date(conflict.created_at).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Conflicting Values */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-300">
                Conflicting Values
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedValue} onValueChange={setSelectedValue}>
                <div className="space-y-4">
                  {Object.entries(conflict.source_values).map(([sourceId, value], index) => (
                    <div key={sourceId} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={JSON.stringify(value)} id={`value-${index}`} />
                        <Label
                          htmlFor={`value-${index}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="flex items-center justify-between p-3 bg-slate-600 rounded-lg hover:bg-slate-500 transition-colors">
                            <div>
                              <div className="font-medium text-white">Source: {sourceId}</div>
                              <div className="text-sm text-slate-300 font-mono">
                                {typeof value === 'object' 
                                  ? JSON.stringify(value, null, 2)
                                  : String(value)
                                }
                              </div>
                            </div>
                            <CheckCircle className="w-5 h-5 text-green-500 opacity-0 group-data-[state=checked]:opacity-100" />
                          </div>
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Resolution Strategy */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-300">
                Resolution Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedStrategy} onValueChange={setSelectedStrategy}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="manual" id="manual" />
                    <Label htmlFor="manual">Manual Resolution</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="priority_based" id="priority" />
                    <Label htmlFor="priority">Priority Based</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="timestamp_based" id="timestamp" />
                    <Label htmlFor="timestamp">Most Recent</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="confidence_based" id="confidence" />
                    <Label htmlFor="confidence">Highest Confidence</Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleResolve}
            disabled={!selectedValue || resolveConflict.isPending}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            {resolveConflict.isPending ? 'Resolving...' : 'Resolve Conflict'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConflictResolutionDialog;
