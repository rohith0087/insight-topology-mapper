
import React from 'react';
import { useExecutiveMetrics } from '@/hooks/useExecutiveMetrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ExecutiveDashboard: React.FC = () => {
  const { data: metrics, isLoading, error } = useExecutiveMetrics();

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-slate-800 border-slate-600">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-8 bg-slate-700 rounded w-1/2"></div>
                  <div className="h-3 bg-slate-700 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="bg-red-950 border-red-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-red-200">Failed to load executive metrics: {error.message}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!metrics) return null;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-600 text-white';
      case 'good':
        return 'bg-blue-600 text-white';
      case 'needs_attention':
        return 'bg-yellow-600 text-white';
      default:
        return 'bg-slate-600 text-white';
    }
  };

  // Sample data for charts (in real implementation, this would come from the backend)
  const trendData = [
    { month: 'Jan', security: 92, health: 96, uptime: 99.1 },
    { month: 'Feb', security: 94, health: 97, uptime: 99.3 },
    { month: 'Mar', security: 93, health: 95, uptime: 99.2 },
    { month: 'Apr', security: 96, health: 98, uptime: 99.4 },
    { month: 'May', security: 95, health: 97, uptime: 99.2 },
    { month: 'Jun', security: 97, health: 98, uptime: 99.5 },
  ];

  const alertDistribution = [
    { name: 'Critical', value: metrics.alerts.critical, color: '#ef4444' },
    { name: 'High Priority', value: metrics.alerts.high_priority, color: '#f97316' },
    { name: 'Healthy', value: metrics.overview.healthy_nodes, color: '#22c55e' },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400">Executive Dashboard</h1>
          <p className="text-slate-400 mt-1">Network health and business metrics overview</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-400">
          <Clock className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.kpis.map((kpi, index) => (
          <Card key={index} className="bg-slate-800 border-slate-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center justify-between">
                {kpi.title}
                {getTrendIcon(kpi.trend.trend)}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-white">
                  {kpi.value}{kpi.unit}
                </span>
                <Badge className={getStatusColor(kpi.status)}>
                  {kpi.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Target: {kpi.target}{kpi.unit}</span>
                <span className={`${kpi.trend.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {kpi.trend.change >= 0 ? '+' : ''}{kpi.trend.change}%
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-slate-200">6-Month Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="security" stroke="#06b6d4" strokeWidth={2} name="Security Score" />
                <Line type="monotone" dataKey="health" stroke="#10b981" strokeWidth={2} name="Network Health" />
                <Line type="monotone" dataKey="uptime" stroke="#8b5cf6" strokeWidth={2} name="Uptime" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Alert Distribution */}
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-slate-200">Alert Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={alertDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
                >
                  {alertDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Financial and Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Financial Impact */}
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span>Financial Impact</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-400">Cost Savings</span>
              <span className="text-green-400 font-semibold">${metrics.financial.cost_savings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Estimated ROI</span>
              <span className="text-green-400 font-semibold">${metrics.financial.estimated_roi.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Incidents Resolved</span>
              <span className="text-blue-400 font-semibold">{metrics.financial.incidents_resolved}</span>
            </div>
          </CardContent>
        </Card>

        {/* Network Overview */}
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-slate-200">Network Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Nodes</span>
              <span className="text-white font-semibold">{metrics.overview.total_nodes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Healthy Nodes</span>
              <span className="text-green-400 font-semibold">{metrics.overview.healthy_nodes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Critical Nodes</span>
              <span className="text-red-400 font-semibold">{metrics.overview.critical_nodes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Connections</span>
              <span className="text-white font-semibold">{metrics.overview.total_connections}</span>
            </div>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <span>Active Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Critical</span>
              <Badge className="bg-red-600 text-white">{metrics.alerts.critical}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">High Priority</span>
              <Badge className="bg-orange-600 text-white">{metrics.alerts.high_priority}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Active</span>
              <Badge className="bg-slate-600 text-white">{metrics.alerts.total_active}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
