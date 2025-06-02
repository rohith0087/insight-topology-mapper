
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-40 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Header with navigation back to landing */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/landing')}
              className="text-slate-400 hover:text-white p-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-cyan-400" />
              <span className="text-sm text-slate-400">Secure Login</span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-3 mb-4">
            <Network className="w-12 h-12 text-cyan-400" />
            <h1 className="text-4xl font-bold text-cyan-400">LumenNet</h1>
          </div>
          <p className="text-slate-400">Unified Security Operations Center</p>
        </div>

        <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-700 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-white text-center text-2xl">
              {getCardTitle()}
            </CardTitle>
            <CardDescription className="text-slate-400 text-center">
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
                  <div className="flex mb-6 bg-slate-700/50 rounded-lg p-1 backdrop-blur-sm">
                    <Button
                      type="button"
                      variant={activeView === 'login' ? 'default' : 'ghost'}
                      className={`flex-1 text-sm transition-all ${
                        activeView === 'login' 
                          ? 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-lg' 
                          : 'text-slate-300 hover:text-white hover:bg-slate-600/50'
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
                          ? 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-lg' 
                          : 'text-slate-300 hover:text-white hover:bg-slate-600/50'
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
          <p className="text-slate-500 text-sm">
            © 2024 LumenNet. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
