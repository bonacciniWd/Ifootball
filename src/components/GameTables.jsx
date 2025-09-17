import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Trophy, 
  Target, 
  Clock, 
  Users,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Minus,
  Filter,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';

const LeagueStandings = ({ standings = [], leagueName = "Liga" }) => {
  const [sortBy, setSortBy] = useState('points');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const sortedStandings = [...standings].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    // Para campos específicos que podem estar aninhados
    if (sortBy === 'points') {
      aValue = a.points || 0;
      bValue = b.points || 0;
    } else if (sortBy === 'position') {
      aValue = a.rank || 0;
      bValue = b.rank || 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  const getPositionBadge = (position) => {
    if (position <= 4) return { color: 'bg-green-500', text: 'Champions' };
    if (position <= 6) return { color: 'bg-blue-500', text: 'Europa' };
    if (position >= standings.length - 2) return { color: 'bg-red-500', text: 'Rebaixamento' };
    return { color: 'bg-slate-500', text: 'Liga' };
  };

  const SortIcon = ({ column }) => {
    if (sortBy !== column) return <Minus size={14} className="text-slate-400" />;
    return sortOrder === 'asc' ? 
      <ArrowUp size={14} className="text-primary" /> : 
      <ArrowDown size={14} className="text-primary" />;
  };

  return (
    <Card className="glassmorphism-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy size={20} className="text-primary" />
          <span>Classificação - {leagueName}</span>
          <Badge variant="outline">{standings.length} times</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-slate-800"
                  onClick={() => handleSort('position')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Pos</span>
                    <SortIcon column="position" />
                  </div>
                </TableHead>
                <TableHead>Time</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-slate-800 text-center"
                  onClick={() => handleSort('points')}
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>Pts</span>
                    <SortIcon column="points" />
                  </div>
                </TableHead>
                <TableHead className="text-center">J</TableHead>
                <TableHead className="text-center">V</TableHead>
                <TableHead className="text-center">E</TableHead>
                <TableHead className="text-center">D</TableHead>
                <TableHead className="text-center">SG</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedStandings.slice(0, 20).map((team, index) => {
                const position = team.rank || (index + 1);
                const positionBadge = getPositionBadge(position);
                
                return (
                  <motion.tr
                    key={team.team?.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="hover:bg-slate-800/50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className={`w-1 h-8 ${positionBadge.color} rounded-full`}></div>
                        <span className="font-semibold text-white">{position}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {team.team?.logo && (
                          <img 
                            src={team.team.logo} 
                            alt={team.team.name}
                            className="w-6 h-6 object-contain"
                          />
                        )}
                        <div>
                          <p className="font-medium text-white">
                            {team.team?.name || 'Time'}
                          </p>
                          <p className="text-xs text-slate-400">
                            {team.team?.country || ''}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-bold text-primary">
                        {team.points || 0}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-slate-300">
                      {team.all?.played || 0}
                    </TableCell>
                    <TableCell className="text-center text-green-400">
                      {team.all?.win || 0}
                    </TableCell>
                    <TableCell className="text-center text-yellow-400">
                      {team.all?.draw || 0}
                    </TableCell>
                    <TableCell className="text-center text-red-400">
                      {team.all?.lose || 0}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`font-medium ${
                        (team.goalsDiff || 0) > 0 ? 'text-green-400' : 
                        (team.goalsDiff || 0) < 0 ? 'text-red-400' : 'text-slate-400'
                      }`}>
                        {team.goalsDiff > 0 ? '+' : ''}{team.goalsDiff || 0}
                      </span>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        {/* Legenda */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-slate-400">Champions League</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-slate-400">Europa League</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-slate-400">Rebaixamento</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const RecentMatches = ({ matches = [] }) => {
  const getMatchStatus = (status) => {
    switch (status?.short) {
      case 'FT':
        return { text: 'Finalizado', color: 'bg-green-500' };
      case 'LIVE':
      case '1H':
      case '2H':
      case 'HT':
        return { text: 'Ao Vivo', color: 'bg-red-500 animate-pulse' };
      default:
        return { text: status?.long || 'Agendado', color: 'bg-slate-500' };
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  };

  return (
    <Card className="glassmorphism-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock size={20} className="text-primary" />
          <span>Jogos Recentes</span>
          <Badge variant="outline">{matches.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.slice(0, 10).map((match, index) => {
            const status = getMatchStatus(match.fixture?.status);
            
            return (
              <motion.div
                key={match.fixture?.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex flex-col p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="text-xs text-slate-400">
                    {formatDate(match.fixture?.timestamp)}
                  </div>
                  <Badge className={`${status.color} text-white text-xs`}>
                    {status.text}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 items-center gap-2">
                  <div className="flex flex-col items-center space-y-1">
                    {match.teams?.home?.logo && (
                      <img 
                        src={match.teams.home.logo} 
                        alt={match.teams.home.name}
                        className="w-8 h-8 object-contain"
                      />
                    )}
                    <span className="text-sm text-white text-center truncate max-w-[120px]">
                      {match.teams?.home?.name}
                    </span>
                  </div>

                  <div className="text-center">
                    {match.goals && (match.goals.home !== null || match.goals.away !== null) ? (
                      <div className="text-lg font-bold text-primary">
                        {match.goals.home} - {match.goals.away}
                      </div>
                    ) : (
                      <div className="text-sm text-slate-400">vs</div>
                    )}
                  </div>

                  <div className="flex flex-col items-center space-y-1">
                    {match.teams?.away?.logo && (
                      <img 
                        src={match.teams.away.logo} 
                        alt={match.teams.away.name}
                        className="w-8 h-8 object-contain"
                      />
                    )}
                    <span className="text-sm text-white text-center truncate max-w-[120px]">
                      {match.teams?.away?.name}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

const TopPlayers = ({ players = [] }) => {
  return (
    <Card className="glassmorphism-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users size={20} className="text-primary" />
          <span>Jogadores em Destaque</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {players.slice(0, 5).map((player, index) => (
            <motion.div
              key={player.player?.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center space-x-3 p-3 bg-slate-800/30 rounded-lg"
            >
              {player.player?.photo && (
                <img 
                  src={player.player.photo} 
                  alt={player.player.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <p className="font-medium text-white">
                  {player.player?.name || 'Jogador'}
                </p>
                <p className="text-xs text-slate-400">
                  {player.statistics?.[0]?.team?.name || 'Time'} • 
                  {player.player?.position || 'Posição'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-primary">
                  {player.statistics?.[0]?.goals?.total || 0} gols
                </p>
                <p className="text-xs text-slate-400">
                  {player.statistics?.[0]?.games?.appearences || 0} jogos
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export { LeagueStandings, RecentMatches, TopPlayers };
