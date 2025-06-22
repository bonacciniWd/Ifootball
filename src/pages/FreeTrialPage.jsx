import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Gift, Users, Copy, CheckCircle, Share2, Loader2 } from 'lucide-react'; // Adicionado Loader2
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext'; // Importar useAuth
import { referralService } from '@/services/referralService'; // Importar referralService
import { useNavigate } from 'react-router-dom';


const FreeTrialPage = () => {
  const { toast } = useToast();
  const { user, isAuthenticated, loading: authLoading } = useAuth(); // Usar user e isAuthenticated
  const navigate = useNavigate();

  const [referralCode, setReferralCode] = useState('CARREGANDO...');
  const [referredFriends, setReferredFriends] = useState(0);
  const [emailForNotification, setEmailForNotification] = useState(''); // Renomeado para evitar conflito
  const [pageLoading, setPageLoading] = useState(true);

  const friendsNeeded = 3;

  useEffect(() => {
    const fetchReferralStatus = async () => {
      if (authLoading) return; // Espera autenticação carregar
      
      if (!isAuthenticated || !user) {
        // toast({ title: "Acesso Negado", description: "Você precisa estar logado para acessar esta página.", variant: "destructive" });
        // navigate('/login'); // Redireciona se não estiver logado
        setPageLoading(false); // Para de carregar a página, mensagem de login será mostrada
        return;
      }
      
      setPageLoading(true);
      try {
        const status = await referralService.getReferralStatus(user.id);
        setReferralCode(status.code || `IFOOT-${user.id.slice(0,4).toUpperCase()}`);
        setReferredFriends(status.referred_count || 0);
      } catch (error) {
        toast({ title: "Erro ao buscar status", description: error.message || "Não foi possível carregar seus dados de indicação.", variant: "destructive" });
        setReferralCode('ERRO');
      } finally {
        setPageLoading(false);
      }
    };

    fetchReferralStatus();
  }, [user, isAuthenticated, authLoading, toast, navigate]);
  
  // Simulação de incremento de amigos para demonstração, se necessário
  // useEffect(() => {
  //   if (!pageLoading && isAuthenticated && referredFriends < friendsNeeded) {
  //     const interval = setInterval(async () => {
  //       if (user && referredFriends < friendsNeeded) { // Verifica se user existe
  //         try {
  //           // Apenas para demonstração, na vida real isso seria acionado por um evento
  //           // const updatedStatus = await referralService.incrementReferralCount(user.id);
  //           // setReferredFriends(updatedStatus.referred_count);
  //           // Para mock simples sem chamada de API:
  //           setReferredFriends(prev => (prev < friendsNeeded ? prev + 1 : friendsNeeded));
  //         } catch (error) {
  //           console.error("Erro ao simular incremento de indicação:", error);
  //         }
  //       }
  //     }, 5000); // Adiciona um amigo a cada 5 segundos
  //     return () => clearInterval(interval);
  //   }
  // }, [pageLoading, isAuthenticated, user, referredFriends]);


  const handleCopyCode = () => {
    if (referralCode && referralCode !== 'CARREGANDO...' && referralCode !== 'ERRO') {
      navigator.clipboard.writeText(referralCode);
      toast({ title: "Copiado!", description: "Código de indicação copiado para a área de transferência." });
    }
  };

  const handleShare = () => {
     toast({
      title: "🚧 Funcionalidade em Construção!",
      description: "Compartilhamento ainda não foi implementado. Mas não se preocupe, você pode solicitá-la no seu próximo prompt! 🚀",
      duration: 5000,
    });
  }

  const handleNotifyMe = (e) => {
    e.preventDefault();
    if (!emailForNotification) {
      toast({ title: "Erro", description: "Por favor, insira seu e-mail.", variant: "destructive" });
      return;
    }
    // TODO: Integrar com Supabase para salvar o e-mail
    toast({
      title: "Pronto!",
      description: `Avisaremos você em ${emailForNotification} quando o teste estiver liberado! (Funcionalidade parcialmente mockada)`,
    });
    setEmailForNotification('');
  };

  const isTrialUnlocked = referredFriends >= friendsNeeded;

  if (authLoading || pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-xl text-slate-300">Carregando informações de teste...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
        <Gift size={48} className="text-yellow-500 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Teste Grátis por Indicação</h2>
        <p className="text-slate-400">Você precisa estar logado para ver seu progresso e compartilhar seu código.</p>
        <Button onClick={() => navigate('/login')} className="mt-6">Fazer Login ou Cadastrar</Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Teste Grátis por Indicação - iFootball</title>
        <meta name="description" content="Compartilhe o iFootball com amigos e libere seu acesso de teste grátis. Acompanhe suas indicações." />
      </Helmet>
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Card className="w-full max-w-lg glassmorphism-card shadow-2xl">
            <CardHeader className="text-center">
              <div className={`mx-auto p-3 rounded-full w-fit mb-4 ${isTrialUnlocked ? 'bg-green-500' : 'bg-primary'}`}>
                {isTrialUnlocked ? <CheckCircle size={32} className="text-white" /> : <Gift size={32} className="text-primary-foreground" />}
              </div>
              <CardTitle className="text-3xl">
                {isTrialUnlocked ? "Teste Grátis Desbloqueado!" : "Libere seu Teste Grátis!"}
              </CardTitle>
              <CardDescription>
                {isTrialUnlocked 
                  ? "Parabéns! Você indicou amigos suficientes e seu teste grátis está ativo." 
                  : `Compartilhe com ${friendsNeeded} amigos para desbloquear seu acesso completo ao iFootball.`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isTrialUnlocked && (
                <>
                  <div className="text-center">
                    <p className="text-slate-300 mb-1">Seu código de indicação:</p>
                    <div className="flex items-center justify-center space-x-2 bg-slate-700/50 p-3 rounded-md">
                      <span className="text-xl font-mono text-accent">{referralCode}</span>
                      <Button variant="ghost" size="icon" onClick={handleCopyCode} aria-label="Copiar código" disabled={referralCode === 'CARREGANDO...' || referralCode === 'ERRO'}>
                        <Copy size={20} className="text-slate-400 hover:text-primary" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-slate-300 mb-2">Progresso das Indicações:</p>
                    <div className="w-full bg-slate-700 rounded-full h-6 overflow-hidden relative">
                      <motion.div 
                        className="bg-gradient-to-r from-primary to-green-500 h-full flex items-center justify-center text-sm font-medium text-primary-foreground"
                        initial={{ width: 0 }}
                        animate={{ width: `${(referredFriends / friendsNeeded) * 100}%` }}
                        transition={{ duration: 0.5, ease: "circOut" }}
                      >
                         {referredFriends > 0 && `${referredFriends}/${friendsNeeded}`}
                      </motion.div>
                       {referredFriends === 0 && <span className="absolute inset-0 flex items-center justify-center text-sm text-slate-400">0/{friendsNeeded}</span>}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{Math.max(0, friendsNeeded - referredFriends)} indicações restantes.</p>
                  </div>
                  
                  <Button onClick={handleShare} className="w-full bg-secondary hover:bg-secondary/90 text-lg py-3">
                    <Share2 size={20} className="mr-2" /> Compartilhar Agora
                  </Button>
                </>
              )}

              {isTrialUnlocked && (
                <div className="text-center space-y-4">
                  <CheckCircle size={64} className="text-green-500 mx-auto animate-pulse" />
                  <p className="text-xl text-slate-200">
                    Seu acesso de teste grátis ao iFootball está ativo por 7 dias! Explore todas as funcionalidades.
                  </p>
                  <Button asChild className="bg-primary hover:bg-primary/90 text-lg py-3">
                    <a href="/analise-jogo">Começar a Analisar Jogos</a>
                  </Button>
                </div>
              )}

              <div className="pt-4 border-t border-slate-700">
                <p className="text-sm text-slate-400 text-center mb-2">
                  Quer ser notificado quando novas formas de teste estiverem disponíveis?
                </p>
                <form onSubmit={handleNotifyMe} className="flex space-x-2">
                  <Input 
                    type="email" 
                    placeholder="Seu e-mail" 
                    value={emailForNotification}
                    onChange={(e) => setEmailForNotification(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 focus:bg-slate-600" 
                  />
                  <Button type="submit" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                    Me Avise
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default FreeTrialPage;