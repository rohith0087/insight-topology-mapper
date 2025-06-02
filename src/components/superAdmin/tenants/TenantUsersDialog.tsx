
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, Mail, Calendar, Shield } from 'lucide-react';

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

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  last_login: string;
  created_at: string;
}

interface TenantUsersDialogProps {
  tenant: TenantDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TenantUsersDialog: React.FC<TenantUsersDialogProps> = ({ tenant, open, onOpenChange }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (tenant && open) {
      fetchTenantUsers();
    }
  }, [tenant, open]);

  const fetchTenantUsers = async () => {
    if (!tenant) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('tenant_id', tenant.tenant_id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching tenant users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tenant users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-600';
      case 'tenant_admin': return 'bg-purple-600';
      case 'network_admin': return 'bg-blue-600';
      case 'analyst': return 'bg-green-600';
      case 'viewer': return 'bg-slate-600';
      default: return 'bg-slate-600';
    }
  };

  if (!tenant) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Users - {tenant.tenant_name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-700 rounded"></div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">User</TableHead>
                  <TableHead className="text-slate-300">Role</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Last Login</TableHead>
                  <TableHead className="text-slate-300">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="border-slate-700">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-slate-600 rounded-full">
                          <Mail className="w-4 h-4 text-slate-300" />
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {user.first_name && user.last_name 
                              ? `${user.first_name} ${user.last_name}`
                              : 'N/A'
                            }
                          </p>
                          <p className="text-sm text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        <Shield className="w-3 h-3 mr-1" />
                        {user.role?.replace('_', ' ') || 'viewer'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? "default" : "destructive"}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {user.last_login 
                        ? new Date(user.last_login).toLocaleDateString()
                        : 'Never'
                      }
                    </TableCell>
                    <TableCell className="text-slate-300">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(user.created_at).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {!loading && users.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No users found for this tenant</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TenantUsersDialog;
