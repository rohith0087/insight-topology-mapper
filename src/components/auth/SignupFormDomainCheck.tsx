
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
    
    if (!domain.trim()) {
      setError('Please enter your company domain');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Convert domain to slug format (replace . with -)
      const slug = domain.toLowerCase().replace(/\./g, '-');
      
      // Check if tenant already exists with this slug
      const { data: existingTenant, error } = await supabase
        .from('tenants')
        .select('id, name, is_active')
        .eq('slug', slug)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking tenant:', error);
        setError('Unable to verify domain. Please try again.');
        setLoading(false);
        return;
      }

      if (existingTenant) {
        // Tenant exists, show error and redirect to login
        setError('An administrator account has already been created for this company domain. Please contact your administrator or sign in with your existing account.');
        setLoading(false);
        return;
      }

      // Domain is available, proceed with signup
      onDomainVerified(domain, true);
    } catch (error) {
      console.error('Domain check error:', error);
      setError('Unable to verify domain. Please try again.');
    }
    
    setLoading(false);
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
