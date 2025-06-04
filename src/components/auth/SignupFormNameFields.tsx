
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { User } from 'lucide-react';

interface SignupFormNameFieldsProps {
  firstName: string;
  lastName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  firstNameErrors: string[];
  lastNameErrors: string[];
}

const SignupFormNameFields: React.FC<SignupFormNameFieldsProps> = ({
  firstName,
  lastName,
  onChange,
  loading,
  firstNameErrors,
  lastNameErrors
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="firstName" className="text-slate-200">First Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={onChange}
            disabled={loading}
            required
            maxLength={50}
            autoComplete="given-name"
            className="pl-10 bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
          />
        </div>
        {firstNameErrors.length > 0 && (
          <div className="text-red-400 text-xs">
            {firstNameErrors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName" className="text-slate-200">Last Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={onChange}
            disabled={loading}
            required
            maxLength={50}
            autoComplete="family-name"
            className="pl-10 bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
          />
        </div>
        {lastNameErrors.length > 0 && (
          <div className="text-red-400 text-xs">
            {lastNameErrors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupFormNameFields;
