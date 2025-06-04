
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Shield } from 'lucide-react';

interface LoginFormSubmitButtonProps {
  loading: boolean;
  attempts: number;
}

const LoginFormSubmitButton: React.FC<LoginFormSubmitButtonProps> = ({ loading, attempts }) => {
  return (
    <Button
      type="submit"
      disabled={loading || attempts >= 5}
      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium py-2.5 transition-all shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Authenticating...
        </>
      ) : (
        <>
          <Shield className="w-4 h-4 mr-2" />
          Secure Sign In
        </>
      )}
    </Button>
  );
};

export default LoginFormSubmitButton;
