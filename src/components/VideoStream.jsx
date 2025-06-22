import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Play, Pause, Volume2, VolumeX, Maximize, Eye } from 'lucide-react';

const VideoStream = ({ 
  title = "Transmissão Ao Vivo", 
  showControls = true, 
  className = "",
  streamUrl = null,
  isLive = false 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // TODO: Implementar controle real do player
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // TODO: Implementar controle real do volume
  };

  const showNotImplementedToast = (feature) => {
    // TODO: Implementar toast notification
    console.log(`${feature} será implementado em breve!`);
  };

  return (
    <Card className={`glassmorphism-card shadow-2xl ${className}`}>
      <CardHeader>
        <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
          {isLive && <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>}
          {title}
          {isLive && <span className="text-red-500 text-sm font-normal">AO VIVO</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative group">
          {/* Player de Vídeo */}
          <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 relative overflow-hidden">
            {streamUrl ? (
              // TODO: Implementar player real quando streamUrl estiver disponível
              <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                  <Eye size={48} className="mx-auto mb-2 text-slate-400" />
                  <p className="text-lg text-slate-300">Stream Conectado</p>
                  <p className="text-sm text-slate-500 mt-1">URL: {streamUrl}</p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <BarChart size={64} className="mx-auto mb-2" />
                <p className="text-xl">Placeholder para Vídeo/Stream da Partida</p>
                <p className="text-sm text-slate-400 mt-2">Streaming será implementado em breve</p>
              </div>
            )}

            {/* Overlay de controles - aparece no hover */}
            {showControls && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={togglePlay}
                    className="bg-white/20 hover:bg-white/30 text-white border-0"
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </Button>
                  
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={toggleMute}
                    className="bg-white/20 hover:bg-white/30 text-white border-0"
                  >
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                  </Button>
                  
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => showNotImplementedToast("Tela cheia")}
                    className="bg-white/20 hover:bg-white/30 text-white border-0"
                  >
                    <Maximize size={24} />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Controles inferiores */}
          {showControls && (
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={() => showNotImplementedToast("Conectar stream")} 
                  variant="secondary"
                  size="sm"
                >
                  {streamUrl ? "Reconectar Stream" : "Conectar Stream"}
                </Button>
                
                {isLive && (
                  <Button 
                    onClick={() => showNotImplementedToast("Voltar ao vivo")} 
                    variant="outline"
                    size="sm"
                    className="text-red-500 border-red-500 hover:bg-red-500/10"
                  >
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                    Voltar ao Vivo
                  </Button>
                )}
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                {isLive && (
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Online
                  </span>
                )}
                <span>Qualidade: HD</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoStream;
