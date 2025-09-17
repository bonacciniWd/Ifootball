import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target, TrendingUp, BarChart3 } from 'lucide-react';
import GameSelector from '@/components/GameSelector';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const GameSelectionPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedGame, setSelectedGame] = useState(null);

  const handleGameSelect = async (match) => {
    setSelectedGame(match);
    
    // Salvar jogo selecionado no localStorage para usar na página de análise
    localStorage.setItem('selectedMatch', JSON.stringify(match));
    
    // Navegar para a página de análise
    navigate('/analise-jogo', { 
      state: { 
        selectedMatch: match,
        from: 'game-selection'
      } 
    });
  };

  const handleBackToAnalysis = () => {
    navigate('/analise-jogo');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
        <Target size={48} className="text-primary mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Acesso Restrito</h2>        <p className="text-muted-foreground mb-6">
          Você precisa estar logado para selecionar jogos para análise.
        </p>
        <Button onClick={() => navigate('/login')} className="mr-4">
          Fazer Login
        </Button>
        <Button onClick={() => navigate('/')} variant="outline">
          Voltar ao Início
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Seleção de Jogos - iFootball</title>
        <meta name="description" content="Selecione jogos ao vivo ou recentes para análise detalhada com IA do iFootball." />
      </Helmet>
      
      <div className="space-y-8 py-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleBackToAnalysis}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <ArrowLeft size={16} />
              <span>Voltar à Análise</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">
                Selecionar <span className="text-primary">Jogo</span>
              </h1>
              <p className="text-slate-400 mt-1">
                Escolha um jogo para análise detalhada em tempo real
              </p>
            </div>
          </div>
        </motion.div>

        {/* Informações sobre a funcionalidade */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glassmorphism-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-primary">
                <BarChart3 size={24} />
                <span>Como Funciona a Análise</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Target size={16} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Selecione o Jogo</h3>
                    <p className="text-sm text-slate-400">
                      Escolha entre jogos ao vivo ou recentes para análise
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp size={16} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Análise IA</h3>
                    <p className="text-sm text-slate-400">
                      Nossa IA analisa estatísticas e tendências em tempo real
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <BarChart3 size={16} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Resultados</h3>
                    <p className="text-sm text-slate-400">
                      Veja probabilidades, estatísticas e insights detalhados
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Seletor de Jogos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <GameSelector onGameSelect={handleGameSelect} />
        </motion.div>
      </div>
    </>
  );
};

export default GameSelectionPage;
