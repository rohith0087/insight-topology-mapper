
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { sanitizeInput, validateInput, RateLimiter } from '@/utils/securityUtils';

interface LoginFormProps {
  onForgotPasswordClick: () => void;
  onSignupClick?: () => void;
}

// Rate limiter for login attempts
const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes

const LoginForm: React.FC<LoginFormProps> = ({ onForgotPasswordClick, onSignupClick }) => {
  const { signIn } = useAuth();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check rate limiting
    const clientId = `${email}_${new Date().getDate()}`; // Basic client identification
    if (!loginRateLimiter.isAllowed(clientId)) {
      setError('Too many login attempts. Please try again in 15 minutes.');
      return;
    }
    
    setLoading(true);
    setError('');

    // Validate form
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
        setAttempts(prev => prev + 1);
        // Clear password on failed attempt for security
        setPassword('');
      } else {
        // Reset rate limiter on successful login
        loginRateLimiter.reset(clientId);
        setAttempts(0);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
      setPassword('');
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert className="border-red-500/50 bg-red-950/50 text-red-100">
          <Shield className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-200 text-sm font-medium">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            required
            disabled={loading}
            maxLength={254}
            autoComplete="email"
            className="pl-10 bg-gray-800/80 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20 transition-colors"
          />
        </div>
        {validationErrors.email && (
          <div className="text-red-400 text-xs">
            {validationErrors.email.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-200 text-sm font-medium">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
            required
            disabled={loading}
            maxLength={128}
            autoComplete="current-password"
            className="pl-10 pr-10 bg-gray-800/80 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
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

      <Button
        type="submit"
        disabled={loading || attempts >= 5}
        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium py-2.5 transition-all shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Authenticating...
          </>
        ) : (
          <>
            <Shield className="w-4 h-4 mr-2" />
            Secure Sign In
          </>
        )}
      </Button>

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
    </form>
  );
};

export default LoginForm;
