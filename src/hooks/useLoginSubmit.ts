
import { useAuth } from '@/contexts/AuthContext';
import { RateLimiter } from '@/utils/securityUtils';

export const useLoginSubmit = (
  email: string,
  password: string,
  loginRateLimiter: RateLimiter,
  validateForm: () => boolean,
  setLoading: (loading: boolean) => void,
  setError: (error: string) => void,
  setAttempts: (attempts: number | ((prev: number) => number)) => void,
  setPassword: (password: string) => void
) => {
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Login form submitted', { email, hasPassword: !!password });
    
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
      console.log('Attempting to sign in...');
      const { error } = await signIn(email, password);
      
      console.log('Sign in result:', { error: error?.message });
      
      if (error) {
        console.error('Login error:', error);
        setError(error.message);
        setAttempts(prev => prev + 1);
        // Clear password on failed attempt for security
        setPassword('');
      } else {
        // Reset rate limiter on successful login
        loginRateLimiter.reset(clientId);
        setAttempts(0);
        console.log('Login successful');
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
      setError('An unexpected error occurred. Please try again.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit };
};
