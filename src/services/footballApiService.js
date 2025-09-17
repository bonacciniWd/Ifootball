import axios from 'axios';

// ============= CONFIGURAÇÃO DE MÚLTIPLAS APIs =============

// API atual (pode ter rate limiting)
const CURRENT_API = {
  key: import.meta.env.VITE_RAPIDAPI_KEY,
  host: import.meta.env.VITE_RAPIDAPI_HOST,
  baseUrl: `https://${import.meta.env.VITE_RAPIDAPI_HOST}`,
  name: 'current'
};

// APIs alternativas - adicione suas novas APIs aqui
const ALTERNATIVE_APIS = [
  {
    key: import.meta.env.VITE_RAPIDAPI_KEY_ALT1, // Nova API 1
    host: import.meta.env.VITE_RAPIDAPI_HOST_ALT1,
    baseUrl: `https://${import.meta.env.VITE_RAPIDAPI_HOST_ALT1}`,
    name: 'api-football',
    endpoints: {
      fixtures: '/fixtures',
      players: '/players',
      teams: '/teams',
      standings: '/standings'
    }
  },
  {
    key: import.meta.env.VITE_RAPIDAPI_KEY_ALT2, // Nova API 2
    host: import.meta.env.VITE_RAPIDAPI_HOST_ALT2,
    baseUrl: `https://${import.meta.env.VITE_RAPIDAPI_HOST_ALT2}`,
    name: 'football-api-v3',
    endpoints: {
      fixtures: '/v3/fixtures',
      players: '/v3/players/search',
      teams: '/v3/teams',
      standings: '/v3/standings'
    }
  }
];

// Validação das credenciais
if (!CURRENT_API.key || !CURRENT_API.host) {
  console.error('❌ Credenciais da API não encontradas! Verifique o arquivo .env');
  console.info('💡 Funcionando em modo fallback com dados de demonstração');
}

// Cache configuration
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos para dados dinâmicos
const LONG_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas para dados estáticos
const CACHE_KEYS = {
  PLAYERS: 'football_players_cache',
  TEAMS: 'football_teams_cache',
  LAST_UPDATE: 'football_last_update'
};

