
import React from 'react';

interface LoginFormFooterProps {
  attempts: number;
  onForgotPasswordClick: () => void;
  onSignupClick?: () => void;
  loading: boolean;
}

const LoginFormFooter: React.FC<LoginFormFooterProps> = ({
  attempts,
  onForgotPasswordClick,
  onSignupClick,
  loading
}) => {
  return (
    <>
      {attempts > 0 && attempts < 5 && (
        <div className="text-center">
          <p className="text-xs text-gray-400">
            Failed attempts: {attempts}/5
          </p>
        </div>
      )}

      <div className="text-center space-y-3">
        <button
          type="button"
          onClick={onForgotPasswordClick}
          className="text-sm text-cyan-400 hover:text-cyan-300 underline transition-colors"
          disabled={loading}
        >
          Forgot your password?
        </button>
        
        {onSignupClick && (
          <div className="text-sm text-gray-400">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSignupClick}
              className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
              disabled={loading}
            >
              Sign up
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default LoginFormFooter;
