
import React, { useState, useEffect } from 'react';
import { Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from './LoginForm';
import MultiStepSignupForm from './MultiStepSignupForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import InviteSignupForm from './InviteSignupForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Network, Users, LogIn, ArrowLeft, Shield } from 'lucide-react';

const AuthPage: React.FC = () => {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'login' | 'signup' | 'forgot' | 'invite-signup'>('login');
  const inviteToken = searchParams.get('invite');

  useEffect(() => {
    if (inviteToken) {
      setActiveView('invite-signup');
    }
  }, [inviteToken]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const getCardTitle = () => {
    switch (activeView) {
      case 'login': return 'Welcome Back';
      case 'signup': return 'Create Company Account';
      case 'forgot': return 'Reset Password';
      case 'invite-signup': return 'Join Your Team';
      default: return 'Welcome';
    }
  };

  const getCardDescription = () => {
    switch (activeView) {
      case 'login': return 'Sign in to your security operations center';
      case 'signup': return 'Set up your company\'s unified security operations center';
      case 'forgot': return 'Enter your email to reset your password';
      case 'invite-signup': return 'Complete your account setup using the invitation';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white relative selection:bg-cyan-500 selection:text-white">
      {/* Background Grid */}
      <div className="fixed inset-0 opacity-20 -z-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(56, 189, 248, 0.07) 1px, transparent 1px),
              linear-gradient(90deg, rgba(56, 189, 248, 0.07) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 via-transparent to-purple-600/5" />
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl animate-pulse opacity-50"></div>
        <div className="absolute -bottom-32 -left-40 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl animate-pulse opacity-50"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header with navigation back to landing */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate('/landing')}
                className="text-gray-400 hover:text-cyan-400 p-2 hover:bg-gray-800/50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              
              <div className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-cyan-400" />
                <span className="text-sm text-gray-400">Secure Login</span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Network className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tight">LumenNet</h1>
            </div>
            <p className="text-gray-400">Unified Security Operations Center</p>
          </div>

          <Card className="bg-gray-900/80 backdrop-blur-lg border border-gray-700/50 shadow-2xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-white text-center text-2xl font-bold">
                {getCardTitle()}
              </CardTitle>
              <CardDescription className="text-gray-400 text-center">
                {getCardDescription()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Show invite signup if there's an invite token */}
              {inviteToken ? (
                <InviteSignupForm 
                  inviteToken={inviteToken} 
                  onBackToLogin={() => setActiveView('login')}
                />
              ) : (
                <>
                  {/* Authentication Mode Toggle */}
                  {activeView !== 'forgot' && (
                    <div className="flex mb-6 bg-gray-800/50 rounded-lg p-1 backdrop-blur-sm">
                      <Button
                        type="button"
                        variant={activeView === 'login' ? 'default' : 'ghost'}
                        className={`flex-1 text-sm transition-all ${
                          activeView === 'login' 
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 shadow-lg' 
                            : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                        }`}
                        onClick={() => setActiveView('login')}
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                      <Button
                        type="button"
                        variant={activeView === 'signup' ? 'default' : 'ghost'}
                        className={`flex-1 text-sm transition-all ${
                          activeView === 'signup' 
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 shadow-lg' 
                            : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                        }`}
                        onClick={() => setActiveView('signup')}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Create Account
                      </Button>
                    </div>
                  )}
                  
                  {/* Forms */}
                  {activeView === 'login' && (
                    <LoginForm onForgotPassword={() => setActiveView('forgot')} />
                  )}
                  
                  {activeView === 'signup' && (
                    <MultiStepSignupForm onBackToLogin={() => setActiveView('login')} />
                  )}
                  
                  {activeView === 'forgot' && (
                    <ForgotPasswordForm onBackToLogin={() => setActiveView('login')} />
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} LumenNet Technologies, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
