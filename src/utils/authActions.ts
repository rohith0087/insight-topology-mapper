
import { supabase } from '@/integrations/supabase/client';

export const signUp = async (email: string, password: string, firstName?: string, lastName?: string, companyName?: string) => {
  try {
    console.log('SIGNUP function called for:', email);
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName || '',
          last_name: lastName || '',
          company_name: companyName || ''
        }
      }
    });
    
    console.log('Supabase signUp result:', { error: error?.message });
    return { error };
  } catch (error) {
    console.error('Sign up error:', error);
    return { error };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    console.log('SIGNIN function called for:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    console.log('Supabase signIn result:', { 
      user: data.user?.email, 
      session: !!data.session, 
      error: error?.message 
    });
    
    return { error };
  } catch (error) {
    console.error('Sign in error:', error);
    return { error };
  }
};

export const signOut = async () => {
  console.log('SIGNOUT function called');
  const { error } = await supabase.auth.signOut();
  console.log('Supabase signOut result:', { error: error?.message });
  return { error };
};

export const resetPassword = async (email: string) => {
  console.log('RESET PASSWORD function called for:', email);
  const redirectUrl = `${window.location.origin}/auth/reset-password`;
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl
  });
  
  console.log('Supabase resetPassword result:', { error: error?.message });
  return { error };
};
