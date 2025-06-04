
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';

interface LoginFormEmailFieldProps {
  email: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validationErrors: string[];
  loading: boolean;
}

const LoginFormEmailField: React.FC<LoginFormEmailFieldProps> = ({
  email,
  onEmailChange,
  validationErrors,
  loading
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email" className="text-gray-200 text-sm font-medium">
        Email Address
      </Label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={onEmailChange}
          required
          disabled={loading}
          maxLength={254}
          autoComplete="email"
          className="pl-10 bg-gray-800/80 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20 transition-colors"
        />
      </div>
      {validationErrors.length > 0 && (
        <div className="text-red-400 text-xs">
          {validationErrors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LoginFormEmailField;
