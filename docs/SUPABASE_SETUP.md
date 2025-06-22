# Configuração do Banco Supabase

Este documento contém todos os comandos SQL necessários para configurar as tabelas no Supabase para o sistema iFootball.

## ⚠️ IMPORTANTE: Correção de Issues do Linter

**ANTES DE COMEÇAR**, se você já tem o banco configurado e está enfrentando problemas no Supabase Linter, execute primeiro os scripts de correção:

### Passo 1: Aplicar Correções do Linter
```bash
# Execute no SQL Editor do Supabase Dashboard:
# 1. Primeiro execute: FIX_LINTER_ISSUES_FINAL.sql
# 2. Depois execute: VERIFICACAO_POS_CORRECAO.sql
```

**O que esses scripts corrigem:**
- ✅ **Auth RLS Initialization Plan**: Substitui `auth.uid()` por `(select auth.uid())` para melhor performance
- ✅ **Multiple Permissive Policies**: Consolida múltiplas policies permissivas em uma policy por ação/role
- ✅ **Performance**: Otimiza queries RLS para execução mais rápida
- ✅ **Linter Warnings**: Remove todos os warnings do Supabase Linter

### Passo 2: Verificação
Após executar os scripts, verifique no Supabase Dashboard:
1. **SQL Editor > Lint**: Não deve haver mais warnings
2. **Authentication > Policies**: Deve ter exatamente 1 policy por ação (SELECT, INSERT, UPDATE, DELETE)
3. **Database > Logs**: Queries devem executar rapidamente

---

## 1. Tabela de Licenças de Usuários

```sql
-- Criar tabela user_licenses
CREATE TABLE user_licenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    license_type VARCHAR(50) NOT NULL DEFAULT 'free_trial',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    expires_at TIMESTAMP WITH TIME ZONE,
    features JSONB DEFAULT '{}',
    invite_code_used VARCHAR(20),
    payment_session_id VARCHAR(100),
    billing_cycle VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_license_type CHECK (license_type IN ('free_trial', 'basic', 'premium', 'enterprise')),
    CONSTRAINT valid_status CHECK (status IN ('active', 'expired', 'cancelled', 'suspended')),
    CONSTRAINT valid_billing_cycle CHECK (billing_cycle IN ('monthly', 'yearly') OR billing_cycle IS NULL),
    
    -- Index para busca rápida por usuário
    UNIQUE(user_id)
);

-- Criar índices
CREATE INDEX idx_user_licenses_user_id ON user_licenses(user_id);
CREATE INDEX idx_user_licenses_status ON user_licenses(status);
CREATE INDEX idx_user_licenses_expires_at ON user_licenses(expires_at);
```

## 2. Tabela de Códigos de Convite

```sql
-- Criar tabela invite_codes
CREATE TABLE invite_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    max_uses INTEGER NOT NULL DEFAULT 1,
    used_count INTEGER NOT NULL DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_max_uses CHECK (max_uses > 0),
    CONSTRAINT valid_used_count CHECK (used_count >= 0 AND used_count <= max_uses),
    
    -- Index para busca rápida por código
    UNIQUE(code)
);

-- Criar índices
CREATE INDEX idx_invite_codes_code ON invite_codes(code);
CREATE INDEX idx_invite_codes_created_by ON invite_codes(created_by);
CREATE INDEX idx_invite_codes_is_active ON invite_codes(is_active);
CREATE INDEX idx_invite_codes_expires_at ON invite_codes(expires_at);
```

## 3. Tabela de Logs de Uso

```sql
-- Criar tabela usage_logs
CREATE TABLE usage_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    usage_type VARCHAR(50) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_usage_type CHECK (usage_type IN ('game_analyses', 'api_calls', 'report_generation', 'data_export'))
);

-- Criar índices
CREATE INDEX idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX idx_usage_logs_usage_type ON usage_logs(usage_type);
CREATE INDEX idx_usage_logs_created_at ON usage_logs(created_at);
CREATE INDEX idx_usage_logs_user_date ON usage_logs(user_id, DATE(created_at));
```

## 4. Tabela de Perfis de Usuário (Extensão da auth.users)

```sql
-- Criar tabela user_profiles
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    is_admin BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Index para busca rápida
    UNIQUE(email)
);

-- Criar índices
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_is_admin ON user_profiles(is_admin);
```

## 5. Tabela de Jogos Analisados (Histórico)

```sql
-- Criar tabela analyzed_games
CREATE TABLE analyzed_games (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    game_id VARCHAR(50) NOT NULL,
    league_id VARCHAR(50),
    home_team VARCHAR(100) NOT NULL,
    away_team VARCHAR(100) NOT NULL,
    game_date TIMESTAMP WITH TIME ZONE,
    analysis_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Index composto para evitar análises duplicadas
    UNIQUE(user_id, game_id)
);

-- Criar índices
CREATE INDEX idx_analyzed_games_user_id ON analyzed_games(user_id);
CREATE INDEX idx_analyzed_games_game_id ON analyzed_games(game_id);
CREATE INDEX idx_analyzed_games_created_at ON analyzed_games(created_at);
```

