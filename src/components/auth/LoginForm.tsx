
import React from 'react';
import { useLoginForm } from '@/hooks/useLoginForm';
import { useLoginSubmit } from '@/hooks/useLoginSubmit';
import LoginFormHeader from './LoginFormHeader';
import LoginFormError from './LoginFormError';
import LoginFormEmailField from './LoginFormEmailField';
import LoginFormPasswordField from './LoginFormPasswordField';
import LoginFormSubmitButton from './LoginFormSubmitButton';
import LoginFormFooter from './LoginFormFooter';

interface LoginFormProps {
  onForgotPasswordClick: () => void;
  onSignupClick?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onForgotPasswordClick, onSignupClick }) => {
  const {
    email,
    password,
    showPassword,
    loading,
    error,
    attempts,
    validationErrors,
    loginRateLimiter,
    setShowPassword,
    setLoading,
    setError,
    setAttempts,
    setPassword,
    handleEmailChange,
    handlePasswordChange,
    validateForm
  } = useLoginForm();

  const { handleSubmit } = useLoginSubmit(
    email,
    password,
    loginRateLimiter,
    validateForm,
    setLoading,
    setError,
    setAttempts,
    setPassword
  );

  return (
    <div className="space-y-6">
      <LoginFormHeader />

      <form onSubmit={handleSubmit} className="space-y-6">
        <LoginFormError error={error} />
        
        <LoginFormEmailField
          email={email}
          onEmailChange={handleEmailChange}
          validationErrors={validationErrors.email || []}
          loading={loading}
        />

        <LoginFormPasswordField
          password={password}
          showPassword={showPassword}
          onPasswordChange={handlePasswordChange}
          onTogglePassword={() => setShowPassword(!showPassword)}
          validationErrors={validationErrors.password || []}
          loading={loading}
        />

        <LoginFormSubmitButton loading={loading} attempts={attempts} />

        <LoginFormFooter
          attempts={attempts}
          onForgotPasswordClick={onForgotPasswordClick}
          onSignupClick={onSignupClick}
          loading={loading}
        />
      </form>
    </div>
  );
};

export default LoginForm;
