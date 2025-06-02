
import React, { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Users, MessageSquare, Power } from 'lucide-react';
import { useSuperAdminActions } from '@/hooks/useSuperAdminActions';
import { useToast } from '@/hooks/use-toast';
import TenantDetailsDialog from './TenantDetailsDialog';
import TenantUsersDialog from './TenantUsersDialog';
import CreateTicketDialog from './CreateTicketDialog';

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

interface TenantTableRowProps {
  tenant: TenantDetails;
}

const TenantTableRow: React.FC<TenantTableRowProps> = ({ tenant }) => {
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [usersDialogOpen, setUsersDialogOpen] = useState(false);
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const { toggleTenantStatus, loading } = useSuperAdminActions();
  const { toast } = useToast();

  const handleToggleStatus = async () => {
    try {
      await toggleTenantStatus(tenant.tenant_id, tenant.is_active);
      // The parent component should handle the refresh
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <>
      <TableRow className="border-slate-700">
        <TableCell>
          <div>
            <p className="font-medium text-white">{tenant.tenant_name}</p>
            <p className="text-sm text-slate-400">{tenant.company_name}</p>
            {tenant.domain && (
              <p className="text-xs text-slate-500">{tenant.domain}</p>
            )}
          </div>
        </TableCell>
        <TableCell>
          <Badge variant={tenant.is_active ? "default" : "destructive"}>
            {tenant.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </TableCell>
        <TableCell className="text-white">{tenant.user_count}</TableCell>
        <TableCell className="text-white">{tenant.data_source_count}</TableCell>
        <TableCell>
          <span className={`font-medium ${getHealthScoreColor(tenant.health_score)}`}>
            {tenant.health_score}%
          </span>
        </TableCell>
        <TableCell>
          {tenant.open_tickets > 0 ? (
            <Badge variant="destructive">{tenant.open_tickets}</Badge>
          ) : (
            <span className="text-slate-400">0</span>
          )}
        </TableCell>
        <TableCell className="text-slate-400">
          {new Date(tenant.last_activity).toLocaleDateString()}
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
              <DropdownMenuItem 
                onClick={() => setDetailsDialogOpen(true)}
                className="text-slate-300 hover:bg-slate-700"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setUsersDialogOpen(true)}
                className="text-slate-300 hover:bg-slate-700"
              >
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setTicketDialogOpen(true)}
                className="text-slate-300 hover:bg-slate-700"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Create Ticket
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleToggleStatus}
                disabled={loading}
                className="text-slate-300 hover:bg-slate-700"
              >
                <Power className="mr-2 h-4 w-4" />
                {tenant.is_active ? 'Deactivate' : 'Activate'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <TenantDetailsDialog
        tenant={tenant}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />

      <TenantUsersDialog
        tenant={tenant}
        open={usersDialogOpen}
        onOpenChange={setUsersDialogOpen}
      />

      <CreateTicketDialog
        tenant={tenant}
        open={ticketDialogOpen}
        onOpenChange={setTicketDialogOpen}
      />
    </>
  );
};

export default TenantTableRow;
