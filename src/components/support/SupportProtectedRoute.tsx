
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSupportAuth } from '@/contexts/SupportAuthContext';

interface SupportProtectedRouteProps {
  children: React.ReactNode;
}

const SupportProtectedRoute: React.FC<SupportProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useSupportAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/support-login" replace />;
  }

  return <>{children}</>;
};

export default SupportProtectedRoute;
