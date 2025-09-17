import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, CheckCircle, AlertTriangle, Target, Shield, Users, Clock, Loader2, Plus, ArrowRight, Bell, TrendingUp, TrendingDown, CornerDownRight, Activity, Zap, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useToast } from '@/components/ui/use-toast';
import { gameService } from '@/services/gameService';
import { footballApiService } from '@/services/footballApiService';
import { licenseService } from '@/services/licenseService';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { FootballDashboard } from '@/components/FootballDashboardUser';
import VideoStream from '@/components/VideoStream';
import AnimatedAlert from '@/components/ui/animated-alert';
import AnimatedChart from '@/components/ui/animated-chart';
import MetricCard from '@/components/ui/metric-card';
import DateTimePicker from '@/components/ui/datetime-picker';
import ApiStatusMonitor from '@/components/ApiStatusMonitor';
import { cn } from '@/lib/utils';

const AlertCard = ({ alert, delay = 0 }) => {
  const typeMap = {
    high: 'error',
    medium: 'warning', 
    low: 'info'
  };

  return (
    <AnimatedAlert
      type={typeMap[alert.severity] || 'info'}
      title={alert.title}
      description={alert.description}
      delay={delay}
    />
  );
};

const TeamStats = ({ teamName, score, winProbability, fouls, penaltyProb, goalProb, corners, assists, color }) => (
  <div className="space-y-4">
    <h3 className={`text-2xl font-semibold ${color} mb-3`}>{teamName}</h3>
    <MetricCard title="Placar Atual" value={score ?? 'N/A'} icon={<Target />} color={color} delay={0} />
    <MetricCard title="Prob. de Vitória" value={winProbability ?? 'N/A'} unit="%" icon={<CheckCircle />} color={color} delay={0.1} />
    <MetricCard title="Faltas Cometidas" value={fouls ?? 'N/A'} icon={<AlertTriangle />} color={color} delay={0.2} />
    <MetricCard title="Prob. de Pênalti" value={penaltyProb ?? 'N/A'} unit="%" icon={<Shield />} color={color} delay={0.3} />
    <MetricCard title="Prob. de Gol (Próx. 10min)" value={goalProb ?? 'N/A'} unit="%" icon={<Target />} color={color} delay={0.4} />
    <MetricCard title="Escanteios" value={corners ?? 'N/A'} icon={<CornerDownRight />} color={color} delay={0.5} />
    <MetricCard title="Assistências para Gol" value={assists ?? 'N/A'} icon={<Users />} color={color} delay={0.6} />
  </div>
);

