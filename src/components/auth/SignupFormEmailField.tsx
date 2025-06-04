
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';

interface SignupFormEmailFieldProps {
  email: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  validationErrors: string[];
  isFirstUser: boolean;
}

const SignupFormEmailField: React.FC<SignupFormEmailFieldProps> = ({
  email,
  onChange,
  loading,
  validationErrors,
  isFirstUser
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email" className="text-slate-200">Work Email</Label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your work email"
          value={email}
          onChange={onChange}
          required
          disabled={loading}
          maxLength={254}
          autoComplete="email"
          className="pl-10 bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
        />
      </div>
      {validationErrors.length > 0 && (
        <div className="text-red-400 text-xs">
          {validationErrors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
      <p className="text-xs text-slate-400">
        Please use your work email address (not Gmail, Outlook, etc.)
        {email && !isFirstUser && (
          <span className="text-yellow-400 block mt-1">
            Note: Other users from your company domain already exist in the system.
          </span>
        )}
      </p>
    </div>
  );
};

export default SignupFormEmailField;
