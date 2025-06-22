import React from 'react';

const TermsPageSimple = () => {
  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
              Termos de Serviço
            </span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Os termos e condições que regem o uso da plataforma iFootball.
          </p>
        </div>

        <div className="space-y-8">
          {/* Aceitação dos Termos */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-green-400">Aceitação dos Termos</h2>
            <p className="text-slate-300 mb-4">
              Ao acessar e usar a plataforma iFootball, você concorda com estes termos de serviço. 
              Se você não concorda com qualquer parte destes termos, não deve usar nossos serviços.
            </p>
          </div>

          {/* Descrição do Serviço */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Descrição do Serviço</h2>
            <p className="text-slate-300 mb-4">
              O iFootball é uma plataforma de análise de futebol que oferece:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Análise avançada de jogos de futebol usando inteligência artificial</li>
              <li>Estatísticas detalhadas de jogadores e equipes</li>
              <li>Predições e insights baseados em dados</li>
              <li>Acesso a dados históricos de partidas</li>
            </ul>
          </div>

          {/* Conta de Usuário */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">Conta de Usuário</h2>
            <p className="text-slate-300 mb-4">
              Para usar nossos serviços, você deve:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Criar uma conta com informações precisas e atualizadas</li>
              <li>Manter a confidencialidade de suas credenciais de login</li>
              <li>Ser responsável por todas as atividades em sua conta</li>
              <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
            </ul>
          </div>

          {/* Uso Aceitável */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">Uso Aceitável</h2>
            <p className="text-slate-300 mb-4">
              Você concorda em NÃO:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Usar nossos serviços para atividades ilegais ou não autorizadas</li>
              <li>Tentar acessar dados ou sistemas sem autorização</li>
              <li>Interferir no funcionamento normal da plataforma</li>
              <li>Reproduzir, duplicar ou copiar nossos serviços sem permissão</li>
              <li>Transmitir vírus ou códigos maliciosos</li>
            </ul>
          </div>

          {/* Licenças e Pagamentos */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-orange-400">Licenças e Pagamentos</h2>
            <p className="text-slate-300 mb-4">
              Nossos serviços são oferecidos sob diferentes planos de licença:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Teste gratuito com funcionalidades limitadas</li>
              <li>Licenças pagas com acesso completo aos recursos</li>
              <li>Pagamentos processados por provedores terceirizados seguros</li>
              <li>Política de reembolso conforme termos específicos</li>
            </ul>
          </div>

          {/* Propriedade Intelectual */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-red-400">Propriedade Intelectual</h2>
            <p className="text-slate-300 mb-4">
              Todo o conteúdo, recursos e tecnologia da plataforma iFootball são protegidos por direitos autorais e outras leis de propriedade intelectual.
            </p>
          </div>

          {/* Limitação de Responsabilidade */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-pink-400">Limitação de Responsabilidade</h2>
            <p className="text-slate-300 mb-4">
              O iFootball não será responsável por danos indiretos, incidentais, especiais ou consequenciais 
              decorrentes do uso ou incapacidade de usar nossos serviços.
            </p>
          </div>

          {/* Modificações */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-indigo-400">Modificações dos Termos</h2>
            <p className="text-slate-300 mb-4">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. 
              As alterações entrarão em vigor imediatamente após a publicação.
            </p>
          </div>

          {/* Contato */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">Contato</h2>
            <p className="text-slate-300">
              Para questões sobre estes termos de serviço, entre em contato conosco:
            </p>
            <p className="text-slate-300 mt-2">
              Email: <span className="text-green-400">legal@ifootball.com</span>
            </p>
          </div>

          <div className="text-center text-slate-500 text-sm">
            <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPageSimple;
