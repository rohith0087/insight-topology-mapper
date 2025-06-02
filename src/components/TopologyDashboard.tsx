import React, { useState } from 'react';
import { Node } from 'reactflow';
import { Network } from 'lucide-react';
import { NodeData } from '@/types/networkTypes';
import NetworkTopology from './NetworkTopology';
import TopologyViewSelector from './topology/TopologyViewSelector';
import { TopologyView } from './topology/TopologyViewSelector';
import SearchAndFilters from './SearchAndFilters';
import DataSourcesDialog from './DataSourcesDialog';
import UserManagementDialog from './UserManagementDialog';
import DataReconciliationDashboard from './dataReconciliation/DataReconciliationDashboard';
import NetworkInsightsPanel from './ai/NetworkInsightsPanel';
import StatusBar from './StatusBar';

const TopologyDashboard: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showDataSources, setShowDataSources] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showDataReconciliation, setShowDataReconciliation] = useState(false);
  const [showNetworkInsights, setShowNetworkInsights] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [filterSettings, setFilterSettings] = useState({
    showDevices: true,
    showServices: true,
    showApplications: true,
    showCloudResources: true,
    showConnections: true
  });

  const [currentView, setCurrentView] = useState<TopologyView>('network');
  const [insights, setInsights] = useState([]);

  const handleNodeClick = (event: React.MouseEvent, node: Node<NodeData>) => {
    setSelectedNode(node);
    console.log('Node clicked', node);
  };

  const handleCloseDataSources = () => {
    setShowDataSources(false);
  };

  const handleCloseUserManagement = () => {
    setShowUserManagement(false);
  };

  const handleCloseDataReconciliation = () => {
    setShowDataReconciliation(false);
  };

  const handleCloseNetworkInsights = () => {
    setShowNetworkInsights(false);
  };

  const handleRunAIAnalysis = () => {
    console.log('Running AI analysis...');
    const mockInsights = [
      {
        id: '1',
        type: 'critical',
        title: 'High CPU Usage Detected',
        description: 'CPU usage on server exceeds 90% for the last 15 minutes.',
        suggested_actions: ['Restart server', 'Scale up resources'],
        affected_nodes: ['server1', 'server2'],
        confidence: 0.95,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        type: 'warning',
        title: 'Potential Network Bottleneck',
        description: 'Network latency has increased by 20% in the last hour.',
        suggested_actions: ['Check network cables', 'Optimize network configuration'],
        affected_nodes: ['router1', 'switch2'],
        confidence: 0.80,
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        type: 'recommendation',
        title: 'Upgrade Database Server',
        description: 'Database server is running on an outdated version.',
        suggested_actions: ['Schedule upgrade', 'Backup database'],
        affected_nodes: ['db-server1'],
        confidence: 0.70,
        created_at: new Date().toISOString()
      }
    ];
    setInsights(mockInsights);
    setShowNetworkInsights(true);
  };

  return (
    <div className="h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <div className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold text-cyan-400 flex items-center space-x-2">
            <Network className="w-6 h-6" />
            <span>Network Topology</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Intelligent network discovery and visualization
          </p>
        </div>

        {/* Filters */}
        <div className="flex-1 overflow-y-auto p-6">
          <SearchAndFilters
            filterSettings={filterSettings}
            setFilterSettings={setFilterSettings}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700">
          <StatusBar />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <TopologyViewSelector
              currentView={currentView}
              onViewChange={setCurrentView}
            />
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowDataSources(true)}
              className="bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg px-3 py-2 text-sm transition-colors"
            >
              Data Sources
            </button>
            <button
              onClick={() => setShowUserManagement(true)}
              className="bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg px-3 py-2 text-sm transition-colors"
            >
              User Management
            </button>
            <button
              onClick={() => setShowDataReconciliation(true)}
              className="bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg px-3 py-2 text-sm transition-colors"
            >
              Data Reconciliation
            </button>
            <button
              onClick={handleRunAIAnalysis}
              className="bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg px-3 py-2 text-sm transition-colors"
            >
              Run AI Analysis
            </button>
          </div>
        </div>

        {/* Network Visualization */}
        <div className="flex-1 relative">
          <NetworkTopology
            currentView={currentView}
            onNodeClick={handleNodeClick}
            filterSettings={filterSettings}
            statusFilter={statusFilter}
            searchTerm={searchTerm}
          />
        </div>
      </div>

      {/* Modals and Dialogs */}
      {showDataSources && (
        <DataSourcesDialog onClose={handleCloseDataSources} />
      )}
      {showUserManagement && (
        <UserManagementDialog onClose={handleCloseUserManagement} />
      )}
      {showDataReconciliation && (
        <DataReconciliationDashboard onClose={handleCloseDataReconciliation} />
      )}
      {showNetworkInsights && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div className="w-96 h-full bg-slate-800 border-l border-slate-700 shadow-lg">
            <NetworkInsightsPanel insights={insights} onClose={handleCloseNetworkInsights} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TopologyDashboard;
