
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SupportUser {
  id: string;
  username: string;
  role: 'support_admin';
}

interface SupportAuthContextType {
  user: SupportUser | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<{ error: any }>;
  signOut: () => void;
}

const SupportAuthContext = createContext<SupportAuthContextType | undefined>(undefined);

export const useSupportAuth = () => {
  const context = useContext(SupportAuthContext);
  if (context === undefined) {
    throw new Error('useSupportAuth must be used within a SupportAuthProvider');
  }
  return context;
};

// Default credentials - in production, these should be stored securely
const DEFAULT_CREDENTIALS = {
  username: 'support_admin',
  password: 'LumenNet2024!'
};

export const SupportAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupportUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in via localStorage
    const savedUser = localStorage.getItem('support_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('support_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (username: string, password: string) => {
    // Simple authentication check - in production, this would hit a secure API
    if (username === DEFAULT_CREDENTIALS.username && password === DEFAULT_CREDENTIALS.password) {
      const supportUser: SupportUser = {
        id: 'support_admin_001',
        username: username,
        role: 'support_admin'
      };
      
      setUser(supportUser);
      localStorage.setItem('support_user', JSON.stringify(supportUser));
      
      return { error: null };
    } else {
      return { error: { message: 'Invalid credentials' } };
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('support_user');
  };

  const value = {
    user,
    loading,
    signIn,
    signOut
  };

  return (
    <SupportAuthContext.Provider value={value}>
      {children}
    </SupportAuthContext.Provider>
  );
};
