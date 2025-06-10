
import { supabase } from '@/integrations/supabase/client';
import { GeneratorFormData } from '@/types/generator';

export const supabaseGeneratorService = {
  async createGenerator(data: GeneratorFormData) {
    console.log('🔄 [SUPABASE_GENERATOR_SERVICE] Salvando geradora...', data);
    
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user?.id) {
        throw new Error('Usuário não autenticado');
      }

      const generatorData = {
        user_id: user.user.id,
        concessionaria: data.concessionaria,
        owner: data.owner as any,
        administrator: data.administrator as any,
        plants: data.plants as any,
        distributor_login: data.distributorLogin as any,
        payment_data: data.paymentData as any,
        attachments: data.attachments as any,
        status: 'active'
      };

      const { data: result, error } = await supabase
        .from('generators')
        .insert(generatorData)
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
  },

  async deleteGenerator(id: string) {
    console.log('🗑️ [SUPABASE_GENERATOR_SERVICE] Excluindo geradora...', id);
    
    try {
      const { error } = await supabase
        .from('generators')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ [SUPABASE_GENERATOR_SERVICE] Erro ao excluir:', error);
        throw error;
      }

      console.log('✅ [SUPABASE_GENERATOR_SERVICE] Geradora excluída com sucesso');
      return true;
    } catch (error) {
      console.error('❌ [SUPABASE_GENERATOR_SERVICE] Erro:', error);
      throw error;
    }
  },

  async updateGenerator(id: string, data: Partial<GeneratorFormData>) {
    console.log('🔄 [SUPABASE_GENERATOR_SERVICE] Atualizando geradora...', id, data);
    
    try {
      const updateData = {
        ...(data.concessionaria && { concessionaria: data.concessionaria }),
        ...(data.owner && { owner: data.owner as any }),
        ...(data.administrator && { administrator: data.administrator as any }),
        ...(data.plants && { plants: data.plants as any }),
        ...(data.distributorLogin && { distributor_login: data.distributorLogin as any }),
        ...(data.paymentData && { payment_data: data.paymentData as any }),
        ...(data.attachments && { attachments: data.attachments as any }),
        updated_at: new Date().toISOString()
      };

      const { data: result, error } = await supabase
        .from('generators')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ [SUPABASE_GENERATOR_SERVICE] Erro ao atualizar:', error);
        throw error;
      }

      console.log('✅ [SUPABASE_GENERATOR_SERVICE] Geradora atualizada com sucesso:', result);
      return result;
    } catch (error) {
      console.error('❌ [SUPABASE_GENERATOR_SERVICE] Erro:', error);
      throw error;
    }
  }
};
