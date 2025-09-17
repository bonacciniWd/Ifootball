import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminService } from '@/services/adminService';
import AdminInviteManager from '@/components/AdminInviteManager';
import { 
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  Database,
  Activity,
  Crown
} from 'lucide-react';

const AdminPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('invites');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  // Verificar se usuário é admin no banco
  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  // Carregar estatísticas do dashboard
  useEffect(() => {
    if (isAdmin) {
      loadDashboardStats();
    }
  }, [isAdmin]);

  const checkAdminStatus = async () => {
    if (!user?.id) {
      setCheckingAdmin(false);
      return;
    }

    try {
      const adminStatus = await adminService.checkAdminStatus(user.id);
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setCheckingAdmin(false);
    }
  };

  const loadDashboardStats = async () => {
    try {
      const stats = await adminService.getDashboardStats();
      setDashboardStats(stats);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };
  console.log('🔍 Debug Admin Check:', {
    user: user,
    isAuthenticated: isAuthenticated,
    isAdmin: isAdmin,
    userEmail: user?.email,
    checkingAdmin: checkingAdmin
  });
  // Mostra loading enquanto verifica admin
  if (checkingAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="bg-card border-border max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Verificando permissões...</h3>
            <p className="text-muted-foreground">Aguarde um momento</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="bg-card border-border max-w-md">
          <CardContent className="pt-6 text-center">
            <Shield className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Acesso Negado</h3>
            <p className="text-muted-foreground mb-4">Você não tem permissão para acessar esta área</p>
            <Button onClick={() => navigate('/')} className="w-full">
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Helmet>
        <title>Administração - iFootball</title>
        <meta name="description" content="Painel administrativo do iFootball" />
      </Helmet>

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Crown className="h-8 w-8 text-accent" />
          <h1 className="text-4xl font-bold text-foreground">Administração</h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Painel de controle e gerenciamento do sistema
        </p>
      </div>        {/* Dashboard Overview */}
        {dashboardStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-primary" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Usuários</p>
                    <p className="text-2xl font-bold text-foreground">{dashboardStats.totalUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-primary" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Usuários Ativos</p>
                    <p className="text-2xl font-bold text-foreground">{dashboardStats.activeUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Crown className="h-8 w-8 text-accent" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Convites</p>
                    <p className="text-2xl font-bold text-foreground">{dashboardStats.totalInviteCodes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-secondary" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Convites Usados</p>
                    <p className="text-2xl font-bold text-foreground">{dashboardStats.usedInviteCodes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 bg-card border-border">
            <TabsTrigger value="invites" className="data-[state=active]:bg-primary">
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Convites</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-primary">
              <Activity className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Usuários</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary">
              <BarChart3 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary">
              <Settings className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Config</span>
            </TabsTrigger>
            <TabsTrigger value="database" className="data-[state=active]:bg-primary">
              <Database className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Dados</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-primary">
              <Shield className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Sistema</span>
            </TabsTrigger>
          </TabsList>

          {/* Convites */}
          <TabsContent value="invites" className="space-y-6">
            <AdminInviteManager />
          </TabsContent>          {/* Usuários */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Gerenciamento de Usuários
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p className="mb-4">🚧 <strong>Em desenvolvimento:</strong></p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Lista de usuários registrados</li>
                  <li>Status das licenças</li>
                  <li>Histórico de uso</li>
                  <li>Gerenciamento de permissões</li>
                  <li>Suporte ao cliente</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Analytics e Relatórios
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p className="mb-4">📊 <strong>Métricas planejadas:</strong></p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Usuários</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Registros por dia/mês</li>
                      <li>Conversão de convites</li>
                      <li>Retenção de usuários</li>
                      <li>Upgrades para premium</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Sistema</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Uso da API</li>
                      <li>Análises realizadas</li>
                      <li>Performance do sistema</li>
                      <li>Receita gerada</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configurações */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Configurações do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p className="mb-4">⚙️ <strong>Configurações disponíveis:</strong></p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Parâmetros de licenças</li>
                  <li>Limites de uso</li>
                  <li>Configuração de gateway de pagamento</li>
                  <li>Notificações por email</li>
                  <li>Manutenção do sistema</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Database */}
          <TabsContent value="database" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Gerenciamento de Dados
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p className="mb-4">🗄️ <strong>Operações de dados:</strong></p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Backup do banco de dados</li>
                  <li>Limpeza de dados antigos</li>
                  <li>Importação/Exportação</li>
                  <li>Otimização de performance</li>
                  <li>Logs do sistema</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sistema */}
          <TabsContent value="system" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Status do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p className="mb-4">🔧 <strong>Monitoramento MVP:</strong></p>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">API Football</h4>
                    <p className="text-primary">✅ Endpoints funcionais: jogadores, times</p>
                    <p className="text-accent">⚠️ Fallback ativo: partidas, ligas, estatísticas</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">Sistema de Licenças</h4>
                    <p className="text-primary">✅ Convites funcionais</p>
                    <p className="text-accent">🚧 Gateway de pagamento: em desenvolvimento</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">Análises</h4>
                    <p className="text-primary">✅ Análise básica funcional</p>
                    <p className="text-accent">🚧 Análise de vídeo: futuro</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  );
};

export default AdminPage;
