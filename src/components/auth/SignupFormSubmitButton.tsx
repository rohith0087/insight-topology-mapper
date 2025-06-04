
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Shield } from 'lucide-react';

interface SignupFormSubmitButtonProps {
  loading: boolean;
}

const SignupFormSubmitButton: React.FC<SignupFormSubmitButtonProps> = ({ loading }) => {
  return (
    <Button
      type="submit"
      disabled={loading}
      className="w-full bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Creating secure account...
        </>
      ) : (
        <>
          <Shield className="w-4 h-4 mr-2" />
          Create Secure Company Account
        </>
      )}
    </Button>
  );
};

export default SignupFormSubmitButton;
