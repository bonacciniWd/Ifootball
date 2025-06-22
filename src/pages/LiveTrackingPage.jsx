import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import LiveMatchTracker from '@/components/LiveMatchTracker';
import VideoStream from '@/components/VideoStream';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { gameService } from '@/services/gameService';
import { 
  Activity, 
  Eye, 
  Play,
  Zap,
  TrendingUp,
  AlertCircle,
  Info
} from 'lucide-react';

const LiveTrackingPage = () => {
  const [eventId, setEventId] = useState('');
  const [countryCode, setCountryCode] = useState('BR');
  const [isTracking, setIsTracking] = useState(false);
  const [showVideoStream, setShowVideoStream] = useState(false);
  const [liveMatches, setLiveMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    loadLiveMatches();
  }, []);

  const loadLiveMatches = async () => {
    setLoading(true);
    try {
      const matches = await gameService.getLiveGames();
      setLiveMatches(matches.response || []);
    } catch (error) {
      console.error('Erro ao carregar partidas ao vivo:', error);
      toast({
        title: "Erro ao carregar partidas",
        description: "Não foi possível carregar as partidas ao vivo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startTracking = () => {
    if (!eventId.trim()) {
      toast({
        title: "ID do evento necessário",
        description: "Digite o ID do evento para iniciar o tracking.",
        variant: "destructive"
      });
      return;
    }
    setIsTracking(true);
    toast({
      title: "Tracking iniciado! 🎯",
      description: `Monitorando evento ${eventId} em tempo real.`,
      variant: "default"
    });
  };

  const stopTracking = () => {
    setIsTracking(false);
    toast({
      title: "Tracking pausado",
      description: "Monitoramento ao vivo pausado.",
      variant: "default"
    });
  };

  const selectMatch = (matchId) => {
    setEventId(matchId.toString());
    toast({
      title: "Partida selecionada",
      description: `ID ${matchId} preenchido. Clique em "Iniciar Tracking" para monitorar.`,
      variant: "default"
    });
  };

  return (
   
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
              <Activity className="h-8 w-8 mr-3" />
              Tracking Ao Vivo
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Monitore partidas em tempo real com dados de odds, estatísticas e eventos ao vivo
            </p>
          </div>

          {/* Controles de Tracking */}
          <Card className="bg-slate-800 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Play className="h-5 w-5 mr-2" />
                Configurar Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="eventId" className="text-white mb-2 block">
                    ID do Evento
                  </Label>
                  <Input
                    id="eventId"
                    placeholder="Ex: 4621624"
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <p className="text-slate-400 text-sm mt-1">
                    Digite o ID do evento ou selecione uma partida abaixo
                  </p>
                </div>
                <div>
                  <Label htmlFor="countryCode" className="text-white mb-2 block">
                    País (Odds)
                  </Label>
                  <Input
                    id="countryCode"
                    placeholder="BR"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
                    className="bg-slate-700 border-slate-600 text-white"
                    maxLength={2}
                  />
                </div>
              </div>
                <div className="flex space-x-2">
                <Button
                  onClick={startTracking}
                  disabled={isTracking || !eventId.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Iniciar Tracking
                </Button>
                <Button
                  onClick={stopTracking}
                  disabled={!isTracking}
                  variant="destructive"
                >
                  Pausar Tracking
                </Button>
                <Button
                  onClick={loadLiveMatches}
                  variant="outline"
                  disabled={loading}
                  className="border-slate-600 text-slate-300"
                >
                  Atualizar Partidas
                </Button>
                <Button
                  onClick={() => setShowVideoStream(!showVideoStream)}
                  variant="outline"
                  className="border-blue-600 text-blue-300 hover:bg-blue-700"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {showVideoStream ? 'Ocultar Stream' : 'Mostrar Stream'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Partidas Disponíveis */}
          <Card className="bg-slate-800 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Partidas Disponíveis ({liveMatches.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-slate-400">
                  Carregando partidas...
                </div>
              ) : liveMatches.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma partida ao vivo encontrada</p>
                  <p className="text-sm">Dados simulados para demonstração MVP</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {liveMatches.slice(0, 6).map((match, index) => (
                    <div
                      key={index}
                      className="bg-slate-700 p-4 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors"
                      onClick={() => selectMatch(match.fixture?.id || `demo_${index + 1000}`)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={match.fixture?.status?.short === 'LIVE' ? 'destructive' : 'secondary'}>
                          {match.fixture?.status?.short || 'LIVE'} 
                          {match.fixture?.status?.elapsed && ` ${match.fixture.status.elapsed}'`}
                        </Badge>
                        <span className="text-slate-400 text-sm">
                          ID: {match.fixture?.id || `demo_${index + 1000}`}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-white font-medium text-sm">
                            {match.teams?.home?.name || 'Time Casa'}
                          </p>
                        </div>
                        <div>
                          <span className="text-white font-bold">
                            {match.goals?.home ?? 0} - {match.goals?.away ?? 0}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">
                            {match.teams?.away?.name || 'Time Visitante'}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-slate-400 text-xs mt-2 text-center">
                        {match.league?.name || 'Liga Demo'} • Clique para selecionar
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>          {/* Componente de Streaming (Opcional) */}
          {showVideoStream && (
            <VideoStream 
              title="Streaming da Partida Ao Vivo"
              isLive={isTracking}
              showControls={true}
              className="mb-8"
            />
          )}

          {/* Componente de Tracking */}
          {isTracking && eventId && (
            <LiveMatchTracker 
              eventId={eventId} 
              countryCode={countryCode}
            />
          )}

          {/* Funcionalidades */}
          <Card className="bg-slate-800 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Funcionalidades de Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">Dados Reais</h3>
                <p className="text-slate-400 text-sm">
                  Livescores e odds atualizados da API oficial
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">Análise de Mudanças</h3>
                <p className="text-slate-400 text-sm">
                  Detecta variações de odds para identificar oportunidades
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">Tempo Real</h3>
                <p className="text-slate-400 text-sm">
                  Atualização automática a cada 30 segundos
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Exemplos e Informações */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Como Usar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Exemplos de ID de Eventos:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['4621624', '1234567', '9876543', 'demo_1000'].map(id => (
                    <Button
                      key={id}
                      variant="outline"
                      size="sm"
                      onClick={() => setEventId(id)}
                      className="border-slate-600 text-slate-300 text-xs"
                    >
                      {id}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="text-slate-400 space-y-2 text-sm">
                <p>🎯 <strong>Passo 1:</strong> Digite o ID do evento ou selecione uma partida</p>
                <p>⚡ <strong>Passo 2:</strong> Clique em "Iniciar Tracking" para monitorar em tempo real</p>
                <p>📊 <strong>Passo 3:</strong> Acompanhe mudanças de odds e estatísticas automaticamente</p>
                <p>🔴 <strong>Dados Reais:</strong> Usa endpoints reais da API quando disponíveis</p>
                <p>🛡️ <strong>Fallback:</strong> Dados simulados para demonstração quando API não responde</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    
  );
};

export default LiveTrackingPage;
