
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSupportAuth } from '@/contexts/SupportAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, User, Eye, EyeOff } from 'lucide-react';

const SupportLogin: React.FC = () => {
  const { user, signIn, loading } = useSupportAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/support-portal" replace />;
  }

  const handleInputChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Basic client-side sanitization
    const sanitized = value.replace(/[<>]/g, '').slice(0, 128);
    setter(sanitized);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (attempts >= 5) {
      setError('Too many failed attempts. Please contact your administrator.');
      return;
    }
    
    setIsLoading(true);
    setError('');

    // Client-side validation
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      setIsLoading(false);
      return;
    }

    if (username.length < 3 || password.length < 8) {
      setError('Invalid credentials format');
      setIsLoading(false);
      return;
    }

    const { error } = await signIn(username, password);
    
    if (error) {
      setError(error.message);
      setAttempts(prev => prev + 1);
      // Clear password on failed attempt
      setPassword('');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Shield className="w-12 h-12 text-red-400" />
            <h1 className="text-4xl font-bold text-red-400">LumenNet</h1>
          </div>
          <p className="text-slate-400">Customer Support Portal</p>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-center">
              Support Team Access
            </CardTitle>
            <CardDescription className="text-slate-400 text-center">
              Secure authentication required for support dashboard access
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
                <Label htmlFor="username" className="text-slate-200">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={handleInputChange(setUsername)}
                    required
                    disabled={isLoading}
                    maxLength={50}
                    autoComplete="username"
                    className="pl-10 bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={handleInputChange(setPassword)}
                    required
                    disabled={isLoading}
                    maxLength={128}
                    autoComplete="current-password"
                    className="pl-10 pr-10 bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-red-500 focus:ring-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || attempts >= 5}
                className="w-full bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              >
                {isLoading ? 'Authenticating...' : 'Secure Sign In'}
              </Button>

              {attempts > 0 && attempts < 5 && (
                <div className="text-center">
                  <p className="text-xs text-slate-400">
                    Failed attempts: {attempts}/5
                  </p>
                </div>
              )}

              <div className="mt-4 p-3 bg-slate-700 rounded-lg">
                <p className="text-xs text-slate-300 text-center">
                  🔒 Secure authentication system active
                </p>
                <p className="text-xs text-slate-400 text-center mt-1">
                  Contact your administrator for access credentials
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupportLogin;
