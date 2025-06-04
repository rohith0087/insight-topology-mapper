
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SupportUser {
  id: string;
  username: string;
  role: 'super_super_admin';
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

// Security utilities
const sanitizeInput = (input: string): string => {
  // Remove dangerous characters that could be used for injection attacks
  return input
    .replace(/[<>]/g, '') // Remove HTML/XML tags
    .replace(/['"`;\\]/g, '') // Remove quotes, semicolons, backslashes
    .replace(/\.\./g, '') // Remove directory traversal patterns
    .replace(/[/\\]/g, '') // Remove path separators
    .replace(/\0/g, '') // Remove null bytes
    .replace(/\r?\n/g, '') // Remove line breaks
    .trim();
};

const validateCredentials = (username: string, password: string): boolean => {
  // Strict validation rules
  if (!username || !password) return false;
  if (username.length < 3 || username.length > 50) return false;
  if (password.length < 8 || password.length > 128) return false;
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /union\s+select/i,
    /drop\s+table/i,
    /delete\s+from/i,
    /insert\s+into/i,
    /update\s+set/i,
    /exec\s*\(/i,
    /script/i,
    /javascript/i,
    /vbscript/i,
    /onload/i,
    /onerror/i,
    /\.\.\/|\.\.\\/, // Directory traversal
    /%2e%2e%2f|%2e%2e%5c/, // URL encoded directory traversal
    /\x00/g, // Null bytes
  ];
  
  const combinedInput = (username + password).toLowerCase();
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(combinedInput)) {
      console.warn('Suspicious input detected:', pattern);
      return false;
    }
  }
  
  return true;
};

export const SupportAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupportUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in via sessionStorage
    const savedUser = sessionStorage.getItem('support_user_session');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Validate the stored session
        if (parsedUser.id && parsedUser.username && parsedUser.role === 'super_super_admin') {
          setUser(parsedUser);
        } else {
          sessionStorage.removeItem('support_user_session');
        }
      } catch (error) {
        console.warn('Invalid session data detected');
        sessionStorage.removeItem('support_user_session');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      // Sanitize inputs
      const sanitizedUsername = sanitizeInput(username);
      const sanitizedPassword = sanitizeInput(password);
      
      // Validate credentials format
      if (!validateCredentials(sanitizedUsername, sanitizedPassword)) {
        return { error: { message: 'Invalid credentials format' } };
      }
      
      // Rate limiting simulation (in production, this would be server-side)
      const lastAttempt = localStorage.getItem('last_support_login_attempt');
      const now = Date.now();
      if (lastAttempt && now - parseInt(lastAttempt) < 3000) {
        return { error: { message: 'Too many attempts. Please wait.' } };
      }
      localStorage.setItem('last_support_login_attempt', now.toString());
      
      // Call the validation edge function
      const { data, error } = await supabase.functions.invoke('validate-support-login', {
        body: {
          username: sanitizedUsername,
          password: sanitizedPassword
        }
      });

      if (error) {
        console.error('Support authentication error:', error);
        return { error: { message: 'Authentication system error' } };
      }

      if (data.success && data.admin) {
        const supportUser: SupportUser = {
          id: data.admin.id,
          username: data.admin.username,
          role: 'super_super_admin'
        };
        
        setUser(supportUser);
        // Use sessionStorage for better security
        sessionStorage.setItem('support_user_session', JSON.stringify(supportUser));
        
        // Clear rate limiting
        localStorage.removeItem('last_support_login_attempt');
        
        return { error: null };
      } else {
        return { error: { message: data.error || 'Authentication failed' } };
      }
    } catch (error) {
      console.error('Authentication error:', error);
      return { error: { message: 'Authentication system error' } };
    }
  };

  const signOut = () => {
    setUser(null);
    sessionStorage.removeItem('support_user_session');
    localStorage.removeItem('last_support_login_attempt');
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
