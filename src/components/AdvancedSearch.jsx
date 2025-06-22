import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { gameService } from '@/services/gameService';
import { 
  Search, 
  Globe, 
  Trophy, 
  Users, 
  Calendar,
  MapPin,
  Star,
  Filter,
  Loader2
} from 'lucide-react';

const AdvancedSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('global');
  const [mainLeagues, setMainLeagues] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const { toast } = useToast();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [leagues, countriesData] = await Promise.all([
        gameService.getMainLeagues(),
        gameService.getAvailableCountries()
      ]);
      
      setMainLeagues(leagues.response || []);
      setCountries(countriesData.response || []);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const handleGlobalSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Digite algo para pesquisar",
        description: "Insira um termo de busca para continuar.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const searchResults = await gameService.globalSearch(searchTerm);
      setResults(searchResults);
      
      toast({
        title: "Busca realizada! 🔍",
        description: `Encontrados: ${searchResults.summary.playersFound} jogadores, ${searchResults.summary.teamsFound} times, ${searchResults.summary.leaguesFound} ligas`,
        variant: "default"
      });
    } catch (error) {
      console.error('Error in global search:', error);
      toast({
        title: "Erro na busca",
        description: "Não foi possível realizar a busca. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLeagueSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      const leagueResults = await gameService.searchLeagues(searchTerm);
      setResults({ leagues: leagueResults });
    } catch (error) {
      console.error('Error searching leagues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCountrySearch = async (countryName) => {
    setLoading(true);
    try {
      const [leagues, teams] = await Promise.all([
        gameService.searchByCountry(countryName),
        gameService.searchTeamsByRegion(countryName)
      ]);
      
      setResults({ 
        country: countryName,
        leagues, 
        teams,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error searching by country:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSearch = async () => {
    setLoading(true);
    try {
      const matches = await gameService.searchMatchesByDate(selectedDate);
      setResults({ 
        date: selectedDate,
        matches,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error searching by date:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeagueMatches = async (leagueId) => {
    setLoading(true);
    try {
      const matches = await gameService.searchMatchesByLeague(leagueId);
      setResults({ 
        leagueId,
        matches,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error searching league matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderResults = () => {
    if (!results) return null;

    return (
      <Card className="bg-slate-800 border-slate-700 mt-6">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Resultados da Busca
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Resultados de Busca Global */}
          {results.response && (
            <>
              {/* Jogadores */}
              {results.response.players?.response?.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Jogadores ({results.response.players.response.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {results.response.players.response.slice(0, 6).map((player, index) => (
                      <div key={index} className="bg-slate-700 p-3 rounded-lg">
                        <p className="text-white font-medium">{player.player?.name || 'Nome não disponível'}</p>
                        <p className="text-slate-300 text-sm">{player.team?.name || 'Time não disponível'}</p>
                        <p className="text-slate-400 text-xs">{player.player?.position || 'Posição não disponível'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Times */}
              {results.response.teams?.response?.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2 flex items-center">
                    <Trophy className="h-4 w-4 mr-2" />
                    Times ({results.response.teams.response.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {results.response.teams.response.slice(0, 6).map((team, index) => (
                      <div key={index} className="bg-slate-700 p-3 rounded-lg flex items-center">
                        {team.team?.logo && (
                          <img 
                            src={team.team.logo} 
                            alt={team.team.name}
                            className="w-8 h-8 mr-3"
                          />
                        )}
                        <div>
                          <p className="text-white font-medium">{team.team?.name || 'Nome não disponível'}</p>
                          <p className="text-slate-300 text-sm">{team.venue?.city || 'Cidade não disponível'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ligas */}
              {results.response.leagues?.response?.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2 flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Ligas ({results.response.leagues.response.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {results.response.leagues.response.map((item, index) => (
                      <div key={index} className="bg-slate-700 p-3 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                          {item.league?.logo && (
                            <img 
                              src={item.league.logo} 
                              alt={item.league.name}
                              className="w-8 h-8 mr-3"
                            />
                          )}
                          <div>
                            <p className="text-white font-medium">{item.league?.name}</p>
                            <p className="text-slate-300 text-sm">{item.country?.name}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleLeagueMatches(item.league.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Ver Partidas
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Resultados de Partidas */}
          {results.matches && (
            <div>
              <h4 className="text-lg font-semibold text-white mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Partidas {results.date && `- ${new Date(results.date).toLocaleDateString('pt-BR')}`}
                ({results.matches.response?.length || 0})
              </h4>
              <div className="space-y-3">
                {results.matches.response?.slice(0, 5).map((match, index) => (
                  <div key={index} className="bg-slate-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-white font-medium">{match.teams?.home?.name}</p>
                        </div>
                        <div className="text-center">
                          <Badge variant="outline" className="text-white">
                            {match.goals?.home !== null ? `${match.goals.home} - ${match.goals.away}` : 'vs'}
                          </Badge>
                        </div>
                        <div className="text-center">
                          <p className="text-white font-medium">{match.teams?.away?.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-300 text-sm">{match.league?.name}</p>
                        <Badge variant={match.fixture?.status?.short === 'FT' ? 'default' : 'secondary'}>
                          {match.fixture?.status?.short}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resultados por País */}
          {results.country && (
            <div>
              <h4 className="text-lg font-semibold text-white mb-2 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Resultados para {results.country}
              </h4>
              
              {results.leagues?.response?.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-white font-medium mb-2">Ligas/Campeonatos:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {results.leagues.response.map((item, index) => (
                      <Badge key={index} variant="outline" className="text-white">
                        {item.league?.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {results.teams?.response?.length > 0 && (
                <div>
                  <h5 className="text-white font-medium mb-2">Times ({results.teams.response.length}):</h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {results.teams.response.slice(0, 9).map((team, index) => (
                      <div key={index} className="bg-slate-600 p-2 rounded text-sm">
                        <p className="text-white">{team.name}</p>
                        <p className="text-slate-300 text-xs">{team.league}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Busca Avançada de Futebol
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-slate-700">
              <TabsTrigger value="global" className="text-white">Global</TabsTrigger>
              <TabsTrigger value="leagues" className="text-white">Ligas</TabsTrigger>
              <TabsTrigger value="countries" className="text-white">Países</TabsTrigger>
              <TabsTrigger value="dates" className="text-white">Datas</TabsTrigger>
            </TabsList>

            {/* Busca Global */}
            <TabsContent value="global" className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Digite: jogador, time, liga, país..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleGlobalSearch()}
                  className="bg-slate-700 border-slate-600 text-white flex-1"
                />
                <Button 
                  onClick={handleGlobalSearch}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-slate-400 text-sm">
                Busca simultaneamente em jogadores, times e ligas. Ex: "messi", "manchester", "premier league"
              </p>
            </TabsContent>

            {/* Busca por Ligas */}
            <TabsContent value="leagues" className="space-y-4">
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Nome da liga ou campeonato..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLeagueSearch()}
                    className="bg-slate-700 border-slate-600 text-white flex-1"
                  />
                  <Button 
                    onClick={handleLeagueSearch}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Filter className="h-4 w-4" />}
                  </Button>
                </div>

                <div>
                  <Label className="text-white mb-2 block">Ligas Principais:</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {mainLeagues.map((item, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleLeagueMatches(item.league.id)}
                        className="justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Star className="h-3 w-3 mr-2" />
                        {item.league.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Busca por Países */}
            <TabsContent value="countries" className="space-y-4">
              <div>
                <Label className="text-white mb-2 block">Selecione um País:</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {countries.map((country, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleCountrySearch(country.name)}
                      className="justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
                      disabled={loading}
                    >
                      {country.flag && (
                        <img 
                          src={country.flag} 
                          alt={country.name}
                          className="w-4 h-4 mr-2"
                        />
                      )}
                      {country.name}
                      <Badge variant="secondary" className="ml-auto">
                        {country.leaguesCount}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Busca por Datas */}
            <TabsContent value="dates" className="space-y-4">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Label htmlFor="date" className="text-white mb-2 block">Data:</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleDateSearch}
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calendar className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <p className="text-slate-400 text-sm">
                Encontre todas as partidas de uma data específica
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Renderizar Resultados */}
      {renderResults()}
    </div>
  );
};

export default AdvancedSearch;
