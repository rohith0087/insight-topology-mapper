
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserSettings, DEFAULT_USER_SETTINGS } from '@/types/userSettings';

export const useUserSettings = () => {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase.rpc('get_user_setting', {
        p_settings_key: 'user_preferences'
      });

      if (error) throw error;

      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        setSettings({ ...DEFAULT_USER_SETTINGS, ...data });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error",
        description: "Failed to load user settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      const { error } = await supabase.rpc('upsert_user_setting', {
        p_settings_key: 'user_preferences',
        p_settings_value: updatedSettings
      });

      if (error) throw error;

      setSettings(updatedSettings);
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    }
  };

  return {
    settings,
    loading,
    updateSettings,
    refreshSettings: loadSettings,
  };
};
