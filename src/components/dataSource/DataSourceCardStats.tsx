
import React from 'react';

interface DataSourceCardStatsProps {
  source: any;
}

const DataSourceCardStats: React.FC<DataSourceCardStatsProps> = ({ source }) => {
  return (
    <div className="grid grid-cols-3 gap-3 text-sm">
      <div className="bg-slate-800 rounded p-2">
        <span className="text-slate-400 block">Last Sync</span>
        <span className="text-white text-xs">
          {source.last_sync ? new Date(source.last_sync).toLocaleString() : 'Never'}
        </span>
      </div>
      <div className="bg-slate-800 rounded p-2">
        <span className="text-slate-400 block">Interval</span>
        <span className="text-white text-xs">{source.sync_interval}s</span>
      </div>
      <div className="bg-slate-800 rounded p-2">
        <span className="text-slate-400 block">Updated</span>
        <span className="text-white text-xs">
          {new Date(source.updated_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default DataSourceCardStats;
