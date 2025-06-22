import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Lock, Database, UserCheck, Mail } from 'lucide-react';

const PrivacyPage = () => {
  return (
    <>
      <Helmet>
        <title>Política de Privacidade - iFootball</title>
        <meta name="description" content="Política de privacidade do iFootball. Saiba como protegemos e utilizamos seus dados pessoais." />
      </Helmet>
      
      <div className="min-h-screen py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                Política de Privacidade
              </span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Sua privacidade é fundamental para nós. Saiba como coletamos, usamos e protegemos suas informações.
            </p>
            <p className="text-sm text-slate-500 mt-4">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </motion.div>

          <div className="space-y-8">
            {/* Coleta de Informações */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="glassmorphism-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Database className="text-primary" size={24} />
                    Informações que Coletamos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300">
                    Coletamos as seguintes informações para fornecer nossos serviços:
                  </p>
                  <ul className="space-y-2 text-slate-400">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <strong>Informações de conta:</strong> Nome, email e preferências de usuário
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <strong>Dados de uso:</strong> Análises realizadas, jogos consultados e estatísticas
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <strong>Informações técnicas:</strong> Endereço IP, navegador e dispositivo
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <strong>Dados de pagamento:</strong> Processados através do PayPal (não armazenamos dados de cartão)
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Como Usamos */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="glassmorphism-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Eye className="text-blue-400" size={24} />
                    Como Usamos suas Informações
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300">
                    Utilizamos suas informações para:
                  </p>
                  <ul className="space-y-2 text-slate-400">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      Fornecer análises personalizadas de jogos de futebol
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      Melhorar nossos algoritmos de IA e recomendações
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      Processar pagamentos e gerenciar licenças
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      Enviar atualizações importantes sobre o serviço
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      Garantir a segurança e prevenir fraudes
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Proteção de Dados */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="glassmorphism-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Shield className="text-green-400" size={24} />
                    Como Protegemos seus Dados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300">
                    Implementamos medidas de segurança robustas:
                  </p>
                  <ul className="space-y-2 text-slate-400">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      Criptografia SSL/TLS para todas as comunicações
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      Autenticação segura via Supabase
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      Acesso restrito aos dados apenas para funcionários autorizados
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      Backups regulares e armazenamento seguro
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      Monitoramento contínuo de segurança
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Seus Direitos */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="glassmorphism-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <UserCheck className="text-purple-400" size={24} />
                    Seus Direitos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300">
                    Você tem os seguintes direitos sobre seus dados:
                  </p>
                  <ul className="space-y-2 text-slate-400">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      <strong>Acesso:</strong> Solicitar uma cópia dos seus dados pessoais
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      <strong>Correção:</strong> Atualizar informações incorretas ou incompletas
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      <strong>Exclusão:</strong> Solicitar a remoção dos seus dados
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      <strong>Portabilidade:</strong> Receber seus dados em formato estruturado
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      <strong>Objeção:</strong> Opor-se ao processamento dos seus dados
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Cookies */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="glassmorphism-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Lock className="text-orange-400" size={24} />
                    Cookies e Tecnologias Similares
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300">
                    Utilizamos cookies para melhorar sua experiência:
                  </p>
                  <ul className="space-y-2 text-slate-400">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400">•</span>
                      <strong>Essenciais:</strong> Necessários para o funcionamento do site
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400">•</span>
                      <strong>Funcionais:</strong> Lembram suas preferências e configurações
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400">•</span>
                      <strong>Analíticos:</strong> Ajudam a entender como você usa o site
                    </li>
                  </ul>
                  <p className="text-slate-400 text-sm">
                    Você pode gerenciar suas preferências de cookies nas configurações do seu navegador.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contato */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="glassmorphism-card border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Mail className="text-primary" size={24} />
                    Entre em Contato
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300">
                    Se você tiver dúvidas sobre esta política de privacidade ou quiser exercer seus direitos, 
                    entre em contato conosco:
                  </p>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                    <p className="text-primary font-medium">Email: privacidade@ifootball.com</p>
                    <p className="text-slate-400 text-sm">
                      Responderemos em até 48 horas úteis.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Alterações */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Card className="glassmorphism-card">
                <CardContent className="pt-6">
                  <p className="text-slate-400 text-sm text-center">
                    <strong>Alterações nesta Política:</strong> Podemos atualizar esta política periodicamente. 
                    Notificaremos sobre mudanças significativas por email ou através do nosso serviço.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPage;
