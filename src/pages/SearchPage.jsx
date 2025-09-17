import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnimatedAlert from '@/components/ui/animated-alert';
import MetricCard from '@/components/ui/metric-card';
import ApiStatusMonitor from '@/components/ApiStatusMonitor';
import { footballApiService } from '@/services/footballApiService';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { 
  Search, 
  Globe, 
  Trophy, 
  Users, 
  Calendar,
  MapPin,
  Star,
  Info,
  Loader2,
  Filter,
  Activity,
  Zap,
  TrendingUp,
  Clock,
  AlertCircle
} from 'lucide-react';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    players: [],
    teams: [],
    leagues: []
  });
  const [searchHistory, setSearchHistory] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    // Carregar histórico de busca do localStorage
    const history = JSON.parse(localStorage.getItem('search_history') || '[]');
    setSearchHistory(history.slice(0, 10)); // Últimas 10 buscas
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Digite algo para buscar",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      let searchResults = {
        players: [],
        teams: [],
        leagues: []
      };

      // Buscar jogadores se tipo for 'all' ou 'players'
      if (searchType === 'all' || searchType === 'players') {
        const playersData = await footballApiService.searchPlayers(searchTerm);
        searchResults.players = playersData.slice(0, 6); // Limitar a 6 resultados
      }

      // Buscar times se tipo for 'all' ou 'teams'
      if (searchType === 'all' || searchType === 'teams') {
        const teamsData = await footballApiService.getTeams();
        // Filtrar times que correspondem ao termo de busca
        searchResults.teams = teamsData
          .filter(team => 
            team.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            team.team?.name?.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .slice(0, 6);
      }

      // Buscar ligas se tipo for 'all' ou 'leagues'
      if (searchType === 'all' || searchType === 'leagues') {
        const leaguesData = await footballApiService.getLeagues();
        searchResults.leagues = leaguesData
          .filter(league => 
            league.league?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            league.country?.name?.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .slice(0, 6);
      }

      setResults(searchResults);

      // Adicionar ao histórico
      const newHistory = [searchTerm, ...searchHistory.filter(h => h !== searchTerm)].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('search_history', JSON.stringify(newHistory));

      // Mostrar resultado
      const totalResults = searchResults.players.length + searchResults.teams.length + searchResults.leagues.length;
      toast({
        title: "Busca concluída",
        description: `${totalResults} resultados encontrados para "${searchTerm}"`,
      });

    } catch (error) {
      console.error('Erro na busca:', error);
      toast({
        title: "Erro na busca",
        description: "Usando dados de demonstração devido a problemas na API",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const quickSearch = (term) => {
    setSearchTerm(term);
    setSearchType('all');
    setTimeout(() => handleSearch(), 100);
  };

  const clearResults = () => {
    setResults({
      players: [],
      teams: [],
      leagues: []
    });
    setSearchTerm('');
  };

  const totalResults = results.players.length + results.teams.length + results.leagues.length;

  return (
    <div className="min-h-screen bg-grid-slate-700/20 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95" />
      
      <div className="relative z-10">
        <Helmet>
          <title>Busca Avançada - iFootball</title>
          <meta name="description" content="Busque jogadores, times e ligas de futebol com nossa ferramenta de busca avançada." />
        </Helmet>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                Busca Avançada
              </span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Encontre jogadores, times e ligas de futebol com nossa ferramenta inteligente
            </p>
          </motion.div>

          {/* Barra de Busca Principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="glassmorphism-card border-primary/20">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                      <Input
                        placeholder="Digite o nome do jogador, time ou liga..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pl-10 h-12 text-lg bg-slate-800 border-slate-600"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <select 
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                      className="px-4 py-3 bg-slate-800 border border-slate-600 rounded-md text-slate-200"
                      disabled={loading}
                    >
                      <option value="all">Tudo</option>
                      <option value="players">Jogadores</option>
                      <option value="teams">Times</option>
                      <option value="leagues">Ligas</option>
                    </select>
                    
                    <Button 
                      onClick={handleSearch}
                      disabled={loading || !searchTerm.trim()}
                      className="h-12 px-6"
                    >
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Search className="h-5 w-5" />
                      )}
                    </Button>
                    
                    {totalResults > 0 && (
                      <Button 
                        variant="outline"
                        onClick={clearResults}
                        className="h-12 px-4"
                      >
                        Limpar
                      </Button>
                    )}
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

          {/* Métricas de Busca */}
          {(totalResults > 0 || loading) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              <MetricCard
                title="Total de Resultados"
                value={totalResults}
                icon={<Search />}
                color="text-primary"
                delay={0}
              />
              <MetricCard
                title="Jogadores"
                value={results.players.length}
                icon={<Users />}
                color="text-blue-400"
                delay={0.1}
              />
              <MetricCard
                title="Times"
                value={results.teams.length}
                icon={<Trophy />}
                color="text-green-400"
                delay={0.2}
              />
              <MetricCard
                title="Ligas"
                value={results.leagues.length}
                icon={<Globe />}
                color="text-purple-400"
                delay={0.3}
              />
            </motion.div>
          )}

          {/* Resultados da Busca */}
          {totalResults > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-8"
            >
              {/* Jogadores */}
              {results.players.length > 0 && (
                <Card className="glassmorphism-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-400" />
                      Jogadores ({results.players.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {results.players.map((player, index) => (
                        <motion.div
                          key={player.id || index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-blue-400/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                              <Users className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">{player.name}</h3>
                              <p className="text-slate-400 text-sm">{player.team || 'Time não informado'}</p>
                              {player.position && (
                                <Badge variant="secondary" className="mt-1">
                                  {player.position}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Times */}
              {results.teams.length > 0 && (
                <Card className="glassmorphism-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-green-400" />
                      Times ({results.teams.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {results.teams.map((team, index) => (
                        <motion.div
                          key={team.id || index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-green-400/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {team.logo || team.team?.logo ? (
                              <img 
                                src={team.logo || team.team.logo} 
                                alt={team.name || team.team?.name}
                                className="w-12 h-12 object-contain"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                                <Trophy className="h-6 w-6 text-white" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold text-white">{team.name || team.team?.name}</h3>
                              <p className="text-slate-400 text-sm">{team.league || 'Liga não informada'}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Ligas */}
              {results.leagues.length > 0 && (
                <Card className="glassmorphism-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-purple-400" />
                      Ligas ({results.leagues.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {results.leagues.map((league, index) => (
                        <motion.div
                          key={league.league?.id || index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-purple-400/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {league.league?.logo ? (
                              <img 
                                src={league.league.logo} 
                                alt={league.league.name}
                                className="w-12 h-12 object-contain"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                                <Globe className="h-6 w-6 text-white" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold text-white">{league.league?.name}</h3>
                              <p className="text-slate-400 text-sm">{league.country?.name}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {/* Histórico e Sugestões */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Histórico de Busca */}
            {searchHistory.length > 0 && (
              <Card className="glassmorphism-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Histórico de Busca
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.map((term, index) => (
                      <Badge 
                        key={index}
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary/20 transition-colors"
                        onClick={() => quickSearch(term)}
                      >
                        {term}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Buscas Populares */}
            <Card className="glassmorphism-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  Buscas Populares
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="players" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="players">Jogadores</TabsTrigger>
                    <TabsTrigger value="teams">Times</TabsTrigger>
                    <TabsTrigger value="leagues">Ligas</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="players" className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {['messi', 'ronaldo', 'neymar', 'mbappé', 'haaland', 'vinicius'].map(term => (
                        <Badge 
                          key={term}
                          variant="outline" 
                          className="cursor-pointer hover:bg-blue-400/20 transition-colors"
                          onClick={() => quickSearch(term)}
                        >
                          {term}
                        </Badge>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="teams" className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {['barcelona', 'real madrid', 'manchester', 'flamengo', 'liverpool', 'chelsea'].map(term => (
                        <Badge 
                          key={term}
                          variant="outline" 
                          className="cursor-pointer hover:bg-green-400/20 transition-colors"
                          onClick={() => quickSearch(term)}
                        >
                          {term}
                        </Badge>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="leagues" className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {['premier league', 'la liga', 'brasileirão', 'champions', 'serie a', 'bundesliga'].map(term => (
                        <Badge 
                          key={term}
                          variant="outline" 
                          className="cursor-pointer hover:bg-purple-400/20 transition-colors"
                          onClick={() => quickSearch(term)}
                        >
                          {term}
                        </Badge>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Dicas de Uso quando não há resultados */}
          <AnimatePresence>
            {totalResults === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="space-y-4"
              >
                <AnimatedAlert
                  type="info"
                  title="Como usar a busca"
                  description="Digite o nome de um jogador, time ou liga e escolha o tipo de busca. O sistema usa múltiplas APIs para resultados mais precisos."
                  delay={0}
                />

                <Card className="glassmorphism-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-blue-400" />
                      Dicas de Busca Avançada
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="text-white font-semibold flex items-center gap-2">
                          <Zap className="h-4 w-4 text-yellow-400" />
                          Busca Rápida
                        </h4>
                        <p className="text-slate-400 text-sm">
                          Use termos simples como "messi" ou "barcelona" para resultados mais amplos
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-white font-semibold flex items-center gap-2">
                          <Filter className="h-4 w-4 text-blue-400" />
                          Filtros Específicos
                        </h4>
                        <p className="text-slate-400 text-sm">
                          Selecione o tipo específico (Jogadores, Times, Ligas) para resultados focados
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status de Loading */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              >
                <Card className="glassmorphism-card p-8">
                  <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                    <div>
                      <h3 className="text-white font-semibold">Buscando...</h3>
                      <p className="text-slate-400 text-sm">Consultando múltiplas APIs de futebol</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
