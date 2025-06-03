
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, ArrowLeft } from 'lucide-react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPasswordForm from './ForgotPasswordForm';

type AuthMode = 'login' | 'signup' | 'forgot-password';

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const navigate = useNavigate();

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

      {/* Header with Back Navigation */}
      <nav className="relative z-10 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Home</span>
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <Network className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">LumenNet</span>
              <span className="hidden sm:inline text-xs text-gray-500 ml-1 pt-0.5">SOC Intelligence Platform</span>
            </div>

            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </nav>

      <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <div className="w-full max-w-md">
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
