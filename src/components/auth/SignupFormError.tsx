
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

interface SignupFormErrorProps {
  error: string;
}

const SignupFormError: React.FC<SignupFormErrorProps> = ({ error }) => {
  if (!error) return null;

  return (
    <Alert className="border-red-500/50 bg-red-950/50 text-red-100">
      <Shield className="w-4 h-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};

export default SignupFormError;
