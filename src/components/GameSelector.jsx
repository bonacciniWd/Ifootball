import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Trophy, 
  Users, 
  Play, 
  Loader2, 
  RefreshCw,
  Target,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { gameService } from '@/services/gameService';

const GameCard = ({ match, onAnalyze, isLoading }) => {
  const getMatchStatus = () => {
    if (!match.fixture) return { text: 'Agendado', color: 'bg-slate-500' };
    
    switch (match.fixture.status?.short) {
      case 'LIVE':
      case '1H':
      case '2H':
      case 'HT':
        return { text: 'Ao Vivo', color: 'bg-red-500 animate-pulse' };
      case 'FT':
        return { text: 'Finalizado', color: 'bg-green-500' };
      case 'NS':
        return { text: 'Não Iniciado', color: 'bg-blue-500' };
      case 'PST':
        return { text: 'Adiado', color: 'bg-yellow-500' };
      default:
        return { text: match.fixture.status?.long || 'Desconhecido', color: 'bg-slate-500' };
    }
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'Data não disponível';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const status = getMatchStatus();
  const isLive = status.text === 'Ao Vivo';
  const canAnalyze = isLive || status.text === 'Finalizado';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className={`glassmorphism-card hover:border-primary/50 transition-all ${isLive ? 'ring-2 ring-red-500/50' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trophy size={16} className="text-primary" />
              <span className="text-sm font-medium text-slate-300">
                {match.league?.name || 'Liga não informada'}
              </span>
            </div>
            <Badge className={`${status.color} text-white text-xs`}>
              {status.text}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Times e Placar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {match.teams?.home?.logo && (
                <img 
                  src={match.teams.home.logo} 
                  alt={match.teams.home.name}
                  className="w-8 h-8 object-contain"
                />
              )}
              <div className="text-left">
                <p className="font-semibold text-white">
                  {match.teams?.home?.name || 'Time Casa'}
                </p>
                <p className="text-xs text-slate-400">Casa</p>
              </div>
            </div>
            
            <div className="text-center">
              {match.goals && (match.goals.home !== null || match.goals.away !== null) ? (
                <div className="text-2xl font-bold text-primary">
                  {match.goals.home} - {match.goals.away}
                </div>
              ) : (
                <div className="text-lg text-slate-400">vs</div>
              )}
              {match.fixture?.status?.elapsed && (
                <div className="text-xs text-slate-400 flex items-center justify-center mt-1">
                  <Clock size={12} className="mr-1" />
                  {match.fixture.status.elapsed}'
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="font-semibold text-white">
                  {match.teams?.away?.name || 'Time Visitante'}
                </p>
                <p className="text-xs text-slate-400">Visitante</p>
              </div>
              {match.teams?.away?.logo && (
                <img 
                  src={match.teams.away.logo} 
                  alt={match.teams.away.name}
                  className="w-8 h-8 object-contain"
                />
              )}
            </div>
          </div>

          {/* Informações da Partida */}
          <div className="flex items-center justify-between text-sm text-slate-400">
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>{formatDateTime(match.fixture?.timestamp)}</span>
            </div>
            {match.fixture?.venue?.name && (
              <div className="flex items-center space-x-1">
                <MapPin size={14} />
                <span className="truncate max-w-[150px]">{match.fixture.venue.name}</span>
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="flex space-x-2 pt-2">
            <Button
              onClick={() => onAnalyze(match)}
              disabled={!canAnalyze || isLoading}
              className="flex-1 flex items-center justify-center space-x-2"
              variant={isLive ? "default" : "outline"}
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Target size={16} />
              )}
              <span>
                {isLive ? 'Analisar Ao Vivo' : 'Ver Análise'}
              </span>
            </Button>
            
            {!canAnalyze && (
              <Button variant="ghost" size="sm" disabled className="text-slate-500">
                <AlertCircle size={16} className="mr-1" />
                Indisponível
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const GameSelector = ({ onGameSelect }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
        await gameService.forceUpdateCache();
      } else {
        setLoading(true);
      }

      const response = await gameService.getLiveGames();
      
      if (response?.response) {
        // Filtrar e ordenar jogos: ao vivo primeiro, depois por data
        const sortedMatches = response.response
          .filter(match => match.fixture && match.teams)
          .sort((a, b) => {
            // Prioridade: jogos ao vivo primeiro
            const aIsLive = ['LIVE', '1H', '2H', 'HT'].includes(a.fixture?.status?.short);
            const bIsLive = ['LIVE', '1H', '2H', 'HT'].includes(b.fixture?.status?.short);
            
            if (aIsLive && !bIsLive) return -1;
            if (!aIsLive && bIsLive) return 1;
            
            // Depois por timestamp (mais recente primeiro)
            return (b.fixture?.timestamp || 0) - (a.fixture?.timestamp || 0);
          });

        setMatches(sortedMatches);
        
        toast({
          title: "Jogos carregados",
          description: `${sortedMatches.length} jogos encontrados`,
        });
      } else {
        setMatches([]);
        toast({
          title: "Nenhum jogo encontrado",
          description: "Tente novamente mais tarde",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao carregar jogos:', error);
      toast({
        title: "Erro ao carregar jogos",
        description: "Verifique sua conexão e tente novamente",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAnalyzeGame = async (match) => {
    setSelectedMatchId(match.fixture?.id);
    
    try {
      // Aqui você pode adicionar lógica para preparar dados específicos da análise
      if (onGameSelect) {
        await onGameSelect(match);
      }
      
      toast({
        title: "Jogo selecionado",
        description: `Análise de ${match.teams?.home?.name} vs ${match.teams?.away?.name}`,
      });
    } catch (error) {
      console.error('Erro ao selecionar jogo:', error);
      toast({
        title: "Erro ao selecionar jogo",
        description: "Tente novamente",
        variant: "destructive"
      });
    } finally {
      setSelectedMatchId(null);
    }
  };

  const liveMatches = matches.filter(match => 
    ['LIVE', '1H', '2H', 'HT'].includes(match.fixture?.status?.short)
  );
  
  const recentMatches = matches.filter(match => 
    !['LIVE', '1H', '2H', 'HT'].includes(match.fixture?.status?.short)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Carregando jogos disponíveis...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Jogos Disponíveis</h2>
          <p className="text-slate-400">Selecione um jogo para análise detalhada</p>
        </div>
        <Button
          onClick={() => loadMatches(true)}
          disabled={refreshing}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          <span>Atualizar</span>
        </Button>
      </div>

      {/* Jogos ao vivo */}
      {liveMatches.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <h3 className="text-xl font-semibold text-white">Ao Vivo</h3>
            <Badge variant="destructive">{liveMatches.length}</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {liveMatches.map((match) => (
              <GameCard
                key={match.fixture?.id || `live-${Math.random()}`}
                match={match}
                onAnalyze={handleAnalyzeGame}
                isLoading={selectedMatchId === match.fixture?.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Jogos recentes/próximos */}
      {recentMatches.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Users size={20} className="text-primary" />
            <h3 className="text-xl font-semibold text-white">Outros Jogos</h3>
            <Badge variant="outline">{recentMatches.length}</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentMatches.slice(0, 12).map((match) => (
              <GameCard
                key={match.fixture?.id || `match-${Math.random()}`}
                match={match}
                onAnalyze={handleAnalyzeGame}
                isLoading={selectedMatchId === match.fixture?.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Estado vazio */}
      {matches.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle size={48} className="mx-auto text-slate-400 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Nenhum jogo encontrado</h3>
          <p className="text-slate-400 mb-6">
            Não há jogos disponíveis no momento. Tente atualizar ou verifique mais tarde.
          </p>
          <Button onClick={() => loadMatches(true)} variant="outline">
            <RefreshCw size={16} className="mr-2" />
            Tentar Novamente
          </Button>
        </div>
      )}
    </div>
  );
};

export default GameSelector;
