
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  PieChart, 
  Activity, 
  Shield, 
  Clock, 
  DollarSign,
  Network,
  Users,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

interface OnboardingDashboardSetupProps {
  onNext: () => void;
}

const OnboardingDashboardSetup: React.FC<OnboardingDashboardSetupProps> = ({ onNext }) => {
  const [dashboardConfig, setDashboardConfig] = useState({
    executiveDashboard: true,
    networkOverview: true,
    securityMetrics: true,
    performanceCharts: false,
    financialMetrics: false,
    userActivity: false,
    realTimeAlerts: true,
    customReports: false
  });

  const dashboardWidgets = [
    {
      id: 'executiveDashboard',
      title: 'Executive Dashboard',
      description: 'High-level KPIs and business metrics for leadership',
      icon: <BarChart3 className="w-5 h-5 text-cyan-400" />,
      category: 'Business',
      recommended: true
    },
    {
      id: 'networkOverview',
      title: 'Network Overview',
      description: 'Real-time network topology and connection status',
      icon: <Network className="w-5 h-5 text-blue-400" />,
      category: 'Technical',
      recommended: true
    },
    {
      id: 'securityMetrics',
      title: 'Security Metrics',
      description: 'Security posture, threats, and compliance status',
      icon: <Shield className="w-5 h-5 text-green-400" />,
      category: 'Security',
      recommended: true
    },
    {
      id: 'performanceCharts',
      title: 'Performance Charts',
      description: 'System performance trends and capacity planning',
      icon: <Activity className="w-5 h-5 text-purple-400" />,
      category: 'Technical',
      recommended: false
    },
    {
      id: 'financialMetrics',
      title: 'Financial Metrics',
      description: 'Cost analysis, ROI tracking, and budget insights',
      icon: <DollarSign className="w-5 h-5 text-yellow-400" />,
      category: 'Business',
      recommended: false
    },
    {
      id: 'userActivity',
      title: 'User Activity',
      description: 'User access patterns and behavior analytics',
      icon: <Users className="w-5 h-5 text-orange-400" />,
      category: 'Security',
      recommended: false
    },
    {
      id: 'realTimeAlerts',
      title: 'Real-time Alerts',
      description: 'Live alerts and incident notifications panel',
      icon: <Clock className="w-5 h-5 text-red-400" />,
      category: 'Operations',
      recommended: true
    },
    {
      id: 'customReports',
      title: 'Custom Reports',
      description: 'Build and schedule custom reports and exports',
      icon: <PieChart className="w-5 h-5 text-indigo-400" />,
      category: 'Business',
      recommended: false
    }
  ];

  const handleWidgetToggle = (widgetId: string) => {
    setDashboardConfig(prev => ({
      ...prev,
      [widgetId]: !prev[widgetId as keyof typeof prev]
    }));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Business':
        return 'bg-cyan-600';
      case 'Technical':
        return 'bg-blue-600';
      case 'Security':
        return 'bg-green-600';
      case 'Operations':
        return 'bg-purple-600';
      default:
        return 'bg-slate-600';
    }
  };

  const getEnabledCount = () => {
    return Object.values(dashboardConfig).filter(Boolean).length;
  };

  const handleComplete = () => {
    // In real implementation, save dashboard configuration
    console.log('Saving dashboard configuration:', dashboardConfig);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-200 mb-2">
          Customize Your Dashboard
        </h2>
        <p className="text-slate-400">
          Choose which widgets and metrics you'd like to see on your dashboard. 
          You can always add or remove widgets later.
        </p>
      </div>

      {/* Dashboard Preview Stats */}
      <Card className="bg-gradient-to-r from-cyan-950 to-blue-950 border-cyan-600">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-200 mb-1">Dashboard Configuration</h3>
              <p className="text-sm text-slate-400">
                {getEnabledCount()} widgets enabled • Recommended setup selected
              </p>
            </div>
            <Badge className="bg-cyan-600 text-white">
              Ready to Launch
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Widget Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-200">Dashboard Widgets</h3>
        <div className="grid gap-4">
          {dashboardWidgets.map((widget) => (
            <Card key={widget.id} className="bg-slate-800 border-slate-600">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {widget.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-slate-200">{widget.title}</h4>
                        <Badge className={`${getCategoryColor(widget.category)} text-white text-xs`}>
                          {widget.category}
                        </Badge>
                        {widget.recommended && (
                          <Badge className="bg-green-600 text-white text-xs">Recommended</Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-400">{widget.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={dashboardConfig[widget.id as keyof typeof dashboardConfig]}
                    onCheckedChange={() => handleWidgetToggle(widget.id)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Dashboard Layout Preview */}
      <Card className="bg-slate-900 border-slate-600">
        <CardHeader>
          <CardTitle className="text-slate-200">Dashboard Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(dashboardConfig)
              .filter(([_, enabled]) => enabled)
              .slice(0, 8)
              .map(([widgetId, _], index) => {
                const widget = dashboardWidgets.find(w => w.id === widgetId);
                return (
                  <div key={widgetId} className="bg-slate-800 rounded p-3 text-center">
                    <div className="flex justify-center mb-1">
                      {widget?.icon}
                    </div>
                    <p className="text-xs text-slate-400 truncate">
                      {widget?.title}
                    </p>
                  </div>
                );
              })}
          </div>
          {getEnabledCount() === 0 && (
            <div className="text-center py-8 text-slate-400">
              <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Select widgets to preview your dashboard</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completion Summary */}
      <Card className="bg-gradient-to-r from-green-950 to-cyan-950 border-green-600">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <CheckCircle className="w-12 h-12 text-green-400 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-slate-200 mb-2">
                🎉 You're All Set!
              </h3>
              <p className="text-slate-400 mb-4">
                Your LumenNet dashboard is configured and ready to use. You can always customize 
                these settings later from the dashboard preferences.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Widgets Enabled:</span>
                  <div className="text-slate-200 font-medium">{getEnabledCount()}</div>
                </div>
                <div>
                  <span className="text-slate-400">Setup Complete:</span>
                  <div className="text-green-400 font-medium">100%</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => onNext()}
          className="border-slate-600 hover:bg-slate-700"
        >
          Skip Customization
        </Button>
        <Button 
          onClick={handleComplete}
          className="bg-green-600 hover:bg-green-700"
        >
          Complete Setup
          <CheckCircle className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default OnboardingDashboardSetup;
