
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Network, Home, Search } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
            <Network className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-cyan-400">LumenNet</h1>
        </div>
        
        <div className="mb-8">
          <Search className="w-24 h-24 text-slate-600 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">404</h2>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">Page Not Found</h3>
          <p className="text-slate-400">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => navigate('/')}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <Button
            onClick={() => navigate('/auth')}
            variant="outline"
            className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
