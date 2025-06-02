
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Link, Copy } from 'lucide-react';
import { UserRole } from './userManagementUtils';
import RolePermissionsCard from './RolePermissionsCard';

interface UserInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInviteGenerated: () => void;
}

const UserInviteDialog: React.FC<UserInviteDialogProps> = ({ 
  open, 
  onOpenChange, 
  onInviteGenerated 
}) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('viewer');
  const [generatedLink, setGeneratedLink] = useState('');

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

      onInviteGenerated();
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-cyan-400">Invite New User</DialogTitle>
          <DialogDescription className="text-slate-400">
            Generate an invite link for a new user with a specific role
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
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
            <Label htmlFor="inviteRole" className="text-slate-200 mb-3 block">
              Select Role & Permissions
            </Label>
            <Select value={inviteRole} onValueChange={(value: UserRole) => setInviteRole(value)}>
              <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-600 text-white">
                <SelectItem value="viewer" className="text-white hover:bg-slate-700">Viewer</SelectItem>
                <SelectItem value="analyst" className="text-white hover:bg-slate-700">Analyst</SelectItem>
                <SelectItem value="network_admin" className="text-white hover:bg-slate-700">Network Admin</SelectItem>
                {profile?.role === 'super_admin' && (
                  <SelectItem value="tenant_admin" className="text-white hover:bg-slate-700">Tenant Admin</SelectItem>
                )}
              </SelectContent>
            </Select>

            <RolePermissionsCard selectedRole={inviteRole} />
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
  );
};

export default UserInviteDialog;
