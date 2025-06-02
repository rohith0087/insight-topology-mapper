
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  UserPlus, 
  Link, 
  Copy, 
  Trash2, 
  Edit, 
  Mail,
  Calendar,
  Check,
  X
} from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type Invitation = Database['public']['Tables']['user_invitations']['Row'];

const UserManagement: React.FC = () => {
  const { profile, canManageUsers } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<Profile[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('viewer');
  const [generatedLink, setGeneratedLink] = useState('');

  useEffect(() => {
    if (canManageUsers) {
      fetchUsers();
      fetchInvitations();
    }
  }, [canManageUsers]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('tenant_id', profile?.tenant_id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    }
  };

  const fetchInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('user_invitations')
        .select('*')
        .eq('tenant_id', profile?.tenant_id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setInvitations(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      setLoading(false);
    }
  };

  const generateInviteLink = async () => {
    try {
      const { data, error } = await supabase
        .from('user_invitations')
        .insert({
          tenant_id: profile?.tenant_id,
          email: inviteEmail || null,
          role: inviteRole,
          invited_by: profile?.id
        })
        .select()
        .single();

      if (error) throw error;

      const inviteUrl = `${window.location.origin}/auth?invite=${data.invite_token}`;
      setGeneratedLink(inviteUrl);
      
      toast({
        title: "Invite link generated",
        description: "Share this link with the user to sign up with the specified role",
      });

      fetchInvitations();
      setInviteEmail('');
    } catch (error) {
      console.error('Error generating invite:', error);
      toast({
        title: "Error",
        description: "Failed to generate invite link",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Invite link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

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

      fetchUsers();
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

      fetchUsers();
    } catch (error) {
      console.error('Error deactivating user:', error);
      toast({
        title: "Error",
        description: "Failed to deactivate user",
        variant: "destructive",
      });
    }
  };

  const deleteInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('user_invitations')
        .delete()
        .eq('id', invitationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Invitation deleted successfully",
      });

      fetchInvitations();
    } catch (error) {
      console.error('Error deleting invitation:', error);
      toast({
        title: "Error",
        description: "Failed to delete invitation",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-600 text-white';
      case 'tenant_admin':
        return 'bg-blue-600 text-white';
      case 'network_admin':
        return 'bg-green-600 text-white';
      case 'analyst':
        return 'bg-yellow-600 text-white';
      case 'viewer':
        return 'bg-gray-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const formatRole = (role: string) => {
    return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (!canManageUsers) {
    return (
      <div className="text-center text-slate-400">
        You don't have permission to manage users.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cyan-400">User Management</h2>
          <p className="text-slate-400">Manage users and invitations for your organization</p>
        </div>
        
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite User
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-cyan-400">Invite New User</DialogTitle>
              <DialogDescription className="text-slate-400">
                Generate an invite link for a new user with a specific role
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="inviteEmail" className="text-slate-200">
                  Email (optional)
                </Label>
                <Input
                  id="inviteEmail"
                  type="email"
                  placeholder="user@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="bg-slate-900 border-slate-600 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="inviteRole" className="text-slate-200">
                  Role
                </Label>
                <Select value={inviteRole} onValueChange={(value: UserRole) => setInviteRole(value)}>
                  <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-600">
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="analyst">Analyst</SelectItem>
                    <SelectItem value="network_admin">Network Admin</SelectItem>
                    {profile?.role === 'super_admin' && (
                      <SelectItem value="tenant_admin">Tenant Admin</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {generatedLink && (
                <div className="p-4 bg-slate-900 rounded-lg">
                  <Label className="text-slate-200">Generated Invite Link:</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Input
                      value={generatedLink}
                      readOnly
                      className="bg-slate-800 border-slate-600 text-white text-sm"
                    />
                    <Button
                      size="sm"
                      onClick={() => copyToClipboard(generatedLink)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button
                onClick={generateInviteLink}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                <Link className="w-4 h-4 mr-2" />
                Generate Invite Link
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Users Table */}
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
                              <SelectItem value="viewer">Viewer</SelectItem>
                              <SelectItem value="analyst">Analyst</SelectItem>
                              <SelectItem value="network_admin">Network Admin</SelectItem>
                              {profile?.role === 'super_admin' && (
                                <SelectItem value="tenant_admin">Tenant Admin</SelectItem>
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

      {/* Pending Invitations */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-cyan-400">Pending Invitations</CardTitle>
          <CardDescription className="text-slate-400">
            Manage outstanding invitations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">Email</TableHead>
                <TableHead className="text-slate-300">Role</TableHead>
                <TableHead className="text-slate-300">Created</TableHead>
                <TableHead className="text-slate-300">Expires</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.map((invitation) => (
                <TableRow key={invitation.id} className="border-slate-700">
                  <TableCell className="text-slate-300">
                    {invitation.email || 'Generic Link'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(invitation.role)}>
                      {formatRole(invitation.role)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {new Date(invitation.created_at!).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {new Date(invitation.expires_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={invitation.used ? "default" : "secondary"}>
                      {invitation.used ? 'Used' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(
                          `${window.location.origin}/auth?invite=${invitation.invite_token}`
                        )}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteInvitation(invitation.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
