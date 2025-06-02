
import React, { useState } from 'react';
import { dataSources } from './DataSourceDocumentationData';
import DataSourceDocumentationHeader from './DataSourceDocumentationHeader';
import DataSourceDocumentationSidebar from './DataSourceDocumentationSidebar';
import DataSourceDocumentationContent from './DataSourceDocumentationContent';

interface DataSourceDocumentationProps {
  onClose: () => void;
}

const DataSourceDocumentation: React.FC<DataSourceDocumentationProps> = ({ onClose }) => {
  const [selectedSource, setSelectedSource] = useState<string>('nmap');
  const [activeTab, setActiveTab] = useState<string>('overview');

  const currentSource = dataSources.find(source => source.id === selectedSource);

  const handleSelectSource = (sourceId: string) => {
    setSelectedSource(sourceId);
    setActiveTab('overview');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-600 w-full max-w-7xl h-[90vh] flex flex-col">
        <DataSourceDocumentationHeader onClose={onClose} />

        <div className="flex flex-1 overflow-hidden">
          <DataSourceDocumentationSidebar
            dataSources={dataSources}
            selectedSource={selectedSource}
            onSelectSource={handleSelectSource}
          />

          {currentSource && (
            <DataSourceDocumentationContent
              currentSource={currentSource}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DataSourceDocumentation;
