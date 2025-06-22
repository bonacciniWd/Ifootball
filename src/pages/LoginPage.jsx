import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { LogIn, UserPlus, Mail, Key } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext'; // Importar useAuth
import { useNavigate, Link } from 'react-router-dom'; // Para redirecionamento

const LoginPage = () => {
  const { toast } = useToast();
  const { login, signup, loading } = useAuth(); // Usar o contexto de autenticação
  const navigate = useNavigate(); // Hook para navegação

  const [isLoginView, setIsLoginView] = useState(true); // Renomeado para evitar conflito com a função login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Erro de Validação", description: "Por favor, preencha e-mail e senha.", variant: "destructive" });
      return;
    }
    if (!isLoginView && password !== confirmPassword) {
      toast({ title: "Erro de Validação", description: "As senhas não coincidem.", variant: "destructive" });
      return;
    }
    if (!isLoginView && !agreeToTerms) {
      toast({ title: "Erro de Validação", description: "Você deve concordar com os Termos de Serviço para se cadastrar.", variant: "destructive" });
      return;
    }

    try {
      if (isLoginView) {
        await login(email, password);
        toast({
          title: "Login Bem-sucedido!",
          description: `Bem-vindo de volta, ${email}!`,
        });
        navigate('/game-analysis'); // Redireciona para análise de jogos após login
      } else {
        await signup(email, password);
        toast({
          title: "Cadastro Realizado!",
          description: `Sua conta para ${email} foi criada. Bem-vindo!`,
        });
        navigate('/game-analysis'); // Redireciona para análise de jogos após cadastro
      }
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setAgreeToTerms(false);
      navigate('/'); // Redireciona para a HomePage após login/cadastro
    } catch (error) {
      toast({
        title: `Erro ao ${isLoginView ? 'entrar' : 'cadastrar'}`,
        description: error.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>{isLoginView ? 'Login' : 'Cadastro'} - iFootball</title>
        <meta name="description" content={`Acesse sua conta ou crie uma nova no iFootball para ${isLoginView ? 'analisar jogos' : 'começar seu teste grátis'}.`} />
      </Helmet>
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-8 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <Card className="w-full glassmorphism-card shadow-2xl">{/* Removido max-w-lg pois já está no container pai */}
            <CardHeader className="text-center px-8 pt-8 pb-6">
              <div className="mx-auto bg-primary p-3 rounded-full w-fit mb-4">
                {isLoginView ? <LogIn size={32} className="text-primary-foreground" /> : <UserPlus size={32} className="text-primary-foreground" />}
              </div>
              <CardTitle className="text-3xl">{isLoginView ? 'Bem-vindo de Volta!' : 'Crie sua Conta'}</CardTitle>
              <CardDescription>{isLoginView ? 'Acesse sua conta para continuar.' : 'Preencha os campos para se registrar.'}</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail size={16} className="inline mr-2 align-middle" />E-mail
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="seu@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="bg-slate-700/50 border-slate-600 focus:bg-slate-600"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">
                    <Key size={16} className="inline mr-2 align-middle" />Senha
                  </Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="********" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    className="bg-slate-700/50 border-slate-600 focus:bg-slate-600"
                    disabled={loading}
                  />
                </div>
                {!isLoginView && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      <Key size={16} className="inline mr-2 align-middle" />Confirmar Senha
                    </Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      placeholder="********" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required 
                      className="bg-slate-700/50 border-slate-600 focus:bg-slate-600"
                      disabled={loading}
                    />
                  </div>
                )}
                {!isLoginView && (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 bg-slate-800/30 rounded-lg border border-slate-600">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 text-primary bg-slate-700 border-slate-500 rounded focus:ring-primary focus:ring-2"
                        disabled={loading}
                      />
                      <label htmlFor="terms" className="text-sm text-slate-300 leading-relaxed">
                        Eu concordo com os{' '}
                        <Link to="/termos" className="text-primary hover:text-primary/80 underline" target="_blank">
                          Termos de Serviço
                        </Link>{' '}
                        e{' '}
                        <Link to="/privacidade" className="text-primary hover:text-primary/80 underline" target="_blank">
                          Política de Privacidade
                        </Link>.
                        <br />
                        <span className="text-xs text-slate-400 mt-2 block">
                          <strong>Importante:</strong> O iFootball é uma ferramenta de análise e não se responsabiliza por perdas financeiras 
                          decorrentes de apostas ou decisões baseadas em nossas análises. Use sempre com responsabilidade.
                        </span>
                      </label>
                    </div>
                  </div>
                )}
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-lg py-3" 
                  disabled={loading || (!isLoginView && !agreeToTerms)}
                >
                  {loading ? 'Processando...' : (isLoginView ? 'Entrar' : 'Criar Conta')}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col items-center space-y-4 px-8 pb-8">
              <Button variant="link" onClick={() => setIsLoginView(!isLoginView)} className="text-slate-400 hover:text-primary" disabled={loading}>
                {isLoginView ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
              </Button>
              
              {/* Aviso sobre responsabilidade */}
              <div className="text-center text-xs text-slate-500 border-t border-slate-700 pt-4">
                <p className="mb-2">
                  <strong>Aviso Legal:</strong> O iFootball é uma plataforma de análise esportiva baseada em dados e inteligência artificial.
                </p>
                <p>
                  Nossas análises são para fins informativos e educacionais. Não nos responsabilizamos por decisões de apostas ou perdas financeiras.
                  Aposte sempre com responsabilidade e dentro de suas possibilidades.
                </p>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;