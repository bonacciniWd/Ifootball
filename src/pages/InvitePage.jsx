import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { licenseService } from '@/services/licenseService';
import { Loader2, Gift, Users, Clock } from 'lucide-react';

const InvitePage = () => {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inviteCode.trim()) {
      toast({
        title: "Código obrigatório",
        description: "Por favor, insira um código de convite.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Validar código de convite
      const validation = await licenseService.validateInviteCode(inviteCode.trim().toUpperCase());
      
      if (!validation.valid) {
        const errorMessages = {
          'invalid_code': 'Código de convite inválido.',
          'expired': 'Código de convite expirado.',
          'already_used': 'Código de convite já foi utilizado.',
          'max_uses_reached': 'Código de convite atingiu o limite de usos.'
        };
        
        toast({
          title: "Código inválido",
          description: errorMessages[validation.reason] || 'Código de convite inválido.',
          variant: "destructive"
        });
        return;
      }

      // Ativar licença de teste
      await licenseService.activateFreeTrial(user.id, inviteCode.trim().toUpperCase());
      
      toast({
        title: "Teste grátis ativado! 🎉",
        description: `Seu teste de ${validation.trialDuration || 7} dias foi ativado com sucesso.`,
        variant: "default"
      });

      // Redirecionar para dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error activating invite:', error);
      toast({
        title: "Erro na ativação",
        description: "Erro ao ativar o código de convite. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTryDemo = () => {
    setInviteCode('DEMO2024');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Gift className="h-12 w-12 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-white">Ativar Teste Grátis</h1>
          <p className="text-slate-400">
            Insira seu código de convite para começar
          </p>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">
              Código de Convite
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inviteCode" className="text-slate-300">
                  Código de Convite
                </Label>
                <Input
                  id="inviteCode"
                  type="text"
                  placeholder="Ex: ABC123XY"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  maxLength={8}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Gift className="mr-2 h-4 w-4" />
                )}
                {loading ? 'Ativando...' : 'Ativar Teste Grátis'}
              </Button>
            </form>

            <div className="space-y-3">
              <div className="text-center">
                <p className="text-sm text-slate-400">ou</p>
              </div>
              
              <Button 
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={handleTryDemo}
              >
                <Users className="mr-2 h-4 w-4" />
                Usar Código Demo
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="space-y-3 text-sm text-slate-400">
              <h3 className="font-semibold text-white flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                O que você ganha:
              </h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>7 dias de teste grátis</li>
                <li>Até 5 análises por dia</li>
                <li>Acesso a jogos ao vivo</li>
                <li>Alertas básicos de probabilidade</li>
                <li>Análise de estatísticas</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button 
            variant="link"
            className="text-slate-400 hover:text-white"
            onClick={() => navigate('/login')}
          >
            Voltar ao Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvitePage;
