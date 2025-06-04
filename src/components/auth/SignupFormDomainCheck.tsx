
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
      const normalizedDomain = domain.toLowerCase().trim();
      console.log('Normalized domain:', normalizedDomain);
      
      // DEBUGGING: Check current auth state
      console.log('=== DEBUGGING: Auth state ===');
      const { data: authData } = await supabase.auth.getUser();
      console.log('Current auth user:', authData.user?.email || 'No user');
      
      // DEBUGGING: Check if we can access the tenants table at all
      console.log('=== DEBUGGING: Testing basic tenants table access ===');
      const { data: countData, error: countError, count } = await supabase
        .from('tenants')
        .select('*', { count: 'exact', head: true });
      
      console.log('Tenants table count:', count);
      console.log('Count error:', countError);
      
      // DEBUGGING: Try to fetch ALL tenants with different approaches
      console.log('=== DEBUGGING: Fetching ALL tenants (approach 1) ===');
      const { data: allTenants1, error: allTenantsError1 } = await supabase
        .from('tenants')
        .select('*');
      
      console.log('ALL TENANTS (approach 1):', allTenants1);
      console.log('ALL TENANTS ERROR (approach 1):', allTenantsError1);
      
      // DEBUGGING: Try with specific columns
      console.log('=== DEBUGGING: Fetching tenants with specific columns ===');
      const { data: allTenants2, error: allTenantsError2 } = await supabase
        .from('tenants')
        .select('id, name, slug, domain, is_active, created_at');
      
      console.log('ALL TENANTS (specific columns):', allTenants2);
      console.log('ALL TENANTS ERROR (specific columns):', allTenantsError2);
      
      // PRIMARY CHECK: Use domain column directly
      console.log('=== PRIMARY CHECK: Domain-based lookup ===');
      console.log('Searching for domain:', normalizedDomain);
      const { data: existingTenantsByDomain, error: domainQueryError } = await supabase
        .from('tenants')
        .select('id, name, slug, domain, is_active, created_at')
        .eq('domain', normalizedDomain);

      console.log('Domain query completed');
      console.log('Domain query error:', domainQueryError);
      console.log('Domain query data:', existingTenantsByDomain);
      console.log('Number of tenants found by domain:', existingTenantsByDomain?.length || 0);

      // SECONDARY CHECK: Also check slug for backward compatibility
      const slug = normalizedDomain.replace(/\./g, '-');
      console.log('=== SECONDARY CHECK: Slug-based lookup ===');
      console.log('Searching for slug:', slug);
      const { data: existingTenantsBySlug, error: slugQueryError } = await supabase
        .from('tenants')
        .select('id, name, slug, domain, is_active, created_at')
        .eq('slug', slug);

      console.log('Slug query completed');
      console.log('Slug query error:', slugQueryError);
      console.log('Slug query data:', existingTenantsBySlug);
      console.log('Number of tenants found by slug:', existingTenantsBySlug?.length || 0);

      // Check for any errors
      if (domainQueryError) {
        console.error('Domain query error details:', {
          code: domainQueryError.code,
          message: domainQueryError.message,
          details: domainQueryError.details,
          hint: domainQueryError.hint
        });
      }
      
      if (slugQueryError) {
        console.error('Slug query error details:', {
          code: slugQueryError.code,
          message: slugQueryError.message,
          details: slugQueryError.details,
          hint: slugQueryError.hint
        });
      }

      // If there are any query errors, show user-friendly message
      if (domainQueryError || slugQueryError) {
        setError('Unable to verify domain. Please try again.');
        setLoading(false);
        return;
      }

      // Combine results - prioritize domain match over slug match
      const foundTenants = existingTenantsByDomain && existingTenantsByDomain.length > 0 
        ? existingTenantsByDomain 
        : existingTenantsBySlug || [];

      console.log('=== FINAL DECISION ===');
      console.log('Combined found tenants:', foundTenants);
      console.log('Total tenants found:', foundTenants.length);

      if (foundTenants && foundTenants.length > 0) {
        const existingTenant = foundTenants[0];
        console.log('Found existing tenant:', existingTenant);
        console.log('Tenant is active:', existingTenant.is_active);
        
        // Tenant exists, show error and DO NOT proceed
        setError('An administrator account has already been created for this company domain. Please contact your administrator or sign in with your existing account.');
        setLoading(false);
        console.log('=== BLOCKING SIGNUP - TENANT EXISTS ===');
        // IMPORTANT: Return here to prevent calling onDomainVerified
        return;
      }

      console.log('No existing tenant found for domain:', normalizedDomain);
      console.log('No existing tenant found for slug:', slug);
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
