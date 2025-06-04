
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface DomainCheckErrorProps {
  error: string;
  onSwitchToLogin: () => void;
}

const DomainCheckError: React.FC<DomainCheckErrorProps> = ({ error, onSwitchToLogin }) => {
  if (!error) return null;

  return (
    <div className="bg-red-950/50 border border-red-500/50 rounded-md p-4">
      <div className="flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-red-100 text-sm">{error}</p>
          {error.includes('administrator account has already been created') && (
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="mt-2 text-cyan-400 hover:text-cyan-300 underline text-sm"
            >
              Go to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DomainCheckError;
