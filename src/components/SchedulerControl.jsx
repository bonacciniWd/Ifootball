import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { footballScheduler } from '@/services/footballScheduler';
import { Clock, Play, Pause, RefreshCw, CheckCircle, XCircle, Info } from 'lucide-react';

export const SchedulerControl = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    updateStatus();
    
    // Escuta eventos de atualização
    const handleUpdate = () => {
      updateStatus();
    };

    window.addEventListener('footballDataUpdated', handleUpdate);
    
    // Atualiza status a cada 30 segundos
    const interval = setInterval(updateStatus, 30000);

    return () => {
      window.removeEventListener('footballDataUpdated', handleUpdate);
      clearInterval(interval);
    };
  }, []);

  const updateStatus = () => {
    const currentStatus = footballScheduler.getStatus();
    setStatus(currentStatus);
  };
  const handleStart = () => {
    footballScheduler.start();
    updateStatus();
    toast({
      title: "Agendador Iniciado",
      description: "O sistema começará a atualizar automaticamente",
    });
  };

  const handleStop = () => {
    footballScheduler.stop();
    updateStatus();
    toast({
      title: "Agendador Parado",
      description: "Atualizações automáticas foram pausadas",
    });
  };

  const handleForceUpdate = async () => {
    setLoading(true);
    try {
      await footballScheduler.forceUpdate();
      toast({
        title: "Atualização Concluída",
        description: "Dados atualizados com sucesso",
      });
    } catch (error) {
      console.error('Erro na atualização manual:', error);
      toast({
        title: "Erro na Atualização",
        description: "Não foi possível atualizar os dados",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      updateStatus();
    }
  };

  if (!status) {
    return (
      <Card className="p-4">
        <div className="text-center">Carregando status do agendador...</div>
      </Card>
    );
  }

  return (
    <Card className="glassmorphism-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Agendador de Atualizações</span>
          <Badge variant={status.active ? "default" : "secondary"}>
            {status.active ? "Ativo" : "Inativo"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controles */}
        <div className="flex space-x-2">
          {status.active ? (
            <Button onClick={handleStop} variant="outline" size="sm">
              <Pause className="h-4 w-4 mr-2" />
              Parar
            </Button>
          ) : (
            <Button onClick={handleStart} variant="outline" size="sm">
              <Play className="h-4 w-4 mr-2" />
              Iniciar
            </Button>
          )}
          
          <Button 
            onClick={handleForceUpdate} 
            disabled={loading}
            variant="outline" 
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar Agora
          </Button>
        </div>

        {/* Horários programados */}
        <div>
          <h4 className="font-medium mb-2">Horários Programados:</h4>
          <div className="flex space-x-2">
            {status.schedules.map(time => (
              <Badge key={time} variant="outline">
                {time}
              </Badge>
            ))}
          </div>
        </div>

        {/* Próximas atualizações */}
        <div>
          <h4 className="font-medium mb-2">Próximas Atualizações:</h4>
          <div className="space-y-1">
            {status.nextUpdates.slice(0, 2).map((time, index) => (
              <div key={index} className="text-sm text-gray-600">
                {time}
              </div>
            ))}
          </div>
        </div>

        {/* Última atualização */}
        {status.lastUpdate && (
          <div>
            <h4 className="font-medium mb-2">Última Atualização:</h4>
            <div className="flex items-center space-x-2">
              {status.lastUpdate.success ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm">{status.lastUpdate.time}</span>
            </div>
            {status.lastUpdate.error && (
              <div className="text-sm text-red-500 mt-1">
                Erro: {status.lastUpdate.error}
              </div>
            )}
          </div>
        )}

        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {status.totalUpdates}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {status.successfulUpdates}
            </div>
            <div className="text-sm text-gray-600">Sucessos</div>
          </div>
        </div>

        {/* Informações */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <div className="flex items-start space-x-2">
            <Info className="h-4 w-4 text-blue-500 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium">Como funciona:</p>
              <ul className="mt-1 space-y-1 text-xs">
                <li>• Atualiza automaticamente 2x por dia (12h e 00h)</li>
                <li>• Cache válido por 12 horas</li>
                <li>• Usa apenas quando necessário para economizar API</li>
                <li>• Dados ficam disponíveis mesmo offline</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
