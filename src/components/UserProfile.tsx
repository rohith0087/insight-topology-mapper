
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, Settings, LogOut, Shield, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProfileSettingsDialog from './profile/ProfileSettingsDialog';
import PreferencesDialog from './profile/PreferencesDialog';
import UserTickets from './user/UserTickets';

const UserProfile: React.FC = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [preferencesDialogOpen, setPreferencesDialogOpen] = useState(false);
  const [ticketsDialogOpen, setTicketsDialogOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleSuperAdminPortal = () => {
    navigate('/super-admin');
  };

  if (!profile) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {profile.first_name?.[0]}{profile.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium">{profile.first_name} {profile.last_name}</p>
              <p className="w-[200px] truncate text-sm text-slate-500">
                {profile.email}
              </p>
            </div>
          </div>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setProfileDialogOpen(true)}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setPreferencesDialogOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Preferences</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setTicketsDialogOpen(true)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Support Tickets</span>
          </DropdownMenuItem>
          
          {profile.role === 'super_admin' && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSuperAdminPortal}>
                <Shield className="mr-2 h-4 w-4 text-red-400" />
                <span className="text-red-400">Super Admin Portal</span>
              </DropdownMenuItem>
            </>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileSettingsDialog 
        open={profileDialogOpen} 
        onOpenChange={setProfileDialogOpen}
      />
      
      <PreferencesDialog 
        open={preferencesDialogOpen} 
        onOpenChange={setPreferencesDialogOpen}
      />

      <Dialog open={ticketsDialogOpen} onOpenChange={setTicketsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Support Tickets</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            <UserTickets />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserProfile;
