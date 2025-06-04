
import { supabase } from '@/integrations/supabase/client';

export const signUp = async (email: string, password: string, firstName?: string, lastName?: string, companyName?: string) => {
  try {
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
    
    return { error };
  } catch (error) {
    console.error('Sign up error:', error);
    return { error };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    console.log('AuthContext signIn called for:', email);
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
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const resetPassword = async (email: string) => {
  const redirectUrl = `${window.location.origin}/auth/reset-password`;
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl
  });
  
  return { error };
};
