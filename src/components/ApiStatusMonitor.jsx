import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  Wifi,
  WifiOff,
  Settings
} from 'lucide-react';
import { footballApiService } from '@/services/footballApiService';

const ApiStatusMonitor = ({ className = "" }) => {
  const [apiStatus, setApiStatus] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadApiStatus = () => {
    try {
      const status = footballApiService.getApiStatus();
      setApiStatus(status);
    } catch (error) {
      console.error('Erro ao carregar status das APIs:', error);
    }
  };

  const handleResetFailures = async () => {
    setRefreshing(true);
    try {
      footballApiService.resetApiFailures();
      loadApiStatus();
      setTimeout(() => setRefreshing(false), 1000);
    } catch (error) {
      console.error('Erro ao resetar APIs:', error);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadApiStatus();
    
    // Atualizar status a cada 30 segundos
    const interval = setInterval(loadApiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!apiStatus) {
    return (
      <Card className={`glassmorphism-card ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 animate-pulse text-primary" />
            <span className="text-sm text-slate-400">Carregando status das APIs...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (api) => {
    if (api.failed) {
      return <WifiOff className="h-4 w-4 text-red-400" />;
    } else if (api.configured) {
      return <Wifi className="h-4 w-4 text-green-400" />;
    } else {
      return <Settings className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getStatusBadge = (api) => {
    if (api.failed) {
      return <Badge variant="destructive">Falha</Badge>;
    } else if (api.configured) {
      return <Badge variant="default" className="bg-green-600">Ativa</Badge>;
    } else {
      return <Badge variant="secondary">Não Configurada</Badge>;
    }
  };

  return (
    <Card className={`glassmorphism-card border-primary/20 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Status das APIs
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFailures}
            disabled={refreshing}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">        {/* API Atual */}
        <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">API Atual:</span>
            <span className="text-sm text-primary">{apiStatus?.currentApi || 'Carregando...'}</span>
          </div>
        </div>
        
        {/* Lista de APIs */}
        <div className="space-y-2">
          {apiStatus?.availableApis?.map((api, index) => (
            <motion.div
              key={api.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-2 bg-slate-900/50 rounded-md"
            >
              <div className="flex items-center gap-2">
                {getStatusIcon(api)}
                <span className="text-xs font-medium text-slate-300">
                  {api.name}
                </span>
              </div>
              {getStatusBadge(api)}
            </motion.div>
          ))}
        </div>        {/* Rate Limited APIs */}
        {Object.keys(apiStatus?.rateLimitedApis || {}).length > 0 && (
          <div className="mt-3 p-2 bg-yellow-950/20 border border-yellow-600/30 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-3 w-3 text-yellow-400" />
              <span className="text-xs font-medium text-yellow-400">Rate Limited:</span>
            </div>
            {Object.entries(apiStatus?.rateLimitedApis || {}).map(([apiName, timestamp]) => {
              const timeLeft = Math.max(0, 60 - Math.floor((Date.now() - timestamp) / 60000));
              return (
                <div key={apiName} className="text-xs text-yellow-300">
                  {apiName}: ~{timeLeft}min restantes
                </div>
              );
            })}
          </div>
        )}        {/* APIs com Falha */}
        {(apiStatus?.failedApis || []).length > 0 && (
          <div className="mt-2 p-2 bg-red-950/20 border border-red-600/30 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-3 w-3 text-red-400" />
              <span className="text-xs font-medium text-red-400">
                APIs com Falha: {(apiStatus?.failedApis || []).join(', ')}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiStatusMonitor;
