
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDomainCheck } from '@/hooks/useDomainCheck';
import DomainCheckError from './DomainCheckError';
import DomainInputField from './DomainInputField';

interface SignupFormDomainCheckProps {
  onDomainVerified: (domain: string, isFirstUser: boolean) => void;
  onSwitchToLogin: () => void;
}

const SignupFormDomainCheck: React.FC<SignupFormDomainCheckProps> = ({
  onDomainVerified,
  onSwitchToLogin
}) => {
  const [domain, setDomain] = useState('');
  const { loading, error, setError, checkDomain } = useDomainCheck();

  const handleDomainCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { isAvailable, isFirstUser } = await checkDomain(domain);
    
    if (isAvailable) {
      onDomainVerified(domain, isFirstUser);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Enter Company Domain</h2>
        <p className="text-gray-400">We'll check if your company is already registered</p>
      </div>

      <form onSubmit={handleDomainCheck} className="space-y-4">
        <DomainCheckError error={error} onSwitchToLogin={onSwitchToLogin} />

        <DomainInputField
          domain={domain}
          onChange={(e) => setDomain(e.target.value)}
          disabled={loading}
        />

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
