
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Network } from 'lucide-react';

const AuthPage: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('login');

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
              {activeTab === 'login' && 'Welcome Back'}
              {activeTab === 'signup' && 'Create Account'}
              {activeTab === 'forgot' && 'Reset Password'}
            </CardTitle>
            <CardDescription className="text-slate-400 text-center">
              {activeTab === 'login' && 'Sign in to your account to continue'}
              {activeTab === 'signup' && 'Create a new account to get started'}
              {activeTab === 'forgot' && 'Enter your email to reset your password'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                <TabsTrigger value="login" className="text-slate-300">Login</TabsTrigger>
                <TabsTrigger value="signup" className="text-slate-300">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <LoginForm onForgotPassword={() => setActiveTab('forgot')} />
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <SignupForm />
              </TabsContent>
            </Tabs>

            {activeTab === 'forgot' && (
              <div className="mt-4">
                <ForgotPasswordForm onBackToLogin={() => setActiveTab('login')} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
