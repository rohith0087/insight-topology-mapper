
import React from 'react';
import { CardHeader, CardTitle } from '../ui/card';
import { getTypeIcon, getStatusIcon, getStatusBadge } from './DataSourceCardUtils';

interface DataSourceCardHeaderProps {
  source: any;
}

const DataSourceCardHeader: React.FC<DataSourceCardHeaderProps> = ({ source }) => {
  return (
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8">{getTypeIcon(source.type)}</div>
          <div>
            <CardTitle className="text-white text-lg">{source.name}</CardTitle>
            <p className="text-slate-400 text-sm uppercase tracking-wide">{source.type}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon(source.sync_status, source.enabled)}
          {getStatusBadge(source.sync_status, source.enabled)}
        </div>
      </div>
    </CardHeader>
  );
};

export default DataSourceCardHeader;
