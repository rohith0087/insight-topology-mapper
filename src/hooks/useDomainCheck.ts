
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useDomainCheck = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // List of personal email domains to block
  const personalEmailDomains = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'icloud.com',
    'aol.com',
    'live.com',
    'msn.com',
    'yandex.com',
    'protonmail.com',
    'zoho.com',
    'mail.com',
    'gmx.com',
    'fastmail.com',
    'tutanota.com',
    'mailinator.com',
    'guerrillamail.com',
    '10minutemail.com',
    'tempmail.org',
    'throwaway.email'
  ];

  const checkDomain = async (domain: string): Promise<{ isAvailable: boolean; isFirstUser: boolean }> => {
    console.log('=== DOMAIN CHECK STARTED ===');
    console.log('Domain input:', domain);
    
    if (!domain.trim()) {
      setError('Please enter your company domain');
      return { isAvailable: false, isFirstUser: false };
    }

    setLoading(true);
    setError('');

    try {
      const normalizedDomain = domain.toLowerCase().trim();
      console.log('Normalized domain:', normalizedDomain);
      
      // Check if it's a personal email domain
      if (personalEmailDomains.includes(normalizedDomain)) {
        setError('Personal email domains (Gmail, Outlook, etc.) are not allowed. Please use your company domain.');
        console.log('=== BLOCKING PERSONAL EMAIL DOMAIN ===');
        return { isAvailable: false, isFirstUser: false };
      }

      // Basic domain format validation
      const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
      if (!domainRegex.test(normalizedDomain)) {
        setError('Please enter a valid domain format (e.g., company.com)');
        return { isAvailable: false, isFirstUser: false };
      }
      
      // Check if domain already exists in tenants table
      const { data: existingTenants, error: domainQueryError } = await supabase
        .from('tenants')
        .select('id, name, domain, is_active')
        .eq('domain', normalizedDomain);

      console.log('Domain query completed');
      console.log('Domain query error:', domainQueryError);
      console.log('Domain query data:', existingTenants);

      if (domainQueryError) {
        console.error('Domain query error details:', {
          code: domainQueryError.code,
          message: domainQueryError.message,
          details: domainQueryError.details,
          hint: domainQueryError.hint
        });
        setError('Unable to verify domain. Please try again.');
        return { isAvailable: false, isFirstUser: false };
      }

      if (existingTenants && existingTenants.length > 0) {
        console.log('Found existing tenant:', existingTenants[0]);
        setError('An administrator account has already been created for this company domain. Please contact your administrator or sign in with your existing account.');
        console.log('=== BLOCKING SIGNUP - TENANT EXISTS ===');
        return { isAvailable: false, isFirstUser: false };
      }

      console.log('No existing tenant found for domain:', normalizedDomain);
      console.log('=== PROCEEDING WITH SIGNUP ===');
      return { isAvailable: true, isFirstUser: true };
    } catch (error) {
      console.error('Domain check catch block error:', error);
      setError('Unable to verify domain. Please try again.');
      return { isAvailable: false, isFirstUser: false };
    } finally {
      setLoading(false);
      console.log('=== DOMAIN CHECK COMPLETED ===');
    }
  };

  return {
    loading,
    error,
    setError,
    checkDomain
  };
};
