
import React, { createContext, useContext } from 'react';
import { AuthContextType } from '@/types/auth';
import { useAuthState } from '@/hooks/useAuthState';
import { signUp, signIn, signOut, resetPassword } from '@/utils/authActions';
import { createPermissionHelpers } from '@/utils/authPermissions';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, session, loading } = useAuthState();
  const { hasRole, isTenantAdmin, isNetworkAdmin, canManageUsers } = createPermissionHelpers(profile);

  // Add console logs to ensure proper function mapping
  const handleSignUp = async (email: string, password: string, firstName?: string, lastName?: string, companyName?: string) => {
    console.log('AuthContext: handleSignUp called');
    return await signUp(email, password, firstName, lastName, companyName);
  };

  const handleSignIn = async (email: string, password: string) => {
    console.log('AuthContext: handleSignIn called');
    return await signIn(email, password);
  };

  const handleSignOut = async () => {
    console.log('AuthContext: handleSignOut called');
    return await signOut();
  };

  const handleResetPassword = async (email: string) => {
    console.log('AuthContext: handleResetPassword called');
    return await resetPassword(email);
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    hasRole,
    isTenantAdmin,
    isNetworkAdmin,
    canManageUsers
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
