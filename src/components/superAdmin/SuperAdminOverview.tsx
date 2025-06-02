
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSuperAdminStats } from '@/hooks/useSuperAdminStats';
import { Building2, Users, Database, AlertTriangle, TrendingUp, Server } from 'lucide-react';

interface SuperAdminOverviewProps {
  onNavigateToTab?: (tab: string) => void;
}

const SuperAdminOverview: React.FC<SuperAdminOverviewProps> = ({ onNavigateToTab }) => {
  const { stats, loading, error } = useSuperAdminStats();

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-slate-600 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-slate-600 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="bg-red-900/20 border-red-700">
          <CardContent className="p-6">
            <p className="text-red-400">Error loading statistics: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Clients',
      value: stats?.total_tenants || 0,
      icon: Building2,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Active Clients',
      value: stats?.active_tenants || 0,
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Total Users',
      value: stats?.total_users || 0,
      icon: Users,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Data Sources',
      value: stats?.total_data_sources || 0,
      icon: Database,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
    },
    {
      title: 'Open Tickets',
      value: stats?.open_tickets || 0,
      icon: AlertTriangle,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'System Health',
      value: '98.5%',
      icon: Server,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
  ];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'clients':
        onNavigateToTab?.('tenants');
        break;
      case 'tickets':
        onNavigateToTab?.('support');
        break;
      case 'users':
        onNavigateToTab?.('tenants');
        break;
      case 'health':
        onNavigateToTab?.('health');
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Platform Overview</h2>
        <p className="text-slate-400">
          Real-time statistics and health monitoring for all client organizations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => handleQuickAction('clients')}
              className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors"
            >
              <Building2 className="w-6 h-6 text-blue-400 mb-2" />
              <p className="text-sm text-blue-400 font-medium">Manage Clients</p>
            </button>
            <button 
              onClick={() => handleQuickAction('tickets')}
              className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg hover:bg-orange-500/20 transition-colors"
            >
              <AlertTriangle className="w-6 h-6 text-orange-400 mb-2" />
              <p className="text-sm text-orange-400 font-medium">Support Tickets</p>
            </button>
            <button 
              onClick={() => handleQuickAction('users')}
              className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-colors"
            >
              <Users className="w-6 h-6 text-purple-400 mb-2" />
              <p className="text-sm text-purple-400 font-medium">Manage Users</p>
            </button>
            <button 
              onClick={() => handleQuickAction('health')}
              className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors"
            >
              <Server className="w-6 h-6 text-green-400 mb-2" />
              <p className="text-sm text-green-400 font-medium">System Health</p>
            </button>
          </div>
        </CardContent>
      </Card>

      {stats?.last_updated && (
        <p className="text-xs text-slate-500 text-center">
          Last updated: {new Date(stats.last_updated).toLocaleString()}
        </p>
      )}
    </div>
  );
};

export default SuperAdminOverview;
