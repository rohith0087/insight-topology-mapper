
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Building, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SignupFormDomainCheckProps {
  onDomainVerified: (domain: string, isFirstUser: boolean) => void;
  onSwitchToLogin: () => void;
}

const SignupFormDomainCheck: React.FC<SignupFormDomainCheckProps> = ({
  onDomainVerified,
  onSwitchToLogin
}) => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDomainCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== DOMAIN CHECK STARTED ===');
    console.log('Original domain input:', domain);
    
    if (!domain.trim()) {
      console.log('ERROR: Empty domain provided');
      setError('Please enter your company domain');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Convert domain to slug format (replace . with -)
      const slug = domain.toLowerCase().replace(/\./g, '-');
      console.log('Converted slug:', slug);
      
      // DEBUGGING: First, let's see ALL tenants to understand what's in the database
      console.log('=== DEBUGGING: Fetching ALL tenants ===');
      const { data: allTenants, error: allTenantsError } = await supabase
        .from('tenants')
        .select('id, name, slug, domain, is_active');
      
      console.log('ALL TENANTS:', allTenants);
      console.log('ALL TENANTS ERROR:', allTenantsError);
      
      // DEBUGGING: Check by domain directly
      console.log('=== DEBUGGING: Checking by domain directly ===');
      const { data: tenantsByDomain, error: domainError } = await supabase
        .from('tenants')
        .select('id, name, slug, domain, is_active')
        .eq('domain', domain.toLowerCase());
      
      console.log('TENANTS BY DOMAIN:', tenantsByDomain);
      console.log('DOMAIN ERROR:', domainError);
      
      // Original slug check
      console.log('=== ORIGINAL SLUG CHECK ===');
      console.log('About to query tenants table with slug:', slug);
      const { data: existingTenants, error } = await supabase
        .from('tenants')
        .select('id, name, is_active, slug, domain')
        .eq('slug', slug);

      console.log('Supabase query completed');
      console.log('Query error:', error);
      console.log('Query data:', existingTenants);
      console.log('Number of tenants found:', existingTenants?.length || 0);

      if (error) {
        console.error('Supabase query error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        setError('Unable to verify domain. Please try again.');
        setLoading(false);
        return;
      }

      // Check if any tenants were found (by slug OR by domain)
      const foundTenants = existingTenants || tenantsByDomain || [];
      if (foundTenants && foundTenants.length > 0) {
        const existingTenant = foundTenants[0]; // Get the first tenant
        console.log('Found existing tenant:', existingTenant);
        console.log('Tenant is active:', existingTenant.is_active);
        
        // Tenant exists, show error and DO NOT proceed
        setError('An administrator account has already been created for this company domain. Please contact your administrator or sign in with your existing account.');
        setLoading(false);
        console.log('=== BLOCKING SIGNUP - TENANT EXISTS ===');
        // IMPORTANT: Return here to prevent calling onDomainVerified
        return;
      }

      console.log('No existing tenant found for slug:', slug);
      console.log('No existing tenant found for domain:', domain.toLowerCase());
      console.log('=== PROCEEDING WITH SIGNUP ===');
      // Domain is available, proceed with signup
      onDomainVerified(domain, true);
    } catch (error) {
      console.error('Domain check catch block error:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack available');
      setError('Unable to verify domain. Please try again.');
    }
    
    setLoading(false);
    console.log('=== DOMAIN CHECK COMPLETED ===');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Enter Company Domain</h2>
        <p className="text-gray-400">We'll check if your company is already registered</p>
      </div>

      <form onSubmit={handleDomainCheck} className="space-y-4">
        {error && (
          <div className="bg-red-950/50 border border-red-500/50 rounded-md p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-100 text-sm">{error}</p>
                {error.includes('administrator account has already been created') && (
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="mt-2 text-cyan-400 hover:text-cyan-300 underline text-sm"
                  >
                    Go to Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="domain" className="text-slate-200">Company Domain</Label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              id="domain"
              name="domain"
              type="text"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
              disabled={loading}
              className="pl-10 bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>
          <p className="text-xs text-gray-500">
            Enter your company's email domain (e.g., auburn.edu, company.com)
          </p>
        </div>

        <Button
          type="submit"
          disabled={loading || !domain.trim()}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Continue'}
        </Button>

        <div className="text-center">
          <div className="text-sm text-gray-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
              disabled={loading}
            >
              Sign in
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignupFormDomainCheck;
