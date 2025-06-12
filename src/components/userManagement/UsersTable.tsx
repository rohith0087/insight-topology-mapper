
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Profile, UserRole, getRoleBadgeColor, formatRole } from './userManagementUtils';
import RoleChangeDialog from './RoleChangeDialog';
import UserDeleteDialog from './UserDeleteDialog';
import UserActions from './UserActions';

interface UsersTableProps {
  users: Profile[];
  onUsersUpdate: () => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, onUsersUpdate }) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleChangeDialogOpen, setRoleChangeDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [newRole, setNewRole] = useState<UserRole | null>(null);

  const updateUserRole = async (userId: string, role: UserRole) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: role })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User role updated successfully",
      });

      onUsersUpdate();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const deactivateUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User deactivated successfully",
      });

      onUsersUpdate();
    } catch (error) {
      console.error('Error deactivating user:', error);
      toast({
        title: "Error",
        description: "Failed to deactivate user",
        variant: "destructive",
      });
    }
  };

  const handleRoleChange = (user: Profile, role: UserRole) => {
    if (role === user.role) {
      // No change needed
      return;
    }
    setSelectedUser(user);
    setNewRole(role);
    setRoleChangeDialogOpen(true);
  };

  const handleDeleteClick = (user: Profile) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const confirmRoleChange = async () => {
    if (selectedUser && newRole) {
      await updateUserRole(selectedUser.id, newRole);
      setRoleChangeDialogOpen(false);
      setSelectedUser(null);
      setNewRole(null);
    }
  };

  const confirmDelete = async () => {
    if (selectedUser) {
      await deactivateUser(selectedUser.id);
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const canModifyUser = (user: Profile) => {
    return user.id !== profile?.id && profile?.role === 'super_admin';
  };

  return (
    <>
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-cyan-400">Active Users</CardTitle>
          <CardDescription className="text-slate-400">
            Manage existing users in your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">Name</TableHead>
                <TableHead className="text-slate-300">Email</TableHead>
                <TableHead className="text-slate-300">Role</TableHead>
                <TableHead className="text-slate-300">Last Login</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="border-slate-700">
                  <TableCell className="text-white">
                    {user.first_name && user.last_name 
                      ? `${user.first_name} ${user.last_name}`
                      : 'N/A'
                    }
                  </TableCell>
                  <TableCell className="text-slate-300">{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role || 'viewer')}>
                      {formatRole(user.role || 'viewer')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {user.last_login 
                      ? new Date(user.last_login).toLocaleDateString()
                      : 'Never'
                    }
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.is_active ? "default" : "destructive"}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <UserActions
                      user={user}
                      canModify={canModifyUser(user)}
                      onRoleChange={handleRoleChange}
                      onDeleteClick={handleDeleteClick}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <RoleChangeDialog
        open={roleChangeDialogOpen}
        onOpenChange={setRoleChangeDialogOpen}
        selectedUser={selectedUser}
        newRole={newRole}
        onConfirm={confirmRoleChange}
      />

      <UserDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        selectedUser={selectedUser}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default UsersTable;