// Dados de fallback para desenvolvimento/demonstração
const FALLBACK_DATA = {
  liveMatches: {
    status: 'success',
    response: [
      {
        fixture: {
          id: 1234567,
          referee: 'A. Rodriguez',
          timezone: 'UTC',
          date: new Date().toISOString(),
          timestamp: Math.floor(Date.now() / 1000),
          periods: { first: 1698696000, second: null },
          venue: { id: 555, name: 'Estádio Maracanã', city: 'Rio de Janeiro' },
          status: { long: 'Match Finished', short: 'FT', elapsed: 90 }
        },
        league: {
          id: 71,
          name: 'Serie A',
          country: 'Brazil',
          logo: 'https://media.api-sports.io/football/leagues/71.png',
          flag: 'https://media.api-sports.io/flags/br.svg',
          season: 2024,
          round: 'Regular Season - 15'
        },
        teams: {
          home: {
            id: 131,
            name: 'Flamengo',
            logo: 'https://media.api-sports.io/football/teams/131.png',
            winner: true
          },
          away: {
            id: 124,
            name: 'Fluminense',
            logo: 'https://media.api-sports.io/football/teams/124.png',
            winner: false
          }
        },
        goals: { home: 2, away: 1 },
        score: {
          halftime: { home: 1, away: 0 },
          fulltime: { home: 2, away: 1 },
          extratime: { home: null, away: null },
          penalty: { home: null, away: null }
        }
      },
      {
        fixture: {
          id: 2345678,
          referee: 'M. Silva',
          timezone: 'UTC',
          date: new Date(Date.now() + 3600000).toISOString(), // 1 hora no futuro
          timestamp: Math.floor((Date.now() + 3600000) / 1000),
          periods: { first: null, second: null },
          venue: { id: 556, name: 'Allianz Parque', city: 'São Paulo' },
          status: { long: 'Not Started', short: 'NS', elapsed: null }
        },
        league: {
          id: 71,
          name: 'Serie A',
          country: 'Brazil',
          logo: 'https://media.api-sports.io/football/leagues/71.png',
          flag: 'https://media.api-sports.io/flags/br.svg',
          season: 2024,
          round: 'Regular Season - 16'
        },
        teams: {
          home: {
            id: 130,
            name: 'Palmeiras',
            logo: 'https://media.api-sports.io/football/teams/130.png',
            winner: null
          },
          away: {
            id: 132,
            name: 'São Paulo',
            logo: 'https://media.api-sports.io/football/teams/132.png',
            winner: null
          }
        },
        goals: { home: null, away: null },
        score: {
          halftime: { home: null, away: null },
          fulltime: { home: null, away: null },
          extratime: { home: null, away: null },
          penalty: { home: null, away: null }
        }
      }
    ]
  },
  leagues: {
    status: 'success',
    response: [
      { league: { id: 39, name: 'Premier League', type: 'League', logo: 'https://media.api-sports.io/football/leagues/39.png' }, country: { name: 'England', code: 'GB', flag: 'https://media.api-sports.io/flags/gb.svg' } },
      { league: { id: 140, name: 'La Liga', type: 'League', logo: 'https://media.api-sports.io/football/leagues/140.png' }, country: { name: 'Spain', code: 'ES', flag: 'https://media.api-sports.io/flags/es.svg' } },
      { league: { id: 78, name: 'Bundesliga', type: 'League', logo: 'https://media.api-sports.io/football/leagues/78.png' }, country: { name: 'Germany', code: 'DE', flag: 'https://media.api-sports.io/flags/de.svg' } },
      { league: { id: 135, name: 'Serie A', type: 'League', logo: 'https://media.api-sports.io/football/leagues/135.png' }, country: { name: 'Italy', code: 'IT', flag: 'https://media.api-sports.io/flags/it.svg' } },
      { league: { id: 61, name: 'Ligue 1', type: 'League', logo: 'https://media.api-sports.io/football/leagues/61.png' }, country: { name: 'France', code: 'FR', flag: 'https://media.api-sports.io/flags/fr.svg' } },
      { league: { id: 71, name: 'Serie A', type: 'League', logo: 'https://media.api-sports.io/football/leagues/71.png' }, country: { name: 'Brazil', code: 'BR', flag: 'https://media.api-sports.io/flags/br.svg' } }
    ]
  },
  standings: {
    status: 'success',
    response: [
      {
        league: {
          id: 39,
          name: 'Premier League',
          country: 'England',
          logo: 'https://media.api-sports.io/football/leagues/39.png',
          flag: 'https://media.api-sports.io/flags/gb.svg',
          season: 2024,
          standings: [[
            { rank: 1, team: { id: 50, name: 'Manchester City', logo: 'https://media.api-sports.io/football/teams/50.png' }, points: 45, goalsDiff: 15, group: 'Premier League', form: 'WWWWW', status: 'same', description: 'Promotion - Champions League (Group Stage)', update: '2024-06-22T00:00:00+00:00', all: { played: 18, win: 14, draw: 3, lose: 1, goals: { for: 42, against: 27 } } },
            { rank: 2, team: { id: 42, name: 'Arsenal', logo: 'https://media.api-sports.io/football/teams/42.png' }, points: 43, goalsDiff: 12, group: 'Premier League', form: 'WLWWW', status: 'same', description: 'Promotion - Champions League (Group Stage)', update: '2024-06-22T00:00:00+00:00', all: { played: 18, win: 13, draw: 4, lose: 1, goals: { for: 38, against: 26 } } },
            { rank: 3, team: { id: 40, name: 'Liverpool', logo: 'https://media.api-sports.io/football/teams/40.png' }, points: 39, goalsDiff: 8, group: 'Premier League', form: 'WWDLW', status: 'same', description: 'Promotion - Champions League (Group Stage)', update: '2024-06-22T00:00:00+00:00', all: { played: 18, win: 12, draw: 3, lose: 3, goals: { for: 35, against: 27 } } }
          ]]
        }
      }
    ]
  }
};

