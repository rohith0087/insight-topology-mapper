
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Server, Database, Users, Globe, AlertTriangle, CheckCircle } from 'lucide-react';

const SystemHealth = () => {
  const healthMetrics = [
    {
      name: 'API Response Time',
      value: 95,
      status: 'healthy',
      description: 'Average response time < 200ms',
      icon: Server,
    },
    {
      name: 'Database Performance',
      value: 88,
      status: 'healthy',
      description: 'Query performance within normal range',
      icon: Database,
    },
    {
      name: 'User Activity',
      value: 92,
      status: 'healthy',
      description: 'Active user sessions',
      icon: Users,
    },
    {
      name: 'Network Connectivity',
      value: 99,
      status: 'healthy',
      description: 'All regions operational',
      icon: Globe,
    },
  ];

  const systemServices = [
    { name: 'Authentication Service', status: 'operational', uptime: '99.9%' },
    { name: 'Data Collection Service', status: 'operational', uptime: '99.8%' },
    { name: 'AI Analysis Service', status: 'operational', uptime: '99.7%' },
    { name: 'Notification Service', status: 'operational', uptime: '99.9%' },
    { name: 'Backup Service', status: 'operational', uptime: '100%' },
    { name: 'Monitoring Service', status: 'degraded', uptime: '98.2%' },
  ];

  const recentIncidents = [
    {
      id: 1,
      title: 'Minor database slowdown',
      description: 'Resolved performance issue in tenant queries',
      status: 'resolved',
      time: '2 hours ago',
      impact: 'low',
    },
    {
      id: 2,
      title: 'Scheduled maintenance',
      description: 'Routine system updates and patches',
      status: 'completed',
      time: '1 day ago',
      impact: 'none',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-600';
      case 'degraded': return 'bg-yellow-600';
      case 'down': return 'bg-red-600';
      default: return 'bg-slate-600';
    }
  };

  const getHealthColor = (value: number) => {
    if (value >= 95) return 'text-green-400';
    if (value >= 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">System Health</h2>
        <p className="text-slate-400">
          Monitor platform performance and service availability
        </p>
      </div>

      {/* Overall Health Score */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Overall System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">98.5%</div>
              <p className="text-slate-400">System Operational</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {healthMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.name} className="bg-slate-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-5 h-5 text-slate-400" />
                    <span className={`text-sm font-medium ${getHealthColor(metric.value)}`}>
                      {metric.value}%
                    </span>
                  </div>
                  <h4 className="text-white font-medium mb-1">{metric.name}</h4>
                  <p className="text-xs text-slate-500">{metric.description}</p>
                  <Progress 
                    value={metric.value} 
                    className="mt-2 h-2" 
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Service Status */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Service Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemServices.map((service) => (
              <div key={service.name} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                <div className="flex items-center space-x-3">
                  {service.status === 'operational' ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  )}
                  <span className="text-white font-medium">{service.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-slate-400 text-sm">{service.uptime} uptime</span>
                  <Badge className={getStatusColor(service.status)}>
                    {service.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Incidents */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentIncidents.map((incident) => (
              <div key={incident.id} className="p-4 bg-slate-900 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-white font-medium">{incident.title}</h4>
                      <Badge className={getStatusColor(incident.status)}>
                        {incident.status}
                      </Badge>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{incident.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <span>Impact: {incident.impact}</span>
                      <span>{incident.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemHealth;
