
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { sanitizeInput, validateInput } from '@/utils/securityUtils';

export const useSignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isFirstUser, setIsFirstUser] = useState(false);
  const [actualIsFirstUser, setActualIsFirstUser] = useState(false); // For the actual signup result
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  // Check if user already exists in the database
  const checkIfUserExists = async (email: string): Promise<boolean> => {
    if (!email || !email.includes('@')) return false;
    
    try {
      const { data: existingUser, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email.toLowerCase())
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error checking if user exists:', error);
        return false;
      }

      return !!existingUser;
    } catch (error) {
      console.error('Error checking if user exists:', error);
      return false;
    }
  };

  // Check if user will be first from their company
  const checkIfFirstUser = async (email: string) => {
    if (!email || !email.includes('@')) return false;
    
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return false;

    try {
      // Check if any existing users have the same domain
      const { data: existingUsers, error } = await supabase
        .from('profiles')
        .select('id')
        .ilike('email', `%@${domain}`)
        .limit(1);

      if (error) {
        console.error('Error checking existing users:', error);
        return false;
      }

      return !existingUsers || existingUsers.length === 0;
    } catch (error) {
      console.error('Error checking existing users:', error);
      return false;
    }
  };

  // Check when email changes (for UI feedback)
  useEffect(() => {
    const checkUser = async () => {
      if (formData.email && formData.email.includes('@')) {
        const firstUser = await checkIfFirstUser(formData.email);
        setIsFirstUser(firstUser);
      }
    };

    const debounceTimeout = setTimeout(checkUser, 500);
    return () => clearTimeout(debounceTimeout);
  }, [formData.email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Sanitize input based on field type
    let sanitized = value;
    
    switch (name) {
      case 'email':
        sanitized = sanitizeInput(value, { maxLength: 254, allowSpecialChars: true });
        break;
      case 'password':
      case 'confirmPassword':
        sanitized = sanitizeInput(value, { maxLength: 128, allowSpecialChars: true });
        break;
      case 'firstName':
      case 'lastName':
        sanitized = sanitizeInput(value, { maxLength: 50 });
        break;
      case 'companyName':
        sanitized = sanitizeInput(value, { maxLength: 100, allowSpecialChars: true, preserveSpaces: true });
        break;
      default:
        sanitized = sanitizeInput(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitized
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: []
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string[]> = {};
    
    // Validate each field
    const emailValidation = validateInput(formData.email, 'email');
    if (!emailValidation.isValid) {
      errors.email = emailValidation.errors;
    }
    
    const passwordValidation = validateInput(formData.password, 'password');
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors;
    }
    
    const firstNameValidation = validateInput(formData.firstName, 'text');
    if (!firstNameValidation.isValid) {
      errors.firstName = firstNameValidation.errors;
    }
    
    const lastNameValidation = validateInput(formData.lastName, 'text');
    if (!lastNameValidation.isValid) {
      errors.lastName = lastNameValidation.errors;
    }
    
    const companyValidation = validateInput(formData.companyName, 'text');
    if (!companyValidation.isValid) {
      errors.companyName = companyValidation.errors;
    }
    
    // Additional validations
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = ['Passwords do not match'];
    }
    
    if (formData.password.length < 8) {
      errors.password = [...(errors.password || []), 'Password must be at least 8 characters long'];
    }
    
    // Check for strong password
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!strongPasswordRegex.test(formData.password)) {
      errors.password = [...(errors.password || []), 'Password must contain uppercase, lowercase, number, and special character'];
    }
    
    // Check for personal email domains
    const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com'];
    const domain = formData.email.split('@')[1]?.toLowerCase();
    if (personalDomains.includes(domain)) {
      errors.email = [...(errors.email || []), 'Please use your work email address, not a personal email'];
    }
    
    // Required field checks
    if (!formData.firstName.trim()) {
      errors.firstName = ['First name is required'];
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = ['Last name is required'];
    }
    
    if (!formData.companyName.trim()) {
      errors.companyName = ['Company name is required'];
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Function to set the actual first user status after signup
  const setSignupResult = (wasFirstUser: boolean) => {
    setActualIsFirstUser(wasFirstUser);
  };

  return {
    formData,
    loading,
    error,
    success,
    isFirstUser, // For UI feedback during email input
    actualIsFirstUser, // For the actual signup success message
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
  };
};