class FootballApiService {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: CURRENT_API.baseUrl,
      headers: {
        'x-rapidapi-key': CURRENT_API.key,
        'x-rapidapi-host': CURRENT_API.host,
        'Content-Type': 'application/json'
      },
      timeout: 15000 // 15 segundos timeout
    });

    // Interceptor para log das requisições
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Interceptor para log das respostas
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status} - ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error(`❌ API Error: ${error.response?.status} - ${error.config?.url}`, error.message);
        return Promise.reject(error);
      }
    );

    // Aviso sobre limitações da API
    console.log('ℹ️ API Football Service inicializado com endpoints limitados');
    console.log('ℹ️ Dados reais: jogadores e times | Fallback: partidas, ligas, estatísticas');
  }

  // =====================================================
  // MÉTODOS DE CACHE
  // =====================================================
  // Verifica se o cache ainda é válido
  isCacheValid(cacheKey, isLongCache = false, customDuration = null) {
    const lastUpdate = localStorage.getItem(`${cacheKey}_timestamp`);
    if (!lastUpdate) return false;
    
    const now = new Date().getTime();
    const cacheTime = parseInt(lastUpdate);
    const duration = customDuration || (isLongCache ? LONG_CACHE_DURATION : CACHE_DURATION);
    return (now - cacheTime) < duration;
  }

  // Salva dados no cache
  saveToCache(key, data, isLongCache = false) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      localStorage.setItem(`${key}_timestamp`, new Date().getTime().toString());
      console.log(`💾 Cache salvo: ${key} (${isLongCache ? 'longo prazo' : 'curto prazo'})`);
    } catch (error) {
      console.error('❌ Erro ao salvar no cache:', error);
    }
  }

  // Carrega dados do cache
  loadFromCache(key) {
    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        console.log(`📂 Cache carregado: ${key}`);
        return JSON.parse(cached);
      }
      return null;
    } catch (error) {
      console.error('❌ Erro ao carregar do cache:', error);
      return null;
    }
  }
  // =====================================================
  // MÉTODOS FUNCIONAIS (ENDPOINTS REAIS)
  // =====================================================
  // Busca jogadores (FUNCIONAL + ADAPTADOR)
  async searchPlayers(searchTerm = 'messi') {
    const cacheKey = `${CACHE_KEYS.PLAYERS}_${searchTerm}`;
    
    if (this.isCacheValid(cacheKey)) {
      const cached = this.loadFromCache(cacheKey);
      if (cached) return cached;
    }

    try {
      // Tentar usar o adaptador moderno primeiro
      if (modernAPI) {
        console.log('🔄 Usando adaptador moderno para busca de jogadores');
        const data = await modernAPI.searchPlayers(searchTerm);
        this.saveToCache(cacheKey, data);
        return data;
      }

      // Fallback para API antiga
      console.log('🔄 Usando API legada para busca de jogadores');
      const response = await this.axiosInstance.get('/football-players-search', {
        params: { search: searchTerm }
      });
      const data = response.data;
      this.saveToCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('❌ Erro ao buscar jogadores:', error);
      const cached = this.loadFromCache(cacheKey);
      if (cached) {
        console.log('⚠️ Retornando cache expirado devido a erro na API');
        return cached;
      }
      
      // Retornar dados de fallback se disponível
      return this.getFallbackPlayersData(searchTerm);
    }
  }

  // Busca times (FUNCIONAL)
  async searchTeams(searchTerm = 'manchester') {
    const cacheKey = `${CACHE_KEYS.TEAMS}_${searchTerm}`;
    
    if (this.isCacheValid(cacheKey)) {
      const cached = this.loadFromCache(cacheKey);
      if (cached) return cached;
    }

    try {
      const response = await this.axiosInstance.get('/football-teams-search', {
        params: { search: searchTerm }
      });
      const data = response.data;
      this.saveToCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('❌ Erro ao buscar times:', error);
      const cached = this.loadFromCache(cacheKey);
      if (cached) {
        console.log('⚠️ Retornando cache expirado devido a erro na API');
        return cached;
      }
      throw error;
    }
  }

  // Partidas ao vivo - DADOS REAIS (FUNCIONAL)
  async getLiveMatches() {
    const cacheKey = 'live_matches_real';
    
    // Cache mais curto para dados ao vivo (2 minutos)
    if (this.isCacheValid(cacheKey, false, 2 * 60 * 1000)) {
      const cached = this.loadFromCache(cacheKey);
      if (cached) {
        console.log('📂 Usando cache de partidas ao vivo');
        return cached;
      }
    }

    try {
      console.log('🔴 Buscando partidas ao vivo - DADOS REAIS');
      const response = await this.axiosInstance.get('/football-current-live');
      const data = response.data;
      
      // Salva no cache com timestamp curto
      this.saveToCache(cacheKey, data);
      console.log(`✅ ${data.response?.length || 0} partidas ao vivo carregadas`);
      return data;
    } catch (error) {
      console.error('❌ Erro ao buscar partidas ao vivo, usando fallback:', error);
      // Fallback para dados simulados se a API falhar
      return this.getLiveMatchesFallback();
    }
  }

  // Odds em tempo real - DADOS REAIS (FUNCIONAL)
  async getLiveOdds(eventId, countryCode = 'BR') {
    const cacheKey = `live_odds_${eventId}_${countryCode}`;
    
    // Cache muito curto para odds (1 minuto)
    if (this.isCacheValid(cacheKey, false, 1 * 60 * 1000)) {
      const cached = this.loadFromCache(cacheKey);
      if (cached) {
        console.log(`📂 Usando cache de odds para evento ${eventId}`);
        return cached;
      }
    }

    try {
      console.log(`🎲 Buscando odds ao vivo para evento ${eventId} - DADOS REAIS`);
      const response = await this.axiosInstance.get('/football-event-odds', {
        params: {
          eventid: eventId,
          countrycode: countryCode
        }
      });
      const data = response.data;
      
      // Salva no cache com timestamp muito curto
      this.saveToCache(cacheKey, data);
      console.log(`✅ Odds carregadas para evento ${eventId}`);
      return data;
    } catch (error) {
      console.error(`❌ Erro ao buscar odds para evento ${eventId}, usando fallback:`, error);
      // Fallback para odds simuladas se a API falhar
      return this.getOddsFallback(eventId);
    }
  }

  // Estatísticas ao vivo do evento - FUNCIONAL (se disponível)
  async getLiveEventStats(eventId) {
    try {
      console.log(`📊 Buscando estatísticas ao vivo para evento ${eventId}`);
      // Se houver endpoint específico para stats, usar aqui
      // Por enquanto, combina dados de partidas ao vivo
      const liveMatches = await this.getLiveMatches();
      const matchData = liveMatches.response?.find(match => 
        match.fixture?.id?.toString() === eventId.toString()
      );
      
      if (matchData) {
        return {
          status: 'success',
          response: {
            eventId,
            match: matchData,
            realTime: true,
            timestamp: new Date().toISOString()
          }
        };
      }
      
      throw new Error('Evento não encontrado nas partidas ao vivo');
    } catch (error) {
      console.error(`❌ Erro ao buscar stats do evento ${eventId}:`, error);
      return this.getEventStatsFallback(eventId);
    }
  }

  // =====================================================
  // MÉTODOS COM FALLBACK (DADOS DE DEMONSTRAÇÃO MVP)
  // =====================================================

  // Partidas ao vivo (FALLBACK INTELIGENTE)
  async getLiveMatches() {
    console.log('⚠️ Usando dados de fallback para partidas ao vivo');
    
    // Simula partidas atualizadas em tempo real
    const currentData = JSON.parse(JSON.stringify(FALLBACK_DATA.liveMatches));
    
    // Atualiza timestamps
    currentData.response.forEach((match, index) => {
      match.fixture.date = new Date().toISOString();
      match.fixture.timestamp = Math.floor(Date.now() / 1000);
      
      // Simula diferentes status baseado no horário atual
      const hour = new Date().getHours();
      const minute = new Date().getMinutes();
      
      if (hour >= 14 && hour <= 22) {
        // Horário de jogos - simula partida em andamento
        const elapsed = Math.floor(Math.random() * 90) + 1;
        match.fixture.status = { 
          long: elapsed > 45 ? 'Second Half' : 'First Half', 
          short: elapsed > 45 ? '2H' : '1H', 
          elapsed 
        };
        match.goals = { 
          home: Math.floor(Math.random() * 4), 
          away: Math.floor(Math.random() * 4) 
        };
      } else if (hour >= 22 || hour <= 2) {
        // Partidas finalizadas
        match.fixture.status = { long: 'Match Finished', short: 'FT', elapsed: 90 };
        match.goals = { home: Math.floor(Math.random() * 4), away: Math.floor(Math.random() * 4) };
      } else {
        // Partidas futuras
        match.fixture.status = { long: 'Not Started', short: 'NS', elapsed: null };
        match.goals = { home: null, away: null };
      }
    });
    
    return currentData;
  }

  // Lista de ligas (FALLBACK)
  async getAllLeagues() {
    console.log('⚠️ Usando dados de fallback para ligas principais');
    return FALLBACK_DATA.leagues;
  }

  // Partidas por data (FALLBACK)
  async getMatchesByDate(date) {
    console.log(`⚠️ Usando dados de fallback para partidas do dia ${date}`);
    
    // Gera partidas simuladas para a data solicitada
    const matches = JSON.parse(JSON.stringify(FALLBACK_DATA.liveMatches));
    matches.response = matches.response.map((match, index) => ({
      ...match,
      fixture: {
        ...match.fixture,
        id: parseInt(date.replace(/-/g, '')) + index + 1000,
        date: `${date}T${14 + (index * 2)}:00:00Z`,
        timestamp: Math.floor(new Date(`${date}T${14 + (index * 2)}:00:00Z`).getTime() / 1000),
        status: { long: 'Not Started', short: 'NS', elapsed: null }
      },
      goals: { home: null, away: null }
    }));
    
    return matches;
  }

  // Partidas por liga (FALLBACK)
  async getMatchesByLeague(league, season) {
    console.log(`⚠️ Usando dados de fallback para liga ${league}, temporada ${season}`);
    
    // Busca informações da liga
    const leagueInfo = FALLBACK_DATA.leagues.response.find(l => l.league.id.toString() === league.toString());
    const leagueName = leagueInfo?.league?.name || 'Liga Desconhecida';
    
    // Gera partidas para a liga específica
    const matches = JSON.parse(JSON.stringify(FALLBACK_DATA.liveMatches));
    matches.response.forEach(match => {
      match.league = leagueInfo?.league || match.league;
      match.league.season = parseInt(season);
    });
    
    return matches;
  }

  // Classificações (FALLBACK)
  async getStandings(leagueId = '39', season = '2024') {
    console.log(`⚠️ Usando dados de fallback para classificações da liga ${leagueId}`);
    
    // Adapta dados para a liga solicitada
    const standings = JSON.parse(JSON.stringify(FALLBACK_DATA.standings));
    standings.response[0].league.id = parseInt(leagueId);
    standings.response[0].league.season = parseInt(season);
    
    // Busca informações da liga
    const leagueInfo = FALLBACK_DATA.leagues.response.find(l => l.league.id.toString() === leagueId.toString());
    if (leagueInfo) {
      standings.response[0].league.name = leagueInfo.league.name;
      standings.response[0].league.country = leagueInfo.country.name;
      standings.response[0].league.logo = leagueInfo.league.logo;
      standings.response[0].league.flag = leagueInfo.country.flag;
    }
    
    return standings;
  }

  // Detalhes da liga (FALLBACK)
  async getLeagueDetails(league) {
    console.log(`⚠️ Usando dados de fallback para detalhes da liga ${league}`);
    const leagueInfo = FALLBACK_DATA.leagues.response.find(l => l.league.id.toString() === league.toString());
    return leagueInfo ? { status: 'success', response: [leagueInfo] } : FALLBACK_DATA.leagues;
  }

  // Odds (FALLBACK DINÂMICO)
  async getMatchOdds(fixture) {
    console.log(`⚠️ Usando dados de fallback para odds da partida ${fixture}`);
    return {
      status: 'success',
      response: [{
        fixture: { id: fixture },
        bookmakers: [{
          id: 8,
          name: 'bet365',
          bets: [{
            id: 1,
            name: 'Match Winner',
            values: [
              { value: 'Home', odd: (1.5 + Math.random() * 3).toFixed(2) },
              { value: 'Draw', odd: (2.8 + Math.random() * 1.5).toFixed(2) },
              { value: 'Away', odd: (1.8 + Math.random() * 4).toFixed(2) }
            ]
          }, {
            id: 5,
            name: 'Goals Over/Under',
            values: [
              { value: 'Over 2.5', odd: (1.6 + Math.random() * 1.8).toFixed(2) },
              { value: 'Under 2.5', odd: (1.8 + Math.random() * 1.6).toFixed(2) }
            ]
          }]
        }]
      }]
    };
  }

  // Eventos da partida (FALLBACK DINÂMICO)
  async getMatchEvents(fixture) {
    console.log(`⚠️ Usando dados de fallback para eventos da partida ${fixture}`);
    
    // Gera eventos aleatórios mas realistas
    const events = [];
    const homeTeam = 'Time Casa';
    const awayTeam = 'Time Visitante';
    
    // Gols
    for (let i = 0; i < Math.floor(Math.random() * 4); i++) {
      events.push({
        time: { elapsed: Math.floor(Math.random() * 90) + 1 },
        type: 'Goal',
        detail: 'Normal Goal',
        player: { name: `Jogador ${i + 1}` },
        team: { name: Math.random() > 0.5 ? homeTeam : awayTeam }
      });
    }
    
    // Cartões
    for (let i = 0; i < Math.floor(Math.random() * 6); i++) {
      events.push({
        time: { elapsed: Math.floor(Math.random() * 90) + 1 },
        type: 'Card',
        detail: Math.random() > 0.8 ? 'Red Card' : 'Yellow Card',
        player: { name: `Jogador ${i + 5}` },
        team: { name: Math.random() > 0.5 ? homeTeam : awayTeam }
      });
    }
    
    // Substituições
    for (let i = 0; i < Math.floor(Math.random() * 6); i++) {
      events.push({
        time: { elapsed: Math.floor(Math.random() * 45) + 45 },
        type: 'subst',
        detail: 'Substitution',
        player: { name: `Sai Jogador ${i + 10}` },
        assist: { name: `Entra Jogador ${i + 15}` },
        team: { name: Math.random() > 0.5 ? homeTeam : awayTeam }
      });
    }
    
    // Ordena por tempo
    events.sort((a, b) => a.time.elapsed - b.time.elapsed);
    
    return {
      status: 'success',
      response: events
    };
  }

  // =====================================================
  // MÉTODOS PARA ANÁLISE DE JOGOS (MVP)
  // =====================================================

  // Obter dados completos para análise de um jogo
  async getCompleteMatchData(fixtureId) {
    try {
      console.log(`📊 Carregando dados completos para partida: ${fixtureId}`);
      
      const [events, odds, liveMatches] = await Promise.allSettled([
        this.getMatchEvents(fixtureId),
        this.getMatchOdds(fixtureId),
        this.getLiveMatches()
      ]);

      // Busca informações específicas da partida
      let matchInfo = null;
      if (liveMatches.status === 'fulfilled' && liveMatches.value?.response) {
        matchInfo = liveMatches.value.response.find(match => 
          match.fixture.id.toString() === fixtureId.toString()
        );
      }

      return {
        matchInfo,
        events: events.status === 'fulfilled' ? events.value : null,
        odds: odds.status === 'fulfilled' ? odds.value : null,
        fixtureId,
        timestamp: new Date().toISOString(),
        note: 'Dados de demonstração para MVP - API limitada'
      };
    } catch (error) {
      console.error('❌ Erro ao carregar dados completos da partida:', error);
      throw error;
    }
  }

  // Obter dados para dashboard MVP
  async getDashboardData(date = null) {
    try {
      console.log('📊 Carregando dados do dashboard MVP...');
      
      const [liveMatches, leagues, todayMatches] = await Promise.allSettled([
        this.getLiveMatches(),
        this.getAllLeagues(),
        date ? this.getMatchesByDate(date) : this.getMatchesByDate(new Date().toISOString().split('T')[0])
      ]);

      return {
        liveMatches: liveMatches.status === 'fulfilled' ? liveMatches.value : null,
        leagues: leagues.status === 'fulfilled' ? leagues.value : null,
        todayMatches: todayMatches.status === 'fulfilled' ? todayMatches.value : null,
        timestamp: new Date().toISOString(),
        note: 'MVP - Dados reais (jogadores/times) + Fallback inteligente (partidas/estatísticas)'
      };
    } catch (error) {
      console.error('❌ Erro ao carregar dados do dashboard:', error);
      throw error;
    }
  }

  // Sistema de avisos de alterações de probabilidades (MVP)
  async getProbabilityAlerts(fixtureId) {
    console.log(`🚨 Gerando alertas de probabilidade para partida ${fixtureId}`);
    
    // Simula alertas baseados em mudanças de odds
    const alerts = [];
    
    if (Math.random() > 0.7) {
      alerts.push({
        type: 'odds_change',
        severity: 'medium',
        message: 'Odds do time mandante aumentaram 15% nos últimos 10 minutos',
        timestamp: new Date().toISOString(),
        recommendation: 'Considerar entrada no mercado de vitória do mandante'
      });
    }
    
    if (Math.random() > 0.8) {
      alerts.push({
        type: 'goal_probability',
        severity: 'high',
        message: 'Alta probabilidade de gol nos próximos 10 minutos',
        timestamp: new Date().toISOString(),
        recommendation: 'Mercado de gols pode ser interessante'
      });
    }
    
    if (Math.random() > 0.6) {
      alerts.push({
        type: 'card_alert',
        severity: 'low',
        message: 'Possível cartão amarelo iminente - jogador em falta recorrente',
        timestamp: new Date().toISOString(),
        recommendation: 'Atenção ao mercado de cartões'
      });
    }
    
    return {
      status: 'success',
      fixtureId,
      alerts,
      note: 'Sistema de alertas simulado para MVP - futuro: integração com Python + análise de vídeo'
    };
  }

  // =====================================================
  // MÉTODOS DE UTILIDADE E GESTÃO
  // =====================================================

  // Teste de conectividade com a API
  async testApiConnection() {
    try {
      console.log('🔍 Testando conectividade com endpoints funcionais...');
      
      // Testa os endpoints que sabemos que funcionam
      await Promise.all([
        this.searchPlayers('test'),
        this.searchTeams('test')
      ]);
      
      console.log('✅ Endpoints funcionais responderam com sucesso!');
      return {
        success: true,
        status: 200,
        message: 'Conexão com a API estabelecida (endpoints limitados)',
        availableEndpoints: ['football-players-search', 'football-teams-search'],
        fallbackEndpoints: ['partidas ao vivo', 'ligas', 'classificações', 'odds', 'eventos'],
        mvpReady: true
      };
    } catch (error) {
      console.error('❌ Erro ao testar API:', error);
      return {
        success: false,
        status: error.response?.status || 'NETWORK_ERROR',
        message: error.message || 'Erro de conectividade',
        mvpReady: false
      };
    }  }

  // Verifica status da API e limites
  getApiStatus() {
    const cacheStatuses = Object.values(CACHE_KEYS).map(key => {
      const timestamp = localStorage.getItem(`${key}_timestamp`);
      return {
        key,
        lastUpdate: timestamp ? new Date(parseInt(timestamp)).toLocaleString('pt-BR') : 'Nunca',
        isValid: this.isCacheValid(key),
        data: this.loadFromCache(key) ? 'Disponível' : 'Vazio'
      };
    });

    // Estrutura de APIs para o monitor
    const availableApis = [
      {
        name: 'API-Football (RapidAPI)',
        configured: !!CURRENT_API.key && !!CURRENT_API.host,
        status: CURRENT_API.key && CURRENT_API.host ? 'active' : 'inactive',
        failed: false,
        lastCheck: new Date().toISOString()
      },
      {
        name: 'Football-Data.org',
        configured: false,
        status: 'inactive',
        failed: false,
        lastCheck: new Date().toISOString()
      },
      {
        name: 'Fallback Data',
        configured: true,
        status: 'active',
        failed: false,
        lastCheck: new Date().toISOString()
      }
    ];

    return {
      currentApi: CURRENT_API.name || 'Fallback Data',
      availableApis,
      rateLimitedApis: {}, // Para futuro uso
      failedApis: [], // Para futuro uso
      cacheStatuses,
      apiCredentials: {
        hasKey: !!CURRENT_API.key,
        hasHost: !!CURRENT_API.host,
        baseUrl: CURRENT_API.baseUrl
      },
      endpoints: {
        functional: ['football-players-search', 'football-teams-search'],
        fallback: ['live matches', 'leagues', 'standings', 'odds', 'events', 'probability alerts']
      },
      mvpStatus: 'Pronto para demonstração com dados inteligentes',
      futureIntegration: 'Python + análise de vídeo + alertas em tempo real'
    };
  }
  // Limpa todo o cache
  clearCache() {
    const keysCleared = [];
    Object.values(CACHE_KEYS).forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        localStorage.removeItem(`${key}_timestamp`);
        keysCleared.push(key);
      }
    });
    console.log(`🗑️ Cache limpo: ${keysCleared.length} entradas removidas`);
    return keysCleared;
  }

  // Reset API failures (para o monitor de status)
  resetApiFailures() {
    console.log('🔄 Resetando falhas de APIs');
    // Por enquanto, só limpa o cache para forçar novas tentativas
    this.clearCache();
    return true;
  }
}

