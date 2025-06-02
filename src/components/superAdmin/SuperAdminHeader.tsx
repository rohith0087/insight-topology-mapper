
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Shield, LogOut, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SuperAdminHeader = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleBackToMain = () => {
    navigate('/');
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-red-400" />
            <div>
              <h1 className="text-xl font-bold text-red-400">LumenNet Super Admin</h1>
              <p className="text-slate-400 text-sm">Customer Service Portal</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            onClick={handleBackToMain}
            variant="outline"
            size="sm"
            className="border-slate-600 hover:bg-slate-700 bg-slate-900 text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Main App
          </Button>

          <div className="flex items-center space-x-3">
            <div className="text-right text-sm">
              <p className="text-white font-medium">
                {profile?.first_name} {profile?.last_name}
              </p>
              <p className="text-red-400 text-xs">Super Administrator</p>
            </div>
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-red-600 text-white text-sm">
                {profile?.first_name?.[0]}{profile?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>

          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="border-slate-600 hover:bg-slate-700 bg-slate-900 text-slate-300 hover:text-white"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default SuperAdminHeader;
