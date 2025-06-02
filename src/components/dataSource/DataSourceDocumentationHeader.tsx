
import React from 'react';
import { Button } from '../ui/button';
import { BookOpen } from 'lucide-react';

interface DataSourceDocumentationHeaderProps {
  onClose: () => void;
}

const DataSourceDocumentationHeader: React.FC<DataSourceDocumentationHeaderProps> = ({ onClose }) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-slate-700 flex-shrink-0">
      <div>
        <h2 className="text-2xl font-semibold text-cyan-400 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          Data Source Documentation
        </h2>
        <p className="text-slate-400 text-sm">
          Comprehensive guides for configuring and using each data source
        </p>
      </div>
      <Button
        onClick={onClose}
        variant="ghost"
        size="sm"
        className="text-slate-400 hover:text-white hover:bg-slate-700"
      >
        ✕
      </Button>
    </div>
  );
};

export default DataSourceDocumentationHeader;
