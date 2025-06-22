# iFootball ⚽

Sistema de análise de jogos de futebol em tempo real com IA e integração futura com Python para análise de vídeo.

## 🎯 Visão Geral

O iFootball é uma plataforma MVP que combina dados de API em tempo real com análise inteligente para fornecer:

- **Análise de jogos** (passados, presentes e futuros)
- **Tabelas e estatísticas** de ligas principais
- **Sistema de alertas** para mudanças de probabilidades
- **Integração futura** com Python para análise de vídeo
- **Sugestões em tempo real** para apostas esportivas

## 🚀 Status do Projeto

**Versão MVP:** ✅ Funcional  
**API Status:** 🟡 Limitada (fallback inteligente implementado)  
**Licenciamento:** 🔄 Em desenvolvimento  

## 📋 Funcionalidades Implementadas

### ✅ Core MVP
- [x] Sistema de autenticação (usuários e admins)
- [x] Dashboard de partidas ao vivo
- [x] Seleção e análise de jogos específicos
- [x] Tabelas de classificação
- [x] Cache inteligente (10min dinâmico, 24h estático)
- [x] Sistema de alertas de probabilidades
- [x] Dados de fallback para demonstração

### ✅ Integração API
- [x] Busca de jogadores (API real)
- [x] Busca de times (API real)
- [x] Partidas ao vivo (fallback inteligente)
- [x] Ligas e classificações (fallback)
- [x] Odds dinâmicas (simuladas)
- [x] Eventos de partidas (simulados)

### ✅ Sistema de Licenças
- [x] Configuração centralizada de licenças
- [x] Página de entrada de convites
- [x] Validação de códigos de convite
- [x] Painel administrativo completo
- [x] Gerenciamento de convites (admin)
- [x] Estrutura para gateway de pagamentos
- [x] Sistema de limites de uso

### ✅ Administração
- [x] Painel administrativo protegido
- [x] Gerenciamento de convites
- [x] Monitoramento do sistema
- [x] Interface para analytics (preparada)
- [x] Configurações centralizadas

### 🗄️ Banco de Dados
- [x] Integração completa com Supabase
- [x] Tabelas de usuários, licenças e convites
- [x] Sistema de logs de uso e analytics
- [x] Row Level Security (RLS) configurado
- [x] Triggers automáticos e views de estatísticas
- [x] Fallback inteligente para MVP

### 🔄 Em Desenvolvimento
- [ ] Sistema de convites para teste grátis
- [ ] Gateway de pagamentos para licenças
- [ ] Integração com Python para análise de vídeo
- [ ] Alertas em tempo real via WebSocket

## 🏗️ Arquitetura

```
src/
├── components/           # Componentes React reutilizáveis
│   ├── ui/              # Componentes de interface base
│   ├── GameSelector.jsx # Seleção de jogos
│   ├── GameTables.jsx   # Tabelas de dados
│   └── FootballDashboardUser.jsx
├── contexts/            # Contextos React (Auth, etc.)
├── hooks/               # Hooks personalizados
├── pages/               # Páginas principais
│   ├── HomePage.jsx
│   ├── GameAnalysisPage.jsx
│   ├── GameSelectionPage.jsx
│   ├── FreeTrialPage.jsx
│   └── LicensePage.jsx
├── services/            # Serviços de API e lógica
│   ├── footballApiService.js  # Integração com API de futebol
│   ├── authService.js          # Autenticação
│   ├── gameService.js          # Lógica de jogos
│   ├── licenseService.js       # Sistema de licenças
│   └── referralService.js      # Sistema de indicações
└── lib/                 # Utilitários e configurações
```

## 🔐 Sistema de Licenças

### 📝 Modalidades Planejadas:

1. **Teste Grátis** (via convite)
   - Acesso limitado por 7 dias
   - Funcionalidades básicas
   - Máximo 5 análises por dia

