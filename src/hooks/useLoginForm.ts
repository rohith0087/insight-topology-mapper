
import { useState } from 'react';
import { sanitizeInput, validateInput, RateLimiter } from '@/utils/securityUtils';

// Rate limiter for login attempts
const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes

export const useLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeInput(e.target.value, { maxLength: 254, allowSpecialChars: true });
    setEmail(sanitized);
    
    if (validationErrors.email) {
      setValidationErrors(prev => ({ ...prev, email: [] }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeInput(e.target.value, { maxLength: 128, allowSpecialChars: true });
    setPassword(sanitized);
    
    if (validationErrors.password) {
      setValidationErrors(prev => ({ ...prev, password: [] }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string[]> = {};
    
    const emailValidation = validateInput(email, 'email');
    if (!emailValidation.isValid) {
      errors.email = emailValidation.errors;
    }
    
    const passwordValidation = validateInput(password, 'password');
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors;
    }
    
    if (!email.trim()) {
      errors.email = ['Email is required'];
    }
    
    if (!password.trim()) {
      errors.password = ['Password is required'];
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return {
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
  };
};