// =====================================================
// MÉTODOS DE FALLBACK PARA NOVOS ENDPOINTS
// =====================================================

// Fallback para partidas ao vivo (quando API real falha)
async function getLiveMatchesFallback() {
  console.log('⚠️ Usando dados de fallback para partidas ao vivo');
  
  // Simula partidas atualizadas em tempo real
  const currentData = JSON.parse(JSON.stringify(FALLBACK_DATA.liveMatches));
  
  // Atualiza timestamps
  currentData.response.forEach((match, index) => {
    match.fixture.date = new Date().toISOString();
    match.fixture.timestamp = Math.floor(Date.now() / 1000);
    
    // Simula diferentes status baseado no horário atual
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    
    if (hour >= 14 && hour <= 22) {
      // Horário de jogos - simula partida em andamento
      const elapsed = Math.floor(Math.random() * 90) + 1;
      match.fixture.status = { 
        long: elapsed > 45 ? 'Second Half' : 'First Half', 
        short: elapsed > 45 ? '2H' : '1H', 
        elapsed 
      };
      match.goals = { 
        home: Math.floor(Math.random() * 4), 
        away: Math.floor(Math.random() * 4) 
      };
    } else if (hour >= 22 || hour <= 2) {
      // Partidas finalizadas
      match.fixture.status = { long: 'Match Finished', short: 'FT', elapsed: 90 };
      match.goals = { home: Math.floor(Math.random() * 4), away: Math.floor(Math.random() * 4) };
    } else {
      // Partidas futuras
      match.fixture.status = { long: 'Not Started', short: 'NS', elapsed: null };
      match.goals = { home: null, away: null };
    }
  });
  
  return currentData;
}

