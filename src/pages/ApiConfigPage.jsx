import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { footballScheduler } from '@/services/footballScheduler';
import { gameService } from '@/services/gameService';
import { SchedulerControl } from '@/components/SchedulerControl';
import { FootballDashboard } from '@/components/FootballDashboard';
import { 
  Settings, 
  Key, 
  Database, 
  Clock, 
  Activity, 
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Trash2,
  Download,
  Shield
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const ApiConfigPage = () => {
  const [logs, setLogs] = useState([]);
  const [apiStatus, setApiStatus] = useState(null);
  const [schedulerStatus, setSchedulerStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
    
    // Atualiza dados a cada 30 segundos
    const interval = setInterval(loadData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    // Carrega logs de atualização
    const updateLogs = footballScheduler.getStatus();
    setLogs(updateLogs);
    
    // Status da API
    const status = gameService.getApiStatus();
    setApiStatus(status);
    
    // Status do agendador
    const scheduler = footballScheduler.getStatus();
    setSchedulerStatus(scheduler);
  };

  const handleTestConnection = async () => {
    setLoading(true);
    try {
      await gameService.searchPlayers('test');
      toast({
        title: "Conexão Bem-sucedida",
        description: "A API está funcionando corretamente",
      });
    } catch (error) {
      toast({
        title: "Erro de Conexão",
        description: `Falha ao conectar com a API: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = () => {
    gameService.clearCache();
    loadData();
    toast({
      title: "Cache Limpo",
      description: "Todos os dados em cache foram removidos",
    });
  };

  const handleForceUpdate = async () => {
    setLoading(true);
    try {
      await gameService.forceUpdateCache();
      loadData();
      toast({
        title: "Atualização Concluída",
        description: "Dados atualizados com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro na Atualização",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportLogs = () => {
    const logsData = schedulerStatus;
    const dataStr = JSON.stringify(logsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `ifootball-api-logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    toast({
      title: "Logs Exportados",
      description: "Arquivo de logs baixado com sucesso",
    });
  };

  return (
    <>
      <Helmet>
        <title>Configurações da API - iFootball</title>
        <meta name="description" content="Gerencie configurações da API de futebol e monitore o sistema" />
      </Helmet>
        <div className="space-y-6 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-orange-500" />
            <h1 className="text-4xl font-bold">
              Painel <span className="text-orange-500">Administrativo</span>
            </h1>
          </div>
          <p className="text-slate-400">
            Configurações avançadas e monitoramento da API de futebol
          </p>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg mt-4 max-w-2xl mx-auto">
            <p className="text-sm text-orange-700 dark:text-orange-300">
              ⚠️ Esta área é restrita para administradores e desenvolvedores
            </p>
          </div>
        </div>

        {/* Controle do Agendador */}
        <SchedulerControl />

        {/* Dashboard Administrativo */}
        <div className="border-2 border-orange-200 dark:border-orange-800 rounded-lg p-1">
          <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-t mb-4">
            <h3 className="font-semibold text-orange-800 dark:text-orange-200 flex items-center">
              <Database className="h-4 w-4 mr-2" />
              Dashboard Administrativo - Dados da API
            </h3>
          </div>
          <FootballDashboard />
        </div>

        {/* Status Geral */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="glassmorphism-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status da API</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Conectada</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Última verificação: {apiStatus?.lastUpdate || 'Nunca'}
              </p>
            </CardContent>
          </Card>

          <Card className="glassmorphism-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cache</CardTitle>
              <Database className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Badge variant={apiStatus?.cacheValid ? "default" : "secondary"}>
                  {apiStatus?.cacheValid ? "Válido" : "Expirado"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Próxima atualização: {apiStatus?.nextUpdate}
              </p>
            </CardContent>
          </Card>

          <Card className="glassmorphism-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agendador</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Badge variant={schedulerStatus?.active ? "default" : "secondary"}>
                  {schedulerStatus?.active ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {schedulerStatus?.totalUpdates || 0} atualizações realizadas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Configurações da API */}
        <Card className="glassmorphism-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="h-5 w-5" />
              <span>Configurações da API</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">Chave da API</Label>
                <Input
                  id="api-key"
                  type="password"
                  value="dc3111ec46msh067623c04ed1abdp17aa8c***"
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Chave configurada nas variáveis de ambiente
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-host">Host da API</Label>
                <Input
                  id="api-host"
                  value="free-api-live-football-data.p.rapidapi.com"
                  disabled
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endpoints">Endpoints Disponíveis</Label>
              <Textarea
                id="endpoints"
                value={`• /football-live-now - Partidas ao vivo
• /football-players-search - Buscar jogadores  
• /football-teams-search - Buscar times
• /football-league-standings - Classificações`}
                disabled
                rows={4}
              />
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={handleTestConnection}
                disabled={loading}
                variant="outline"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Testar Conexão
              </Button>
              
              <Button 
                onClick={handleForceUpdate}
                disabled={loading}
                variant="outline"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar Agora
              </Button>
              
              <Button 
                onClick={handleClearCache}
                variant="outline"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar Cache
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Limites e Uso */}
        <Card className="glassmorphism-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>Limites e Uso da API</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Limites Mensais</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Limite Total:</span>
                    <Badge variant="outline">100 requests/mês</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Frequência:</span>
                    <Badge variant="outline">2x por dia</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Cache:</span>
                    <Badge variant="outline">12 horas</Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Uso Estimado</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Por dia:</span>
                    <Badge>~8 requests</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Por mês:</span>
                    <Badge>~60 requests</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Margem de segurança:</span>
                    <Badge variant="secondary">40%</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                    Otimização do Uso
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    O sistema foi configurado para fazer apenas 2 requisições por dia (12h e 00h), 
                    mantendo os dados em cache por 12 horas. Isso garante que você use apenas 
                    ~60 requests por mês dos 100 disponíveis.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logs de Atividade */}
        <Card className="glassmorphism-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Logs de Atividade</span>
            </CardTitle>
            <Button onClick={handleExportLogs} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </CardHeader>
          <CardContent>
            {schedulerStatus?.lastUpdate ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Última atualização bem-sucedida</p>
                      <p className="text-sm text-muted-foreground">
                        {schedulerStatus.lastUpdate.time}
                      </p>
                    </div>
                  </div>
                  <Badge>Sucesso</Badge>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>Total de atualizações: {schedulerStatus.totalUpdates}</p>
                  <p>Sucessos: {schedulerStatus.successfulUpdates}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhuma atualização registrada ainda</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ApiConfigPage;
