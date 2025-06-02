
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { X } from 'lucide-react';
import { Button } from './ui/button';

interface DataSourcesDialogProps {
  onClose: () => void;
}

const DataSourcesDialog: React.FC<DataSourcesDialogProps> = ({ onClose }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-600 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-cyan-400">
              Data Sources Management
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-slate-300">
            Data sources configuration and management will be implemented here.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DataSourcesDialog;
