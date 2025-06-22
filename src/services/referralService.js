import { supabase } from '@/lib/supabaseClient';

export const referralService = {
  getReferralStatus: async (userId) => {
    const { data, error } = await supabase
      .from('referrals')
      .select('referred_count, code, id, user_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching referral status:', error.message);
      throw error;
    }
    // Se não existir, pode-se criar um código padrão aqui ou deixar null/undefined
    // Para este exemplo, retornaremos data, que pode ser null.
    // A lógica de criar um código se não existir pode ser movida para a página ou um serviço de criação.
    return data; 
  },

  createReferralEntry: async (userId, referralCode) => {
    const { data, error } = await supabase
      .from('referrals')
      .insert([{ user_id: userId, code: referralCode, referred_count: 0 }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating referral entry:', error.message);
      throw error;
    }
    return data;
  },

  incrementReferralCount: async (referralCodeToIncrement) => {
    // Esta função é um pouco mais complexa e geralmente seria melhor tratada
    // com uma função de banco de dados (RPC) para atomicidade.
    // Por enquanto, faremos uma busca e depois um update.
    
    // 1. Encontrar o usuário pelo código de indicação
    const { data: referralUser, error: findError } = await supabase
      .from('referrals')
      .select('id, referred_count, user_id')
      .eq('code', referralCodeToIncrement)
      .single();

    if (findError || !referralUser) {
      console.error('Error finding referral code or code not found:', findError?.message);
      throw findError || new Error('Referral code not found.');
    }

    // 2. Incrementar a contagem
    const newCount = (referralUser.referred_count || 0) + 1;
    const { data: updatedData, error: updateError } = await supabase
      .from('referrals')
      .update({ referred_count: newCount, updated_at: new Date().toISOString() })
      .eq('id', referralUser.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error incrementing referral count:', updateError.message);
      throw updateError;
    }
    return updatedData;
  },
};