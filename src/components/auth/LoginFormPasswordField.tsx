
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface LoginFormPasswordFieldProps {
  password: string;
  showPassword: boolean;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePassword: () => void;
  validationErrors: string[];
  loading: boolean;
}

const LoginFormPasswordField: React.FC<LoginFormPasswordFieldProps> = ({
  password,
  showPassword,
  onPasswordChange,
  onTogglePassword,
  validationErrors,
  loading
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="password" className="text-gray-200 text-sm font-medium">
        Password
      </Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={password}
          onChange={onPasswordChange}
          required
          disabled={loading}
          maxLength={128}
          autoComplete="current-password"
          className="pl-10 pr-10 bg-gray-800/80 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20 transition-colors"
        />
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
          disabled={loading}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
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

export default LoginFormPasswordField;
