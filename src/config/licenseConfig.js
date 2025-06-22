// Configurações do sistema de licenças e convites
export const LICENSE_CONFIG = {
  // Tipos de licença disponíveis
  LICENSE_TYPES: {
    FREE_TRIAL: 'free_trial',
    PREMIUM: 'premium',
    ENTERPRISE: 'enterprise'
  },

  // Configurações do teste grátis
  FREE_TRIAL: {
    duration: 7, // dias
    maxAnalysesPerDay: 5,
    features: {
      basicAnalysis: true,
      liveMatches: true,
      basicAlerts: true,
      advancedAnalysis: false,
      unlimitedAnalyses: false,
      prioritySupport: false,
      videoAnalysis: false
    },
    requiresInvite: true
  },

  // Configurações da licença Premium
  PREMIUM: {
    price: {
      monthly: 49.90,
      yearly: 499.90, // 2 meses grátis
      currency: 'BRL'
    },
    features: {
      basicAnalysis: true,
      liveMatches: true,
      basicAlerts: true,
      advancedAnalysis: true,
      unlimitedAnalyses: true,
      prioritySupport: true,
      videoAnalysis: false, // Futuro
      customAlerts: true,
      exportData: true
    },
    limits: {
      maxAnalysesPerDay: null, // Ilimitado
      maxSavedAnalyses: 100,
      maxCustomAlerts: 20
    }
  },

  // Configurações da licença Enterprise
  ENTERPRISE: {
    price: {
      monthly: 299.90,
      yearly: 2999.90,
      currency: 'BRL'
    },
    features: {
      basicAnalysis: true,
      liveMatches: true,
      basicAlerts: true,
      advancedAnalysis: true,
      unlimitedAnalyses: true,
      prioritySupport: true,
      videoAnalysis: true, // Futuro
      customAlerts: true,
      exportData: true,
      apiAccess: true,
      whiteLabel: true,
      dedicatedSupport: true
    },
    limits: {
      maxAnalysesPerDay: null, // Ilimitado
      maxSavedAnalyses: null, // Ilimitado
      maxCustomAlerts: null, // Ilimitado
      maxApiCalls: 10000 // Por dia
    }
  },

  // Configurações do sistema de convites
  INVITE_SYSTEM: {
    enabled: true,
    inviteCodeLength: 8,
    inviteValidityDays: 30,
    maxInviteUses: 1, // Cada convite pode ser usado uma vez
    adminCanGenerateInvites: true,
    
    // Códigos especiais para demonstração
    demoInvites: {
      'DEMO2024': {
        maxUses: 100,
        validUntil: '2024-12-31',
        trialDuration: 14 // dias extras
      },
      'BETA2024': {
        maxUses: 50,
        validUntil: '2024-12-31',
        trialDuration: 30,
        features: {
          videoAnalysis: true // Acesso antecipado
        }
      }
    }
  },

  // Configurações do gateway de pagamento
  PAYMENT_GATEWAY: {
    provider: 'stripe', // ou 'mercadopago', 'pagarme'
    testMode: true, // Mudar para false em produção
    
    webhook: {
      enabled: true,
      endpoint: '/api/webhooks/payment',
      events: [
        'payment_intent.succeeded',
        'payment_intent.payment_failed',
        'invoice.payment_succeeded',
        'customer.subscription.deleted'
      ]
    },

    // URLs de redirecionamento
    redirectUrls: {
      success: '/dashboard?payment=success',
      cancel: '/license?payment=cancel',
      error: '/license?payment=error'
    }
  },

  // Configurações de renovação automática
  AUTO_RENEWAL: {
    enabled: true,
    reminderDays: [7, 3, 1], // Dias antes do vencimento
    gracePeriodDays: 3, // Dias após vencimento
    
    // Downgrade automático se não renovar
    downgradeSettings: {
      enabled: true,
      downgradeTo: 'FREE_TRIAL',
      retainDataDays: 30 // Dados ficam salvos por 30 dias
    }
  },

  // Limites de uso para prevenir abuso
  USAGE_LIMITS: {
    maxAccountsPerIP: 3,
    maxLoginAttemptsPerHour: 5,
    maxApiCallsPerMinute: {
      free_trial: 10,
      premium: 60,
      enterprise: 300
    }
  },

  // Configurações de notificações
  NOTIFICATIONS: {
    email: {
      welcome: true,
      trialExpiring: true,
      paymentSuccess: true,
      paymentFailed: true,
      subscriptionCanceled: true
    },
    inApp: {
      usageLimitWarning: true,
      featureBlocked: true,
      trialExpiring: true
    }
  }
};

// Funções auxiliares para verificação de licenças
export const licenseUtils = {
  // Verifica se usuário tem acesso a uma funcionalidade
  hasFeature: (userLicense, feature) => {
    if (!userLicense || !userLicense.type) return false;
    
    const licenseConfig = LICENSE_CONFIG[userLicense.type.toUpperCase()];
    return licenseConfig?.features?.[feature] || false;
  },

  // Verifica se licença está ativa
  isLicenseActive: (userLicense) => {
    if (!userLicense) return false;
    
    const now = new Date();
    const expiryDate = new Date(userLicense.expiresAt);
    
    return now <= expiryDate && userLicense.status === 'active';
  },

  // Calcula dias restantes da licença
  getDaysRemaining: (userLicense) => {
    if (!userLicense) return 0;
    
    const now = new Date();
    const expiryDate = new Date(userLicense.expiresAt);
    const diffTime = expiryDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  },

  // Verifica se pode usar funcionalidade baseado em limites
  canUseFeature: (userLicense, featureName, currentUsage = 0) => {
    if (!licenseUtils.hasFeature(userLicense, featureName)) {
      return { allowed: false, reason: 'feature_not_available' };
    }

    if (!licenseUtils.isLicenseActive(userLicense)) {
      return { allowed: false, reason: 'license_expired' };
    }

    const licenseConfig = LICENSE_CONFIG[userLicense.type.toUpperCase()];
    const limits = licenseConfig?.limits;

    // Verifica limites específicos
    if (featureName === 'analyses' && limits?.maxAnalysesPerDay) {
      if (currentUsage >= limits.maxAnalysesPerDay) {
        return { allowed: false, reason: 'daily_limit_reached' };
      }
    }

    return { allowed: true };
  },

  // Gera código de convite
  generateInviteCode: () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < LICENSE_CONFIG.INVITE_SYSTEM.inviteCodeLength; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
};

export default LICENSE_CONFIG;
