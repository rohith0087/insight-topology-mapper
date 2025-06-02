
import React from 'react';
import { useUserSettings } from '@/hooks/useUserSettings';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface PreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PreferencesDialog: React.FC<PreferencesDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { settings, loading, updateSettings } = useUserSettings();

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updateSettings({ theme });
  };

  const handleLanguageChange = (language: 'en' | 'es' | 'fr' | 'de') => {
    updateSettings({ language });
  };

  const handleNotificationChange = (key: keyof typeof settings.notifications, value: boolean) => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        [key]: value,
      },
    });
  };

  const handleDashboardChange = (key: keyof typeof settings.dashboard, value: any) => {
    updateSettings({
      dashboard: {
        ...settings.dashboard,
        [key]: value,
      },
    });
  };

  const handlePrivacyChange = (key: keyof typeof settings.privacy, value: any) => {
    updateSettings({
      privacy: {
        ...settings.privacy,
        [key]: value,
      },
    });
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] bg-slate-800 border-slate-700">
          <div className="flex items-center justify-center p-8">
            <div className="text-slate-300">Loading preferences...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-slate-800 border-slate-700 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Preferences</DialogTitle>
          <DialogDescription className="text-slate-400">
            Customize your application experience and settings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Theme Settings */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white">Appearance</h3>
            <div className="space-y-2">
              <Label className="text-slate-300">Theme</Label>
              <Select value={settings.theme} onValueChange={handleThemeChange}>
                <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Language</Label>
              <Select value={settings.language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white">Notifications</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Email Notifications</Label>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Browser Notifications</Label>
                <Switch
                  checked={settings.notifications.browser}
                  onCheckedChange={(checked) => handleNotificationChange('browser', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Security Alerts</Label>
                <Switch
                  checked={settings.notifications.security}
                  onCheckedChange={(checked) => handleNotificationChange('security', checked)}
                />
              </div>
            </div>
          </div>

          {/* Dashboard Settings */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white">Dashboard</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Auto Refresh</Label>
                <Switch
                  checked={settings.dashboard.autoRefresh}
                  onCheckedChange={(checked) => handleDashboardChange('autoRefresh', checked)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">
                  Refresh Interval: {settings.dashboard.refreshInterval}s
                </Label>
                <Slider
                  value={[settings.dashboard.refreshInterval]}
                  onValueChange={([value]) => handleDashboardChange('refreshInterval', value)}
                  max={300}
                  min={10}
                  step={10}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Default View</Label>
                <Select
                  value={settings.dashboard.defaultView}
                  onValueChange={(value) => handleDashboardChange('defaultView', value)}
                >
                  <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="topology">Network Topology</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                    <SelectItem value="monitoring">Monitoring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white">Privacy</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Share Usage Data</Label>
                <Switch
                  checked={settings.privacy.shareUsageData}
                  onCheckedChange={(checked) => handlePrivacyChange('shareUsageData', checked)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Profile Visibility</Label>
                <Select
                  value={settings.privacy.profileVisibility}
                  onValueChange={(value) => handlePrivacyChange('profileVisibility', value)}
                >
                  <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreferencesDialog;
