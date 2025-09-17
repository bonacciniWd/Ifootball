import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { KeyRound, CalendarDays, CheckCircle, XCircle, AlertTriangle, ShoppingCart, Loader2, Crown, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { licenseService } from '@/services/licenseService';
import LICENSE_CONFIG, { licenseUtils } from '@/config/licenseConfig';
import { useNavigate } from 'react-router-dom';

const LicensePage = () => {
  const { toast } = useToast();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [licenseInfo, setLicenseInfo] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState(null);
  const [demoStatusIndex, setDemoStatusIndex] = useState(0);
  const [isAnnual, setIsAnnual] = useState(false);

  useEffect(() => {
    const fetchLicenseInfo = async () => {
      if (authLoading) return;

      if (!isAuthenticated || !user) {
        setPageLoading(false);
        return;
      }
      
      setPageLoading(true);
      try {
        const data = await licenseService.getUserLicense(user.id);
        if (data) {
          const daysRemaining = licenseUtils.getDaysRemaining(data);
          const isActive = licenseUtils.isLicenseActive(data);
          
          let statusConfig = {
            statusText: getStatusText(data.license_type, data.status, isActive),
            color: getStatusColor(data.status, isActive, daysRemaining),
            icon: getStatusIcon(data.status, isActive, daysRemaining),
            daysRemaining,
            canRenew: true,
            buttonText: getButtonText(data.license_type, data.status, isActive)
          };

          setLicenseInfo(statusConfig);
        } else {
          // Usuário sem licença
          setLicenseInfo({
            statusText: 'Sem Licença Ativa',
            color: 'text-gray-500',
            icon: <XCircle />,
            daysRemaining: 0,
            canRenew: true,
            buttonText: 'Ativar Teste Grátis'
          });
        }
      } catch (error) {
        console.error('Error fetching license:', error);
        toast({
          title: "Erro ao carregar licença",
          description: "Não foi possível carregar as informações da sua licença.",
          variant: "destructive"
        });
      } finally {
        setPageLoading(false);
      }
    };

    fetchLicenseInfo();
  }, [authLoading, isAuthenticated, user, toast]);

  // Funções auxiliares para determinar status
  const getStatusText = (licenseType, status, isActive) => {
    if (!isActive) return 'Licença Expirada';
    
    switch (licenseType) {
      case 'free_trial': return 'Teste Grátis Ativo';
      case 'premium': return 'Licença Premium Ativa';
      case 'enterprise': return 'Licença Enterprise Ativa';
      default: return 'Licença Ativa';
    }
  };

  const getStatusColor = (status, isActive, daysRemaining) => {
    if (!isActive) return 'text-red-500';
    if (daysRemaining <= 3) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusIcon = (status, isActive, daysRemaining) => {
    if (!isActive) return <XCircle />;
    if (daysRemaining <= 3) return <AlertTriangle />;
    return <CheckCircle />;
  };

  const getButtonText = (licenseType, status, isActive) => {
    if (!isActive) return 'Renovar Licença';
    if (licenseType === 'free_trial') return 'Fazer Upgrade';
    return 'Renovar Licença';
  };

  // Handler para compra de licença
  const handlePurchase = async (licenseType, billingCycle = 'monthly') => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para comprar uma licença.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    setPurchaseLoading(`${licenseType}-${billingCycle}`);

    try {
      const result = await licenseService.initiatePurchase(user.id, licenseType, billingCycle);
      
      if (result.success) {
        toast({
          title: "Redirecionando para pagamento",
          description: "Você será redirecionado para completar o pagamento.",
          variant: "default"
        });
        
        // Em produção, redirecionaria para o gateway
        // window.location.href = result.paymentUrl;
        
        // Para MVP, simula sucesso
        setTimeout(() => {
          toast({
            title: "Pagamento simulado! 🎉",
            description: "Em produção, seria processado pelo gateway de pagamento.",
            variant: "default"
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Error initiating purchase:', error);
      toast({
        title: "Erro no pagamento",
        description: "Não foi possível iniciar o processo de pagamento.",
        variant: "destructive"
      });
    } finally {
      setPurchaseLoading(null);
    }
  };

  const handleInviteRedirect = () => {
    navigate('/invite');
  };

  const handleSyncLicense = async () => {
    if (!user) return;
    
    setPurchaseLoading('sync');
    
    try {
      console.log('🔄 Iniciando sincronização de licença...');
      
      // Fazer debug da licença
      await licenseService.debugUserLicense(user.id);
      
      // Tentar sincronizar
      const syncedData = await licenseService.syncLicenseData(user.id);
      
      if (syncedData) {
        // Recarregar informações da licença
        const data = await licenseService.getUserLicense(user.id);
        if (data) {
          const daysRemaining = licenseUtils.getDaysRemaining(data);
          const isActive = licenseUtils.isLicenseActive(data);
          
          let statusConfig = {
            statusText: getStatusText(data.license_type, data.status, isActive),
            color: getStatusColor(data.status, isActive, daysRemaining),
            icon: getStatusIcon(data.status, isActive, daysRemaining),
            daysRemaining,
            canRenew: true,
            buttonText: getButtonText(data.license_type, data.status, isActive)
          };

          setLicenseInfo(statusConfig);
          
          toast({
            title: "Licença sincronizada! ✅",
            description: `Status: ${statusConfig.statusText}`,
            variant: "default"
          });
        }
      } else {
        toast({
          title: "Nenhuma licença encontrada",
          description: "Não há licenças ativas no sistema para sincronizar.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Erro na sincronização:', error);
      toast({
        title: "Erro na sincronização",
        description: "Não foi possível sincronizar a licença.",
        variant: "destructive"
      });
    } finally {
      setPurchaseLoading(null);
    }
  };

  if (authLoading || pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-white">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Carregando informações da licença...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="bg-card border-border max-w-md">
          <CardContent className="pt-6 text-center">
            <KeyRound className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Login Necessário</h3>
            <p className="text-muted-foreground mb-4">Faça login para gerenciar sua licença</p>
            <Button onClick={() => navigate('/login')} className="w-full">
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Helmet>
        <title>Licenças - iFootball</title>
        <meta name="description" content="Gerencie sua licença do iFootball e escolha o plano ideal." />
      </Helmet>

      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Gerenciar Licença</h1>
        <p className="text-xl text-muted-foreground">
          Escolha o plano ideal para suas análises de futebol
        </p>
      </div>

        {/* Status da Licença Atual */}
        {licenseInfo && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                {licenseInfo.icon}
                <span className="ml-2">Status da Licença</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-lg font-semibold ${licenseInfo.color}`}>
                    {licenseInfo.statusText}
                  </p>
                  {licenseInfo.daysRemaining > 0 && (
                    <p className="text-muted-foreground flex items-center mt-1">
                      <CalendarDays className="h-4 w-4 mr-1" />
                      {licenseInfo.daysRemaining} dias restantes
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {licenseInfo.canRenew && (
                    <Button 
                      onClick={licenseInfo.statusText.includes('Sem Licença') ? handleInviteRedirect : () => {}}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {licenseInfo.buttonText}
                    </Button>
                  )}
                  <Button 
                    onClick={handleSyncLicense}
                    variant="outline"
                    size="sm"
                    className="text-muted-foreground border-border hover:bg-muted"
                    disabled={purchaseLoading === 'sync'}
                  >
                    {purchaseLoading === 'sync' ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        Verificando...
                      </>
                    ) : (
                      '🔄 Verificar'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Toggle de Planos */}
        <div className="flex justify-center items-center space-x-4 mb-8">
          <span className={`text-sm font-medium ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
            Mensal
          </span>
          <label htmlFor="billing-toggle" className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                id="billing-toggle" 
                className="sr-only" 
                checked={isAnnual}
                onChange={() => setIsAnnual(!isAnnual)}
              />
              <div className={`block w-14 h-8 rounded-full transition-all duration-300 ease-in-out ${
                isAnnual ? 'bg-primary' : 'bg-muted'
              }`}></div>
              <div className={`absolute left-1 top-1 bg-background w-6 h-6 rounded-full transition-transform duration-300 ease-in-out ${
                isAnnual ? 'translate-x-6' : ''
              }`}></div>
            </div>
          </label>
          <span className={`text-sm font-medium ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
            Anual
            <span className="ml-1 text-xs text-primary">Economize 20%</span>
          </span>
        </div>

        {/* Planos Disponíveis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Teste Grátis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card border-border relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-foreground">Teste Grátis</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Perfeito para começar
                </CardDescription>
                <div className="text-2xl font-bold text-foreground">
                  Grátis
                  <span className="text-sm font-normal text-muted-foreground block">
                    7 dias
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-foreground">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Até 5 análises por dia
                  </div>
                  <div className="flex items-center text-foreground">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Jogos ao vivo
                  </div>
                  <div className="flex items-center text-foreground">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Alertas básicos
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <XCircle className="h-4 w-4 text-destructive mr-2" />
                    Análises avançadas
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleInviteRedirect}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Ativar com Convite
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Premium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card border-accent/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-orange-500"></div>
              <div className="absolute top-4 right-4 bg-accent text-background text-xs px-2 py-1 rounded-full font-semibold">
                POPULAR
              </div>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <Crown className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-foreground">Premium</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Para usuários avançados
                </CardDescription>
                <div className="text-2xl font-bold text-foreground">
                  R$ {isAnnual 
                    ? Math.round(LICENSE_CONFIG.PREMIUM.price.yearly / 12) 
                    : LICENSE_CONFIG.PREMIUM.price.monthly}
                  <span className="text-sm font-normal text-muted-foreground block">
                    por mês {isAnnual && '(cobrança anual)'}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-foreground">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Análises ilimitadas
                  </div>
                  <div className="flex items-center text-foreground">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Análises avançadas
                  </div>
                  <div className="flex items-center text-foreground">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Alertas personalizados
                  </div>
                  <div className="flex items-center text-foreground">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Exportar dados
                  </div>
                  <div className="flex items-center text-foreground">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Suporte prioritário
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handlePurchase('premium', isAnnual ? 'yearly' : 'monthly')}
                  disabled={purchaseLoading === `premium-${isAnnual ? 'yearly' : 'monthly'}`}
                  className="w-full bg-accent hover:bg-accent/90 text-background"
                >
                  {purchaseLoading === `premium-${isAnnual ? 'yearly' : 'monthly'}` ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ShoppingCart className="h-4 w-4 mr-2" />
                  )}
                  {isAnnual ? 'Assinar Anual' : 'Assinar Mensal'}
                  {isAnnual && (
                    <span className="ml-1 text-xs">
                      (R$ {LICENSE_CONFIG.PREMIUM.price.yearly}/ano)
                    </span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Enterprise */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-card border-secondary/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-purple-500"></div>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <Zap className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-foreground">Enterprise</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Para profissionais
                </CardDescription>
                <div className="text-2xl font-bold text-foreground">
                  R$ {isAnnual 
                    ? Math.round(LICENSE_CONFIG.ENTERPRISE.price.yearly / 12) 
                    : LICENSE_CONFIG.ENTERPRISE.price.monthly}
                  <span className="text-sm font-normal text-muted-foreground block">
                    por mês {isAnnual && '(cobrança anual)'}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-foreground">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Tudo do Premium
                  </div>
                  <div className="flex items-center text-foreground">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    API Access
                  </div>
                  <div className="flex items-center text-foreground">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    White Label
                  </div>
                  <div className="flex items-center text-foreground">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Análise de vídeo (Em breve)
                  </div>
                  <div className="flex items-center text-foreground">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Suporte dedicado
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handlePurchase('enterprise', isAnnual ? 'yearly' : 'monthly')}
                  disabled={purchaseLoading === `enterprise-${isAnnual ? 'yearly' : 'monthly'}`}
                  className="w-full bg-secondary hover:bg-secondary/90"
                >
                  {purchaseLoading === `enterprise-${isAnnual ? 'yearly' : 'monthly'}` ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ShoppingCart className="h-4 w-4 mr-2" />
                  )}
                  {isAnnual ? 'Assinar Anual' : 'Assinar Mensal'}
                  {isAnnual && (
                    <span className="ml-1 text-xs">
                      (R$ {LICENSE_CONFIG.ENTERPRISE.price.yearly}/ano)
                    </span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        {/* FAQ ou Informações Adicionais */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Informações do MVP</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2">
            <p>🚧 <strong>Sistema em desenvolvimento:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Integração com gateway de pagamento será implementada</li>
              <li>Sistema de convites funcional para teste grátis</li>
              <li>Análise de vídeo e alertas em tempo real em desenvolvimento</li>
              <li>API atual limitada, fallback inteligente ativo</li>
            </ul>
          </CardContent>
        </Card>
    </div>
  );
};

export default LicensePage;