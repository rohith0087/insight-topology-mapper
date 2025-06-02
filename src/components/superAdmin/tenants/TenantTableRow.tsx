
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Users, Database, AlertTriangle, MoreHorizontal, Eye } from 'lucide-react';

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
  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
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
      <TableCell>
        <div className="flex items-center space-x-1">
          <Users className="w-4 h-4 text-slate-400" />
          <span className="text-white">{tenant.user_count}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-1">
          <Database className="w-4 h-4 text-slate-400" />
          <span className="text-white">{tenant.data_source_count}</span>
        </div>
      </TableCell>
      <TableCell>
        <span className={`font-medium ${getHealthColor(tenant.health_score)}`}>
          {tenant.health_score}%
        </span>
      </TableCell>
      <TableCell>
        {tenant.open_tickets > 0 ? (
          <div className="flex items-center space-x-1">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <span className="text-orange-400">{tenant.open_tickets}</span>
          </div>
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
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-slate-800 border-slate-700">
            <DropdownMenuItem className="text-slate-300 hover:bg-slate-700">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem className="text-slate-300 hover:bg-slate-700">
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </DropdownMenuItem>
            <DropdownMenuItem className="text-slate-300 hover:bg-slate-700">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Create Ticket
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default TenantTableRow;
