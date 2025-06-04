
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

interface SignupFormSuccessProps {
  success: boolean;
  isFirstUser: boolean;
}

const SignupFormSuccess: React.FC<SignupFormSuccessProps> = ({ success, isFirstUser }) => {
  if (!success) return null;

  return (
    <Alert className="border-green-500/50 bg-green-950/50 text-green-100">
      <Shield className="w-4 h-4" />
      <AlertDescription>
        Account created successfully! Please check your email to verify your account.
        {isFirstUser && (
          <span> As the first user from your company, you have been granted Super Admin privileges.</span>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default SignupFormSuccess;
