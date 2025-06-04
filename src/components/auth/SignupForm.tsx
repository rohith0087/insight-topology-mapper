
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSignupForm } from '@/hooks/useSignupForm';
import { supabase } from '@/integrations/supabase/client';
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
  
  const { signUp } = useAuth();
  const {
    formData,
    loading,
    error,
    success,
    isFirstUser,
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
    validateForm
  } = useSignupForm();

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
        // Check if this user was actually the first from their company
        const wasFirstUser = await checkIfFirstUserAfterSignup(formData.email);
        setSignupResult(wasFirstUser);
        
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

        <SignupFormSubmitButton loading={loading} />

        <SignupFormFooter onLoginClick={onLoginClick} loading={loading} />
      </form>
    </div>
  );
};

export default SignupForm;
