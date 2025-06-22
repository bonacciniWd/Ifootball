import React from 'react';
import Layout from '@/components/Layout';
import AdvancedSearch from '@/components/AdvancedSearch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Globe, 
  Trophy, 
  Users, 
  Calendar,
  MapPin,
  Star,
  Info
} from 'lucide-react';

const SearchPage = () => {
  return (
    
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
              <Search className="h-8 w-8 mr-3" />
              Busca Avançada
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Encontre jogadores, times, ligas e partidas de forma rápida e inteligente
            </p>
          </div>

          {/* Guia de Funcionalidades */}
          <Card className="bg-slate-800 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Como Usar a Busca
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">Busca Global</h3>
                <p className="text-slate-400 text-sm">
                  Pesquise simultaneamente em jogadores, times e ligas
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">Por Liga</h3>
                <p className="text-slate-400 text-sm">
                  Filtre por campeonatos específicos e veja partidas
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">Por País</h3>
                <p className="text-slate-400 text-sm">
                  Explore ligas e times de países específicos
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-orange-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">Por Data</h3>
                <p className="text-slate-400 text-sm">
                  Encontre todas as partidas de uma data específica
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Exemplos de Busca */}
          <Card className="bg-slate-800 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Exemplos de Busca
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-white font-semibold mb-2 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Jogadores
                  </h4>
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-slate-300">messi</Badge>
                    <Badge variant="outline" className="text-slate-300">ronaldo</Badge>
                    <Badge variant="outline" className="text-slate-300">neymar</Badge>
                    <Badge variant="outline" className="text-slate-300">mbappé</Badge>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white font-semibold mb-2 flex items-center">
                    <Trophy className="h-4 w-4 mr-2" />
                    Times
                  </h4>
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-slate-300">manchester</Badge>
                    <Badge variant="outline" className="text-slate-300">barcelona</Badge>
                    <Badge variant="outline" className="text-slate-300">real madrid</Badge>
                    <Badge variant="outline" className="text-slate-300">flamengo</Badge>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white font-semibold mb-2 flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Ligas
                  </h4>
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-slate-300">premier league</Badge>
                    <Badge variant="outline" className="text-slate-300">la liga</Badge>
                    <Badge variant="outline" className="text-slate-300">serie a</Badge>
                    <Badge variant="outline" className="text-slate-300">brasileirão</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Componente Principal de Busca */}
          <AdvancedSearch />

          {/* Informações Adicionais */}
          <Card className="bg-slate-800 border-slate-700 mt-8">
            <CardHeader>
              <CardTitle className="text-white">ℹ️ Informações</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400 space-y-2">
              <p>✅ <strong>Dados Reais:</strong> Busca de jogadores e times via API oficial</p>
              <p>🔄 <strong>Dados Simulados:</strong> Partidas, estatísticas e eventos (MVP)</p>
              <p>⚡ <strong>Cache Inteligente:</strong> Resultados salvos por 10 minutos para melhor performance</p>
              <p>🎯 <strong>MVP:</strong> Sistema de busca funcional, integração completa será implementada na próxima versão</p>
            </CardContent>
          </Card>
        </div>
      </div>
   
  );
};

export default SearchPage;
