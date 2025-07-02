
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Credential {
  id: string;
  credential_name: string;
  credential_type: string;
  created_at: string;
  last_used: string | null;
  is_active: boolean;
}

export const useCredentials = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCredentials = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('credential-manager', {
        body: { action: 'list' }
      });

      if (error) throw error;

      if (data?.success) {
        setCredentials(data.credentials || []);
      }
    } catch (error) {
      console.error('Error fetching credentials:', error);
      toast.error('Failed to load credentials');
    } finally {
      setLoading(false);
    }
  };

  const deleteCredential = async (credentialId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('credential-manager', {
        body: {
          action: 'delete',
          credentialId
        }
      });

      if (error) throw error;

      if (data?.success) {
        setCredentials(prev => prev.filter(cred => cred.id !== credentialId));
        toast.success('Credential deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting credential:', error);
      toast.error('Failed to delete credential');
    }
  };

  const getCredentialById = (credentialId: string): Credential | undefined => {
    return credentials.find(cred => cred.id === credentialId);
  };

  useEffect(() => {
    fetchCredentials();
  }, []);

  return {
    credentials,
    loading,
    fetchCredentials,
    deleteCredential,
    getCredentialById
  };
};
