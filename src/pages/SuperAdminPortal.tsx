
import React from 'react';
import SuperAdminDashboard from '../components/superAdmin/SuperAdminDashboard';
import { useAuth } from '@/contexts/AuthContext';

const SuperAdminPortal = () => {
  const { profile } = useAuth();

  // Only super admins can access this portal
  if (profile?.role !== 'super_admin') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h1>
          <p className="text-slate-400">Super admin privileges required to access this portal.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <SuperAdminDashboard />
    </div>
  );
};

export default SuperAdminPortal;
