
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import AuthPage from './AuthPage';

interface AuthModalProps {
  show: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ show, onClose }) => {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 bg-gray-900/95 border-gray-700">
        <DialogHeader className="sr-only">
          <DialogTitle>Authentication</DialogTitle>
        </DialogHeader>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4 text-white" />
          <span className="sr-only">Close</span>
        </button>
        <div className="p-6">
          <AuthPage />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