2. **Licença Premium** (via gateway de pagamento)
   - Acesso completo às funcionalidades
   - Análises ilimitadas
   - Alertas em tempo real
   - Suporte prioritário

3. **Licença Enterprise** (personalizada)
   - API dedicada
   - Integração com sistemas próprios
   - Análise de vídeo avançada
   - Consultoria técnica

## 🛠️ Tecnologias

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS** + **shadcn/ui**
- **Framer Motion** (animações)
- **React Router** (navegação)
- **Axios** (requisições HTTP)

### Backend & Banco
- **Supabase** (PostgreSQL + Auth + Storage)
- **Row Level Security (RLS)** para segurança
- **Triggers automáticos** para atualizações
- **Views otimizadas** para analytics
- **Sistema de fallback** para desenvolvimento

### Infraestrutura
- **Vercel/Netlify** (deploy frontend)
- **Railway/Heroku** (futuro: backend Python)

## 🚀 Como Executar

### Pré-requisitos
```bash
Node.js >= 18
npm ou yarn
```

### Instalação
```bash
# Clone o repositório
git clone [url-do-repo]
cd iFootball

# Instale dependências
npm install

# Configure variáveis de ambiente (.env)
cp .env.example .env
# Edite o .env com suas credenciais

# Execute em desenvolvimento
npm run dev
```

### Variáveis de Ambiente
```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# RapidAPI Football
VITE_RAPIDAPI_KEY=your_rapidapi_key
VITE_RAPIDAPI_HOST=free-api-live-football-data.p.rapidapi.com
```

## 📊 Status da API

### ✅ Endpoints Funcionais
- `/football-players-search` - Busca de jogadores
- `/football-teams-search` - Busca de times

### 🔄 Fallback Inteligente
- Partidas ao vivo (simuladas em tempo real)
- Ligas e classificações (dados reais das principais ligas)
- Odds dinâmicas (atualizadas por algoritmo)
- Eventos de partidas (gerados contextualmente)

## 🎯 Roadmap

### Fase 1: MVP Completo ✅
- [x] Interface funcional
- [x] Integração básica com API
- [x] Sistema de fallback
- [x] Análise de jogos

### Fase 2: Monetização 🔄
- [ ] Sistema de convites
- [ ] Gateway de pagamentos
- [ ] Diferentes níveis de acesso
- [ ] Dashboard de administração

### Fase 3: IA Avançada 📋
- [ ] Integração com Python
- [ ] Análise de vídeo em tempo real
- [ ] Machine Learning para previsões
- [ ] Alertas personalizados

### Fase 4: Escalabilidade 📋
- [ ] API própria
- [ ] WebSocket para tempo real
- [ ] Mobile app (React Native)
- [ ] Marketplace de estratégias

## 👥 Equipe

- **Frontend:** React + TypeScript
- **Backend:** Node.js + Python (futuro)
- **Data Science:** Python + ML (futuro)
- **DevOps:** Docker + CI/CD (futuro)

## 📞 Suporte

Para questões técnicas ou comerciais:
- **Email:** [seu-email]
- **Discord:** [link-do-discord]
- **Documentação:** `/docs`

## 🎫 Como Usar (MVP)

### Para Usuários

1. **Acesso por Convite:**
   ```
   1. Visite: /invite
   2. Insira o código: DEMO2024
   3. Ative seu teste grátis
   4. Acesse o dashboard
   ```

2. **Análise de Jogos:**
   ```
   1. Selecione uma partida
   2. Visualize estatísticas em tempo real
   3. Receba alertas de probabilidades
   4. Exporte dados (premium)
   ```

### Para Administradores

1. **Painel Admin:**
   ```
   1. Acesse: /admin
   2. Gerencie convites
   3. Monitore usuários
   4. Configure sistema
   ```

2. **Gerar Convites:**
   ```
   1. Aba "Convites" no admin
   2. Configure usos e validade
   3. Compartilhe código gerado
   ```

---

**⚡ iFootball - Transformando dados em vitórias! ⚽**
