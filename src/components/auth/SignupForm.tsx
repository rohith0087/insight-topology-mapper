import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSignupForm } from '@/hooks/useSignupForm';
import { supabase } from '@/integrations/supabase/client';
import SignupFormDomainCheck from './SignupFormDomainCheck';
import SignupFormHeader from './SignupFormHeader';
import SignupFormError from './SignupFormError';
import SignupFormSuccess from './SignupFormSuccess';
import SignupFormCompanyField from './SignupFormCompanyField';
import SignupFormNameFields from './SignupFormNameFields';
import SignupFormEmailField from './SignupFormEmailField';
import SignupFormPasswordFields from './SignupFormPasswordFields';
import SignupFormSubmitButton from './SignupFormSubmitButton';
import SignupFormFooter from './SignupFormFooter';

interface SignupFormProps {
  onLoginClick: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onLoginClick }) => {
  console.log('SignupForm component rendered - this should only show when mode is signup');
  
  const [showDomainCheck, setShowDomainCheck] = useState(true);
  const [verifiedDomain, setVerifiedDomain] = useState('');
  const [isFirstUser, setIsFirstUser] = useState(false);
  
  const { signUp } = useAuth();
  const {
    formData,
    loading,
    error,
    success,
    actualIsFirstUser,
    showPassword,
    showConfirmPassword,
    validationErrors,
    setLoading,
    setError,
    setSuccess,
    setShowPassword,
    setShowConfirmPassword,
    setFormData,
    setSignupResult,
    handleChange,
    validateForm,
    checkIfUserExists
  } = useSignupForm();

  const handleDomainVerified = (domain: string, firstUser: boolean) => {
    setVerifiedDomain(domain);
    setIsFirstUser(firstUser);
    setShowDomainCheck(false);
    
    // Pre-fill company name based on domain
    const companyName = domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);
    setFormData(prev => ({
      ...prev,
      companyName: companyName
    }));
  };

  const checkIfFirstUserAfterSignup = async (email: string) => {
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return false;

    try {
      // Check how many users exist with this domain after signup
      const { data: existingUsers, error } = await supabase
        .from('profiles')
        .select('id')
        .ilike('email', `%@${domain}`);

      if (error) {
        console.error('Error checking users after signup:', error);
        return false;
      }

      // If only 1 user exists (the one we just created), they're the first
      return existingUsers && existingUsers.length === 1;
    } catch (error) {
      console.error('Error checking users after signup:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('SignupForm submitted - attempting SIGN UP (not sign in)', { email: formData.email });
    
    setLoading(true);
    setError('');
    setSuccess(false);

    // Validate form
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    // Validate email domain matches verified domain
    const emailDomain = formData.email.split('@')[1]?.toLowerCase();
    if (emailDomain !== verifiedDomain.toLowerCase()) {
      setError(`Email domain must match your company domain: ${verifiedDomain}`);
      setLoading(false);
      return;
    }

    // Check if user already exists before attempting signup
    const userExists = await checkIfUserExists(formData.email);
    if (userExists) {
      setError('An account with this email already exists. Please try signing in instead.');
      setLoading(false);
      return;
    }

    try {
      console.log('About to call signUp function with email:', formData.email);
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.companyName
      );
      
      console.log('SignUp result:', { error: error?.message });
      
      if (error) {
        // Check if it's a "user already exists" error
        if (error.message?.includes('already registered') || error.message?.includes('already exists')) {
          setError('An account with this email already exists. Please try signing in instead.');
        } else {
          setError(error.message);
        }
      } else {
        // For first user from a new domain, they are always the first user
        setSignupResult(isFirstUser);
        
        setSuccess(true);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          companyName: ''
        });
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Signup error:', err);
    }
    
    setLoading(false);
  };

  // Show domain check first
  if (showDomainCheck) {
    return (
      <SignupFormDomainCheck
        onDomainVerified={handleDomainVerified}
        onSwitchToLogin={onLoginClick}
      />
    );
  }

  return (
    <div className="space-y-6">
      <SignupFormHeader />

      <form onSubmit={handleSubmit} className="space-y-4">
        <SignupFormError error={error} />
        <SignupFormSuccess success={success} isFirstUser={actualIsFirstUser} />

        <SignupFormCompanyField
          value={formData.companyName}
          onChange={handleChange}
          loading={loading}
          validationErrors={validationErrors.companyName || []}
        />

        <SignupFormNameFields
          firstName={formData.firstName}
          lastName={formData.lastName}
          onChange={handleChange}
          loading={loading}
          firstNameErrors={validationErrors.firstName || []}
          lastNameErrors={validationErrors.lastName || []}
        />
        
        <SignupFormEmailField
          email={formData.email}
          onChange={handleChange}
          loading={loading}
          validationErrors={validationErrors.email || []}
          isFirstUser={isFirstUser}
        />

        <SignupFormPasswordFields
          password={formData.password}
          confirmPassword={formData.confirmPassword}
          showPassword={showPassword}
          showConfirmPassword={showConfirmPassword}
          onChange={handleChange}
          onTogglePassword={() => setShowPassword(!showPassword)}
          onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
          loading={loading}
          passwordErrors={validationErrors.password || []}
          confirmPasswordErrors={validationErrors.confirmPassword || []}
        />

        <div className="text-xs text-gray-500 bg-slate-800/50 p-3 rounded-md">
          <p><strong>Domain:</strong> {verifiedDomain}</p>
          <p>Your email must use this domain to complete registration.</p>
        </div>

        <SignupFormSubmitButton loading={loading} />

        <SignupFormFooter onLoginClick={onLoginClick} loading={loading} />
      </form>
    </div>
  );
};

export default SignupForm;
