
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, User, ArrowLeft, Building } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];
type Invitation = Database['public']['Tables']['user_invitations']['Row'];

interface InviteSignupFormProps {
  inviteToken: string;
  onBackToLogin: () => void;
}

const InviteSignupForm: React.FC<InviteSignupFormProps> = ({ inviteToken, onBackToLogin }) => {
  const { signUp } = useAuth();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [tenantInfo, setTenantInfo] = useState<{ name: string; company_name: string } | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validatingInvite, setValidatingInvite] = useState(true);

  useEffect(() => {
    validateInvitation();
  }, [inviteToken]);

  const validateInvitation = async () => {
    try {
      const { data: inviteData, error: inviteError } = await supabase
        .from('user_invitations')
        .select('*, tenants(name, company_name)')
        .eq('invite_token', inviteToken)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (inviteError || !inviteData) {
        setError('Invalid or expired invitation link');
        setValidatingInvite(false);
        return;
      }

      setInvitation(inviteData);
      setTenantInfo(inviteData.tenants as any);
      
      if (inviteData.email) {
        setFormData(prev => ({ ...prev, email: inviteData.email || '' }));
      }
      
      setValidatingInvite(false);
    } catch (error) {
      console.error('Error validating invitation:', error);
      setError('Failed to validate invitation');
      setValidatingInvite(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    // If email is pre-filled from invitation, use it; otherwise use the entered email
    const emailToUse = invitation?.email || formData.email;

    const { error } = await signUp(
      emailToUse,
      formData.password,
      formData.firstName,
      formData.lastName
    );
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    }
    
    setLoading(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-600 text-white';
      case 'tenant_admin':
        return 'bg-blue-600 text-white';
      case 'network_admin':
        return 'bg-green-600 text-white';
      case 'analyst':
        return 'bg-yellow-600 text-white';
      case 'viewer':
        return 'bg-gray-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const formatRole = (role: string) => {
    return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (validatingInvite) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-cyan-400" />
        <p className="text-slate-400">Validating invitation...</p>
      </div>
    );
  }

  if (error && !invitation) {
    return (
      <div className="space-y-4">
        <Alert className="border-red-500/50 bg-red-950/50 text-red-100">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        
        <Button
          type="button"
          variant="ghost"
          onClick={onBackToLogin}
          className="text-slate-400 hover:text-white p-0 h-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="ghost"
        onClick={onBackToLogin}
        className="text-slate-400 hover:text-white p-0 h-auto"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Login
      </Button>

      {invitation && tenantInfo && (
        <div className="p-4 bg-slate-900 rounded-lg border border-slate-600">
          <div className="flex items-center space-x-3 mb-3">
            <Building className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">{tenantInfo.company_name}</h3>
              <p className="text-sm text-slate-400">You're invited to join as:</p>
            </div>
          </div>
          <Badge className={getRoleBadgeColor(invitation.role)}>
            {formatRole(invitation.role)}
          </Badge>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert className="border-red-500/50 bg-red-950/50 text-red-100">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="border-green-500/50 bg-green-950/50 text-green-100">
            <AlertDescription>
              Account created successfully! Please check your email to verify your account.
              You will have {formatRole(invitation?.role || 'viewer')} access.
            </AlertDescription>
          </Alert>
        )}

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
                value={formData.firstName}
                onChange={handleChange}
                disabled={loading}
                required
                className="pl-10 bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
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
                value={formData.lastName}
                onChange={handleChange}
                disabled={loading}
                required
                className="pl-10 bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-200">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={invitation?.email || formData.email}
              onChange={handleChange}
              required
              disabled={loading || !!invitation?.email}
              className="pl-10 bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>
          {invitation?.email && (
            <p className="text-xs text-slate-400">
              Email is pre-filled from your invitation
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-200">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              className="pl-10 bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-slate-200">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
              className="pl-10 bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating account...
            </>
          ) : (
            'Join Team'
          )}
        </Button>
      </form>
    </div>
  );
};

export default InviteSignupForm;
