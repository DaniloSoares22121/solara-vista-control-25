
import { supabase } from '@/integrations/supabase/client';
import { SubscriberFormData } from '@/types/subscriber';

const COLLECTION_NAME = 'subscribers';

export const supabaseSubscriberService = {
  // Criar novo assinante
  async createSubscriber(data: SubscriberFormData): Promise<string> {
    try {
      console.log('🚀 [SUPABASE_SERVICE] Iniciando criação de assinante...');
      console.log('📊 [SUPABASE_SERVICE] Dados recebidos:', JSON.stringify(data, null, 2));
      
      // Preparar dados para salvar
      const docData = {
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'active'
      };

      console.log('📝 [SUPABASE_SERVICE] Dados preparados para salvar:', JSON.stringify(docData, null, 2));

      // Inserir no Supabase
      const { data: insertedData, error } = await supabase
        .from(COLLECTION_NAME)
        .insert([docData])
        .select('id')
        .single();
      
      if (error) {
        console.error('❌ [SUPABASE_SERVICE] Erro ao inserir:', error);
        throw error;
      }

      console.log('✅ [SUPABASE_SERVICE] Documento inserido com sucesso!');
      console.log('🆔 [SUPABASE_SERVICE] ID do documento:', insertedData.id);
      
      return insertedData.id;
    } catch (error) {
      console.error('❌ [SUPABASE_SERVICE] ERRO DETALHADO ao criar assinante:', error);
      throw new Error(`Erro ao salvar no Supabase: ${error.message}`);
    }
  },

  // Buscar todos os assinantes
  async getSubscribers(): Promise<(SubscriberFormData & { id: string })[]> {
    try {
      console.log('🔍 [SUPABASE_SERVICE] Buscando assinantes...');
      
      const { data, error } = await supabase
        .from(COLLECTION_NAME)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ [SUPABASE_SERVICE] Erro ao buscar:', error);
        throw error;
      }

      console.log('✅ [SUPABASE_SERVICE] Total de assinantes encontrados:', data?.length || 0);
      console.log('✅ [SUPABASE_SERVICE] Lista completa:', data);
      
      return data || [];
    } catch (error) {
      console.error('❌ [SUPABASE_SERVICE] Erro ao buscar assinantes:', error);
      throw error;
    }
  },

  // Buscar assinante por ID
  async getSubscriberById(id: string): Promise<(SubscriberFormData & { id: string }) | null> {
    try {
      const { data, error } = await supabase
        .from(COLLECTION_NAME)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No rows found
        }
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Erro ao buscar assinante:', error);
      throw error;
    }
  },

  // Atualizar assinante
  async updateSubscriber(id: string, data: Partial<SubscriberFormData>): Promise<void> {
    try {
      const { error } = await supabase
        .from(COLLECTION_NAME)
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      console.log('Assinante atualizado:', id);
    } catch (error) {
      console.error('Erro ao atualizar assinante:', error);
      throw error;
    }
  },

  // Deletar assinante
  async deleteSubscriber(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(COLLECTION_NAME)
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      console.log('Assinante deletado:', id);
    } catch (error) {
      console.error('Erro ao deletar assinante:', error);
      throw error;
    }
  }
};
