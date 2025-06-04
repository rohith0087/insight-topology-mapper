
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Building } from 'lucide-react';

interface DomainInputFieldProps {
  domain: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

const DomainInputField: React.FC<DomainInputFieldProps> = ({ domain, onChange, disabled }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="domain" className="text-slate-200">Company Domain</Label>
      <div className="relative">
        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          id="domain"
          name="domain"
          type="text"
          placeholder="company.com"
          value={domain}
          onChange={onChange}
          required
          disabled={disabled}
          className="pl-10 bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
        />
      </div>
      <div className="text-xs text-gray-500 space-y-1">
        <p>Enter your company's domain (e.g., auburn.edu, microsoft.com)</p>
        <p className="text-yellow-400">
          ⚠️ Personal email domains (Gmail, Outlook, Yahoo, etc.) are not allowed
        </p>
      </div>
    </div>
  );
};

export default DomainInputField;
