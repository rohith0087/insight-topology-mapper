
import { Database } from '@/integrations/supabase/types';

export type UserRole = Database['public']['Enums']['user_role'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Invitation = Database['public']['Tables']['user_invitations']['Row'];

export const roleDescriptions = {
  viewer: {
    title: "Viewer",
    description: "Read-only access to network topology and monitoring data",
    permissions: ["View network topology", "View monitoring data", "Export reports"]
  },
  analyst: {
    title: "Analyst", 
    description: "Advanced analysis capabilities with limited configuration access",
    permissions: ["All Viewer permissions", "Create custom filters", "Advanced analytics", "Incident investigation"]
  },
  network_admin: {
    title: "Network Admin",
    description: "Full network management with data source configuration",
    permissions: ["All Analyst permissions", "Configure data sources", "Manage network settings", "Modify topology"]
  },
  tenant_admin: {
    title: "Tenant Admin",
    description: "Complete administrative access including user management",
    permissions: ["All Network Admin permissions", "Manage users and roles", "Organization settings", "Billing management"]
  }
};

export const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'super_admin':
      return 'bg-purple-600 text-white';
    case 'tenant_admin':
      return 'bg-blue-600 text-white';
    case 'network_admin':
      return 'bg-green-600 text-white';
    case 'analyst':
      return 'bg-yellow-600 text-white';
    case 'viewer':
      return 'bg-gray-600 text-white';
    default:
      return 'bg-gray-600 text-white';
  }
};

export const formatRole = (role: string) => {
  return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};
