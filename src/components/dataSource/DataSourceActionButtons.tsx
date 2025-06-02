
import React from 'react';
import { Button } from '../ui/button';
import { Save } from 'lucide-react';

interface DataSourceActionButtonsProps {
  onCancel: () => void;
  onSave: () => void;
  saving: boolean;
  testing: boolean;
  isEditing: boolean;
}

const DataSourceActionButtons: React.FC<DataSourceActionButtonsProps> = ({
  onCancel,
  onSave,
  saving,
  testing,
  isEditing
}) => {
  return (
    <div className="flex justify-between pt-4 border-t border-slate-600">
      <div></div>
      
      <div className="space-x-3">
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={saving}
          className="border-slate-600 hover:bg-slate-700 bg-slate-900 text-slate-300 hover:text-white"
        >
          Cancel
        </Button>
        <Button 
          onClick={onSave}
          disabled={saving || testing}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : (isEditing ? 'Update' : 'Save')}
        </Button>
      </div>
    </div>
  );
};

export default DataSourceActionButtons;
