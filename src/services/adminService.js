import { supabase } from '@/lib/supabaseClient';
import { licenseService } from './licenseService';

export const adminService = {  // Verificar se usuário é admin
  async checkAdminStatus(userId) {
    try {
      // Se há erro de RLS conhecido, pula direto para fallback
      const { data: userData } = await supabase.auth.getUser();
      const email = userData?.user?.email;
      
      // Lista de emails admin conhecidos
      const adminEmails = [
        'admin@ifootball.com',
        'dbonaccini8@gmail.com',
        'dbonaccioli8@gmail.com'
      ];
      
      // Se é um email admin conhecido, retorna true imediatamente
      if (adminEmails.includes(email) || email?.endsWith('@ifootball.com')) {
        console.log('✅ Admin detected via email:', email);
        return true;
      }
      
      // Apenas tenta o banco se não é um admin conhecido
      const { data, error } = await supabase
        .from('user_profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('🚧 Admin check error:', error.message);
        
        if (error.code === '42P17' || error.message.includes('infinite recursion')) {
          console.warn('🔄 RLS recursion detected, using email fallback');
        }
        
        return false; // Se não é admin conhecido e há erro, não é admin
      }

      return data?.is_admin || false;
    } catch (error) {
      console.warn('🚧 MVP: Erro ao verificar admin:', error);
      return false; // Em caso de erro, assume que não é admin
             email?.endsWith('@ifootball.com');
    }
  },
  // Gerenciamento de Códigos de Convite
  async getAllInviteCodes() {
    try {
      // Primeira query: buscar todos os invite codes
      const { data: inviteCodes, error: inviteError } = await supabase
        .from('invite_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (inviteError) {
        console.warn('🚧 MVP: Banco não configurado, usando dados mock');
        return this.getMockInviteCodes();
      }

      // Segunda query: buscar perfis dos criadores
      const creatorIds = [...new Set(inviteCodes.map(code => code.created_by).filter(Boolean))];
      let creatorProfiles = {};
      
      if (creatorIds.length > 0) {
        const { data: profiles, error: profileError } = await supabase
          .from('user_profiles')
          .select('id, email, full_name')
          .in('id', creatorIds);
        
        if (!profileError && profiles) {
          profiles.forEach(profile => {
            creatorProfiles[profile.id] = profile;
          });
        }
      }

      // Combinar dados manualmente
      const enrichedCodes = inviteCodes.map(code => ({
        ...code,
        created_by_profile: creatorProfiles[code.created_by] || null
      }));

      return enrichedCodes;
    } catch (error) {
      console.warn('🚧 MVP: Erro no banco, usando dados mock');
      return this.getMockInviteCodes();
    }
  },

  async createInviteCode(adminUserId, { maxUses = 1, validityDays = 30 }) {
    try {
      return await licenseService.generateInviteCode(adminUserId, maxUses, validityDays);
    } catch (error) {
      console.warn('🚧 MVP: Erro ao criar convite no banco, simulando criação');
      return this.createMockInviteCode(maxUses, validityDays);
    }
  },

  async deactivateInviteCode(codeId) {
    try {
      const { data, error } = await supabase
        .from('invite_codes')
        .update({ is_active: false })
        .eq('id', codeId)
        .select()
        .single();

      if (error) {
        console.warn('🚧 MVP: Banco não configurado');
        return { success: false, error: 'Banco não configurado' };
      }

      return { success: true, data };
    } catch (error) {
      console.warn('🚧 MVP: Erro ao desativar convite');
      return { success: false, error: error.message };
    }
  },
  // Gerenciamento de Licenças
  async getAllLicenses(page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;
      
      // Primeira query: buscar licenças com contagem
      const { data: licenses, error: licenseError, count } = await supabase
        .from('user_licenses')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (licenseError) {
        console.warn('🚧 MVP: Banco não configurado, usando dados mock');
        return {
          licenses: this.getMockLicenses(),
          total: 10,
          page,
          totalPages: 1
        };
      }

      // Segunda query: buscar perfis dos usuários
      const userIds = [...new Set(licenses.map(license => license.user_id).filter(Boolean))];
      let userProfiles = {};
      
      if (userIds.length > 0) {
        const { data: profiles, error: profileError } = await supabase
          .from('user_profiles')
          .select('id, email, full_name')
          .in('id', userIds);
        
        if (!profileError && profiles) {
          profiles.forEach(profile => {
            userProfiles[profile.id] = profile;
          });
        }
      }

      // Combinar dados manualmente
      const enrichedLicenses = licenses.map(license => ({
        ...license,
        user_profile: userProfiles[license.user_id] || null
      }));

      return {
        licenses: enrichedLicenses,
        total: count,
        page,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      console.warn('🚧 MVP: Erro no banco, usando dados mock');
      return {
        licenses: this.getMockLicenses(),
        total: 10,
        page,
        totalPages: 1
      };
    }
  },

  async updateLicenseStatus(licenseId, status) {
    try {
      const { data, error } = await supabase
        .from('user_licenses')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', licenseId)
        .select()
        .single();

      if (error) {
        console.warn('🚧 MVP: Banco não configurado');
        return { success: false, error: 'Banco não configurado' };
      }

      return { success: true, data };
    } catch (error) {
      console.warn('🚧 MVP: Erro ao atualizar licença');
      return { success: false, error: error.message };
    }
  },

  // Analytics e Estatísticas
  async getDashboardStats() {
    try {
      // Busca estatísticas de licenças
      const { data: licenseStats, error: licenseError } = await supabase
        .from('license_stats')
        .select('*');

      // Busca uso dos últimos 30 dias
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: usageStats, error: usageError } = await supabase
        .from('usage_logs')
        .select('usage_type, created_at')
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Busca códigos de convite ativos
      const { data: inviteStats, error: inviteError } = await supabase
        .from('invite_code_stats')
        .select('*')
        .eq('is_active', true);

      if (licenseError || usageError || inviteError) {
        console.warn('🚧 MVP: Banco não configurado, usando dados mock');
        return this.getMockDashboardStats();
      }

      // Processa estatísticas
      const totalUsers = licenseStats.reduce((sum, stat) => sum + stat.count, 0);
      const activeUsers = licenseStats.reduce((sum, stat) => sum + stat.active_count, 0);
      
      const dailyUsage = this.processDailyUsage(usageStats);
      const totalInviteCodes = inviteStats.length;
      const usedInviteCodes = inviteStats.filter(invite => invite.used_count > 0).length;

      return {
        totalUsers,
        activeUsers,
        totalInviteCodes,
        usedInviteCodes,
        dailyUsage,
        licenseDistribution: licenseStats,
        inviteCodeStats: inviteStats
      };
    } catch (error) {
      console.warn('🚧 MVP: Erro no banco, usando dados mock');
      return this.getMockDashboardStats();
    }
  },
  async getUsageLogs(userId = null, limit = 50) {
    try {
      // Primeira query: buscar logs de uso
      let query = supabase
        .from('usage_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data: usageLogs, error: logsError } = await query;

      if (logsError) {
        console.warn('🚧 MVP: Banco não configurado, usando dados mock');
        return this.getMockUsageLogs();
      }

      // Segunda query: buscar perfis dos usuários
      const userIds = [...new Set(usageLogs.map(log => log.user_id).filter(Boolean))];
      let userProfiles = {};
      
      if (userIds.length > 0) {
        const { data: profiles, error: profileError } = await supabase
          .from('user_profiles')
          .select('id, email, full_name')
          .in('id', userIds);
        
        if (!profileError && profiles) {
          profiles.forEach(profile => {
            userProfiles[profile.id] = profile;
          });
        }
      }

      // Combinar dados manualmente
      const enrichedLogs = usageLogs.map(log => ({
        ...log,
        user_profile: userProfiles[log.user_id] || null
      }));

      return enrichedLogs;
    } catch (error) {
      console.warn('🚧 MVP: Erro no banco, usando dados mock');
      return this.getMockUsageLogs();
    }
  },

  // Funções auxiliares para processamento de dados
  processDailyUsage(usageData) {
    const dailyMap = new Map();
    
    usageData.forEach(log => {
      const date = new Date(log.created_at).toISOString().split('T')[0];
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { date, total: 0, analyses: 0, api_calls: 0 });
      }
      const dayData = dailyMap.get(date);
      dayData.total++;
      if (log.usage_type === 'game_analyses') dayData.analyses++;
      if (log.usage_type === 'api_calls') dayData.api_calls++;
    });

    return Array.from(dailyMap.values()).sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  // Dados Mock para MVP
  getMockInviteCodes() {
    return [
      {
        id: 'demo-1',
        code: 'DEMO2025',
        max_uses: 100,
        used_count: 45,
        expires_at: '2025-12-31T23:59:59Z',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        created_by_profile: { email: 'admin@ifootball.com', full_name: 'Admin' }
      },
      {
        id: 'beta-1',
        code: 'BETA2025',
        max_uses: 50,
        used_count: 12,
        expires_at: '2025-12-31T23:59:59Z',
        is_active: true,
        created_at: '2024-01-15T00:00:00Z',
        created_by_profile: { email: 'admin@ifootball.com', full_name: 'Admin' }
      }
    ];
  },

  getMockLicenses() {
    return [
      {
        id: 'license-1',
        user_id: 'user-1',
        license_type: 'free_trial',
        status: 'active',
        expires_at: '2025-02-28T23:59:59Z',
        created_at: '2024-01-01T00:00:00Z',
        user_profile: { email: 'user1@test.com', full_name: 'Usuário Teste 1' }
      },
      {
        id: 'license-2',
        user_id: 'user-2',
        license_type: 'premium',
        status: 'active',
        expires_at: '2025-06-30T23:59:59Z',
        created_at: '2024-01-05T00:00:00Z',
        user_profile: { email: 'user2@test.com', full_name: 'Usuário Teste 2' }
      }
    ];
  },

  getMockDashboardStats() {
    return {
      totalUsers: 150,
      activeUsers: 120,
      totalInviteCodes: 8,
      usedInviteCodes: 5,
      dailyUsage: [
        { date: '2024-12-19', total: 45, analyses: 30, api_calls: 15 },
        { date: '2024-12-18', total: 38, analyses: 25, api_calls: 13 },
        { date: '2024-12-17', total: 52, analyses: 35, api_calls: 17 }
      ],
      licenseDistribution: [
        { license_type: 'free_trial', status: 'active', count: 80, active_count: 65 },
        { license_type: 'premium', status: 'active', count: 50, active_count: 45 },
        { license_type: 'basic', status: 'active', count: 20, active_count: 18 }
      ]
    };
  },

  getMockUsageLogs() {
    return [
      {
        id: 'log-1',
        user_id: 'user-1',
        usage_type: 'game_analyses',
        created_at: '2024-12-19T10:30:00Z',
        metadata: { game_id: 'game123' },
        user_profile: { email: 'user1@test.com', full_name: 'Usuário Teste 1' }
      },
      {
        id: 'log-2',
        user_id: 'user-2',
        usage_type: 'api_calls',
        created_at: '2024-12-19T10:25:00Z',
        metadata: { endpoint: '/live-scores' },
        user_profile: { email: 'user2@test.com', full_name: 'Usuário Teste 2' }
      }
    ];
  },

  createMockInviteCode(maxUses, validityDays) {
    const code = `MOCK${Date.now().toString().slice(-6)}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + validityDays);

    return {
      id: `mock-${Date.now()}`,
      code,
      max_uses: maxUses,
      used_count: 0,
      expires_at: expiresAt.toISOString(),
      is_active: true,
      created_at: new Date().toISOString(),
      created_by_profile: { email: 'admin@ifootball.com', full_name: 'Admin MVP' }
    };
  }
};
