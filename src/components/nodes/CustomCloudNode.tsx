
import React from 'react';
import { Handle, Position } from 'reactflow';

const CustomCloudNode = ({ data, selected }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'border-green-400 bg-green-400/10';
      case 'warning': return 'border-yellow-400 bg-yellow-400/10';
      case 'critical': return 'border-red-400 bg-red-400/10';
      default: return 'border-slate-400 bg-slate-400/10';
    }
  };

  return (
    <div className={`
      px-4 py-3 rounded-lg border-2 bg-slate-800 min-w-32 text-center
      ${selected ? 'border-cyan-400 bg-cyan-400/10' : getStatusColor(data.status)}
      transition-all duration-200 hover:scale-105
    `}>
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <div className="text-white font-medium text-sm">{data.label}</div>
      <div className="text-xs text-amber-400 mt-1">Cloud</div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
};

export default CustomCloudNode;
