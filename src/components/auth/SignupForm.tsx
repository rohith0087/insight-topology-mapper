import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, User, Building, Eye, EyeOff, Shield } from 'lucide-react';
import { sanitizeInput, validateInput } from '@/utils/securityUtils';
import { supabase } from '@/integrations/supabase/client';

interface SignupFormProps {
  onLoginClick: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onLoginClick }) => {
  console.log('SignupForm component rendered - this should only show when mode is signup');
  
  const { signUp } = useAuth();
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

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

  // Check when email changes
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
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-gray-400">Join LumenNet with your company credentials</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert className="border-red-500/50 bg-red-950/50 text-red-100">
            <Shield className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="border-green-500/50 bg-green-950/50 text-green-100">
            <Shield className="w-4 h-4" />
            <AlertDescription>
              Account created successfully! Please check your email to verify your account.
              {isFirstUser && (
                <span> As the first user from your company, you have been granted Super Admin privileges.</span>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-slate-200">Company Name</Label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              id="companyName"
              name="companyName"
              type="text"
              placeholder="Enter your company name"
              value={formData.companyName}
              onChange={handleChange}
              required
              disabled={loading}
              maxLength={100}
              autoComplete="organization"
              className="pl-10 bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>
          {validationErrors.companyName && (
            <div className="text-red-400 text-xs">
              {validationErrors.companyName.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-slate-200">First Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                disabled={loading}
                required
                maxLength={50}
                autoComplete="given-name"
                className="pl-10 bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
            {validationErrors.firstName && (
              <div className="text-red-400 text-xs">
                {validationErrors.firstName.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-slate-200">Last Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                disabled={loading}
                required
                maxLength={50}
                autoComplete="family-name"
                className="pl-10 bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
            {validationErrors.lastName && (
              <div className="text-red-400 text-xs">
                {validationErrors.lastName.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-200">Work Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your work email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              maxLength={254}
              autoComplete="email"
              className="pl-10 bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>
          {validationErrors.email && (
            <div className="text-red-400 text-xs">
              {validationErrors.email.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          )}
          <p className="text-xs text-slate-400">
            Please use your work email address (not Gmail, Outlook, etc.)
            {formData.email && !isFirstUser && (
              <span className="text-yellow-400 block mt-1">
                Note: Other users from your company domain already exist in the system.
              </span>
            )}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-200">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              maxLength={128}
              autoComplete="new-password"
              className="pl-10 pr-10 bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
              disabled={loading}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {validationErrors.password && (
            <div className="text-red-400 text-xs">
              {validationErrors.password.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-slate-200">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
              maxLength={128}
              autoComplete="new-password"
              className="pl-10 pr-10 bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
              disabled={loading}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {validationErrors.confirmPassword && (
            <div className="text-red-400 text-xs">
              {validationErrors.confirmPassword.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating secure account...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Create Secure Company Account
            </>
          )}
        </Button>

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
      </form>
    </div>
  );
};

export default SignupForm;
