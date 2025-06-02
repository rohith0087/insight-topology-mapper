
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertTriangle, Shield, Activity, Clock, ArrowRight } from 'lucide-react';

interface OnboardingMonitoringSetupProps {
  onNext: () => void;
}

const OnboardingMonitoringSetup: React.FC<OnboardingMonitoringSetupProps> = ({ onNext }) => {
  const [alertSettings, setAlertSettings] = useState({
    criticalAlerts: true,
    warningAlerts: true,
    performanceAlerts: false,
    securityAlerts: true,
    alertThreshold: [80],
    notificationMethod: 'email',
    monitoringInterval: '5'
  });

  const handleSettingChange = (key: string, value: any) => {
    setAlertSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const alertTypes = [
    {
      id: 'criticalAlerts',
      title: 'Critical System Alerts',
      description: 'Node failures, connection losses, security breaches',
      icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
      recommended: true
    },
    {
      id: 'warningAlerts',
      title: 'Warning Alerts',
      description: 'Performance degradation, resource usage warnings',
      icon: <Bell className="w-5 h-5 text-yellow-400" />,
      recommended: true
    },
    {
      id: 'performanceAlerts',
      title: 'Performance Monitoring',
      description: 'CPU, memory, bandwidth utilization alerts',
      icon: <Activity className="w-5 h-5 text-blue-400" />,
      recommended: false
    },
    {
      id: 'securityAlerts',
      title: 'Security Events',
      description: 'Unauthorized access attempts, anomaly detection',
      icon: <Shield className="w-5 h-5 text-green-400" />,
      recommended: true
    }
  ];

  const handleContinue = () => {
    // In real implementation, save monitoring settings
    console.log('Saving monitoring settings:', alertSettings);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-200 mb-2">
          Set Up Monitoring & Alerts
        </h2>
        <p className="text-slate-400">
          Configure how you want to be notified about network events. 
          You can always adjust these settings later.
        </p>
      </div>

      {/* Alert Types */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-200">Alert Types</h3>
        <div className="grid gap-4">
          {alertTypes.map((alertType) => (
            <Card key={alertType.id} className="bg-slate-800 border-slate-600">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {alertType.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-slate-200">{alertType.title}</h4>
                        {alertType.recommended && (
                          <Badge className="bg-cyan-600 text-white text-xs">Recommended</Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-400">{alertType.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={alertSettings[alertType.id as keyof typeof alertSettings] as boolean}
                    onCheckedChange={(checked) => handleSettingChange(alertType.id, checked)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Alert Threshold */}
      <Card className="bg-slate-800 border-slate-600">
        <CardHeader>
          <CardTitle className="text-slate-200 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <span>Alert Threshold</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-slate-400">Performance threshold</span>
              <span className="text-sm text-cyan-400">{alertSettings.alertThreshold[0]}%</span>
            </div>
            <Slider
              value={alertSettings.alertThreshold}
              onValueChange={(value) => handleSettingChange('alertThreshold', value)}
              max={100}
              min={50}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-slate-500 mt-2">
              Alert when resource utilization exceeds this threshold
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-slate-200 text-base">Notification Method</CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={alertSettings.notificationMethod} 
              onValueChange={(value) => handleSettingChange('notificationMethod', value)}
            >
              <SelectTrigger className="bg-slate-900 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="email">Email Notifications</SelectItem>
                <SelectItem value="slack">Slack Integration</SelectItem>
                <SelectItem value="webhook">Webhook</SelectItem>
                <SelectItem value="dashboard">Dashboard Only</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-slate-200 text-base flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Monitoring Interval</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={alertSettings.monitoringInterval} 
              onValueChange={(value) => handleSettingChange('monitoringInterval', value)}
            >
              <SelectTrigger className="bg-slate-900 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="1">1 minute</SelectItem>
                <SelectItem value="5">5 minutes</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card className="bg-slate-900 border-slate-600">
        <CardContent className="p-4">
          <h3 className="font-semibold text-slate-200 mb-3">Configuration Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Active Alert Types:</span>
              <div className="mt-1">
                {Object.entries(alertSettings)
                  .filter(([key, value]) => typeof value === 'boolean' && value)
                  .length} enabled
              </div>
            </div>
            <div>
              <span className="text-slate-400">Notification:</span>
              <div className="mt-1 text-slate-200 capitalize">
                {alertSettings.notificationMethod}
              </div>
            </div>
            <div>
              <span className="text-slate-400">Threshold:</span>
              <div className="mt-1 text-slate-200">
                {alertSettings.alertThreshold[0]}%
              </div>
            </div>
            <div>
              <span className="text-slate-400">Check Interval:</span>
              <div className="mt-1 text-slate-200">
                {alertSettings.monitoringInterval} minutes
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
          Skip Setup
        </Button>
        <Button 
          onClick={handleContinue}
          className="bg-cyan-600 hover:bg-cyan-700"
        >
          Save & Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default OnboardingMonitoringSetup;