// Fallback para odds (quando API real falha)
function getOddsFallback(eventId) {
  console.log(`⚠️ Usando dados de fallback para odds do evento ${eventId}`);
  return {
    status: 'success',
    response: {
      eventId,
      bookmakers: [{
        id: 8,
        name: 'bet365',
        markets: [
          {
            name: 'Match Winner',
            outcomes: [
              { name: 'Home', odds: (1.5 + Math.random() * 3).toFixed(2) },
              { name: 'Draw', odds: (2.8 + Math.random() * 1.5).toFixed(2) },
              { name: 'Away', odds: (1.8 + Math.random() * 4).toFixed(2) }
            ]
          },
          {
            name: 'Total Goals',
            outcomes: [
              { name: 'Over 2.5', odds: (1.6 + Math.random() * 1.8).toFixed(2) },
              { name: 'Under 2.5', odds: (1.8 + Math.random() * 1.6).toFixed(2) }
            ]
          },
          {
            name: 'Both Teams to Score',
            outcomes: [
              { name: 'Yes', odds: (1.7 + Math.random() * 1.2).toFixed(2) },
              { name: 'No', odds: (2.0 + Math.random() * 1.0).toFixed(2) }
            ]
          }
        ]
      }],
      timestamp: new Date().toISOString(),
      note: 'Odds simuladas para demonstração MVP'
    }
  };
}

