
import React from 'react';

interface SignupFormFooterProps {
  onLoginClick: () => void;
  loading: boolean;
}

const SignupFormFooter: React.FC<SignupFormFooterProps> = ({ onLoginClick, loading }) => {
  return (
    <div className="text-center">
      <div className="text-sm text-gray-400">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => {
            console.log('SignupForm: switching to login mode');
            onLoginClick();
          }}
          className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
          disabled={loading}
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

export default SignupFormFooter;
