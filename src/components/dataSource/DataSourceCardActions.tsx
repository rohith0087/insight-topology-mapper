
import React from 'react';
import { Edit, Trash2, Power, PowerOff, TestTube, Scan } from 'lucide-react';
import { Button } from '../ui/button';

interface DataSourceCardActionsProps {
  source: any;
  testing: boolean;
  updating: boolean;
  scanning: boolean;
  onTestConnection: () => void;
  onScan: () => void;
  onToggleEnabled: () => void;
  onEdit: (source: any) => void;
  onDelete: (id: string, name: string) => void;
}

const DataSourceCardActions: React.FC<DataSourceCardActionsProps> = ({
  source,
  testing,
  updating,
  scanning,
  onTestConnection,
  onScan,
  onToggleEnabled,
  onEdit,
  onDelete
}) => {
  return (
    <div className="flex justify-between items-center pt-2">
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onTestConnection}
          disabled={testing}
          className="border-slate-600 hover:bg-slate-700"
        >
          <TestTube className={`w-4 h-4 mr-2 ${testing ? 'animate-pulse' : ''}`} />
          {testing ? 'Testing...' : 'Test'}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onScan}
          disabled={scanning}
          className="border-slate-600 hover:bg-slate-700"
        >
          <Scan className={`w-4 h-4 mr-2 ${scanning ? 'animate-spin' : ''}`} />
          {scanning ? 'Scanning...' : 'Scan'}
        </Button>
      </div>

      <div className="flex space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleEnabled}
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
  );
};

export default DataSourceCardActions;
