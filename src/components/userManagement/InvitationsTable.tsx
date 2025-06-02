
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
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
import { Copy, Trash2 } from 'lucide-react';
import { Invitation, getRoleBadgeColor, formatRole } from './userManagementUtils';

interface InvitationsTableProps {
  invitations: Invitation[];
  onInvitationsUpdate: () => void;
}

const InvitationsTable: React.FC<InvitationsTableProps> = ({ 
  invitations, 
  onInvitationsUpdate 
}) => {
  const { toast } = useToast();

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

      onInvitationsUpdate();
    } catch (error) {
      console.error('Error deleting invitation:', error);
      toast({
        title: "Error",
        description: "Failed to delete invitation",
        variant: "destructive",
      });
    }
  };

  return (
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
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-slate-800"
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
  );
};

export default InvitationsTable;
