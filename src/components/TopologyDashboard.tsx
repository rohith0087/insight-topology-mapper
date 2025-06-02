
import React, { useState } from 'react';
import NetworkTopology from './NetworkTopology';
import SearchAndFilters from './SearchAndFilters';
import StatusBar from './StatusBar';
import DataSourceManagement from './DataSourceManagement';
import UserManagement from './UserManagement';
import UserProfile from './UserProfile';
import NetworkAIChat from './ai/NetworkAIChat';
import NetworkInsightsPanel from './ai/NetworkInsightsPanel';
import { useAuth } from '@/contexts/AuthContext';
import { useNetworkInsights } from '@/hooks/useNetworkAI';
import { Button } from './ui/button';
import { Database, Settings, Network, Users, Brain, Lightbulb } from 'lucide-react';

const TopologyDashboard = () => {
  const { profile } = useAuth();
  const { insights, generateInsights, isLoading: insightsLoading } = useNetworkInsights();
  const [selectedNode, setSelectedNode] = useState(null);
  const [showDataSources, setShowDataSources] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [filterSettings, setFilterSettings] = useState({
    showDevices: true,
    showServices: true,
    showApplications: true,
    showCloudResources: true,
    showConnections: true
  });

  const handleGenerateInsights = async () => {
    try {
      await generateInsights('overview');
      setShowInsights(true);
    } catch (error) {
      console.error('Failed to generate insights:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white overflow-hidden">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Network className="w-8 h-8 text-cyan-400" />
            <div>
              <h1 className="text-2xl font-bold text-cyan-400">LumenNet</h1>
              <p className="text-slate-400 text-sm">AI-Powered Security Operations Center Visualization</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* AI Features */}
            <Button
              onClick={() => setShowAIChat(true)}
              variant="outline"
              className="border-slate-600 hover:bg-slate-700 bg-slate-900 text-slate-300 hover:text-white"
            >
              <Brain className="w-4 h-4 mr-2" />
              AI Assistant
            </Button>
            
            <Button
              onClick={handleGenerateInsights}
              disabled={insightsLoading}
              variant="outline"
              className="border-slate-600 hover:bg-slate-700 bg-slate-900 text-slate-300 hover:text-white"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              {insightsLoading ? 'Generating...' : 'Generate Insights'}
            </Button>

            {/* Role-based action buttons */}
            {profile?.role && ['super_admin', 'tenant_admin', 'network_admin'].includes(profile.role) && (
              <Button
                onClick={() => setShowDataSources(true)}
                variant="outline"
                className="border-slate-600 hover:bg-slate-700 bg-slate-900 text-slate-300 hover:text-white"
              >
                <Database className="w-4 h-4 mr-2" />
                Data Sources
              </Button>
            )}
            
            {profile?.role && ['super_admin', 'tenant_admin'].includes(profile.role) && (
              <Button
                onClick={() => setShowUserManagement(true)}
                variant="outline"
                className="border-slate-600 hover:bg-slate-700 bg-slate-900 text-slate-300 hover:text-white"
              >
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
            )}
            
            <StatusBar />
            <UserProfile />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Fixed width with scroll */}
        <aside className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-slate-700 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-cyan-400">Search & Filters</h3>
            </div>
            {profile && (
              <div className="mt-2 text-xs text-slate-500">
                Role: {profile.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <SearchAndFilters 
                filterSettings={filterSettings}
                setFilterSettings={setFilterSettings}
              />
            </div>
          </div>
        </aside>

        {/* Main Topology View - Takes remaining space */}
        <main className="flex-1 relative min-w-0">
          {showUserManagement ? (
            <div className="h-full overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-cyan-400">User Management</h2>
                <Button
                  onClick={() => setShowUserManagement(false)}
                  variant="outline"
                  className="border-slate-600 hover:bg-slate-700 bg-slate-900 text-slate-300 hover:text-white"
                >
                  Back to Network
                </Button>
              </div>
              <UserManagement />
            </div>
          ) : showAIChat ? (
            <div className="h-full p-6">
              <NetworkAIChat onClose={() => setShowAIChat(false)} />
            </div>
          ) : (
            <NetworkTopology 
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
              filterSettings={filterSettings}
            />
          )}
        </main>

        {/* Right Panel - Dynamic content based on context */}
        {!showUserManagement && !showAIChat && (
          <aside className="w-96 bg-slate-800 border-l border-slate-700 flex flex-col flex-shrink-0">
            {selectedNode ? (
              <>
                <div className="p-4 border-b border-slate-700 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-cyan-400">Node Details</h3>
                    <button 
                      onClick={() => setSelectedNode(null)}
                      className="text-slate-400 hover:text-white text-xl leading-none"
                    >
                      ×
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-slate-400 block mb-1">Type</label>
                      <p className="text-white font-medium">{selectedNode.type}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400 block mb-1">Label</label>
                      <p className="text-white font-medium">{selectedNode.label}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400 block mb-1">Status</label>
                      <p className={`font-medium ${
                        selectedNode.status === 'healthy' ? 'text-green-400' :
                        selectedNode.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {selectedNode.status}
                      </p>
                    </div>
                    {selectedNode.metadata && (
                      <div>
                        <label className="text-sm text-slate-400 block mb-1">Metadata</label>
                        <div className="bg-slate-900 rounded p-3 mt-1">
                          <pre className="text-xs text-slate-300 whitespace-pre-wrap overflow-x-auto">
                            {JSON.stringify(selectedNode.metadata, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : showInsights && insights.length > 0 ? (
              <>
                <div className="p-4 border-b border-slate-700 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-cyan-400">AI Insights</h3>
                    <button 
                      onClick={() => setShowInsights(false)}
                      className="text-slate-400 hover:text-white text-xl leading-none"
                    >
                      ×
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  <NetworkInsightsPanel 
                    insights={insights}
                    onInsightClick={(insight) => {
                      console.log('Insight clicked:', insight);
                    }}
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                <div className="text-center">
                  <Brain className="w-12 h-12 mx-auto mb-3" />
                  <p>Select a node or generate insights</p>
                  <p className="text-sm">to see detailed information</p>
                </div>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* Data Sources Modal */}
      {showDataSources && (
        <DataSourceManagement onClose={() => setShowDataSources(false)} />
      )}
    </div>
  );
};

export default TopologyDashboard;
