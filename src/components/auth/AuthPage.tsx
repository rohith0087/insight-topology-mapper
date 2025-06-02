
import React, { useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from './LoginForm';
import MultiStepSignupForm from './MultiStepSignupForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import InviteSignupForm from './InviteSignupForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Network, Users, LogIn } from 'lucide-react';

const AuthPage: React.FC = () => {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Network className="w-12 h-12 text-cyan-400" />
            <h1 className="text-4xl font-bold text-cyan-400">LumenNet</h1>
          </div>
          <p className="text-slate-400">Unified Security Operations Center</p>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-center">
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
                  <div className="flex mb-6 bg-slate-700 rounded-lg p-1">
                    <Button
                      type="button"
                      variant={activeView === 'login' ? 'default' : 'ghost'}
                      className={`flex-1 text-sm ${
                        activeView === 'login' 
                          ? 'bg-cyan-600 text-white hover:bg-cyan-700' 
                          : 'text-slate-300 hover:text-white hover:bg-slate-600'
                      }`}
                      onClick={() => setActiveView('login')}
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                    <Button
                      type="button"
                      variant={activeView === 'signup' ? 'default' : 'ghost'}
                      className={`flex-1 text-sm ${
                        activeView === 'signup' 
                          ? 'bg-cyan-600 text-white hover:bg-cyan-700' 
                          : 'text-slate-300 hover:text-white hover:bg-slate-600'
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
      </div>
    </div>
  );
};

export default AuthPage;
