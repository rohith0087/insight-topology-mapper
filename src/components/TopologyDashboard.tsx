import React, { useState, useRef, useEffect } from 'react';
import NetworkTopology from './NetworkTopology';
import SearchAndFilters from './SearchAndFilters';
import StatusBar from './StatusBar';
import DataSourceManagement from './DataSourceManagement';
import UserManagement from './UserManagement';
import UserProfile from './UserProfile';
import NetworkAIChat from './ai/NetworkAIChat';
import NetworkInsightsPanel from './ai/NetworkInsightsPanel';
import ExecutiveDashboard from './executive/ExecutiveDashboard';
import OnboardingModal from './onboarding/OnboardingModal';
import { useAuth } from '@/contexts/AuthContext';
import { useNetworkInsights } from '@/hooks/useNetworkAI';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useWebhooks } from '@/hooks/useWebhooks';
import { HelpProvider } from '@/components/help/HelpSystem';
import ContextualTooltip from '@/components/help/ContextualTooltip';
import SmartHelpButton from '@/components/help/SmartHelpButton';
import WebhookManager from '@/components/automation/WebhookManager';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from './ui/button';
import { Database, Settings, Network, Users, Brain, Lightbulb, X, BarChart3, Play, Webhook } from 'lucide-react';

const TopologyDashboard = () => {
  const { profile } = useAuth();
  const { insights, generateInsights, isLoading: insightsLoading } = useNetworkInsights();
  const { 
    progress, 
    startOnboarding, 
    isLoading: onboardingLoading, 
    isOnboardingVisible,
    setIsOnboardingVisible 
  } = useOnboarding();
  const { triggerAlert, triggerDeviceEvent } = useWebhooks();
  
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

  // Show onboarding for new users
  useEffect(() => {
    console.log('Checking if should auto-start onboarding:', { profile, progress });
    if (profile && (!progress || (!progress.is_completed && progress.current_step === 1))) {
      const timer = setTimeout(() => {
        console.log('Auto-starting onboarding for new user');
        startOnboarding();
      }, 1000); // Show after 1 second
      
      return () => clearTimeout(timer);
    }
  }, [profile, progress, startOnboarding]);

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

  const handleStartOnboarding = () => {
    console.log('Start Tour button clicked - Dashboard handler');
    console.log('Current progress before starting:', progress);
    startOnboarding();
    console.log('After calling startOnboarding, isOnboardingVisible should be:', isOnboardingVisible);
  };

  // Check if we should show the Start Tour button
  const shouldShowStartTour = () => {
    if (onboardingLoading) {
      console.log('Not showing tour button - loading');
      return false;
    }
    if (!progress) {
      console.log('Showing tour button - no progress');
      return true; // No progress record means user hasn't started
    }
    const shouldShow = !progress.is_completed;
    console.log('Should show tour button:', shouldShow, 'Progress completed:', progress.is_completed);
    return shouldShow; // Show if onboarding is not completed
  };

  console.log('TopologyDashboard render - onboarding state:', {
    isOnboardingVisible,
    progress,
    shouldShowStartTour: shouldShowStartTour()
  });

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
              <h2 className="text-2xl font-bold app-accent">User Management</h2>
              <Button
                onClick={() => setShowUserManagement(false)}
                variant="outline"
                className="border-app-border hover:app-hover app-text-secondary hover:app-text-primary"
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
                className="border-app-border hover:app-hover app-text-secondary hover:app-text-primary"
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

  return (
    <HelpProvider>
      <div className="flex flex-col h-screen app-bg app-text-primary overflow-hidden">
        {/* Header */}
        <header className="app-header-bg border-b app-border px-6 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Network className="w-8 h-8 app-accent" />
              <div>
                <h1 className="text-xl font-bold app-accent">LumenNet</h1>
                <p className="app-text-muted text-xs">AI-Powered Security Operations Center</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Onboarding Button (show if not completed) */}
              {profile && shouldShowStartTour() && (
                <ContextualTooltip
                  content="Start an interactive tour to learn about LumenNet's features and capabilities"
                  context="onboarding"
                  userRole={profile?.role}
                  currentPage={getCurrentView()}
                >
                  <Button
                    onClick={handleStartOnboarding}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white border-0"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Start Tour
                  </Button>
                </ContextualTooltip>
              )}

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
                  className="border-app-border hover:app-hover app-text-secondary hover:app-text-primary"
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
                  className="border-app-border hover:app-hover app-text-secondary hover:app-text-primary"
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
                  className="border-app-border hover:app-hover app-text-secondary hover:app-text-primary"
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
                  className="border-app-border hover:app-hover app-text-secondary hover:app-text-primary"
                >
                  <Webhook className="w-4 h-4 mr-1" />
                  Webhooks
                </Button>
              </ContextualTooltip>

              {/* Role-based action buttons */}
              {profile?.role && ['super_admin', 'tenant_admin', 'network_admin'].includes(profile.role) && (
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
                    className="border-app-border hover:app-hover app-text-secondary hover:app-text-primary"
                  >
                    <Database className="w-4 h-4 mr-1" />
                    Data Sources
                  </Button>
                </ContextualTooltip>
              )}
              
              {profile?.role && ['super_admin', 'tenant_admin'].includes(profile.role) && (
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
                    className="border-app-border hover:app-hover app-text-secondary hover:app-text-primary"
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
            <aside className="w-80 app-panel-bg border-r app-border flex flex-col flex-shrink-0">
              <div className="p-4 border-b app-border flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 app-accent" />
                    <h3 className="text-lg font-semibold app-accent">Search & Filters</h3>
                  </div>
                  <SmartHelpButton
                    context="search-filters"
                    helpContent="Use these filters to focus on specific parts of your network. You can filter by device type, status, and more."
                    className="relative"
                  />
                </div>
                {profile && (
                  <div className="mt-2 text-xs app-text-muted">
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
              className={`absolute top-0 right-0 h-full w-96 app-panel-bg border-l app-border flex flex-col transition-transform duration-300 ease-in-out z-10 ${
                showRightPanel ? 'transform translate-x-0' : 'transform translate-x-full'
              }`}
            >
              {selectedNode ? (
                <>
                  <div className="p-4 border-b app-border flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold app-accent">Node Details</h3>
                      <Button
                        onClick={handleCloseRightPanel}
                        variant="ghost"
                        size="sm"
                        className="app-text-muted hover:app-text-primary hover:app-hover"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm app-text-muted block mb-1">Type</label>
                        <p className="app-text-primary font-medium">{selectedNode.type}</p>
                      </div>
                      <div>
                        <label className="text-sm app-text-muted block mb-1">Label</label>
                        <p className="app-text-primary font-medium">{selectedNode.label}</p>
                      </div>
                      <div>
                        <label className="text-sm app-text-muted block mb-1">Status</label>
                        <p className={`font-medium ${
                          selectedNode.status === 'healthy' ? 'text-green-400' :
                          selectedNode.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {selectedNode.status}
                        </p>
                      </div>
                      {selectedNode.metadata && (
                        <div>
                          <label className="text-sm app-text-muted block mb-1">Metadata</label>
                          <div className="app-bg rounded p-3 mt-1">
                            <pre className="text-xs app-text-secondary whitespace-pre-wrap overflow-x-auto">
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

        {/* Onboarding Modal */}
        <OnboardingModal />
      </div>
    </HelpProvider>
  );
};

export default TopologyDashboard;
