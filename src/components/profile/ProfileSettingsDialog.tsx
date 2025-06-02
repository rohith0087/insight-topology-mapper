
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ProfileData } from '@/types/userSettings';

interface ProfileSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileSettingsDialog: React.FC<ProfileSettingsDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    email: '',
    role: '',
    company_name: '',
    phone: '',
    bio: '',
  });

  useEffect(() => {
    if (profile && user) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email,
        role: profile.role,
        company_name: '',
        phone: '',
        bio: '',
      });
    }
  }, [profile, user]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          metadata: {
            company_name: formData.company_name,
            phone: formData.phone,
            bio: formData.bio,
          },
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">Profile Settings</DialogTitle>
          <DialogDescription className="text-slate-400">
            Update your personal information and profile details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-slate-300">
                First Name
              </Label>
              <Input
                id="firstName"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                className="bg-slate-900 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-slate-300">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                className="bg-slate-900 border-slate-600 text-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-slate-300">
              Email
            </Label>
            <Input
              id="email"
              value={formData.email}
              disabled
              className="bg-slate-900 border-slate-600 text-slate-400"
            />
          </div>

          <div>
            <Label htmlFor="company" className="text-slate-300">
              Company
            </Label>
            <Input
              id="company"
              value={formData.company_name}
              onChange={(e) => handleInputChange('company_name', e.target.value)}
              className="bg-slate-900 border-slate-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-slate-300">
              Phone
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="bg-slate-900 border-slate-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="bio" className="text-slate-300">
              Bio
            </Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="bg-slate-900 border-slate-600 text-white resize-none"
              rows={3}
              placeholder="Tell us a bit about yourself..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveProfile}
            disabled={loading}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSettingsDialog;
