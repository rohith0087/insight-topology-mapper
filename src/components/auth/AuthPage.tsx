
import React, { useState } from 'react';
import { Network } from 'lucide-react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPasswordForm from './ForgotPasswordForm';

type AuthMode = 'login' | 'signup' | 'forgot-password';

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>('login');

  return (
    <div className="min-h-screen bg-gray-950 text-white relative">
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

      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Network className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-cyan-400">LumenNet</h1>
            </div>
            <p className="text-gray-400">SOC Intelligence Platform</p>
          </div>

          {/* Auth Form Container */}
          <div className="bg-gray-900/70 backdrop-blur-md border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
            {mode === 'login' && (
              <LoginForm 
                onSignupClick={() => setMode('signup')}
                onForgotPasswordClick={() => setMode('forgot-password')}
              />
            )}
            {mode === 'signup' && (
              <SignupForm onLoginClick={() => setMode('login')} />
            )}
            {mode === 'forgot-password' && (
              <ForgotPasswordForm onBackToLogin={() => setMode('login')} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
