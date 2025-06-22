import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { gameService } from '@/services/gameService';
import { useToast } from '@/components/ui/use-toast';
import { SchedulerControl } from '@/components/SchedulerControl';
import { Loader2, RefreshCw, Trophy, Users, Clock, Wifi, WifiOff } from 'lucide-react';

export const FootballDashboard = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    loadInitialData();
    updateApiStatus();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Carrega dados do cache primeiro
      const status = gameService.getApiStatus();
      setApiStatus(status);

      if (status.cacheValid) {
        toast({
          title: "Dados Carregados do Cache",
          description: `Última atualização: ${status.lastUpdate}`,
        });
      }

      // Tenta carregar partidas ao vivo
      try {
        const matches = await gameService.getLiveGames();
        setLiveMatches(matches?.response || []);
      } catch (error) {
        console.warn('Erro ao carregar partidas:', error);
      }

      // Carrega alguns jogadores
      try {
        const playersData = await gameService.searchPlayers('ronaldo');
        setPlayers(playersData?.response?.slice(0, 5) || []);
      } catch (error) {
        console.warn('Erro ao carregar jogadores:', error);
      }

      // Carrega classificações
      try {
        const standingsData = await gameService.getStandings();
        setStandings(standingsData?.response?.[0]?.league?.standings?.[0]?.slice(0, 5) || []);
      } catch (error) {
        console.warn('Erro ao carregar classificações:', error);
      }

    } catch (error) {
      toast({
        title: "Erro ao Carregar Dados",
        description: "Alguns dados podem não estar disponíveis",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateApiStatus = () => {
    const status = gameService.getApiStatus();
    setApiStatus(status);
  };

  const handleForceUpdate = async () => {
    setLoading(true);
    try {
      await gameService.forceUpdateCache();
      await loadInitialData();
      toast({
        title: "Cache Atualizado",
        description: "Dados atualizados com sucesso da API",
      });
    } catch (error) {
      toast({
        title: "Erro na Atualização",
        description: "Não foi possível atualizar os dados",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = () => {
    gameService.clearCache();
    setLiveMatches([]);
    setPlayers([]);
    setStandings([]);
    updateApiStatus();
    toast({
      title: "Cache Limpo",
      description: "Todos os dados em cache foram removidos",
    });
  };

  if (loading && !liveMatches.length && !players.length) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando dados do futebol...</span>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Controle do Agendador */}
      <SchedulerControl />

      {/* Status da API */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {apiStatus?.cacheValid ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-orange-500" />
            )}
            <div>
              <h3 className="font-semibold">Status da API</h3>
              <p className="text-sm text-gray-600">
                Última atualização: {apiStatus?.lastUpdate || 'Nunca'}
              </p>
              <p className="text-sm text-gray-600">
                Próxima atualização: {apiStatus?.nextUpdate || 'Pendente'}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={handleForceUpdate} 
              disabled={loading}
              variant="outline"
              size="sm"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Atualizar
            </Button>
            <Button 
              onClick={handleClearCache}
              variant="outline" 
              size="sm"
            >
              Limpar Cache
            </Button>
          </div>
        </div>
      </Card>

      {/* Partidas ao Vivo */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Partidas ao Vivo</h2>
        </div>
        {liveMatches.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {liveMatches.slice(0, 6).map((match, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <p className="font-medium">{match.teams?.home?.name || 'Time A'}</p>
                    <p className="text-gray-600">{match.teams?.away?.name || 'Time B'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {match.goals?.home || 0} - {match.goals?.away || 0}
                    </p>
                    <p className="text-sm text-gray-600">
                      {match.fixture?.status?.long || 'Ao Vivo'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Nenhuma partida ao vivo no momento</p>
        )}
      </Card>

      {/* Classificação */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Trophy className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Classificação</h2>
        </div>
        {standings.length > 0 ? (
          <div className="space-y-2">
            {standings.map((team, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-lg w-8">{team.rank}</span>
                  <img 
                    src={team.team?.logo} 
                    alt={team.team?.name}
                    className="w-6 h-6"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <span className="font-medium">{team.team?.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold">{team.points} pts</span>
                  <div className="text-sm text-gray-600">
                    {team.all?.played}J {team.all?.win}V {team.all?.draw}E {team.all?.lose}D
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Classificação não disponível</p>
        )}
      </Card>

      {/* Jogadores */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Jogadores</h2>
        </div>
        {players.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {players.map((player, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <img 
                    src={player.player?.photo} 
                    alt={player.player?.name}
                    className="w-12 h-12 rounded-full"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/48x48?text=?';
                    }}
                  />
                  <div>
                    <p className="font-medium">{player.player?.name}</p>
                    <p className="text-sm text-gray-600">
                      {player.statistics?.[0]?.team?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {player.player?.age} anos • {player.player?.nationality}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Nenhum jogador carregado</p>
        )}
      </Card>
    </div>
  );
};
