
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface SignupFormPasswordFieldsProps {
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  loading: boolean;
  passwordErrors: string[];
  confirmPasswordErrors: string[];
}

const SignupFormPasswordFields: React.FC<SignupFormPasswordFieldsProps> = ({
  password,
  confirmPassword,
  showPassword,
  showConfirmPassword,
  onChange,
  onTogglePassword,
  onToggleConfirmPassword,
  loading,
  passwordErrors,
  confirmPasswordErrors
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-slate-200">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={onChange}
            required
            disabled={loading}
            maxLength={128}
            autoComplete="new-password"
            className="pl-10 pr-10 bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
            disabled={loading}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {passwordErrors.length > 0 && (
          <div className="text-red-400 text-xs">
            {passwordErrors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-slate-200">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={onChange}
            required
            disabled={loading}
            maxLength={128}
            autoComplete="new-password"
            className="pl-10 pr-10 bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
          />
          <button
            type="button"
            onClick={onToggleConfirmPassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
            disabled={loading}
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {confirmPasswordErrors.length > 0 && (
          <div className="text-red-400 text-xs">
            {confirmPasswordErrors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SignupFormPasswordFields;
