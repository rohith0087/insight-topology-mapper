
import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { DataSourceDoc } from './DataSourceDocumentationData';

interface DataSourceDocumentationSidebarProps {
  dataSources: DataSourceDoc[];
  selectedSource: string;
  onSelectSource: (sourceId: string) => void;
}

const DataSourceDocumentationSidebar: React.FC<DataSourceDocumentationSidebarProps> = ({
  dataSources,
  selectedSource,
  onSelectSource
}) => {
  const categories = [...new Set(dataSources.map(source => source.category))];

  return (
    <div className="w-80 border-r border-slate-700 flex flex-col">
      <div className="p-4">
        <h3 className="text-lg font-medium text-white mb-4">Data Sources</h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {categories.map(category => (
            <div key={category}>
              <h4 className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">
                {category}
              </h4>
              <div className="space-y-1">
                {dataSources
                  .filter(source => source.category === category)
                  .map(source => (
                    <button
                      key={source.id}
                      onClick={() => onSelectSource(source.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedSource === source.id
                          ? 'bg-cyan-600 text-white'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-6 h-6">
                          {typeof source.icon === 'string' ? (
                            <span className="text-lg">{source.icon}</span>
                          ) : (
                            source.icon
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{source.name}</div>
                          <div className="text-xs opacity-75">{source.category}</div>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DataSourceDocumentationSidebar;
