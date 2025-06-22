import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, CheckCircle, AlertTriangle, Target, Shield, Users, Clock, Loader2, Plus, ArrowRight, Bell, TrendingUp, TrendingDown, CornerDownRight } from 'lucide-react';
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

const StatCard = ({ title, value, icon, color = "text-primary", unit = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="glassmorphism-card hover:border-primary/70 transition-all">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-300">{title}</CardTitle>
        {React.cloneElement(icon, { className: `h-5 w-5 ${color}` })}
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${color}`}>{value}{unit}</div>
      </CardContent>
    </Card>
  </motion.div>
);

const AlertCard = ({ alert }) => {
  const severityColors = {
    high: 'border-red-500 bg-red-950/20',
    medium: 'border-yellow-500 bg-yellow-950/20',
    low: 'border-blue-500 bg-blue-950/20'
  };

  const severityIcons = {
    high: <Bell className="h-5 w-5 text-red-400" />,
    medium: <TrendingUp className="h-5 w-5 text-yellow-400" />,
    low: <TrendingDown className="h-5 w-5 text-blue-400" />
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-lg border ${severityColors[alert.severity]}`}
    >
      <div className="flex items-start space-x-3">
        {severityIcons[alert.severity]}
        <div className="flex-1">
          <p className="font-medium text-white">{alert.message}</p>
          <p className="text-sm text-slate-400 mt-1">{alert.recommendation}</p>
          <p className="text-xs text-slate-500 mt-2">
            {new Date(alert.timestamp).toLocaleTimeString('pt-BR')}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const TeamStats = ({ teamName, score, winProbability, fouls, penaltyProb, goalProb, corners, assists, color }) => (
  <div className="space-y-4">
    <h3 className={`text-2xl font-semibold ${color} mb-3`}>{teamName}</h3>
    <StatCard title="Placar Atual" value={score ?? 'N/A'} icon={<Target />} color={color} />
    <StatCard title="Prob. de Vitória" value={winProbability ?? 'N/A'} unit="%" icon={<CheckCircle />} color={color} />
    <StatCard title="Faltas Cometidas" value={fouls ?? 'N/A'} icon={<AlertTriangle />} color={color} />
    <StatCard title="Prob. de Pênalti" value={penaltyProb ?? 'N/A'} unit="%" icon={<Shield />} color={color} />
    <StatCard title="Prob. de Gol (Próx. 10min)" value={goalProb ?? 'N/A'} unit="%" icon={<Target />} color={color} />
    <StatCard title="Escanteios" value={corners ?? 'N/A'} icon={<CornerDownRight />} color={color} />
    <StatCard title="Assistências para Gol" value={assists ?? 'N/A'} icon={<Users />} color={color} />
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
      const data = await gameService.getGameStats('current-game');
      if (data && data.length >= 2) {
        setGameStats({
          teamHome: data[0], 
          teamAway: data[1]  
        });
      }
    } catch (error) {
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
    <>
      <Helmet>
        <title>Análise de Jogo - iFootball</title>
        <meta name="description" content="Acompanhe estatísticas de futebol em tempo real com a IA do iFootball. Placar, probabilidades, faltas e muito mais." />
      </Helmet>
      <div className="space-y-8 py-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold mb-2">Análise de Jogo em <span className="text-primary">Tempo Real</span></h1>
          <p className="text-slate-400">Acompanhe as métricas da partida ao vivo.</p>
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

        {/* Sistema de Alertas de Probabilidades */}
        {selectedMatch && (
          <Card className="glassmorphism-card border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Bell size={24} className="text-primary" />
                  <span>Alertas de Probabilidades</span>
                  {alertsLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                </span>
                <Button
                  onClick={refreshAlerts}
                  variant="outline"
                  size="sm"
                  disabled={alertsLoading}
                  className="flex items-center space-x-2"
                >
                  <TrendingUp size={16} />
                  <span>Atualizar</span>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {probabilityAlerts.length > 0 ? (
                <div className="space-y-3">
                  {probabilityAlerts.map((alert, index) => (
                    <AlertCard key={index} alert={alert} />
                  ))}
                  <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
                    <p className="text-sm text-slate-400">
                      💡 <strong>MVP:</strong> Este sistema detecta mudanças em tempo real e, no futuro, 
                      será integrado com análise de vídeo via Python para sugestões ainda mais precisas.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Bell size={48} className="mx-auto text-slate-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Nenhum alerta ativo</h3>
                  <p className="text-slate-400 mb-4">
                    O sistema está monitorando mudanças de probabilidades em tempo real.
                  </p>
                  <Button 
                    onClick={refreshAlerts} 
                    variant="outline" 
                    disabled={alertsLoading}
                    className="flex items-center space-x-2"
                  >
                    {alertsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <TrendingUp size={16} />}
                    <span>Verificar Agora</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
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
            <StatCard 
              title="Tempo de Jogo" 
              value={gameStats?.time_played || "Em Tempo Real"} 
              icon={<Clock />} 
              color="text-accent" 
            />
            <StatCard 
              title="Dados da API" 
              value="Ativo" 
              icon={<BarChart />} 
              color="text-green-400" 
            />
            <StatCard 
              title="Cache" 
              value="12h" 
              icon={<Shield />} 
              color="text-blue-400" 
            />
            <StatCard 
              title="Atualizações" 
              value="2x/dia" 
              icon={<Target />} 
              color="text-yellow-400" 
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default GameAnalysisPage;