
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import TenantTableRow from './TenantTableRow';

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

interface TenantTableProps {
  tenants: TenantDetails[];
}

const TenantTable: React.FC<TenantTableProps> = ({ tenants }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-slate-700">
          <TableHead className="text-slate-300">Client</TableHead>
          <TableHead className="text-slate-300">Status</TableHead>
          <TableHead className="text-slate-300">Users</TableHead>
          <TableHead className="text-slate-300">Data Sources</TableHead>
          <TableHead className="text-slate-300">Health Score</TableHead>
          <TableHead className="text-slate-300">Open Tickets</TableHead>
          <TableHead className="text-slate-300">Last Activity</TableHead>
          <TableHead className="text-slate-300">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tenants.map((tenant) => (
          <TenantTableRow key={tenant.tenant_id} tenant={tenant} />
        ))}
      </TableBody>
    </Table>
  );
};

export default TenantTable;
