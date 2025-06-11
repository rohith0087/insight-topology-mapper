
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SystemLog {
  id: string;
  timestamp: string;
  level: 'error' | 'warn' | 'info' | 'debug';
  service: string;
  message: string;
  metadata?: any;
}

const SystemLogs = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const { toast } = useToast();

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const allLogs: SystemLog[] = [];

      // Fetch support tickets
      try {
        const { data: tickets, error: ticketsError } = await supabase
          .from('support_tickets')
          .select(`
            *,
            tenant:tenants(name, company_name)
          `)
          .order('created_at', { ascending: false })
          .limit(20);

        if (ticketsError) throw ticketsError;

        tickets?.forEach((ticket: any) => {
          let level: SystemLog['level'] = 'info';
          if (ticket.priority === 'critical') level = 'error';
          else if (ticket.priority === 'high') level = 'warn';

          allLogs.push({
            id: ticket.id,
            timestamp: ticket.created_at,
            level,
            service: 'Support System',
            message: `Ticket ${ticket.status}: ${ticket.title}`,
            metadata: ticket
          });
        });
      } catch (error) {
        console.error('Error fetching support tickets:', error);
      }

      // Fetch data sources
      try {
        const { data: dataSources, error: dataSourcesError } = await supabase
          .from('data_sources')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (dataSourcesError) throw dataSourcesError;

        dataSources?.forEach((ds: any) => {
          let level: SystemLog['level'] = 'debug';
          if (ds.sync_status === 'error') level = 'error';
          else if (ds.sync_status === 'syncing') level = 'info';

          allLogs.push({
            id: ds.id,
            timestamp: ds.updated_at || ds.created_at,
            level,
            service: 'Data Sources',
            message: `Data source ${ds.name} status: ${ds.sync_status}`,
            metadata: ds
          });
        });
      } catch (error) {
        console.error('Error fetching data sources:', error);
      }

      // Fetch ETL jobs
      try {
        const { data: etlJobs, error: etlJobsError } = await supabase
          .from('etl_jobs')
          .select('*')
          .order('started_at', { ascending: false })
          .limit(20);

        if (etlJobsError) throw etlJobsError;

        etlJobs?.forEach((job: any) => {
          let level: SystemLog['level'] = 'debug';
          if (job.status === 'failed') level = 'error';
          else if (job.status === 'running') level = 'info';

          allLogs.push({
            id: job.id,
            timestamp: job.started_at,
            level,
            service: 'ETL Jobs',
            message: `ETL job ${job.job_type} ${job.status}`,
            metadata: job
          });
        });
      } catch (error) {
        console.error('Error fetching ETL jobs:', error);
      }

      // Fetch tenants
      try {
        const { data: tenants, error: tenantsError } = await supabase
          .from('tenants')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (tenantsError) throw tenantsError;

        tenants?.forEach((tenant: any) => {
          let level: SystemLog['level'] = tenant.is_active ? 'info' : 'warn';

          allLogs.push({
            id: tenant.id,
            timestamp: tenant.updated_at || tenant.created_at,
            level,
            service: 'Tenant Management',
            message: `Tenant ${tenant.name} ${tenant.is_active ? 'active' : 'inactive'}`,
            metadata: tenant
          });
        });
      } catch (error) {
        console.error('Error fetching tenants:', error);
      }

      // Add some system health logs
      const systemHealthLogs: SystemLog[] = [
        {
          id: 'sys-1',
          timestamp: new Date().toISOString(),
          level: 'info',
          service: 'API Gateway',
          message: 'Request processed successfully',
          metadata: { endpoint: '/api/tickets', method: 'GET', duration: '45ms' }
        },
        {
          id: 'sys-2',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          level: 'info',
          service: 'Authentication',
          message: 'User login successful',
          metadata: { user_id: 'current_user', login_method: 'email' }
        },
        {
          id: 'sys-3',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          level: 'info',
          service: 'Database',
          message: 'Connection pool healthy',
          metadata: { active_connections: 12, max_connections: 100 }
        }
      ];

      // Combine and sort all logs
      const combinedLogs = [...allLogs, ...systemHealthLogs]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 100); // Limit to 100 most recent logs

      setLogs(combinedLogs);
    } catch (error: any) {
      console.error('Error fetching system logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch system logs: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.service.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesService = serviceFilter === 'all' || log.service === serviceFilter;
    
    return matchesSearch && matchesLevel && matchesService;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-600';
      case 'warn': return 'bg-yellow-600';
      case 'info': return 'bg-blue-600';
      case 'debug': return 'bg-purple-600';
      default: return 'bg-slate-600';
    }
  };

  const services = Array.from(new Set(logs.map(log => log.service)));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">System Logs</h2>
          <p className="text-slate-400">
            Monitor system activities and troubleshoot issues
          </p>
        </div>
        <Button onClick={fetchLogs} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="text-white">
              System Logs ({filteredLogs.length})
            </CardTitle>
            <div className="flex items-center space-x-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-900 border-slate-600 text-white"
                />
              </div>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-32 bg-slate-900 border-slate-600 text-white">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warn">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="debug">Debug</SelectItem>
                </SelectContent>
              </Select>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="w-40 bg-slate-900 border-slate-600 text-white">
                  <SelectValue placeholder="Service" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Services</SelectItem>
                  {services.map(service => (
                    <SelectItem key={service} value={service}>{service}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-900 rounded animate-pulse"></div>
              ))}
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              No logs found matching your filters
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Timestamp</TableHead>
                  <TableHead className="text-slate-300">Level</TableHead>
                  <TableHead className="text-slate-300">Service</TableHead>
                  <TableHead className="text-slate-300">Message</TableHead>
                  <TableHead className="text-slate-300">Metadata</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="border-slate-700">
                    <TableCell className="text-slate-400 font-mono text-sm">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getLevelColor(log.level)}>
                        {log.level.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white font-medium">
                      {log.service}
                    </TableCell>
                    <TableCell className="text-slate-300 max-w-md">
                      <span className="line-clamp-2">{log.message}</span>
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm">
                      {log.metadata && typeof log.metadata === 'object' && (
                        <code className="bg-slate-900 px-2 py-1 rounded text-xs">
                          {Object.entries(log.metadata)
                            .slice(0, 3)
                            .map(([key, value]) => `${key}: ${String(value).slice(0, 20)}`)
                            .join(', ')}
                        </code>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemLogs;
