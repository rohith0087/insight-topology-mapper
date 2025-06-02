
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface UserManagementHeaderProps {
  onInviteClick: () => void;
}

const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({ onInviteClick }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-slate-400">Manage users and invitations for your organization</p>
      </div>
      
      <Button onClick={onInviteClick} className="bg-cyan-600 hover:bg-cyan-700">
        <UserPlus className="w-4 h-4 mr-2" />
        Invite User
      </Button>
    </div>
  );
};

export default UserManagementHeader;
