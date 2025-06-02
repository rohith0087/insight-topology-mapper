import React from 'react';
import { Database, Network, Play, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useDataSources, useETLJobs, useRunETL } from '../hooks/useDataSources';

const DataSourcePanel = () => {
  const { data: dataSources, isLoading: sourcesLoading } = useDataSources();
  const { data: etlJobs, isLoading: jobsLoading } = useETLJobs();
  const runETL = useRunETL();

  const getTypeIcon = (type: string) => {
    const iconImages = {
      aws: '/lovable-uploads/e1398d3d-578a-471e-bfde-4096d0238576.png',
      azure: '/lovable-uploads/c8dd797a-375c-47db-991f-ea4bdbf311f1.png',
      datadog: '/lovable-uploads/29d45e0c-b15e-4e77-89ae-28286dda410d.png',
      'microsoft-sentinel': '/lovable-uploads/09db2bdd-5525-47a7-aaa8-e30b98d6901d.png',
      qradar: '/lovable-uploads/88b0bf91-c943-4248-baf0-5e75ef46c244.png',
      sentinelone: '/lovable-uploads/fe727117-4df6-4009-85bb-536a2073baec.png'
    };

    if (iconImages[type]) {
      return <img src={iconImages[type]} alt={type} className="w-5 h-5 object-contain" />;
    }

    const icons = {
      nmap: '🌐',
      splunk: '🟢',
      snmp: '📡',
      api: '🔌'
    };
    return <span className="text-lg">{icons[type] || '⚙️'}</span>;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'running': return 'text-blue-400';
      case 'failed': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-400';
      case 'pending': return 'bg-yellow-400';
      case 'running': return 'bg-blue-400 animate-pulse';
      case 'failed': return 'bg-red-400';
      default: return 'bg-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'running': return <Clock className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-yellow-400" />;
    }
  };

  const handleRunETL = () => {
    runETL.mutate();
  };

  if (sourcesLoading) {
    return (
      <div className="p-6 border-t border-slate-700">
        <div className="text-slate-400">Loading data sources...</div>
      </div>
    );
  }

  return (
    <div className="p-6 border-t border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-cyan-400">Data Sources</h3>
        <button
          onClick={handleRunETL}
          disabled={runETL.isPending}
          className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 px-3 py-1 rounded text-sm text-white"
        >
          <Play className="w-4 h-4" />
          <span>{runETL.isPending ? 'Running...' : 'Run ETL'}</span>
        </button>
      </div>

      <div className="space-y-3 mb-6">
        {dataSources?.map((source) => (
          <div key={source.id} className="bg-slate-900 rounded-lg p-4 border border-slate-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-5 h-5">{getTypeIcon(source.type)}</div>
                <div>
                  <p className="text-white font-medium text-sm">{source.name}</p>
                  <p className="text-slate-400 text-xs">{source.type.toUpperCase()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getStatusDot(source.sync_status)}`}></div>
                <span className={`text-xs ${getStatusColor(source.sync_status)}`}>
                  {source.sync_status}
                </span>
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Last sync: {source.last_sync ? new Date(source.last_sync).toLocaleString() : 'Never'}
            </div>
          </div>
        ))}
      </div>

      <h4 className="text-md font-semibold text-cyan-400 mb-3">Recent ETL Jobs</h4>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {jobsLoading ? (
          <div className="text-slate-400 text-sm">Loading jobs...</div>
        ) : (
          etlJobs?.map((job) => (
            <div key={job.id} className="bg-slate-900 rounded p-3 border border-slate-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(job.status)}
                  <span className="text-sm text-white">{job.job_type}</span>
                </div>
                <span className="text-xs text-slate-400">
                  {job.records_processed} records
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {new Date(job.started_at).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DataSourcePanel;
