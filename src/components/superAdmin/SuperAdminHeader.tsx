
import React from 'react';
import { useSupportAuth } from '@/contexts/SupportAuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SuperAdminHeader = () => {
  const { user, signOut } = useSupportAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/support-login');
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-red-400" />
            <div>
              <h1 className="text-xl font-bold text-red-400">LumenNet Customer Support</h1>
              <p className="text-slate-400 text-sm">Multi-Tenant Management Portal</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="text-right text-sm">
              <p className="text-white font-medium">
                {user?.username}
              </p>
              <p className="text-red-400 text-xs">Support Administrator</p>
            </div>
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-red-600 text-white text-sm">
                SA
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
