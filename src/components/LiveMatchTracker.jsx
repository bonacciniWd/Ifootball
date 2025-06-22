import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { gameService } from '@/services/gameService';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown,
  Activity,
  DollarSign,
  BarChart3,
  Clock,
  Zap,
  AlertTriangle
} from 'lucide-react';

const LiveMatchTracker = ({ eventId, countryCode = 'BR' }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [oddsHistory, setOddsHistory] = useState([]);
  const intervalRef = useRef(null);
  
  const { toast } = useToast();

  useEffect(() => {
    if (eventId && isTracking) {
      startTracking();
    } else {
      stopTracking();
    }

    return () => stopTracking();
  }, [eventId, isTracking]);

  const startTracking = () => {
    console.log(`🎯 Iniciando tracking ao vivo para evento ${eventId}`);
    
    // Carrega dados iniciais
    loadLiveData();
    
    // Configura atualização automática a cada 30 segundos
    intervalRef.current = setInterval(() => {
      loadLiveData();
    }, 30000);
  };

  const stopTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const loadLiveData = async () => {
    if (!eventId) return;
    
    setLoading(true);
    try {
      const data = await gameService.getLiveAnalysisData(eventId, countryCode);
      
      setLiveData(data);
      setLastUpdate(new Date());
      
      // Salva histórico de odds para comparação
      if (data.odds?.response) {
        setOddsHistory(prev => {
          const newHistory = [...prev, {
            timestamp: new Date(),
            odds: data.odds.response
          }].slice(-10); // Mantém apenas últimas 10 atualizações
          return newHistory;
        });
      }

      if (isTracking) {
        toast({
          title: "Dados atualizados! 🔄",
          description: `Evento ${eventId} - ${new Date().toLocaleTimeString()}`,
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados ao vivo:', error);
      toast({
        title: "Erro na atualização",
        description: "Não foi possível atualizar os dados ao vivo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleTracking = () => {
    setIsTracking(!isTracking);
  };

  const calculateOddsChange = (marketName, outcomeName) => {
    if (oddsHistory.length < 2) return null;
    
    const current = oddsHistory[oddsHistory.length - 1];
    const previous = oddsHistory[oddsHistory.length - 2];
    
    const currentOdds = current.odds.bookmakers?.[0]?.markets
      ?.find(m => m.name === marketName)
      ?.outcomes?.find(o => o.name === outcomeName)?.odds;
    
    const previousOdds = previous.odds.bookmakers?.[0]?.markets
      ?.find(m => m.name === marketName)
      ?.outcomes?.find(o => o.name === outcomeName)?.odds;
    
    if (currentOdds && previousOdds) {
      const change = ((parseFloat(currentOdds) - parseFloat(previousOdds)) / parseFloat(previousOdds)) * 100;
      return {
        percentage: change,
        direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
        current: currentOdds,
        previous: previousOdds
      };
    }
    
    return null;
  };

  const renderMatchInfo = () => {
    if (!liveData?.stats?.response?.match) return null;
    
    const match = liveData.stats.response.match;
    
    return (
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="flex flex-col items-center">
            <img 
              src={match.teams?.home?.logo || 'https://via.placeholder.com/40'} 
              alt="Home team"
              className="w-10 h-10 mb-2"
            />
            <p className="text-white font-medium">{match.teams?.home?.name}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="bg-slate-700 rounded-lg px-4 py-2 mb-2">
            <span className="text-2xl font-bold text-white">
              {match.goals?.home ?? 0} - {match.goals?.away ?? 0}
            </span>
          </div>
          <Badge variant={match.fixture?.status?.short === 'LIVE' ? 'destructive' : 'secondary'}>
            {match.fixture?.status?.short} {match.fixture?.status?.elapsed && `${match.fixture.status.elapsed}'`}
          </Badge>
        </div>
        
        <div>
          <div className="flex flex-col items-center">
            <img 
              src={match.teams?.away?.logo || 'https://via.placeholder.com/40'} 
              alt="Away team"
              className="w-10 h-10 mb-2"
            />
            <p className="text-white font-medium">{match.teams?.away?.name}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderStatistics = () => {
    if (!liveData?.stats?.response?.statistics) return null;
    
    const stats = liveData.stats.response.statistics;
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-slate-400 text-sm">Posse de Bola</p>
          <div className="flex justify-between text-white font-semibold">
            <span>{stats.possession?.home}%</span>
            <span>{stats.possession?.away}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-1">
            <div 
              className="bg-blue-500 h-2 rounded-full" 
              style={{ width: `${stats.possession?.home || 50}%` }}
            ></div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-slate-400 text-sm">Finalizações</p>
          <div className="flex justify-between text-white font-semibold">
            <span>{stats.shots?.home}</span>
            <span>{stats.shots?.away}</span>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-slate-400 text-sm">Escanteios</p>
          <div className="flex justify-between text-white font-semibold">
            <span>{stats.corners?.home}</span>
            <span>{stats.corners?.away}</span>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-slate-400 text-sm">Faltas</p>
          <div className="flex justify-between text-white font-semibold">
            <span>{stats.fouls?.home}</span>
            <span>{stats.fouls?.away}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderOdds = () => {
    if (!liveData?.odds?.response?.bookmakers?.[0]?.markets) return null;
    
    const markets = liveData.odds.response.bookmakers[0].markets;
    
    return (
      <div className="space-y-4">
        {markets.map((market, index) => (
          <div key={index}>
            <h4 className="text-white font-medium mb-2 flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              {market.name}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {market.outcomes?.map((outcome, outcomeIndex) => {
                const change = calculateOddsChange(market.name, outcome.name);
                
                return (
                  <div 
                    key={outcomeIndex} 
                    className="bg-slate-700 p-3 rounded-lg text-center relative"
                  >
                    <p className="text-slate-300 text-sm">{outcome.name}</p>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-white font-bold text-lg">{outcome.odds}</span>
                      {change && change.direction !== 'stable' && (
                        <div className={`flex items-center ${
                          change.direction === 'up' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {change.direction === 'up' ? 
                            <TrendingUp className="h-3 w-3" /> : 
                            <TrendingDown className="h-3 w-3" />
                          }
                          <span className="text-xs ml-1">
                            {Math.abs(change.percentage).toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Controles */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Tracking Ao Vivo - Evento {eventId}
            </div>
            <div className="flex items-center space-x-2">
              {lastUpdate && (
                <span className="text-slate-400 text-sm">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {lastUpdate.toLocaleTimeString()}
                </span>
              )}
              <Button
                onClick={toggleTracking}
                variant={isTracking ? "destructive" : "default"}
                size="sm"
                disabled={loading}
                className="flex items-center space-x-2"
              >
                {isTracking ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{isTracking ? 'Pausar' : 'Iniciar'}</span>
              </Button>
              <Button
                onClick={loadLiveData}
                variant="outline"
                size="sm"
                disabled={loading}
                className="border-slate-600 text-slate-300"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isTracking ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className="text-slate-300">
                {isTracking ? 'Tracking Ativo' : 'Tracking Pausado'}
              </span>
            </div>
            {isTracking && (
              <div className="flex items-center space-x-2 text-slate-400">
                <Zap className="h-3 w-3" />
                <span>Atualização automática a cada 30s</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Informações da Partida */}
      {liveData && (
        <>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Informações da Partida
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderMatchInfo()}
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Estatísticas ao Vivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderStatistics()}
            </CardContent>
          </Card>

          {/* Odds */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Odds ao Vivo
                {oddsHistory.length > 1 && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    Mudanças detectadas
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderOdds()}
            </CardContent>
          </Card>
        </>
      )}

      {/* Alertas */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Informações
          </CardTitle>
        </CardHeader>
        <CardContent className="text-slate-400 space-y-2">
          <p>🔴 <strong>Dados Reais:</strong> Este componente utiliza dados ao vivo da API</p>
          <p>⚡ <strong>Atualização:</strong> Automática a cada 30 segundos quando ativo</p>
          <p>📊 <strong>Histórico:</strong> Rastreia mudanças de odds para detectar oportunidades</p>
          <p>🎯 <strong>MVP:</strong> Sistema de tracking em tempo real funcional</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveMatchTracker;
