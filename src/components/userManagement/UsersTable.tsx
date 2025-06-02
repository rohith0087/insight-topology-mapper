
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
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

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
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

  return (
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
                    {user.id !== profile?.id && (
                      <>
                        <Select
                          value={user.role || 'viewer'}
                          onValueChange={(value: UserRole) => updateUserRole(user.id, value)}
                        >
                          <SelectTrigger className="w-32 h-8 text-xs bg-slate-700 border-slate-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-600">
                            <SelectItem value="viewer" className="text-white hover:bg-slate-700">Viewer</SelectItem>
                            <SelectItem value="analyst" className="text-white hover:bg-slate-700">Analyst</SelectItem>
                            <SelectItem value="network_admin" className="text-white hover:bg-slate-700">Network Admin</SelectItem>
                            {profile?.role === 'super_admin' && (
                              <SelectItem value="tenant_admin" className="text-white hover:bg-slate-700">Tenant Admin</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deactivateUser(user.id)}
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
  );
};

export default UsersTable;
