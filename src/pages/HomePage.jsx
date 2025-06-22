import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Zap, Users, BarChartBig, ShieldCheck } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import TextScramble from '@/components/TextScramble';
import { WorldCupBalls } from '@/components/WorldCupBalls';

const testimonials = [
  {
    quote: "O iFootball revolucionou a forma como analiso jogos. As métricas em tempo real são incrivelmente precisas!",
    name: "Carlos M.",
    role: "Técnico de Futebol Amador",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=50&q=60"
  },
  {
    quote: "Com o iFootball, consigo tomar decisões mais estratégicas durante as partidas. É uma ferramenta indispensável.",
    name: "Ana P.",
    role: "Analista de Desempenho",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dXNlciUyMGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=50&q=60"
  },
  {
    quote: "A interface é intuitiva e os dados são apresentados de forma clara. Recomendo para todos os apaixonados por futebol!",
    name: "João V.",
    role: "Jornalista Esportivo",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHVzZXIlMjBhdmF0YXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=50&q=60"
  }
];

const features = [
  {
    icon: <BarChartBig size={32} className="text-primary" />,
    title: "Análises Detalhadas",
    description: "Métricas avançadas e probabilidades calculadas por IA para uma visão completa do jogo."
  },
  {
    icon: <Zap size={32} className="text-primary" />,
    title: "Tempo Real",
    description: "Acompanhe as estatísticas e insights ao vivo, conforme o jogo acontece."
  },
  {
    icon: <ShieldCheck size={32} className="text-primary" />,
    title: "Precisão com IA",
    description: "Nossa Inteligência Artificial aprende e melhora constantemente para fornecer dados confiáveis."
  }
];

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>iFootball - Análise de Jogos em Tempo Real com IA</title>
        <meta name="description" content="Descubra o poder da IA na análise de jogos de futebol. Métricas em tempo real, probabilidades e insights estratégicos. Experimente grátis!" />
      </Helmet>
      <div className="space-y-24 py-8 md:py-16">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Banner animado com Text Scramble */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full h-64 md:h-96 rounded-xl mb-8 shadow-2xl overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-black border border-slate-700"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, #22c55e 0%, transparent 50%), 
                                 radial-gradient(circle at 75% 75%, #3b82f6 0%, transparent 50%),
                                 radial-gradient(circle at 50% 50%, #8b5cf6 0%, transparent 50%)`
              }}></div>
            </div>
            
            {/* Animated grid pattern */}
            <motion.div 
              className="absolute inset-0 opacity-10"
              animate={{ 
                backgroundPosition: ['0% 0%', '100% 100%']
              }}
              transition={{ 
                duration: 20, 
                repeat: Infinity, 
                repeatType: "reverse",
                ease: "linear"
              }}
            >
              <div 
                className="w-full h-full"
                style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                   linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                  backgroundSize: '30px 30px'
                }}
              ></div>
            </motion.div>
            
            {/* Floating World Cup balls */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Primeira camada de bolas */}
              {Object.entries(WorldCupBalls).map(([ballName, ballSvg], i) => (
                <motion.div
                  key={`layer1-${i}`}
                  className="absolute w-6 h-6 md:w-10 md:h-10 opacity-30"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -40, 0],
                    x: [0, Math.sin(i) * 20, 0],
                    rotate: [0, 360],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 5 + Math.random() * 4,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut",
                  }}
                >
                  {ballSvg}
                </motion.div>
              ))}
              
              {/* Segunda camada de bolas - menores e mais rápidas */}
              {Object.entries(WorldCupBalls).slice(0, 5).map(([ballName, ballSvg], i) => (
                <motion.div
                  key={`layer2-${i}`}
                  className="absolute w-4 h-4 md:w-6 md:h-6 opacity-20"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -60, 0],
                    x: [0, Math.cos(i) * 30, 0],
                    rotate: [360, 0],
                    opacity: [0.1, 0.4, 0.1],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.7,
                    ease: "easeInOut",
                  }}
                >
                  {ballSvg}
                </motion.div>
              ))}
              
              {/* Terceira camada - movimento diagonal */}
              {Object.entries(WorldCupBalls).slice(3, 8).map(([ballName, ballSvg], i) => (
                <motion.div
                  key={`layer3-${i}`}
                  className="absolute w-8 h-8 md:w-12 md:h-12 opacity-25"
                  style={{
                    left: `${10 + (i * 20) % 80}%`,
                    top: `${10 + (i * 15) % 80}%`,
                  }}
                  animate={{
                    x: [0, 50, -30, 0],
                    y: [0, -30, 20, 0],
                    rotate: [0, 180, 360],
                    scale: [1, 1.2, 0.8, 1],
                    opacity: [0.15, 0.4, 0.25, 0.15],
                  }}
                  transition={{
                    duration: 6 + Math.random() * 3,
                    repeat: Infinity,
                    delay: i * 0.8,
                    ease: "easeInOut",
                  }}
                >
                  {ballSvg}
                </motion.div>
              ))}
            </div>
            
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center px-8">
              <motion.div 
                className="mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <div className="text-2xl md:text-4xl lg:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent mb-6">
                  iFootball
                </div>
                <div className="text-sm md:text-base text-slate-300 mb-4">
                  Análise de Jogos em Tempo Real com IA
                </div>
              </motion.div>
              
              {/* Text Scramble animado */}
              <motion.div 
                className="text-base md:text-2xl lg:text-3xl font-bold text-center max-w-4xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <TextScramble 
                  texts={[
                    "Seu próximo grande ganho começa aqui.",
                    "O futuro das apostas está bem aqui.",
                    "Transformando dados em dinheiro."
                  ]}
                  className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-400 to-purple-400"
                  duration={4000}
                  scrambleDuration={1200}
                />
              </motion.div>
              
              {/* Indicadores visuais */}
              <motion.div 
                className="flex space-x-4 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              </motion.div>
            </div>
          </motion.div>

        {/* Seção Como Funciona a IA */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="py-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-clip-text bg-gradient-to-r text-primary">
                Como Nossa IA Revoluciona a Análise
              </span>
            </h2>
            <p className="text-lg text-slate-300 max-w-4xl mx-auto">
              Descubra o poder da inteligência artificial que processa vídeos em tempo real e combina com dados de APIs externas
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Processamento de Vídeo */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="glassmorphism-card h-full hover:border-purple-400 transition-all duration-300">
                <CardHeader className="items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <CardTitle className="text-xl text-center">Processamento de Vídeo IA</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-center mb-6">
                    Nossa IA analisa cada frame do vídeo, identificando jogadores, movimentos, posições e padrões táticos em tempo real.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-purple-300">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                      Detecção de jogadores e bola
                    </div>
                    <div className="flex items-center text-sm text-purple-300">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                      Análise de movimentação
                    </div>
                    <div className="flex items-center text-sm text-purple-300">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                      Reconhecimento de padrões
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Integração com APIs */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="glassmorphism-card h-full hover:border-blue-400 transition-all duration-300">
                <CardHeader className="items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                    </svg>
                  </div>
                  <CardTitle className="text-xl text-center">APIs RapidAPI</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-center mb-6">
                    Integramos dados em tempo real de múltiplas APIs do RapidAPI para enriquecer a análise com estatísticas oficiais.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-blue-300">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      Dados de partidas ao vivo
                    </div>
                    <div className="flex items-center text-sm text-blue-300">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      Estatísticas de jogadores
                    </div>
                    <div className="flex items-center text-sm text-blue-300">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      Odds e probabilidades
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Resultado Final */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="glassmorphism-card h-full hover:border-green-400 transition-all duration-300">
                <CardHeader className="items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
                    <BarChartBig className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-center">Insights Inteligentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-center mb-6">
                    A combinação de análise visual e dados externos gera insights únicos e previsões precisas para suas apostas.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-green-300">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                      Previsões de resultados
                    </div>
                    <div className="flex items-center text-sm text-green-300">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                      Análise de performance
                    </div>
                    <div className="flex items-center text-sm text-green-300">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                      Recomendações estratégicas
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Fluxo do Processo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-16"
          >
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-slate-700">
              <h3 className="text-2xl font-bold text-center mb-8 text-white">
                Processo de Análise em 3 Etapas
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                    1
                  </div>
                  <h4 className="font-semibold mb-2 text-purple-300">Captura & Processamento</h4>
                  <p className="text-sm text-slate-400">
                    IA analisa o vídeo frame por frame, extraindo dados visuais e movimentações
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                    2
                  </div>
                  <h4 className="font-semibold mb-2 text-blue-300">Enriquecimento de Dados</h4>
                  <p className="text-sm text-slate-400">
                    Integração com APIs do RapidAPI para dados oficiais e estatísticas em tempo real
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                    3
                  </div>
                  <h4 className="font-semibold mb-2 text-green-300">Análise Inteligente</h4>
                  <p className="text-sm text-slate-400">
                    Geração de insights, previsões e recomendações baseadas em machine learning
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

           <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="py-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Por que viemos pra <span className="text-primary">Revolucionar</span>?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glassmorphism-card h-full hover:border-primary transition-all duration-300">
                  <CardHeader className="items-center">
                    {feature.icon}
                    <CardTitle className="mt-4 text-xl text-center">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400 text-center">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

           {/* Seção de Demonstração em Vídeo */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="py-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                Veja o iFootball em Ação
              </span>
            </h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              Descubra como nossa tecnologia revoluciona a análise de futebol com demonstrações reais
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Primeiro Vídeo - Análise em Tempo Real */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group"
            >
              <Card className="glassmorphism-card h-full hover:border-primary transition-all duration-300 overflow-hidden">
                <div className="relative aspect-video overflow-hidden rounded-t-lg">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  >
                    <source src="https://res.cloudinary.com/dmzyxoy2o/video/upload/v1750609500/ecwadu9ee8txhwqbhdrl.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <CardHeader className="items-center">
                  
                  <CardTitle className="text-xl text-center">Análise em Tempo Real</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-center mb-4">
                    Acompanhe estatísticas avançadas, probabilidades de gol e insights táticos conforme o jogo acontece. 
                    Nossa IA processa dados instantaneamente para fornecer análises precisas.
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-accent">
                    <div className="flex items-center">
                      <Zap size={16} className="mr-1" />
                      Instantâneo
                    </div>
                    <div className="flex items-center">
                      <ShieldCheck size={16} className="mr-1" />
                      Preciso
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Segundo Vídeo - Interface Intuitiva */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group"
            >
              <Card className="glassmorphism-card h-full hover:border-accent transition-all duration-300 overflow-hidden">
                <div className="relative aspect-video overflow-hidden rounded-t-lg">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  >
                    <source src="https://res.cloudinary.com/dmzyxoy2o/video/upload/v1750609500/czb2eg4gqrkcfawjtltz.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <CardHeader className="items-center">
                  
                  <CardTitle className="text-xl text-center">Interface Inteligente</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-center mb-4">
                    Dashboard intuitivo com visualizações claras e controles simples. 
                    Acesse todas as funcionalidades através de uma interface pensada para profissionais.
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-accent">
                    <div className="flex items-center">
                      <BarChartBig size={16} className="mr-1" />
                      Profissional
                    </div>
                    <div className="flex items-center">
                      <Zap size={16} className="mr-1" />
                      Intuitivo
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Call to Action da seção */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-12"
          >
            <p className="text-slate-300 mb-6">
              Pronto para experimentar o futuro da análise esportiva?
            </p>
          </motion.div>
        </motion.section>
        </motion.section>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-20">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
              Análise Inteligente
            </span>
            <br/>
            <br /> Para Resultados Excepcionais
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Eleve sua compreensão do jogo com insights precisos e estatísticas avançadas, tudo em tempo real, potencializado por nossa Inteligência Artificial de ponta.
          </p>
          <div className="space-x-0 space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" asChild className="bg-gradient-to-r from-primary to-green-500 hover:from-primary/90 hover:to-green-500/90 text-white shadow-lg transform hover:scale-105 transition-transform">
              <Link to="/teste-gratis">Experimentar Grátis</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-accent text-accent hover:bg-accent/10 shadow-lg transform hover:scale-105 transition-transform">
              <Link to="/licenca">Comprar Licença</Link>
            </Button>
          </div>
        </motion.section>

       

        {/* Nova seção sobre dados reais */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="py-20"
        >
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-8 border border-green-500/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                Dados <span className="text-green-400">100% Reais</span> em Tempo Real
              </h2>
              <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                Nosso sistema se conecta diretamente com APIs profissionais de futebol, 
                garantindo informações precisas e atualizadas automaticamente.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-green-400 mb-2">🔄</div>
                <h3 className="font-semibold mb-2">Atualização Automática</h3>
                <p className="text-sm text-slate-400">Dados atualizados 2x por dia automaticamente</p>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-blue-400 mb-2">⚡</div>
                <h3 className="font-semibold mb-2">Tempo Real</h3>
                <p className="text-sm text-slate-400">Partidas ao vivo e classificações atuais</p>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-purple-400 mb-2">🏆</div>
                <h3 className="font-semibold mb-2">Ligas Oficiais</h3>
                <p className="text-sm text-slate-400">Premier League, La Liga e outras</p>
              </div>
              
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400 mb-2">👤</div>
                <h3 className="font-semibold mb-2">Jogadores Reais</h3>
                <p className="text-sm text-slate-400">Estatísticas de jogadores profissionais</p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link to="/analise-jogo">Ver Dados ao Vivo</Link>
              </Button>
            </div>
          </div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="py-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12">O que nossos <span className="text-secondary">Usuários</span> Dizem</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <Card className="glassmorphism-card h-full flex flex-col">
                  <CardContent className="pt-6 flex-grow">
                    <p className="text-slate-300 italic">"{testimonial.quote}"</p>
                  </CardContent>
                  <CardHeader className="flex-row items-center space-x-3 pt-4">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <CardTitle className="text-md text-primary">{testimonial.name}</CardTitle>
                      <p className="text-xs text-slate-500">{testimonial.role}</p>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

       
      </div>
    </>
  );
};

export default HomePage;