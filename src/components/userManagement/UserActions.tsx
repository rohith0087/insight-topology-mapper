
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import { Profile, UserRole } from './userManagementUtils';

interface UserActionsProps {
  user: Profile;
  canModify: boolean;
  onRoleChange: (user: Profile, role: UserRole) => void;
  onDeleteClick: (user: Profile) => void;
}

const UserActions: React.FC<UserActionsProps> = ({
  user,
  canModify,
  onRoleChange,
  onDeleteClick
}) => {
  if (!canModify) {
    return null;
  }

  return (
    <div className="flex space-x-2">
      <Select
        value={user.role || 'viewer'}
        onValueChange={(value: UserRole) => onRoleChange(user, value)}
      >
        <SelectTrigger className="w-32 h-8 text-xs bg-slate-700 border-slate-600 text-white">
          <SelectValue className="text-white" />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-slate-600">
          <SelectItem value="viewer" className="text-white hover:bg-slate-700 focus:bg-slate-700 focus:text-white">Viewer</SelectItem>
          <SelectItem value="analyst" className="text-white hover:bg-slate-700 focus:bg-slate-700 focus:text-white">Analyst</SelectItem>
          <SelectItem value="network_admin" className="text-white hover:bg-slate-700 focus:bg-slate-700 focus:text-white">Network Admin</SelectItem>
          <SelectItem value="tenant_admin" className="text-white hover:bg-slate-700 focus:bg-slate-700 focus:text-white">Tenant Admin</SelectItem>
        </SelectContent>
      </Select>
      
      <Button
        size="sm"
        variant="destructive"
        onClick={() => onDeleteClick(user)}
        disabled={!user.is_active}
      >
        <Trash2 className="w-3 h-3" />
      </Button>
    </div>
  );
};

export default UserActions;
