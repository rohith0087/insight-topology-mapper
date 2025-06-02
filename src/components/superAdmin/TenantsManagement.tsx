
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import TenantActions from './tenants/TenantActions';
import TenantFilters from './tenants/TenantFilters';
import TenantTable from './tenants/TenantTable';
import TenantLoadingState from './tenants/TenantLoadingState';

interface TenantDetails {
  tenant_id: string;
  tenant_name: string;
  tenant_slug: string;
  company_name: string;
  domain: string;
  is_active: boolean;
  user_count: number;
  data_source_count: number;
  last_activity: string;
  health_score: number;
  open_tickets: number;
}

const TenantsManagement = () => {
  const [tenants, setTenants] = useState<TenantDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_tenant_details_with_health');
      
      if (error) throw error;
      
      setTenants(data || []);
    } catch (error: any) {
      console.error('Error fetching tenants:', error);
      toast({
        title: "Error",
        description: "Failed to fetch client data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const filteredTenants = tenants.filter(tenant =>
    tenant.tenant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.domain?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = () => {
    // TODO: Implement add client functionality
    toast({
      title: "Coming Soon",
      description: "Add client functionality will be implemented soon",
    });
  };

  if (loading) {
    return <TenantLoadingState />;
  }

  return (
    <div className="p-6 space-y-6">
      <TenantActions onAddClient={handleAddClient} />

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">All Clients ({filteredTenants.length})</CardTitle>
            <TenantFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>
        </CardHeader>
        <CardContent>
          <TenantTable tenants={filteredTenants} />
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantsManagement;
