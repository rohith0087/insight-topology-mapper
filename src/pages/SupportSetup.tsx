
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Eye, EyeOff } from 'lucide-react';

const SupportSetup: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!username.trim() || !password.trim() || !adminKey.trim()) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-support-admin', {
        body: {
          username: username.trim(),
          password: password,
          adminKey: adminKey.trim()
        }
      });

      if (error) {
        console.error('Support admin creation error:', error);
        setError('Failed to create support admin. Please check your admin key.');
      } else if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/support-login');
        }, 2000);
      } else {
        setError(data.error || 'Failed to create support admin');
      }
    } catch (error) {
      console.error('Setup error:', error);
      setError('Setup system error');
    }
    
    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card className="bg-slate-800 border-slate-700 w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-green-400 text-6xl mb-4">✓</div>
            <h2 className="text-white text-xl font-bold mb-2">Setup Complete!</h2>
            <p className="text-slate-400 mb-4">
              Super Support Admin account created successfully.
            </p>
            <p className="text-slate-300 text-sm">
              Redirecting to login page...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Shield className="w-12 h-12 text-red-400" />
            <h1 className="text-4xl font-bold text-red-400">LumenNet</h1>
          </div>
          <p className="text-slate-400">Support Admin Setup</p>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-center">
              Create Super Support Admin
            </CardTitle>
            <CardDescription className="text-slate-400 text-center">
              One-time setup for super_super_admin access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="border-red-500/50 bg-red-950/50 text-red-100">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="adminKey" className="text-slate-200">Admin Setup Key</Label>
                <Input
                  id="adminKey"
                  type="password"
                  placeholder="Enter setup key"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-red-500 focus:ring-red-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-200">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                  maxLength={50}
                  className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-red-500 focus:ring-red-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Choose a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    minLength={8}
                    maxLength={128}
                    className="pr-10 bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-red-500 focus:ring-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-200">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-red-500 focus:ring-red-500"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              >
                {isLoading ? 'Creating Admin...' : 'Create Super Support Admin'}
              </Button>

              <div className="mt-4 p-3 bg-slate-700 rounded-lg">
                <p className="text-xs text-slate-300 text-center">
                  🔒 One-time setup for super_super_admin role
                </p>
                <p className="text-xs text-slate-400 text-center mt-1">
                  This page will be disabled after first admin creation
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupportSetup;
