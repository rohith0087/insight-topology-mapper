
export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'es' | 'fr' | 'de';
  notifications: {
    email: boolean;
    browser: boolean;
    security: boolean;
  };
  dashboard: {
    autoRefresh: boolean;
    refreshInterval: number;
    defaultView: 'topology' | 'analytics' | 'monitoring';
  };
  privacy: {
    shareUsageData: boolean;
    profileVisibility: 'public' | 'private';
  };
}

export interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  company_name?: string;
  phone?: string;
  bio?: string;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  theme: 'dark',
  language: 'en',
  notifications: {
    email: true,
    browser: true,
    security: true,
  },
  dashboard: {
    autoRefresh: true,
    refreshInterval: 30,
    defaultView: 'topology',
  },
  privacy: {
    shareUsageData: false,
    profileVisibility: 'private',
  },
};
