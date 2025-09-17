import { supabase } from '@/lib/supabaseClient';
import { footballApiService } from './footballApiService';

export const gameService = {
  // Busca estatísticas do jogo do Supabase
  getGameStats: async (gameId) => {
    const { data, error } = await supabase
      .from('game_analysis_stats')
      .select('*')
      .eq('game_id', gameId);
    
    if (error) {
      console.error('Error fetching game stats:', error.message);
      throw error;
    }
    return data;
  },

  // Adiciona estatística de jogo no Supabase
  addGameStat: async (statData) => {
    const { data, error } = await supabase
      .from('game_analysis_stats')
      .insert([statData])
      .select();
    
    if (error) {
      console.error('Error adding game stat:', error.message);
      throw error;
    }
    return data;
  },

  // Busca jogos ao vivo da API (DADOS REAIS)
  getLiveGames: async () => {
    try {
      const matches = await footballApiService.getLiveMatches();
      console.log(`🔴 ${matches?.length || 0} partidas ao vivo carregadas`);
      return matches;
    } catch (error) {
      console.error('Error fetching live games:', error);
      // Retornar array vazio em vez de throw para não quebrar a aplicação
      return [];
    }
  },

  // Busca odds ao vivo para um evento específico (SIMULADO)
  getLiveOdds: async (eventId, countryCode = 'BR') => {
    try {
      // Método não implementado ainda, retornar dados simulados
      console.log(`🎲 Odds simuladas para evento ${eventId}`);
      return {
        eventId,
        odds: {
          home: 2.1,
          draw: 3.2,
          away: 3.8
        },
        simulated: true
      };
    } catch (error) {
      console.error(`Error fetching live odds for event ${eventId}:`, error);
      return null;
    }
  },

  // Busca estatísticas ao vivo de um evento (SIMULADO)
  getLiveEventStats: async (eventId) => {
    try {
      // Método não implementado ainda, retornar dados simulados
      console.log(`📊 Stats simuladas para evento ${eventId}`);
      return {
        eventId,
        stats: {
          possession: { home: 55, away: 45 },
          shots: { home: 8, away: 5 },
          corners: { home: 4, away: 2 }
        },
        simulated: true
      };
    } catch (error) {
      console.error(`Error fetching live stats for event ${eventId}:`, error);
      return null;
    }
  },

  // Dados completos para análise ao vivo de um jogo
  getLiveAnalysisData: async (eventId, countryCode = 'BR') => {
    try {
      console.log(`🎯 Carregando análise completa ao vivo para evento ${eventId}`);
      
      const [liveStats, liveOdds] = await Promise.allSettled([
        gameService.getLiveEventStats(eventId),
        gameService.getLiveOdds(eventId, countryCode)
      ]);

      return {
        eventId,
        realTime: true,
        stats: liveStats.status === 'fulfilled' ? liveStats.value : null,
        odds: liveOdds.status === 'fulfilled' ? liveOdds.value : null,
        timestamp: new Date().toISOString(),
        note: 'Dados ao vivo para análise em tempo real'
      };
    } catch (error) {
      console.error(`Error getting live analysis data for event ${eventId}:`, error);
      throw error;
    }
  },

  // Busca jogadores
  searchPlayers: async (searchTerm = 'm') => {
    try {
      const players = await footballApiService.searchPlayers(searchTerm);
      return players;
    } catch (error) {
      console.error('Error searching players:', error);
      // Retornar array vazio em vez de throw
      return [];
    }
  },

  // Busca times
  searchTeams: async (searchTerm = 'manchester') => {
    try {
      const teams = await footballApiService.getTeams();
      // Filtrar por termo de busca
      return teams.filter(team => 
        team.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.team?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching teams:', error);
      return [];
    }
  },

  // Busca classificações
  getStandings: async (leagueId = '39') => {
    try {
      const standings = await footballApiService.getStandings(leagueId);
      return standings;
    } catch (error) {
      console.error('Error fetching standings:', error);
      throw error;
    }
  },

  // Força atualização do cache
  forceUpdateCache: async () => {
    try {
      return await footballApiService.forceUpdateCache();
    } catch (error) {
      console.error('Error updating cache:', error);
      throw error;
    }
  },

  // Verifica status da API
  getApiStatus: () => {
    return footballApiService.getApiStatus();
  },

  // Limpa cache
  clearCache: () => {
    footballApiService.clearCache();
  },

  // Salva análise de jogo na tabela analyzed_games (usando UPSERT para evitar duplicatas)
  saveGameAnalysis: async (userId, gameData, analysisData) => {
    try {
      const gameId = gameData.fixture?.id?.toString() || `game_${Date.now()}`;
      
      const gameAnalysis = {
        user_id: userId,
        game_id: gameId,
        league_id: gameData.league?.id?.toString() || null,
        home_team: gameData.teams?.home?.name || 'Unknown',
        away_team: gameData.teams?.away?.name || 'Unknown',
        game_date: gameData.fixture?.date || new Date().toISOString(),
        analysis_data: analysisData
      };

      // Usar UPSERT para evitar duplicatas (com base na constraint UNIQUE user_id + game_id)
      const { data, error } = await supabase
        .from('analyzed_games')
        .upsert(gameAnalysis, { 
          onConflict: 'user_id,game_id',
          ignoreDuplicates: false 
        })
        .select();

      if (error) {
        console.error('Error saving game analysis:', error);
        throw error;
      }

      console.log(`✅ Análise do jogo ${gameId} salva/atualizada para usuário ${userId}`);
      return data[0];
    } catch (error) {
      console.error('Error in saveGameAnalysis:', error);
      throw error;
    }
  },

  // Busca análises de jogos do usuário
  getUserGameAnalyses: async (userId, limit = 10) => {
    try {
      const { data, error } = await supabase
        .from('analyzed_games')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching user game analyses:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserGameAnalyses:', error);
      throw error;
    }
  },

  // Busca análise específica de um jogo
  getGameAnalysis: async (userId, gameId) => {
    try {
      const { data, error } = await supabase
        .from('analyzed_games')
        .select('*')
        .eq('user_id', userId)
        .eq('game_id', gameId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching game analysis:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getGameAnalysis:', error);
      throw error;
    }
  },

  // Remove análise de jogo
  deleteGameAnalysis: async (userId, gameId) => {
    try {
      const { error } = await supabase
        .from('analyzed_games')
        .delete()
        .eq('user_id', userId)
        .eq('game_id', gameId);

      if (error) {
        console.error('Error deleting game analysis:', error);
        throw error;
      }

      console.log(`🗑️ Análise do jogo ${gameId} removida para usuário ${userId}`);
      return true;
    } catch (error) {
      console.error('Error in deleteGameAnalysis:', error);
      throw error;
    }
  },

  // =====================================================
  // MÉTODOS DE BUSCA AVANÇADA
  // =====================================================

  // Busca ligas/campeonatos
  searchLeagues: async (searchTerm = '') => {
    try {
      const leagues = await footballApiService.getAllLeagues();
      
      if (!searchTerm.trim()) {
        return leagues;
      }

      // Filtra ligas por nome ou país
      const filtered = {
        ...leagues,
        response: leagues.response.filter(item => 
          item.league.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.country.code.toLowerCase() === searchTerm.toLowerCase()
        )
      };

      console.log(`🔍 Encontradas ${filtered.response.length} ligas para "${searchTerm}"`);
      return filtered;
    } catch (error) {
      console.error('Error searching leagues:', error);
      throw error;
    }
  },

  // Busca por país
  searchByCountry: async (countryName) => {
    try {
      const leagues = await footballApiService.getAllLeagues();
      
      const filtered = {
        ...leagues,
        response: leagues.response.filter(item => 
          item.country.name.toLowerCase().includes(countryName.toLowerCase()) ||
          item.country.code.toLowerCase() === countryName.toLowerCase()
        )
      };

      console.log(`🌍 Encontradas ${filtered.response.length} ligas para país "${countryName}"`);
      return filtered;
    } catch (error) {
      console.error('Error searching by country:', error);
      throw error;
    }
  },

  // Busca partidas por liga específica
  searchMatchesByLeague: async (leagueId, season = '2024') => {
    try {
      const matches = await footballApiService.getMatchesByLeague(leagueId, season);
      console.log(`⚽ Encontradas ${matches.response?.length || 0} partidas para liga ${leagueId}`);
      return matches;
    } catch (error) {
      console.error('Error searching matches by league:', error);
      throw error;
    }
  },

  // Busca partidas por data
  searchMatchesByDate: async (date) => {
    try {
      const matches = await footballApiService.getMatchesByDate(date);
      console.log(`📅 Encontradas ${matches.response?.length || 0} partidas para ${date}`);
      return matches;
    } catch (error) {
      console.error('Error searching matches by date:', error);
      throw error;
    }
  },

  // Busca times por país/liga
  searchTeamsByRegion: async (region) => {
    try {
      // Primeiro busca ligas da região
      const leagues = await gameService.searchByCountry(region);
      
      if (!leagues.response?.length) {
        return { status: 'success', response: [], message: `Nenhuma liga encontrada para ${region}` };
      }

      // Para cada liga, busca partidas recentes para obter times
      const allTeams = new Set();
      
      for (const leagueItem of leagues.response.slice(0, 3)) { // Limita a 3 ligas para performance
        try {
          const matches = await footballApiService.getMatchesByLeague(leagueItem.league.id, '2024');
          
          matches.response?.forEach(match => {
            if (match.teams?.home) {
              allTeams.add(JSON.stringify({
                id: match.teams.home.id,
                name: match.teams.home.name,
                logo: match.teams.home.logo,
                league: leagueItem.league.name,
                country: leagueItem.country.name
              }));
            }
            if (match.teams?.away) {
              allTeams.add(JSON.stringify({
                id: match.teams.away.id,
                name: match.teams.away.name,
                logo: match.teams.away.logo,
                league: leagueItem.league.name,
                country: leagueItem.country.name
              }));
            }
          });
        } catch (err) {
          console.warn(`Erro ao buscar times da liga ${leagueItem.league.name}:`, err);
        }
      }

      const teams = Array.from(allTeams).map(teamStr => JSON.parse(teamStr));
      console.log(`🏟️ Encontrados ${teams.length} times para região "${region}"`);
      
      return {
        status: 'success',
        response: teams,
        message: `${teams.length} times encontrados em ${region}`
      };
    } catch (error) {
      console.error('Error searching teams by region:', error);
      throw error;
    }
  },

  // Busca global (times, ligas, países)
  globalSearch: async (searchTerm) => {
    try {
      console.log(`🔍 Busca global por: "${searchTerm}"`);
      
      const [players, teams, leagues] = await Promise.allSettled([
        footballApiService.searchPlayers(searchTerm),
        footballApiService.searchTeams(searchTerm),
        gameService.searchLeagues(searchTerm)
      ]);

      return {
        status: 'success',
        response: {
          players: players.status === 'fulfilled' ? players.value : { response: [] },
          teams: teams.status === 'fulfilled' ? teams.value : { response: [] },
          leagues: leagues.status === 'fulfilled' ? leagues.value : { response: [] },
          searchTerm,
          timestamp: new Date().toISOString()
        },
        summary: {
          playersFound: players.status === 'fulfilled' ? players.value?.response?.length || 0 : 0,
          teamsFound: teams.status === 'fulfilled' ? teams.value?.response?.length || 0 : 0,
          leaguesFound: leagues.status === 'fulfilled' ? leagues.value?.response?.length || 0 : 0
        }
      };
    } catch (error) {
      console.error('Error in global search:', error);
      throw error;
    }
  },

  // Ligas principais (acesso rápido)
  getMainLeagues: async () => {
    try {
      const mainLeagueIds = [39, 140, 78, 135, 61, 71]; // Premier, La Liga, Bundesliga, Serie A, Ligue 1, Brasileirão
      const leagues = await footballApiService.getAllLeagues();
      
      const mainLeagues = {
        ...leagues,
        response: leagues.response.filter(item => 
          mainLeagueIds.includes(item.league.id)
        )
      };

      console.log(`⭐ ${mainLeagues.response.length} ligas principais carregadas`);
      return mainLeagues;
    } catch (error) {
      console.error('Error getting main leagues:', error);
      throw error;
    }
  },

  // Países disponíveis
  getAvailableCountries: async () => {
    try {
      const leagues = await footballApiService.getAllLeagues();
      
      const countries = leagues.response.reduce((acc, item) => {
        if (!acc.find(c => c.code === item.country.code)) {
          acc.push({
            name: item.country.name,
            code: item.country.code,
            flag: item.country.flag,
            leaguesCount: leagues.response.filter(l => l.country.code === item.country.code).length
          });
        }
        return acc;
      }, []);

      countries.sort((a, b) => b.leaguesCount - a.leaguesCount); // Ordena por quantidade de ligas
      
      console.log(`🌍 ${countries.length} países disponíveis`);
      return {
        status: 'success',
        response: countries,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting countries:', error);
      throw error;
    }
  },
};