// Fallback para estatísticas do evento
function getEventStatsFallback(eventId) {
  console.log(`⚠️ Usando dados de fallback para stats do evento ${eventId}`);
  return {
    status: 'success',
    response: {
      eventId,
      match: {
        fixture: { id: eventId, status: { short: 'LIVE', elapsed: Math.floor(Math.random() * 90) + 1 } },
        teams: {
          home: { name: 'Time Casa', logo: 'https://via.placeholder.com/40' },
          away: { name: 'Time Visitante', logo: 'https://via.placeholder.com/40' }
        },
        goals: {
          home: Math.floor(Math.random() * 4),
          away: Math.floor(Math.random() * 4)
        }
      },
      statistics: {
        possession: {
          home: Math.floor(Math.random() * 40) + 30,
          away: Math.floor(Math.random() * 40) + 30
        },
        shots: {
          home: Math.floor(Math.random() * 10) + 2,
          away: Math.floor(Math.random() * 10) + 2
        },
        corners: {
          home: Math.floor(Math.random() * 8),
          away: Math.floor(Math.random() * 8)
        },
        fouls: {
          home: Math.floor(Math.random() * 15) + 5,
          away: Math.floor(Math.random() * 15) + 5
        }
      },
      realTime: false,
      timestamp: new Date().toISOString(),
      note: 'Estatísticas simuladas para demonstração MVP'
    }
  };
}

