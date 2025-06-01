
import React, { useState } from 'react';
import NetworkTopology from './NetworkTopology';
import DataSourcePanel from './DataSourcePanel';
import SearchAndFilters from './SearchAndFilters';
import StatusBar from './StatusBar';
import DataSourceManagement from './DataSourceManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const TopologyDashboard = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterSettings, setFilterSettings] = useState({
    showDevices: true,
    showServices: true,
    showApplications: true,
    showCloudResources: true,
    showConnections: true
  });

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-cyan-400">SOC Network Topology</h1>
            <p className="text-slate-400 text-sm">Unified Security Operations Center Visualization</p>
          </div>
          <StatusBar />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col">
          <Tabs defaultValue="filters" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 bg-slate-700">
              <TabsTrigger value="filters" className="data-[state=active]:bg-slate-600">
                Filters & Search
              </TabsTrigger>
              <TabsTrigger value="sources" className="data-[state=active]:bg-slate-600">
                Data Sources
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="filters" className="flex-1 overflow-hidden">
              <SearchAndFilters 
                filterSettings={filterSettings}
                setFilterSettings={setFilterSettings}
              />
              <DataSourcePanel />
            </TabsContent>
            
            <TabsContent value="sources" className="flex-1 overflow-y-auto p-4">
              <DataSourceManagement />
            </TabsContent>
          </Tabs>
        </aside>

        {/* Main Topology View */}
        <main className="flex-1 relative">
          <NetworkTopology 
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            filterSettings={filterSettings}
          />
        </main>

        {/* Right Panel - Node Details */}
        {selectedNode && (
          <aside className="w-96 bg-slate-800 border-l border-slate-700 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-cyan-400">Node Details</h3>
                <button 
                  onClick={() => setSelectedNode(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ×
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-slate-400">Type</label>
                  <p className="text-white font-medium">{selectedNode.type}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Label</label>
                  <p className="text-white font-medium">{selectedNode.label}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Status</label>
                  <p className={`font-medium ${
                    selectedNode.status === 'healthy' ? 'text-green-400' :
                    selectedNode.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {selectedNode.status}
                  </p>
                </div>
                {selectedNode.metadata && (
                  <div>
                    <label className="text-sm text-slate-400">Metadata</label>
                    <div className="bg-slate-900 rounded p-3 mt-1">
                      <pre className="text-xs text-slate-300 whitespace-pre-wrap">
                        {JSON.stringify(selectedNode.metadata, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default TopologyDashboard;
