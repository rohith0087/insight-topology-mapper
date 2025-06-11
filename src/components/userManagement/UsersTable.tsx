
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2 } from 'lucide-react';
import { Profile, UserRole, getRoleBadgeColor, formatRole } from './userManagementUtils';

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
      setRoleChangeDialogOpen(false);
      setSelectedUser(null);
      setNewRole(null);
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
      setDeleteDialogOpen(false);
      setSelectedUser(null);
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
    setSelectedUser(user);
    setNewRole(role);
    setRoleChangeDialogOpen(true);
  };

  const handleDeleteClick = (user: Profile) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
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
                    <div className="flex space-x-2">
                      {canModifyUser(user) && (
                        <>
                          <Select
                            value={user.role || 'viewer'}
                            onValueChange={(value: UserRole) => handleRoleChange(user, value)}
                          >
                            <SelectTrigger className="w-32 h-8 text-xs bg-slate-700 border-slate-600">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-600">
                              <SelectItem value="viewer" className="text-white hover:bg-slate-700">Viewer</SelectItem>
                              <SelectItem value="analyst" className="text-white hover:bg-slate-700">Analyst</SelectItem>
                              <SelectItem value="network_admin" className="text-white hover:bg-slate-700">Network Admin</SelectItem>
                              <SelectItem value="tenant_admin" className="text-white hover:bg-slate-700">Tenant Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteClick(user)}
                            disabled={!user.is_active}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Role Change Confirmation Dialog */}
      <AlertDialog open={roleChangeDialogOpen} onOpenChange={setRoleChangeDialogOpen}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirm Role Change</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              Are you sure you want to change the role of <strong>{selectedUser?.first_name} {selectedUser?.last_name}</strong> ({selectedUser?.email}) to <strong>{newRole ? formatRole(newRole) : ''}</strong>?
              <br /><br />
              This action will immediately update their permissions and access level.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-600 text-white hover:bg-slate-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => selectedUser && newRole && updateUserRole(selectedUser.id, newRole)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Change Role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* User Deletion Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirm User Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              Are you sure you want to deactivate <strong>{selectedUser?.first_name} {selectedUser?.last_name}</strong> ({selectedUser?.email})?
              <br /><br />
              This action will:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Immediately revoke their access to the system</li>
                <li>Prevent them from logging in</li>
                <li>Remove them from all active sessions</li>
              </ul>
              <br />
              <strong className="text-red-400">This action cannot be easily undone.</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-600 text-white hover:bg-slate-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => selectedUser && deactivateUser(selectedUser.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Deactivate User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UsersTable;