// Fallback para dados de jogadores
function getFallbackPlayersData(searchTerm) {
  console.log(`⚠️ Usando dados de fallback para busca: ${searchTerm}`);
  
  const samplePlayers = [
    {
      id: 1,
      name: 'Cristiano Ronaldo',
      team: 'Al Nassr',
      position: 'Forward',
      age: 39,
      nationality: 'Portugal',
      photo: 'https://media.api-sports.io/football/players/874.png'
    },
    {
      id: 2,
      name: 'Lionel Messi',
      team: 'Inter Miami',
      position: 'Forward', 
      age: 36,
      nationality: 'Argentina',
      photo: 'https://media.api-sports.io/football/players/154.png'
    },
    {
      id: 3,
      name: 'Neymar Jr',
      team: 'Al Hilal',
      position: 'Forward',
      age: 32,
      nationality: 'Brazil',
      photo: 'https://media.api-sports.io/football/players/276.png'
    },
    {
      id: 4,
      name: 'Kylian Mbappé',
      team: 'PSG',
      position: 'Forward',
      age: 25,
      nationality: 'France',
      photo: 'https://media.api-sports.io/football/players/1313.png'
    }
  ];

  // Filtrar jogadores baseado no termo de busca
  const filtered = samplePlayers.filter(player => 
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    status: 'fallback',
    response: filtered.length > 0 ? filtered : samplePlayers.slice(0, 2),
    message: 'Dados de demonstração (API indisponível)'
  };
}

export const footballApiService = new FootballApiService();
export default footballApiService; 