## 6. RLS (Row Level Security) Policies

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE user_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyzed_games ENABLE ROW LEVEL SECURITY;

-- Políticas para user_licenses
CREATE POLICY "Users can view their own licenses" ON user_licenses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own licenses" ON user_licenses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all licenses" ON user_licenses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

CREATE POLICY "System can insert licenses" ON user_licenses
    FOR INSERT WITH CHECK (true);

-- Políticas para invite_codes
CREATE POLICY "Admins can manage invite codes" ON invite_codes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

CREATE POLICY "Anyone can validate invite codes" ON invite_codes
    FOR SELECT USING (is_active = true);

-- Políticas para usage_logs
CREATE POLICY "Users can view their own usage logs" ON usage_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert usage logs" ON usage_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all usage logs" ON usage_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Políticas para user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Políticas para analyzed_games
CREATE POLICY "Users can view their own analyzed games" ON analyzed_games
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analyzed games" ON analyzed_games
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all analyzed games" ON analyzed_games
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );
```

## 7. Triggers para Updated_at

```sql
-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para user_licenses
CREATE TRIGGER update_user_licenses_updated_at 
    BEFORE UPDATE ON user_licenses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para user_profiles
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 8. Função para Criar Perfil Automaticamente

```sql
-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para criar perfil automaticamente
CREATE TRIGGER create_user_profile_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_user_profile();
```

## 9. Dados Iniciais

```sql
-- IMPORTANTE: Primeiro você precisa se registrar na aplicação através da interface
-- Depois execute este comando substituindo pelo seu email real

-- Tornar seu usuário um administrador (substitua pelo seu email)
UPDATE user_profiles 
SET is_admin = true 
WHERE email = 'seu-email@exemplo.com';

-- OU se você ainda não criou conta, pode inserir diretamente:
-- (mas você ainda precisará criar a conta na aplicação)
INSERT INTO user_profiles (id, email, full_name, is_admin)
VALUES (
    gen_random_uuid(),
    'seu-email@exemplo.com',
    'Seu Nome',
    true
) ON CONFLICT (email) DO UPDATE SET is_admin = true;

-- Códigos de convite de demonstração (opcional)
INSERT INTO invite_codes (code, created_by, max_uses, expires_at, is_active)
VALUES 
    ('DEMO2025', (SELECT id FROM user_profiles WHERE is_admin = true LIMIT 1), 100, '2025-12-31 23:59:59+00', true),
    ('BETA2025', (SELECT id FROM user_profiles WHERE is_admin = true LIMIT 1), 50, '2025-12-31 23:59:59+00', true);
```

## 10. Views Úteis para Analytics

```sql
-- View para estatísticas de licenças
CREATE VIEW license_stats AS
SELECT 
    license_type,
    status,
    COUNT(*) as count,
    COUNT(*) FILTER (WHERE expires_at > NOW()) as active_count,
    COUNT(*) FILTER (WHERE expires_at <= NOW()) as expired_count
FROM user_licenses
GROUP BY license_type, status;

-- View para uso diário
CREATE VIEW daily_usage_stats AS
SELECT 
    DATE(created_at) as usage_date,
    usage_type,
    COUNT(*) as usage_count,
    COUNT(DISTINCT user_id) as unique_users
FROM usage_logs
GROUP BY DATE(created_at), usage_type
ORDER BY usage_date DESC;

-- View para códigos de convite
CREATE VIEW invite_code_stats AS
SELECT 
    ic.code,
    ic.max_uses,
    ic.used_count,
    ic.expires_at,
    ic.is_active,
    up.email as created_by_email,
    ic.created_at
FROM invite_codes ic
JOIN user_profiles up ON ic.created_by = up.id;
```

## Instruções de Uso

1. **Execute os comandos na ordem apresentada** no SQL Editor do Supabase
2. **Substitua 'seu-email@exemplo.com'** pelo seu email real no comando de criar admin
3. **Teste as tabelas** inserindo alguns dados de exemplo
4. **Configure as variáveis de ambiente** no seu projeto com as credenciais do Supabase

## Verificação

Para verificar se tudo foi criado corretamente:

```sql
-- Verificar tabelas criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('user_licenses', 'invite_codes', 'usage_logs', 'user_profiles', 'analyzed_games');

-- Verificar se RLS está habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('user_licenses', 'invite_codes', 'usage_logs', 'user_profiles', 'analyzed_games');
```
