import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NetworkTopology from './NetworkTopology';
import SearchAndFilters from './SearchAndFilters';
import StatusBar from './StatusBar';
import DataSourceManagement from './DataSourceManagement';
import UserManagement from './UserManagement';
import UserProfile from './UserProfile';
import NetworkAIChat from './ai/NetworkAIChat';
import NetworkInsightsPanel from './ai/NetworkInsightsPanel';
import ExecutiveDashboard from './executive/ExecutiveDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { useNetworkInsights } from '@/hooks/useNetworkAI';
import { useWebhooks } from '@/hooks/useWebhooks';
import { HelpProvider } from '@/components/help/HelpSystem';
import ContextualTooltip from '@/components/help/ContextualTooltip';
import SmartHelpButton from '@/components/help/SmartHelpButton';
import WebhookManager from '@/components/automation/WebhookManager';
import { Button } from './ui/button';
import { Database, Settings, Network, Users, Brain, Lightbulb, X, BarChart3, Webhook, Shield } from 'lucide-react';

const TopologyDashboard = () => {
  const { profile, user, loading } = useAuth();
  const navigate = useNavigate();
  const { insights, generateInsights, isLoading: insightsLoading } = useNetworkInsights();
  const { triggerAlert, triggerDeviceEvent } = useWebhooks();
  
  // Debug user role
  console.log('User profile:', profile);
  console.log('User role:', profile?.role);
  console.log('User object:', user);
  console.log('Loading state:', loading);
  
  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      console.log('User not authenticated, redirecting to auth page');
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }
  
  const [selectedNode, setSelectedNode] = useState(null);
  const [showDataSources, setShowDataSources] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showExecutiveDashboard, setShowExecutiveDashboard] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const [filterSettings, setFilterSettings] = useState({
    showDevices: true,
    showServices: true,
    showApplications: true,
    showCloudResources: true,
    showConnections: true
  });
  const [showWebhookManager, setShowWebhookManager] = useState(false);

  // Handle click outside to close right panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rightPanelRef.current && !rightPanelRef.current.contains(event.target as Node)) {
        setShowRightPanel(false);
        setSelectedNode(null);
        setShowInsights(false);
      }
    };

    if (showRightPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showRightPanel]);

  const handleNodeSelection = (node: any) => {
    setSelectedNode(node);
    setShowInsights(false);
    setShowRightPanel(true);
  };

  const handleGenerateInsights = async () => {
    try {
      await generateInsights('overview');
      setSelectedNode(null);
      setShowInsights(true);
      setShowRightPanel(true);
    } catch (error) {
      console.error('Failed to generate insights:', error);
    }
  };

  const handleCloseRightPanel = () => {
    setShowRightPanel(false);
    setSelectedNode(null);
    setShowInsights(false);
  };

  const getCurrentView = () => {
    if (showUserManagement) return 'user-management';
    if (showAIChat) return 'ai-chat';
    if (showExecutiveDashboard) return 'executive-dashboard';
    return 'network-topology';
  };

  const renderMainContent = () => {
    switch (getCurrentView()) {
      case 'user-management':
        return (
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
        );
      
      case 'ai-chat':
        return (
          <div className="h-full p-6">
            <NetworkAIChat onClose={() => setShowAIChat(false)} />
          </div>
        );
      
      case 'executive-dashboard':
        return (
          <div className="h-full overflow-y-auto">
            <div className="flex items-center justify-between p-6 pb-0">
              <div></div>
              <Button
                onClick={() => setShowExecutiveDashboard(false)}
                variant="outline"
                className="border-slate-600 hover:bg-slate-700 bg-slate-900 text-slate-300 hover:text-white"
              >
                Back to Network
              </Button>
            </div>
            <ExecutiveDashboard />
          </div>
        );
      
      default:
        return (
          <NetworkTopology 
            selectedNode={selectedNode}
            setSelectedNode={handleNodeSelection}
            filterSettings={filterSettings}
          />
        );
    }
  };

  // Check if user has admin privileges for data sources
  const hasDataSourceAccess = profile?.role && ['super_admin', 'tenant_admin', 'network_admin'].includes(profile.role);
  const hasUserManagementAccess = profile?.role && ['super_admin', 'tenant_admin'].includes(profile.role);

  console.log('Has data source access:', hasDataSourceAccess);
  console.log('Has user management access:', hasUserManagementAccess);

  return (
    <HelpProvider>
      <div className="flex flex-col h-screen bg-slate-900 text-white overflow-hidden">
        {/* Header */}
        <header className="bg-slate-800 border-b border-slate-700 px-6 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Network className="w-8 h-8 text-cyan-400" />
              <div>
                <h1 className="text-xl font-bold text-cyan-400">LumenNet</h1>
                <p className="text-slate-400 text-xs">AI-Powered Security Operations Center</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Executive Dashboard */}
              <ContextualTooltip
                content="Access high-level metrics and executive summaries of your network status"
                context="executive-dashboard"
                userRole={profile?.role}
                currentPage={getCurrentView()}
              >
                <Button
                  onClick={() => setShowExecutiveDashboard(true)}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 hover:bg-slate-700 bg-slate-900 text-slate-300 hover:text-white"
                >
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Executive
                </Button>
              </ContextualTooltip>

              {/* AI Features */}
              <ContextualTooltip
                content="Chat with AI to get insights about your network, ask questions, and get recommendations"
                context="ai-assistant"
                userRole={profile?.role}
                currentPage={getCurrentView()}
              >
                <Button
                  onClick={() => setShowAIChat(true)}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 hover:bg-slate-700 bg-slate-900 text-slate-300 hover:text-white"
                >
                  <Brain className="w-4 h-4 mr-1" />
                  AI Assistant
                </Button>
              </ContextualTooltip>
              
              <ContextualTooltip
                content="Generate AI-powered insights about your network topology, performance, and security"
                context="ai-insights"
                userRole={profile?.role}
                currentPage={getCurrentView()}
              >
                <Button
                  onClick={handleGenerateInsights}
                  disabled={insightsLoading}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 hover:bg-slate-700 bg-slate-900 text-slate-300 hover:text-white"
                >
                  <Lightbulb className="w-4 h-4 mr-1" />
                  {insightsLoading ? 'Generating...' : 'Insights'}
                </Button>
              </ContextualTooltip>

              {/* Webhook Automation */}
              <ContextualTooltip
                content="Configure webhooks to automatically notify external systems when network events occur"
                context="webhook-automation"
                userRole={profile?.role}
                currentPage={getCurrentView()}
              >
                <Button
                  onClick={() => setShowWebhookManager(true)}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 hover:bg-slate-700 bg-slate-900 text-slate-300 hover:text-white"
                >
                  <Webhook className="w-4 h-4 mr-1" />
                  Webhooks
                </Button>
              </ContextualTooltip>

              {/* Data Sources - Always show for debugging, then we'll add the role check back */}
              <ContextualTooltip
                content="Manage and configure data sources that feed network information into LumenNet"
                context="data-sources"
                userRole={profile?.role}
                currentPage={getCurrentView()}
              >
                <Button
                  onClick={() => setShowDataSources(true)}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 hover:bg-slate-700 bg-slate-900 text-slate-300 hover:text-white"
                >
                  <Database className="w-4 h-4 mr-1" />
                  Data Sources
                </Button>
              </ContextualTooltip>
              
              {/* User Management */}
              {hasUserManagementAccess && (
                <ContextualTooltip
                  content="Manage user accounts, roles, and permissions for your organization"
                  context="user-management"
                  userRole={profile?.role}
                  currentPage={getCurrentView()}
                >
                  <Button
                    onClick={() => setShowUserManagement(true)}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 hover:bg-slate-700 bg-slate-900 text-slate-300 hover:text-white"
                  >
                    <Users className="w-4 h-4 mr-1" />
                    Users
                  </Button>
                </ContextualTooltip>
              )}
              
              <StatusBar />
              <UserProfile />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Left Sidebar - Fixed width with scroll */}
          {getCurrentView() === 'network-topology' && (
            <aside className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col flex-shrink-0">
              <div className="p-4 border-b border-slate-700 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-lg font-semibold text-cyan-400">Search & Filters</h3>
                  </div>
                  <SmartHelpButton
                    context="search-filters"
                    helpContent="Use these filters to focus on specific parts of your network. You can filter by device type, status, and more."
                    className="relative"
                  />
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
          )}

          {/* Main Content Area - Takes remaining space */}
          <main className="flex-1 relative min-w-0">
            {renderMainContent()}
          </main>

          {/* Right Panel - Sliding panel (only for network topology view) */}
          {getCurrentView() === 'network-topology' && (
            <div
              ref={rightPanelRef}
              className={`absolute top-0 right-0 h-full w-96 bg-slate-800 border-l border-slate-700 flex flex-col transition-transform duration-300 ease-in-out z-10 ${
                showRightPanel ? 'transform translate-x-0' : 'transform translate-x-full'
              }`}
            >
              {selectedNode ? (
                <>
                  <div className="p-4 border-b border-slate-700 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-cyan-400">Node Details</h3>
                      <Button
                        onClick={handleCloseRightPanel}
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-white hover:bg-slate-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
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
                <NetworkInsightsPanel 
                  insights={insights}
                  onInsightClick={(insight) => {
                    console.log('Insight clicked:', insight);
                  }}
                  onClose={handleCloseRightPanel}
                />
              ) : null}
            </div>
          )}
        </div>

        {/* Data Sources Modal */}
        {showDataSources && (
          <DataSourceManagement onClose={() => setShowDataSources(false)} />
        )}

        {/* Webhook Manager Modal */}
        {showWebhookManager && (
          <WebhookManager onClose={() => setShowWebhookManager(false)} />
        )}
      </div>
    </HelpProvider>
  );
};

export default TopologyDashboard;
