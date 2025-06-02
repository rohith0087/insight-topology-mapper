
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Database, Calendar, Activity, AlertTriangle } from 'lucide-react';

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

interface TenantDetailsDialogProps {
  tenant: TenantDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TenantDetailsDialog: React.FC<TenantDetailsDialogProps> = ({ tenant, open, onOpenChange }) => {
  if (!tenant) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Building2 className="w-5 h-5 mr-2" />
            {tenant.tenant_name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Organization Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400">Company Name</label>
                  <p className="text-white">{tenant.company_name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Domain</label>
                  <p className="text-white">{tenant.domain || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Slug</label>
                  <p className="text-white">{tenant.tenant_slug}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Status</label>
                  <div className="mt-1">
                    <Badge variant={tenant.is_active ? "default" : "destructive"}>
                      {tenant.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{tenant.user_count}</p>
                    <p className="text-xs text-slate-400">Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-green-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{tenant.data_source_count}</p>
                    <p className="text-xs text-slate-400">Data Sources</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{tenant.health_score}%</p>
                    <p className="text-xs text-slate-400">Health Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{tenant.open_tickets}</p>
                    <p className="text-xs text-slate-400">Open Tickets</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity */}
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="text-sm text-slate-400">Last Activity</label>
                <p className="text-white">{new Date(tenant.last_activity).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TenantDetailsDialog;
