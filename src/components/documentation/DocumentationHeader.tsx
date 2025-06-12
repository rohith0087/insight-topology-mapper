
import React from 'react';

const DocumentationHeader: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">LN</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">LumenNet</h1>
              <p className="text-sm text-gray-600">Network Topology Platform</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Documentation v1.0
          </div>
        </div>
      </div>
    </header>
  );
};

export default DocumentationHeader;
