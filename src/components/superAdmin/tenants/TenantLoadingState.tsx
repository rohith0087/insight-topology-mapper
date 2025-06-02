
import React from 'react';

const TenantLoadingState: React.FC = () => {
  return (
    <div className="p-6">
      <div className="animate-pulse">
        <div className="h-8 bg-slate-600 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-800 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TenantLoadingState;