const GameAnalysisPage = () => {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();
  const [gameStats, setGameStats] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [probabilityAlerts, setProbabilityAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertsLoading, setAlertsLoading] = useState(false);

  useEffect(() => {
    // Verificar se há um jogo selecionado vindo da navegação
    if (location.state?.selectedMatch) {
      setSelectedMatch(location.state.selectedMatch);
      loadGameAnalysis(location.state.selectedMatch);
    } else {
      // Tentar carregar do localStorage
      const storedMatch = localStorage.getItem('selectedMatch');
      if (storedMatch) {
        try {
          const match = JSON.parse(storedMatch);
          setSelectedMatch(match);
          loadGameAnalysis(match);
        } catch (error) {
          console.error('Erro ao carregar jogo do localStorage:', error);
        }
      } else if (isAuthenticated) {
        // Se não há jogo selecionado, tenta buscar dados gerais
        loadGeneralStats();
      }
    }
  }, [location.state, isAuthenticated]);

  const loadGameAnalysis = async (match) => {
    if (!match?.fixture?.id) return;
    
    setLoading(true);
    try {
      const stats = await gameService.getGameStats(match.fixture.id);
      setGameStats(stats?.[0] || null);
      
      // Carrega alertas de probabilidades
      loadProbabilityAlerts(match.fixture.id);
      
      // Salva análise no banco de dados
      if (user?.id) {
        const analysisData = {
          stats,
          analysisDate: new Date().toISOString(),
          matchStatus: match.fixture?.status?.short || 'unknown',
          score: match.score || null
        };
        
        await gameService.saveGameAnalysis(user.id, match, analysisData);
        
        // Registra uso no sistema de licenças
        await licenseService.logUsage(user.id, 'game_analyses', {
          game_id: match.fixture.id,
          home_team: match.teams?.home?.name,
          away_team: match.teams?.away?.name,
          analysis_type: 'full_analysis'
        });
      }
      
      toast({
        title: "Análise carregada",
        description: `Dados de ${match.teams?.home?.name} vs ${match.teams?.away?.name}`,
      });
    } catch (error) {
      console.error('Erro ao carregar análise do jogo:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProbabilityAlerts = async (fixtureId) => {
    if (!fixtureId) return;
    
    setAlertsLoading(true);
    try {
      const alertsData = await footballApiService.getProbabilityAlerts(fixtureId);
      setProbabilityAlerts(alertsData.alerts || []);
    } catch (error) {
      console.error('Erro ao carregar alertas:', error);
    } finally {
      setAlertsLoading(false);
    }
  };

  const refreshAlerts = () => {
    if (selectedMatch?.fixture?.id) {
      loadProbabilityAlerts(selectedMatch.fixture.id);
    }
  };

  const loadGeneralStats = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      // Em vez de buscar dados específicos que podem não existir,
      // vamos apenas definir um estado inicial vazio
      setGameStats(null);
      
      // Log para debug
      console.log('🎯 Página de análise carregada sem jogo específico');
      
    } catch (error) {
      console.error('Erro ao carregar estatísticas gerais:', error);
      // Ignora erros - dados da API serão mostrados no FootballDashboard
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGame = () => {
    navigate('/selecionar-jogo');
  };

  const showNotImplementedToast = (feature) => {
    toast({
      title: "🚧 Funcionalidade em Construção!",
      description: `${feature} ainda não foi implementado. Mas não se preocupe, você pode solicitá-la no seu próximo prompt! 🚀`,
      duration: 5000,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-xl text-slate-300">Carregando análise do jogo...</p>
      </div>
    );
  }
  
   if (!isAuthenticated && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
        <AlertTriangle size={48} className="text-yellow-500 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Acesso Restrito</h2>
        <p className="text-slate-400">Você precisa estar logado para visualizar a análise do jogo.</p>
        <Button onClick={() => navigate('/login')} className="mt-6">Fazer Login</Button>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-grid-slate-700/20 relative">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95" />
      
      <div className="relative z-10">
        <Helmet>
          <title>Análise de Jogo - iFootball</title>
          <meta name="description" content="Acompanhe estatísticas de futebol em tempo real com a IA do iFootball. Placar, probabilidades, faltas e muito mais." />
        </Helmet>
        <div className="space-y-8 py-8 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Análise de Jogo em <span className="text-primary">Tempo Real</span></h1>
          <p className="text-slate-400">Acompanhe as métricas da partida ao vivo.</p>
        </motion.div>

        {/* Filtros Avançados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="glassmorphism-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                Filtros de Análise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Período de Análise</label>
                  <DateTimePicker
                    placeholder="Selecionar período"
                    showTime={true}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Tipo de Métrica</label>
                  <select className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-slate-200 text-sm">
                    <option>Todas as Métricas</option>
                    <option>Apenas Ofensivas</option>
                    <option>Apenas Defensivas</option>
                    <option>Probabilidades</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Intervalo de Atualização</label>
                  <select className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-slate-200 text-sm">
                    <option>Tempo Real (5s)</option>
                    <option>Rápido (15s)</option>
                    <option>Normal (30s)</option>
                    <option>Lento (60s)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monitor de APIs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <ApiStatusMonitor />
        </motion.div>

        {/* Seleção de Jogo */}
        <Card className="glassmorphism-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Target size={24} className="text-primary" />
                <span>Jogo Selecionado</span>
              </span>
              <Button
                onClick={handleSelectGame}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Escolher Jogo</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMatch ? (
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center space-x-4">
                  {selectedMatch.teams?.home?.logo && (
                    <img 
                      src={selectedMatch.teams.home.logo} 
                      alt={selectedMatch.teams.home.name}
                      className="w-10 h-10 object-contain"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-white">
                      {selectedMatch.teams?.home?.name || 'Time Casa'} vs {selectedMatch.teams?.away?.name || 'Time Visitante'}
                    </p>
                    <p className="text-sm text-slate-400">
                      {selectedMatch.league?.name || 'Liga'} • {selectedMatch.fixture?.status?.long || 'Status'}
                    </p>
                  </div>
                </div>
                {selectedMatch.teams?.away?.logo && (
                  <img 
                    src={selectedMatch.teams.away.logo} 
                    alt={selectedMatch.teams.away.name}
                    className="w-10 h-10 object-contain"
                  />
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target size={48} className="mx-auto text-slate-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Nenhum jogo selecionado</h3>
                <p className="text-slate-400 mb-4">
                  Escolha um jogo específico para análise detalhada ou veja dados gerais abaixo.
                </p>
                <Button onClick={handleSelectGame} className="flex items-center space-x-2">
                  <ArrowRight size={16} />
                  <span>Selecionar Jogo</span>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Métricas Avançadas com Charts */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          {/* Performance Overview */}
          <Card className="glassmorphism-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatedChart
                data={[
                  { label: 'Posse', value: 65, color: 'from-emerald-500/80 to-emerald-400' },
                  { label: 'Passes', value: 82, color: 'from-blue-500/80 to-blue-400' },
                  { label: 'Finalizações', value: 45, color: 'from-purple-500/80 to-purple-400' },
                  { label: 'Precisão', value: 78, color: 'from-orange-500/80 to-orange-400' },
                  { label: 'Defesas', value: 89, color: 'from-red-500/80 to-red-400' },
                ]}
                height={180}
                className="mt-4"
              />
            </CardContent>
          </Card>

          {/* Live Metrics */}
          <Card className="glassmorphism-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                Métricas em Tempo Real
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <MetricCard
                  title="Intensidade"
                  value="87"
                  unit="%"
                  icon={<Activity />}
                  color="text-red-400"
                  change="5.2"
                  changeType="positive"
                  delay={0}
                  className="w-full"
                />
                <MetricCard
                  title="Momentum"
                  value="73"
                  unit="%"
                  icon={<TrendingUp />}
                  color="text-emerald-400"
                  change="2.8"
                  changeType="positive"
                  delay={0.1}
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <MetricCard
                  title="Pressão"
                  value="91"
                  unit="/min"
                  icon={<Target />}
                  color="text-purple-400"
                  change="1.3"
                  changeType="negative"
                  delay={0.2}
                  className="w-full"
                />
                <MetricCard
                  title="XG Total"
                  value="2.4"
                  icon={<Trophy />}
                  color="text-yellow-400"
                  change="0.6"
                  changeType="positive"
                  delay={0.3}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Advanced Alerts */}
        {probabilityAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-8"
          >
            <Card className="glassmorphism-card border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Alertas Inteligentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {probabilityAlerts.slice(0, 3).map((alert, index) => (
                    <AlertCard key={index} alert={alert} delay={index * 0.1} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Componente de Streaming de Vídeo */}
        <VideoStream 
          title="Transmissão Ao Vivo / Player"
          isLive={selectedMatch?.status?.long === 'Match Finished' ? false : true}
          showControls={true}
        />

        {/* Dashboard com dados reais da API */}
        <FootballDashboard />

        {/* Análise específica do jogo (se disponível) */}
        {gameStats && (
          <Card className="glassmorphism-card">
            <CardHeader>
              <CardTitle className="text-xl">Análise Específica da Partida</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <TeamStats 
                  teamName={gameStats.teamHome?.team_name || "Time Casa"}
                  score={gameStats.teamHome?.score}
                  winProbability={gameStats.teamHome?.win_probability}
                  fouls={gameStats.teamHome?.fouls}
                  penaltyProb={gameStats.teamHome?.penalty_prob}
                  goalProb={gameStats.teamHome?.goal_prob}
                  corners={gameStats.teamHome?.corners}
                  assists={gameStats.teamHome?.assists}
                  color="text-primary"
                />
                <TeamStats 
                  teamName={gameStats.teamAway?.team_name || "Time Visitante"}
                  score={gameStats.teamAway?.score}
                  winProbability={gameStats.teamAway?.win_probability}
                  fouls={gameStats.teamAway?.fouls}
                  penaltyProb={gameStats.teamAway?.penalty_prob}
                  goalProb={gameStats.teamAway?.goal_prob}
                  corners={gameStats.teamAway?.corners}
                  assists={gameStats.teamAway?.assists}
                  color="text-secondary"
                />
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="glassmorphism-card">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Clock size={24} className="mr-2 text-accent" /> 
              Resumo Geral da Partida
            </CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard 
              title="Tempo de Jogo" 
              value={gameStats?.time_played || "Em Tempo Real"} 
              icon={<Clock />} 
              color="text-accent" 
              delay={0}
            />
            <MetricCard 
              title="Dados da API" 
              value="Ativo" 
              icon={<BarChart />} 
              color="text-green-400" 
              delay={0.1}
            />
            <MetricCard 
              title="Cache" 
              value="12h" 
              icon={<Shield />} 
              color="text-blue-400" 
              delay={0.2}
            />
            <MetricCard 
              title="Atualizações" 
              value="2x/dia" 
              icon={<Target />} 
              color="text-yellow-400" 
              delay={0.3}
            />
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default GameAnalysisPage;