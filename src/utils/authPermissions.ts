
import { UserRole, Profile } from '@/types/auth';

export const createPermissionHelpers = (profile: Profile | null) => {
  const hasRole = (role: UserRole): boolean => {
    return profile?.role === role;
  };

  const isTenantAdmin = hasRole('tenant_admin') || hasRole('super_admin');
  const isNetworkAdmin = hasRole('network_admin') || isTenantAdmin;
  const canManageUsers = hasRole('tenant_admin') || hasRole('super_admin');

  return {
    hasRole,
    isTenantAdmin,
    isNetworkAdmin,
    canManageUsers
  };
};
