import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { gameService } from '@/services/gameService';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Trophy, Users, Clock, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { LeagueStandings, RecentMatches, TopPlayers } from '@/components/GameTables';

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
    
    // Escuta eventos de atualização automática
    const handleUpdate = () => {
      loadInitialData();
      updateApiStatus();
    };

    window.addEventListener('footballDataUpdated', handleUpdate);
    
    return () => {
      window.removeEventListener('footballDataUpdated', handleUpdate);
    };
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Carrega dados do cache primeiro
      const status = gameService.getApiStatus();
      setApiStatus(status);

      // Tenta carregar partidas ao vivo
      try {
        const matches = await gameService.getLiveGames();
        setLiveMatches(matches?.response || []);
      } catch (error) {
        console.warn('Erro ao carregar partidas:', error);
      }      // Carrega alguns jogadores
      try {
        const playersData = await gameService.searchPlayers('ronaldo');
        console.log('Players data:', playersData); // Debug
        const playersArray = Array.isArray(playersData?.response) 
          ? playersData.response.slice(0, 5) 
          : Array.isArray(playersData) 
          ? playersData.slice(0, 5) 
          : [];
        setPlayers(playersArray);
      } catch (error) {
        console.warn('Erro ao carregar jogadores:', error);
        setPlayers([]);
      }

      // Carrega classificações
      try {
        const standingsData = await gameService.getStandings();
        setStandings(standingsData?.response?.[0]?.league?.standings?.[0]?.slice(0, 10) || []);
      } catch (error) {
        console.warn('Erro ao carregar classificações:', error);
      }

    } catch (error) {
      console.error('Erro geral ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApiStatus = () => {
    const status = gameService.getApiStatus();
    setApiStatus(status);
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
      {/* Status discreto da atualização */}
      {apiStatus && (
        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            {apiStatus.cacheValid ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-orange-500" />
            )}
            <span className="text-sm text-muted-foreground">
              Dados atualizados: {apiStatus.lastUpdate}
            </span>
          </div>
          {!apiStatus.cacheValid && (
            <div className="flex items-center space-x-1 text-orange-600">
              <RefreshCw className="h-4 w-4" />
              <span className="text-sm">Atualizando...</span>
            </div>
          )}
        </div>
      )}

      {/* Partidas ao vivo */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="h-5 w-5 text-red-500" />
          <h2 className="text-xl font-semibold">Partidas ao Vivo</h2>
          {liveMatches.length > 0 && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
              {liveMatches.length} LIVE
            </span>
          )}
        </div>
        {liveMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveMatches.slice(0, 6).map((match, index) => (
              <div key={index} className="flex flex-col p-4 border rounded-lg hover:bg-gradient-to-tr dark:hover:bg-slate-800 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                    {match.fixture?.status?.elapsed}'
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {match.league?.name}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-3 items-center gap-2">
                    <div className="text-center">
                      <p className="font-medium truncate">{match.teams?.home?.name}</p>
                      <p className="text-xs text-muted-foreground">Casa</p>
                    </div>
                    <div className="text-center font-bold text-lg">
                      {match.goals?.home ?? 0} - {match.goals?.away ?? 0}
                    </div>
                    <div className="text-center">
                      <p className="font-medium truncate">{match.teams?.away?.name}</p>
                      <p className="text-xs text-muted-foreground">Visitante</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Nenhuma partida ao vivo no momento</p>
            <p className="text-sm">Os dados são atualizados automaticamente</p>
          </div>
        )}
      </Card>

      {/* Dados organizados em tabelas mais profissionais */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Classificação */}
        <LeagueStandings 
          standings={standings} 
          leagueName="Premier League" 
        />
        
        {/* Jogadores em Destaque */}
        <TopPlayers players={players} />
      </div>

      {/* Partidas Recentes */}
      <RecentMatches matches={liveMatches} />
    </div>
  );
};
