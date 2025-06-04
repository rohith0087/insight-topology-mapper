
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSignupForm } from '@/hooks/useSignupForm';
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
    showPassword,
    showConfirmPassword,
    validationErrors,
    setLoading,
    setError,
    setSuccess,
    setShowPassword,
    setShowConfirmPassword,
    setFormData,
    handleChange,
    validateForm
  } = useSignupForm();

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
        <SignupFormSuccess success={success} isFirstUser={isFirstUser} />

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
