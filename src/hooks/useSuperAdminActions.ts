
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSuperAdminActions = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createTenant = async (tenantData: {
    name: string;
    company_name: string;
    domain?: string;
  }) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('tenants')
        .insert([{
          name: tenantData.name,
          company_name: tenantData.company_name,
          domain: tenantData.domain,
          slug: tenantData.name.toLowerCase().replace(/\s+/g, '-'),
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "New client created successfully",
      });

      return data;
    } catch (error: any) {
      console.error('Error creating tenant:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create client",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleTenantStatus = async (tenantId: string, isActive: boolean) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('tenants')
        .update({ is_active: !isActive })
        .eq('id', tenantId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Client ${!isActive ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error: any) {
      console.error('Error updating tenant status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update client status",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createTenant,
    toggleTenantStatus,
    loading,
  };
};
