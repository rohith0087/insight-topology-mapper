
import React from 'react';
import { Button } from '@/components/ui/button';

interface TenantActionsProps {
  onAddClient: () => void;
}

const TenantActions: React.FC<TenantActionsProps> = ({ onAddClient }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Client Management</h2>
        <p className="text-slate-400">
          Monitor and manage all client organizations on the platform
        </p>
      </div>
      <Button className="bg-blue-600 hover:bg-blue-700" onClick={onAddClient}>
        Add New Client
      </Button>
    </div>
  );
};

export default TenantActions;
