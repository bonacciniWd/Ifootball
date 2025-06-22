import { supabase } from '@/lib/supabaseClient';
import LICENSE_CONFIG, { licenseUtils } from '@/config/licenseConfig';

export const licenseService = {
  // Obtém licença do usuário com informações completas
  getUserLicense: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_licenses')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.warn('🚧 MVP: Banco não configurado, usando fallback para licenças');
        return licenseService.getMVPLicenseData(userId);
      }
      
      return data;
    } catch (error) {
      console.warn('🚧 MVP: Erro no banco, usando fallback para licenças');
      return licenseService.getMVPLicenseData(userId);
    }
  },

  // Dados MVP simulados para desenvolvimento
  getMVPLicenseData: (userId) => {
    // Simula dados baseados no localStorage para MVP
    const storedLicense = localStorage.getItem(`mvp_license_${userId}`);
    if (storedLicense) {
      try {
        return JSON.parse(storedLicense);
      } catch (error) {
        console.error('Erro ao carregar licença do localStorage:', error);
      }
    }

    // Retorna null se não há licença armazenada
    return null;
  },

  // Salva licença MVP no localStorage
  saveMVPLicense: (userId, licenseData) => {
    try {
      localStorage.setItem(`mvp_license_${userId}`, JSON.stringify(licenseData));
      console.log('✅ MVP: Licença salva no localStorage');
    } catch (error) {
      console.error('Erro ao salvar licença no localStorage:', error);
    }
  },

  // Verifica se usuário pode usar funcionalidade
  canUseFeature: async (userId, featureName) => {
    const license = await licenseService.getUserLicense(userId);
    
    if (!license) {
      return { allowed: false, reason: 'no_license' };
    }

    // Obter uso atual se necessário
    let currentUsage = 0;
    if (featureName === 'analyses') {
      currentUsage = await licenseService.getTodayUsage(userId, 'game_analyses');
    }

    return licenseUtils.canUseFeature(license, featureName, currentUsage);
  },

  // Obtém uso do dia atual
  getTodayUsage: async (userId, usageType) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { count, error } = await supabase
        .from('usage_logs')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('usage_type', usageType)
        .gte('created_at', `${today} 00:00:00`)
        .lt('created_at', `${today} 23:59:59`);

      if (error) {
        console.warn('🚧 MVP: Banco não configurado, usando fallback para uso');
        return licenseService.getMVPUsageData(userId, usageType);
      }

      return count || 0;
    } catch (error) {
      console.warn('🚧 MVP: Erro no banco, usando fallback para uso');
      return licenseService.getMVPUsageData(userId, usageType);
    }
  },

  // Dados MVP de uso simulados
  getMVPUsageData: (userId, usageType) => {
    const today = new Date().toISOString().split('T')[0];
    const storageKey = `mvp_usage_${userId}_${usageType}_${today}`;
    const storedUsage = localStorage.getItem(storageKey);
    return storedUsage ? parseInt(storedUsage) : 0;
  },

  // Registra uso de funcionalidade
  logUsage: async (userId, usageType, metadata = {}) => {
    try {
      const { data, error } = await supabase
        .from('usage_logs')
        .insert({
          user_id: userId,
          usage_type: usageType,
          metadata: metadata,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.warn('🚧 MVP: Banco não configurado, salvando uso no localStorage');
        return licenseService.logMVPUsage(userId, usageType, metadata);
      }

      return data;
    } catch (error) {
      console.warn('🚧 MVP: Erro no banco, salvando uso no localStorage');
      return licenseService.logMVPUsage(userId, usageType, metadata);
    }
  },

  // Log de uso MVP
  logMVPUsage: (userId, usageType, metadata = {}) => {
    const today = new Date().toISOString().split('T')[0];
    const storageKey = `mvp_usage_${userId}_${usageType}_${today}`;
    const currentUsage = licenseService.getMVPUsageData(userId, usageType);
    localStorage.setItem(storageKey, (currentUsage + 1).toString());
    
    return {
      user_id: userId,
      usage_type: usageType,
      metadata,
      created_at: new Date().toISOString()
    };
  },

  // Valida código de convite
  validateInviteCode: async (inviteCode) => {
    // Verifica códigos especiais de demonstração
    const demoInvite = LICENSE_CONFIG.INVITE_SYSTEM.demoInvites[inviteCode];
    if (demoInvite) {
      const validUntil = new Date(demoInvite.validUntil);
      if (new Date() <= validUntil) {
        return {
          valid: true,
          type: 'demo',
          trialDuration: demoInvite.trialDuration,
          features: demoInvite.features || {}
        };
      }
    }

    // Verifica códigos regulares no banco
    const { data, error } = await supabase
      .from('invite_codes')
      .select('*')
      .eq('code', inviteCode)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return { valid: false, reason: 'invalid_code' };
    }

    // Verifica se ainda não expirou
    if (new Date() > new Date(data.expires_at)) {
      return { valid: false, reason: 'expired' };
    }

    // Verifica se ainda tem usos disponíveis
    if (data.used_count >= data.max_uses) {
      return { valid: false, reason: 'max_uses_reached' };
    }

    return { 
      valid: true, 
      type: 'regular',
      inviteData: data
    };
  },

  // Ativa licença usando código de convite
  activateWithInvite: async (userId, inviteCode) => {
    const validation = await licenseService.validateInviteCode(inviteCode);
    
    if (!validation.valid) {
      throw new Error(`Código inválido: ${validation.reason}`);
    }

    // Calcula data de expiração
    const trialDuration = validation.trialDuration || LICENSE_CONFIG.FREE_TRIAL.duration;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + trialDuration);

    const licenseData = {
      user_id: userId,
      license_type: LICENSE_CONFIG.LICENSE_TYPES.FREE_TRIAL,
      status: 'active',
      expires_at: expiresAt.toISOString(),
      features: validation.features || LICENSE_CONFIG.FREE_TRIAL.features,
      invite_code_used: inviteCode,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    try {
      // Tenta salvar no banco
      const { data: license, error: licenseError } = await supabase
        .from('user_licenses')
        .upsert(licenseData)
        .select()
        .single();

      if (licenseError) {
        console.warn('🚧 MVP: Banco não configurado, salvando licença no localStorage');
        licenseService.saveMVPLicense(userId, licenseData);
        return licenseData;
      }

      // Atualiza contador de uso do convite (apenas para códigos regulares)
      if (validation.type === 'regular') {
        await supabase
          .from('invite_codes')
          .update({ 
            used_count: validation.inviteData.used_count + 1,
            last_used_at: new Date().toISOString()
          })
          .eq('code', inviteCode);
      }

      return license;
    } catch (error) {
      console.warn('🚧 MVP: Erro no banco, salvando licença no localStorage');
      licenseService.saveMVPLicense(userId, licenseData);
      return licenseData;
    }
  },

  // Método mais simples para ativação de teste grátis (MVP)
  activateFreeTrial: async (userId, inviteCode) => {
    return await licenseService.activateWithInvite(userId, inviteCode);
  },

  // Gera código de convite (apenas admin)
  generateInviteCode: async (adminUserId, maxUses = 1, validityDays = 30) => {
    const code = licenseUtils.generateInviteCode();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + validityDays);

    const { data, error } = await supabase
      .from('invite_codes')
      .insert({
        code,
        created_by: adminUserId,
        max_uses: maxUses,
        used_count: 0,
        expires_at: expiresAt.toISOString(),
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error generating invite code:', error);
      throw error;
    }

    return data;
  },

  // Atualiza licença
  updateLicense: async (userId, newStatus, newExpiryDate, newType = null) => {
    const updateData = { 
      status: newStatus, 
      expires_at: newExpiryDate, 
      updated_at: new Date().toISOString() 
    };

    if (newType) {
      updateData.license_type = newType;
      updateData.features = LICENSE_CONFIG[newType.toUpperCase()]?.features || {};
    }

    const { data, error } = await supabase
      .from('user_licenses')
      .update(updateData)
      .eq('user_id', userId)
      .select();
      
    if (error) {
      console.error('Error updating license:', error.message);
      throw error;
    }
    return data;
  },

  // Cria nova licença
  createLicense: async (licenseData) => {
    const { data, error } = await supabase
      .from('user_licenses')
      .insert([licenseData])
      .select();
      
    if (error) {
      console.error('Error creating license:', error.message);
      throw error;
    }
    return data;
  },

  // Inicia processo de pagamento (integração futura com gateway)
  initiatePurchase: async (userId, licenseType, billingCycle = 'monthly') => {
    console.log('🚧 Iniciando processo de pagamento (SIMULADO)...');
    
    const licenseConfig = LICENSE_CONFIG[licenseType.toUpperCase()];
    if (!licenseConfig) {
      throw new Error('Tipo de licença inválido');
    }

    const amount = licenseConfig.price[billingCycle];
    
    // Simula criação de sessão de pagamento
    const paymentSession = {
      id: `pi_${Date.now()}`,
      amount,
      currency: licenseConfig.price.currency,
      status: 'pending',
      userId,
      licenseType,
      billingCycle,
      created_at: new Date().toISOString()
    };

    // Em produção, aqui seria feita a chamada para o gateway de pagamento
    // return await stripeService.createPaymentSession(paymentSession);
    
    return {
      success: true,
      paymentUrl: `/payment/checkout?session=${paymentSession.id}`,
      sessionId: paymentSession.id,
      note: 'MVP - Integração com gateway de pagamento será implementada'
    };
  },

  // Processa confirmação de pagamento (webhook do gateway)
  processPaymentSuccess: async (sessionId, paymentData) => {
    console.log('💳 Processando pagamento confirmado (SIMULADO)...');
    
    // Em produção, validaria o webhook do gateway
    const { userId, licenseType, billingCycle } = paymentData;
    
    // Calcula data de expiração baseada no ciclo
    const expiresAt = new Date();
    if (billingCycle === 'yearly') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    // Atualiza ou cria licença
    const licenseData = {
      user_id: userId,
      license_type: licenseType,
      status: 'active',
      expires_at: expiresAt.toISOString(),
      features: LICENSE_CONFIG[licenseType.toUpperCase()].features,
      payment_session_id: sessionId,
      billing_cycle: billingCycle,
      updated_at: new Date().toISOString()
    };

    return await licenseService.createLicense(licenseData);
  }
};