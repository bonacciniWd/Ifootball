import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-400">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }  // Se requer admin, verifica se é admin
  if (requireAdmin) {
    const isAdmin = user?.email === 'admin@ifootball.com' || 
                   user?.role === 'admin' ||
                   user?.email === 'dbonaccioli8@gmail.com' ||
                   user?.email?.includes('admin') ||
                   user?.email?.endsWith('@ifootball.com') ||
                   // Temporário para desenvolvimento - aceita qualquer usuário autenticado
                   (process.env.NODE_ENV === 'development' && user);

    console.log('🔒 ProtectedRoute Admin Check:', {
      user: user,
      isAdmin: isAdmin,
      requireAdmin: requireAdmin,
      userEmail: user?.email,
      isDevelopment: process.env.NODE_ENV === 'development'
    });
    
    if (!isAdmin) {
      return (
        <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-xl font-semibold">
                Acesso Restrito
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-yellow-600 dark:text-yellow-400">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">Área Administrativa</span>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Esta página é restrita apenas para administradores do sistema.
              </p>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-sm">
                <p className="text-muted-foreground">
                  Se você é um desenvolvedor, esta área fica disponível apenas em modo de desenvolvimento.
                </p>
              </div>

              <div className="flex space-x-2 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => window.history.back()}
                >
                  Voltar
                </Button>
                <Button asChild>
                  <a href="/">Ir para Início</a>
                </Button>
              </div>

              <div className="text-xs text-muted-foreground mt-4">
                <p>Usuário atual: {user?.email}</p>
                <p>Permissão: {isAdmin ? 'Admin' : 'Usuário'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // Se passou por todas as verificações, renderiza o componente
  return children;
};

export default ProtectedRoute;
