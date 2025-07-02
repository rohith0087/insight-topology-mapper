
import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Eye, EyeOff, Lock, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SecureCredentialInputProps {
  credentialName: string;
  credentialType: 'api_key' | 'username_password' | 'token' | 'certificate';
  fields: Array<{
    key: string;
    label: string;
    type: 'password' | 'text';
    required?: boolean;
  }>;
  existingCredentialId?: string;
  onCredentialStored: (credentialId: string) => void;
  className?: string;
}

export const SecureCredentialInput: React.FC<SecureCredentialInputProps> = ({
  credentialName,
  credentialType,
  fields,
  existingCredentialId,
  onCredentialStored,
  className = ''
}) => {
  const [credentialData, setCredentialData] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [isStoring, setIsStoring] = useState(false);
  const [isStored, setIsStored] = useState(!!existingCredentialId);

  const handleInputChange = (key: string, value: string) => {
    setCredentialData(prev => ({ ...prev, [key]: value }));
  };

  const togglePasswordVisibility = (key: string) => {
    setShowPassword(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const storeCredential = async () => {
    setIsStoring(true);
    try {
      const { data, error } = await supabase.functions.invoke('credential-manager', {
        body: {
          action: existingCredentialId ? 'update' : 'store',
          credentialName,
          credentialType,
          credentialData,
          ...(existingCredentialId && { credentialId: existingCredentialId })
        }
      });

      if (error) throw error;

      if (data?.success) {
        setIsStored(true);
        onCredentialStored(existingCredentialId || data.credentialId);
        toast.success(`Credential ${existingCredentialId ? 'updated' : 'stored'} securely`);
        
        // Clear the form data for security
        setCredentialData({});
      } else {
        throw new Error('Failed to store credential');
      }
    } catch (error) {
      console.error('Error storing credential:', error);
      toast.error('Failed to store credential');
    } finally {
      setIsStoring(false);
    }
  };

  const isFormValid = fields.every(field => 
    !field.required || (credentialData[field.key] && credentialData[field.key].trim().length > 0)
  );

  if (isStored && !Object.keys(credentialData).length) {
    return (
      <div className={`flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md ${className}`}>
        <Check className="h-4 w-4 text-green-600" />
        <span className="text-sm text-green-800">
          Credential configured securely
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsStored(false)}
          className="ml-auto"
        >
          Update
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 p-4 border border-slate-200 rounded-lg bg-slate-50 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Lock className="h-4 w-4 text-slate-600" />
        <span className="text-sm font-medium text-slate-700">
          Secure Credential Storage
        </span>
      </div>

      {fields.map(field => (
        <div key={field.key}>
          <Label htmlFor={field.key} className="text-slate-700">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </Label>
          <div className="relative">
            <Input
              id={field.key}
              type={field.type === 'password' && !showPassword[field.key] ? 'password' : 'text'}
              value={credentialData[field.key] || ''}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              className="bg-white border-slate-300 pr-10"
            />
            {field.type === 'password' && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility(field.key)}
              >
                {showPassword[field.key] ? (
                  <EyeOff className="h-4 w-4 text-slate-400" />
                ) : (
                  <Eye className="h-4 w-4 text-slate-400" />
                )}
              </Button>
            )}
          </div>
        </div>
      ))}

      <Button
        onClick={storeCredential}
        disabled={!isFormValid || isStoring}
        className="w-full"
      >
        {isStoring ? 'Storing Securely...' : existingCredentialId ? 'Update Credential' : 'Store Credential Securely'}
      </Button>

      <p className="text-xs text-slate-500 mt-2">
        🔒 Your credentials are encrypted using AES-256 encryption and stored securely. 
        They are never exposed to the browser after initial input.
      </p>
    </div>
  );
};
