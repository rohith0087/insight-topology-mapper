
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface HelpContextType {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isFirstTimeUser: boolean;
  userRole: string | undefined;
  helpPreferences: {
    showTooltips: boolean;
    showAdvancedTips: boolean;
    autoShowHelp: boolean;
  };
  updateHelpPreferences: (prefs: Partial<HelpContextType['helpPreferences']>) => void;
  trackHelpInteraction: (action: string, context: string) => void;
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

export const useHelp = () => {
  const context = useContext(HelpContext);
  if (!context) {
    throw new Error('useHelp must be used within a HelpProvider');
  }
  return context;
};

interface HelpProviderProps {
  children: React.ReactNode;
}

export const HelpProvider: React.FC<HelpProviderProps> = ({ children }) => {
  const { profile } = useAuth();
  const [currentPage, setCurrentPage] = useState('network-topology');
  const [helpPreferences, setHelpPreferences] = useState({
    showTooltips: true,
    showAdvancedTips: true,
    autoShowHelp: true
  });

  // Determine if user is new (created within last 7 days)
  const isFirstTimeUser = profile ? 
    new Date().getTime() - new Date(profile.created_at || '').getTime() < 7 * 24 * 60 * 60 * 1000 : 
    false;

  // Load help preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('helpPreferences');
    if (saved) {
      try {
        setHelpPreferences(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load help preferences:', error);
      }
    }
  }, []);

  const updateHelpPreferences = (prefs: Partial<typeof helpPreferences>) => {
    const updated = { ...helpPreferences, ...prefs };
    setHelpPreferences(updated);
    localStorage.setItem('helpPreferences', JSON.stringify(updated));
  };

  const trackHelpInteraction = (action: string, context: string) => {
    console.log('Help interaction:', { action, context, page: currentPage, user: profile?.id });
    // Here you could send analytics data to track help system usage
  };

  return (
    <HelpContext.Provider value={{
      currentPage,
      setCurrentPage,
      isFirstTimeUser,
      userRole: profile?.role,
      helpPreferences,
      updateHelpPreferences,
      trackHelpInteraction
    }}>
      {children}
    </HelpContext.Provider>
  );
};
