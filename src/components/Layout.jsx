import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, LogIn, Gift, KeyRound, ShieldCheck, Settings, User, LogOut, Search, Activity, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Lottie from 'lottie-react';

const navItems = [
  { path: '/', label: 'Início', icon: <Home size={20} /> },
  { path: '/analise-jogo', label: 'Análise', icon: <BarChart2 size={20} /> },
  { path: '/search', label: 'Busca', icon: <Search size={20} /> },
  { path: '/live', label: 'Ao Vivo', icon: <Activity size={20} /> },
  { path: '/teste-gratis', label: 'Teste Grátis', icon: <Gift size={20} /> },
  { path: '/licenca', label: 'Licença', icon: <KeyRound size={20} /> },
];

// Itens apenas para admins/desenvolvedores
const adminNavItems = [
  { path: '/admin', label: 'Admin', icon: <Settings size={20} /> },
];

const Layout = ({ children }) => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [vrzAnimation, setVrzAnimation] = useState(null);
  
  // Carrega a animação Lottie
  useEffect(() => {
    fetch('/vrz.json')
      .then(response => response.json())
      .then(data => setVrzAnimation(data))
      .catch(error => console.error('Error loading Lottie animation:', error));
  }, []);
  
  // Memoiza os itens de navegação para evitar recriações
  const memoizedNavItems = useMemo(() => navItems, []);
  const memoizedAdminNavItems = useMemo(() => adminNavItems, []);
  
  // Memoiza a verificação de admin para evitar recalculações
  const isAdmin = useMemo(() => {
    return user?.email === 'admin@ifootball.com' || 
           user?.email === 'dbonaccioli8@gmail.com' ||
           process.env.NODE_ENV === 'development';
  }, [user?.email]);

  // Memoiza o handler de logout
  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }, [logout]);

  // Memoiza o toggle do menu móvel
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  // Memoiza o fechamento do menu móvel
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Memoiza o ano atual
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-slate-900">
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg shadow-lg"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/ifootball-logo.svg" alt="iFootball Logo" className="h-10 w-auto" />
              <span className="text-2xl font-bold text-primary">iFootball</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-2">
              {memoizedNavItems.map((item) => (
                <Button
                  key={item.path}
                  variant={location.pathname === item.path ? 'default' : 'ghost'}
                  asChild
                  className={`
                    ${location.pathname === item.path 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'}
                  `}
                >
                  <Link to={item.path} className="flex items-center space-x-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </Button>
              ))}
              
              {/* Itens administrativos - apenas para admins */}
              {isAdmin && memoizedAdminNavItems.map((item) => (
                <Button
                  key={item.path}
                  variant={location.pathname === item.path ? 'default' : 'ghost'}
                  asChild
                  className={`
                    ${location.pathname === item.path 
                      ? 'bg-orange-600 text-white' 
                      : 'text-orange-300 hover:bg-orange-700 hover:text-white border border-orange-600'}
                  `}
                >
                  <Link to={item.path} className="flex items-center space-x-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </Button>
              ))}

              {/* Área de autenticação */}
              <div className="ml-4 border-l border-slate-600 pl-4">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2 px-3 py-2 bg-slate-800 rounded-lg">
                      <User size={16} className="text-green-400" />
                      <span className="text-sm text-slate-300">
                        {user?.email?.split('@')[0] || 'Usuário'}
                      </span>
                      {isAdmin && (
                        <span className="text-xs bg-orange-600 text-white px-2 py-0.5 rounded">
                          Admin
                        </span>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="text-slate-300 border-slate-600 hover:bg-slate-700"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sair
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    asChild
                    className="text-slate-300 border-slate-600 hover:bg-slate-700"
                  >
                    <Link to="/login" className="flex items-center space-x-2">
                      <LogIn size={16} />
                      <span>Login</span>
                    </Link>
                  </Button>
                )}
              </div>
            </nav>
            
            {/* Menu móvel */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMobileMenu}
                className="text-slate-300 hover:bg-slate-700"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
          
          {/* Menu móvel expandido */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-background/95 backdrop-blur-lg border-t border-slate-600">
              <div className="px-4 py-4 space-y-2">
                {memoizedNavItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={location.pathname === item.path ? 'default' : 'ghost'}
                    asChild
                    className={`w-full justify-start ${
                      location.pathname === item.path 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <Link to={item.path} className="flex items-center space-x-2">
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </Button>
                ))}
                
                {/* Itens administrativos - apenas para admins no mobile */}
                {isAdmin && memoizedAdminNavItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={location.pathname === item.path ? 'default' : 'ghost'}
                    asChild
                    className={`w-full justify-start ${
                      location.pathname === item.path 
                        ? 'bg-orange-600 text-white' 
                        : 'text-orange-300 hover:bg-orange-700 hover:text-white border border-orange-600'
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <Link to={item.path} className="flex items-center space-x-2">
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </Button>
                ))}

                {/* Área de autenticação móvel */}
                <div className="pt-2 border-t border-slate-600">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 px-3 py-2 bg-slate-800 rounded-lg">
                        <User size={16} className="text-green-400" />
                        <span className="text-sm text-slate-300">
                          {user?.email?.split('@')[0] || 'Usuário'}
                        </span>
                        {isAdmin && (
                          <span className="text-xs bg-orange-600 text-white px-2 py-0.5 rounded">
                            Admin
                          </span>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleLogout();
                          closeMobileMenu();
                        }}
                        className="w-full justify-start text-slate-300 border-slate-600 hover:bg-slate-700"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sair
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      asChild
                      className="w-full justify-start text-slate-300 border-slate-600 hover:bg-slate-700"
                      onClick={closeMobileMenu}
                    >
                      <Link to="/login" className="flex items-center space-x-2">
                        <LogIn size={16} />
                        <span>Login</span>
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.header>
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-background/50 border-t border-border py-8 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <img src="/ifootball-logo.svg" alt="iFootball Logo" className="h-8 w-auto" />
              <p className="text-sm text-slate-400">&copy; {currentYear} iFootball. Todos os direitos reservados.</p>
            </div>
            <div className="flex space-x-4">
              <Link to="/termos" className="text-xs text-slate-500 hover:text-primary">Termos de Serviço</Link>
              <Link to="/privacidade" className="text-xs text-slate-500 hover:text-primary">Política de Privacidade</Link>
            </div>
          </div>          <div className="mt-2">
            <div className="flex justify-center items-center py-2">
              {vrzAnimation ? (
                <Lottie 
                  animationData={vrzAnimation} 
                  loop={true} 
                  autoplay={true}
                  style={{ width: 80, height: 80 }}
                  className="opacity-90"
                />
              ) : (
                <div className="w-[60px] h-[60px] flex items-center justify-center opacity-60">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-2">
            Desenvolvido com <ShieldCheck size={14} className="inline text-primary" /> por Visione Rifatta.
            </p>
          </div>
          
        </div>
      </footer>
    </div>
  );
};

export default Layout;