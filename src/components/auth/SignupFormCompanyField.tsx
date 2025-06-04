
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Building } from 'lucide-react';

interface SignupFormCompanyFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  validationErrors: string[];
}

const SignupFormCompanyField: React.FC<SignupFormCompanyFieldProps> = ({
  value,
  onChange,
  loading,
  validationErrors
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="companyName" className="text-slate-200">Company Name</Label>
      <div className="relative">
        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          id="companyName"
          name="companyName"
          type="text"
          placeholder="Enter your company name"
          value={value}
          onChange={onChange}
          required
          disabled={loading}
          maxLength={100}
          autoComplete="organization"
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
    </div>
  );
};

export default SignupFormCompanyField;
