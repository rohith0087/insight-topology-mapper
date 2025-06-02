
import React from 'react';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useTheme } from '@/contexts/ThemeContext';
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
  const { effectiveTheme } = useTheme();

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
        <DialogContent className="sm:max-w-[600px] app-panel-bg border-app-border">
          <div className="flex items-center justify-center p-8">
            <div className="app-text-secondary">Loading preferences...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] app-panel-bg border-app-border max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="app-text-primary">Preferences</DialogTitle>
          <DialogDescription className="app-text-muted">
            Customize your application experience and settings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Theme Settings */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium app-text-primary">Appearance</h3>
            <div className="space-y-2">
              <Label className="app-text-secondary">Theme</Label>
              <Select value={settings.theme} onValueChange={handleThemeChange}>
                <SelectTrigger className="app-bg border-app-border app-text-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="app-panel-bg border-app-border">
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs app-text-muted">
                Current: {effectiveTheme === 'light' ? 'Light Mode' : 'Dark Mode'}
              </p>
            </div>
            <div className="space-y-2">
              <Label className="app-text-secondary">Language</Label>
              <Select value={settings.language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="app-bg border-app-border app-text-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="app-panel-bg border-app-border">
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
            <h3 className="text-lg font-medium app-text-primary">Notifications</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="app-text-secondary">Email Notifications</Label>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="app-text-secondary">Browser Notifications</Label>
                <Switch
                  checked={settings.notifications.browser}
                  onCheckedChange={(checked) => handleNotificationChange('browser', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="app-text-secondary">Security Alerts</Label>
                <Switch
                  checked={settings.notifications.security}
                  onCheckedChange={(checked) => handleNotificationChange('security', checked)}
                />
              </div>
            </div>
          </div>

          {/* Dashboard Settings */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium app-text-primary">Dashboard</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="app-text-secondary">Auto Refresh</Label>
                <Switch
                  checked={settings.dashboard.autoRefresh}
                  onCheckedChange={(checked) => handleDashboardChange('autoRefresh', checked)}
                />
              </div>
              <div className="space-y-2">
                <Label className="app-text-secondary">
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
                <Label className="app-text-secondary">Default View</Label>
                <Select
                  value={settings.dashboard.defaultView}
                  onValueChange={(value) => handleDashboardChange('defaultView', value)}
                >
                  <SelectTrigger className="app-bg border-app-border app-text-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="app-panel-bg border-app-border">
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
            <h3 className="text-lg font-medium app-text-primary">Privacy</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="app-text-secondary">Share Usage Data</Label>
                <Switch
                  checked={settings.privacy.shareUsageData}
                  onCheckedChange={(checked) => handlePrivacyChange('shareUsageData', checked)}
                />
              </div>
              <div className="space-y-2">
                <Label className="app-text-secondary">Profile Visibility</Label>
                <Select
                  value={settings.privacy.profileVisibility}
                  onValueChange={(value) => handlePrivacyChange('profileVisibility', value)}
                >
                  <SelectTrigger className="app-bg border-app-border app-text-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="app-panel-bg border-app-border">
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
            className="app-accent-bg hover:app-accent-hover text-white"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreferencesDialog;
