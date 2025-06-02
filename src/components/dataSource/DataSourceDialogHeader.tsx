
import React from 'react';
import { DialogHeader, DialogTitle } from '../ui/dialog';

interface DataSourceDialogHeaderProps {
  isEditing: boolean;
}

const DataSourceDialogHeader: React.FC<DataSourceDialogHeaderProps> = ({ isEditing }) => {
  return (
    <DialogHeader>
      <div className="flex items-center justify-between">
        <DialogTitle className="text-cyan-400 text-xl">
          {isEditing ? 'Edit Data Source' : 'Add Data Source'}
        </DialogTitle>
      </div>
    </DialogHeader>
  );
};

export default DataSourceDialogHeader;
