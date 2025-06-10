
import { supabase } from '@/integrations/supabase/client';
import { GeneratorFormData } from '@/types/generator';

export const supabaseGeneratorService = {
  async createGenerator(data: GeneratorFormData) {
    console.log('🔄 [SUPABASE_GENERATOR_SERVICE] Salvando geradora...', data);
    
    try {
      const { data: result, error } = await supabase
        .from('generators')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          concessionaria: data.concessionaria,
          owner: data.owner,
          administrator: data.administrator,
          plants: data.plants,
          distributor_login: data.distributorLogin,
          payment_data: data.paymentData,
          attachments: data.attachments,
          status: 'active'
        })
        .select()
        .single();

      if (error) {
        console.error('❌ [SUPABASE_GENERATOR_SERVICE] Erro ao salvar:', error);
        throw error;
      }

      console.log('✅ [SUPABASE_GENERATOR_SERVICE] Geradora salva com sucesso:', result);
      return result;
    } catch (error) {
      console.error('❌ [SUPABASE_GENERATOR_SERVICE] Erro:', error);
      throw error;
    }
  },

  async getGenerators() {
    console.log('🔍 [SUPABASE_GENERATOR_SERVICE] Buscando geradoras...');
    
    try {
      const { data, error } = await supabase
        .from('generators')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [SUPABASE_GENERATOR_SERVICE] Erro ao buscar:', error);
        throw error;
      }

      console.log('✅ [SUPABASE_GENERATOR_SERVICE] Geradoras encontradas:', data);
      return data || [];
    } catch (error) {
      console.error('❌ [SUPABASE_GENERATOR_SERVICE] Erro:', error);
      throw error;
    }
  }
};
