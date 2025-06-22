import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/services/authService';
import { supabase } from '@/lib/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      const currentSession = await authService.getCurrentUserSession();
      if (currentSession) {
        setUser(currentSession.user);
        setSession(currentSession);
      }
      setLoading(false);
    };

    getInitialSession();

    const { data: authSubscription } = authService.onAuthStateChange(
      async (event, currentSession) => {
        setUser(currentSession?.user ?? null);
        setSession(currentSession ?? null);
        setLoading(false);
      }
    );

    return () => {
      if (authSubscription?.subscription) {
        authSubscription.subscription.unsubscribe();
      }
    };
  }, []); // Array vazio - só executa uma vez

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      setSession(data.session);
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signup = async (email, password) => {
    setLoading(true);
    try {
      // Fazer signup SEM interferências
      const data = await authService.signup(email, password);
      
      setUser(data.user);
      setSession(data.session);
      setLoading(false);
      
      // Só tentar criar perfil DEPOIS do signup bem-sucedido
      if (data.user) {
        // Não aguardar - fazer em background
        setTimeout(async () => {
          try {
            await supabase.rpc('create_user_profile_simple', {
              user_id: data.user.id,
              user_email: data.user.email || email
            });
            console.log('Perfil criado em background');
          } catch (err) {
            console.log('Perfil será criado no primeiro login');
          }
        }, 2000);
      }
      
      return data;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setSession(null);
      // Força uma verificação do estado
      setTimeout(() => {
        setLoading(false);
      }, 100);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const value = {
    user,
    session,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};