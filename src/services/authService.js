import { supabase } from '@/lib/supabaseClient';

export const authService = {
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Login error:', error.message);
      throw error;
    }
    return data;
  },

  signup: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error('Signup error:', error.message);
      throw error;
    }
    return data;
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
      throw error;
    }
  },

  getCurrentUserSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
        console.error('Error getting current session:', error.message);
        return null;
    }
    return session;
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
};