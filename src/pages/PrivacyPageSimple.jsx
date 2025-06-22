import React from 'react';

const PrivacyPageSimple = () => {
  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
              Política de Privacidade
            </span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Sua privacidade é fundamental para nós. Saiba como coletamos, usamos e protegemos suas informações.
          </p>
        </div>

        <div className="space-y-8">
          {/* Coleta de Informações */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-green-400">Informações que Coletamos</h2>
            <p className="text-slate-300 mb-4">
              Coletamos informações que você nos fornece diretamente e informações sobre como você usa nossos serviços:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Informações de conta: nome, email, informações de perfil</li>
              <li>Dados de uso: como você interage com nossa plataforma</li>
              <li>Informações técnicas: endereço IP, tipo de navegador, dispositivo</li>
              <li>Dados de análise de jogos e preferências</li>
            </ul>
          </div>

          {/* Como Usamos */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Como Usamos Suas Informações</h2>
            <p className="text-slate-300 mb-4">
              Utilizamos suas informações para:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Fornecer e melhorar nossos serviços de análise de futebol</li>
              <li>Personalizar sua experiência na plataforma</li>
              <li>Comunicar-nos com você sobre atualizações e novidades</li>
              <li>Garantir a segurança da plataforma</li>
              <li>Cumprir obrigações legais</li>
            </ul>
          </div>

          {/* Proteção de Dados */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">Proteção de Dados</h2>
            <p className="text-slate-300 mb-4">
              Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Criptografia de dados em trânsito e em repouso</li>
              <li>Controles de acesso rigorosos</li>
              <li>Monitoramento contínuo de segurança</li>
              <li>Auditorias regulares de segurança</li>
            </ul>
          </div>

          {/* Seus Direitos */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">Seus Direitos</h2>
            <p className="text-slate-300 mb-4">
              Você tem os seguintes direitos em relação aos seus dados:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Acesso aos seus dados pessoais</li>
              <li>Correção de informações incorretas</li>
              <li>Exclusão de dados pessoais</li>
              <li>Portabilidade de dados</li>
              <li>Retirada do consentimento</li>
            </ul>
          </div>

          {/* Contato */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-red-400">Contato</h2>
            <p className="text-slate-300">
              Para questões sobre esta política de privacidade ou seus dados pessoais, entre em contato conosco:
            </p>
            <p className="text-slate-300 mt-2">
              Email: <span className="text-green-400">privacy@ifootball.com</span>
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

export default PrivacyPageSimple;
