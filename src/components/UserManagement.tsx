
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import UserManagementHeader from './userManagement/UserManagementHeader';
import UserInviteDialog from './userManagement/UserInviteDialog';
import UsersTable from './userManagement/UsersTable';
import InvitationsTable from './userManagement/InvitationsTable';
import { Profile, Invitation } from './userManagement/userManagementUtils';

const UserManagement: React.FC = () => {
  const { canManageUsers, profile } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<Profile[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

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

  if (!canManageUsers) {
    return (
      <div className="text-center text-slate-400">
        You don't have permission to manage users.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserManagementHeader onInviteClick={() => setInviteDialogOpen(true)} />

      <UserInviteDialog 
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        onInviteGenerated={fetchInvitations}
      />

      <UsersTable users={users} onUsersUpdate={fetchUsers} />

      <InvitationsTable 
        invitations={invitations} 
        onInvitationsUpdate={fetchInvitations} 
      />
    </div>
  );
};

export default UserManagement;
