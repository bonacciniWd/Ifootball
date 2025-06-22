import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, CreditCard, Shield, AlertTriangle, Scale, Mail, Gavel } from 'lucide-react';

const TermsPage = () => {
  return (
    <>
      <Helmet>
        <title>Termos de Serviço - iFootball</title>
        <meta name="description" content="Termos e condições de uso do iFootball. Leia os termos que regem o uso da nossa plataforma de análise de futebol." />
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
                Termos de Serviço
              </span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Os termos e condições que regem o uso da plataforma iFootball.
            </p>
            <p className="text-sm text-slate-500 mt-4">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </motion.div>

          <div className="space-y-8">
            {/* Aceitação dos Termos */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="glassmorphism-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <FileText className="text-primary" size={24} />
                    Aceitação dos Termos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300">
                    Ao acessar e utilizar o iFootball, você concorda com estes Termos de Serviço. 
                    Se você não concordar com qualquer parte destes termos, não deve usar nossos serviços.
                  </p>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-slate-400 text-sm">
                      <strong>Importante:</strong> Estes termos constituem um acordo legal entre você e o iFootball. 
                      Leia-os cuidadosamente.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Descrição do Serviço */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="glassmorphism-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Shield className="text-blue-400" size={24} />
                    Nossos Serviços
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300">
                    O iFootball oferece:
                  </p>
                  <ul className="space-y-2 text-slate-400">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      Análise de jogos de futebol usando inteligência artificial
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      Estatísticas e métricas avançadas em tempo real
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      Previsões e insights baseados em dados
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      Interface para acompanhamento de partidas ao vivo
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      Relatórios e análises personalizadas
                    </li>
                  </ul>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <p className="text-yellow-300 text-sm">
                      <strong>Aviso:</strong> Nossos serviços são destinados apenas para fins informativos e de entretenimento. 
                      Não garantimos a precisão absoluta das previsões.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Conta de Usuário */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="glassmorphism-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Users className="text-green-400" size={24} />
                    Conta de Usuário
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300">
                    Responsabilidades do usuário:
                  </p>
                  <ul className="space-y-2 text-slate-400">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      Fornecer informações precisas e atualizadas durante o registro
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      Manter a confidencialidade das credenciais de acesso
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      Notificar imediatamente sobre uso não autorizado da conta
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      Usar os serviços apenas para fins legais e apropriados
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      Respeitar os limites de uso das APIs e recursos
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pagamentos e Licenças */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="glassmorphism-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <CreditCard className="text-purple-400" size={24} />
                    Pagamentos e Licenças
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300">
                    Condições de pagamento:
                  </p>
                  <ul className="space-y-2 text-slate-400">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      Oferecemos planos gratuitos e pagos com diferentes recursos
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      Pagamentos são processados via PayPal de forma segura
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      Licenças são ativadas automaticamente após confirmação do pagamento
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      Reembolsos podem ser solicitados em até 7 dias após a compra
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      Preços podem ser alterados com aviso prévio de 30 dias
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Uso Apropriado */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="glassmorphism-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <AlertTriangle className="text-orange-400" size={24} />
                    Uso Apropriado
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300">
                    É <strong>proibido</strong>:
                  </p>
                  <ul className="space-y-2 text-slate-400">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">✗</span>
                      Usar o serviço para atividades ilegais ou fraudulentas
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">✗</span>
                      Tentar violar a segurança ou acessar dados não autorizados
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">✗</span>
                      Fazer engenharia reversa ou copiar nossos algoritmos
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">✗</span>
                      Sobrecarregar nossos servidores com requisições excessivas
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">✗</span>
                      Compartilhar credenciais de acesso com terceiros
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Propriedade Intelectual */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="glassmorphism-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Scale className="text-cyan-400" size={24} />
                    Propriedade Intelectual
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300">
                    Todos os direitos de propriedade intelectual do iFootball são protegidos:
                  </p>
                  <ul className="space-y-2 text-slate-400">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400">•</span>
                      Algoritmos de IA e modelos de machine learning são propriedade exclusiva
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400">•</span>
                      Interface, design e marca são protegidos por direitos autorais
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400">•</span>
                      Dados processados e insights gerados são de nossa propriedade
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400">•</span>
                      Uso comercial não autorizado pode resultar em ações legais
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Limitação de Responsabilidade */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Card className="glassmorphism-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Gavel className="text-red-400" size={24} />
                    Limitação de Responsabilidade
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <p className="text-red-300 text-sm mb-3">
                      <strong>IMPORTANTE - AVISO LEGAL:</strong>
                    </p>
                    <ul className="space-y-2 text-red-200 text-sm">
                      <li>• O iFootball não se responsabiliza por perdas financeiras decorrentes do uso de nossas análises</li>
                      <li>• Nossas previsões são baseadas em dados históricos e não garantem resultados futuros</li>
                      <li>• Apostas esportivas envolvem riscos e devem ser feitas com responsabilidade</li>
                      <li>• Não somos uma casa de apostas nem facilitamos transações de jogos</li>
                      <li>• Nossa responsabilidade máxima se limita ao valor pago pelo serviço</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contato */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Card className="glassmorphism-card border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Mail className="text-primary" size={24} />
                    Dúvidas ou Suporte
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300">
                    Para dúvidas sobre estes termos ou nossos serviços:
                  </p>
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                    <p className="text-primary font-medium">Email: suporte@ifootball.com</p>
                    <p className="text-slate-400 text-sm">
                      Atendimento: Segunda a Sexta, 9h às 18h (horário de Brasília)
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
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <Card className="glassmorphism-card">
                <CardContent className="pt-6">
                  <p className="text-slate-400 text-sm text-center">
                    <strong>Alterações nos Termos:</strong> Reservamos o direito de modificar estes termos a qualquer momento. 
                    Mudanças significativas serão comunicadas com 30 dias de antecedência. 
                    O uso continuado dos serviços após as alterações constitui aceitação dos novos termos.
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

export default TermsPage;
