
import { supabase } from '@/integrations/supabase/client';
import { SubscriberFormData } from '@/types/subscriber';

const COLLECTION_NAME = 'subscribers';

export const supabaseSubscriberService = {
  // Criar novo assinante
  async createSubscriber(data: SubscriberFormData): Promise<string> {
    try {
      console.log('🚀 [SUPABASE_SERVICE] Iniciando criação de assinante...');
      console.log('📊 [SUPABASE_SERVICE] Dados recebidos:', JSON.stringify(data, null, 2));
      
      // Obter o usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Preparar dados para salvar (convertendo File objects para strings/base64 se necessário)
      const docData = {
        user_id: user.id,
        concessionaria: data.concessionaria,
        subscriber: data.subscriber,
        administrator: data.administrator || null,
        energy_account: data.energyAccount,
        plan_contract: data.planContract,
        plan_details: data.planDetails,
        notifications: data.notifications,
        attachments: data.attachments || null,
        status: 'active'
      };

      console.log('📝 [SUPABASE_SERVICE] Dados preparados para salvar:', JSON.stringify(docData, null, 2));

      // Inserir no Supabase usando inserção direta
      const { data: insertedData, error } = await (supabase as any)
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
      
      // Usar query SQL direta para contornar problema de tipos
      const { data, error } = await (supabase as any)
        .from(COLLECTION_NAME)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ [SUPABASE_SERVICE] Erro ao buscar:', error);
        throw error;
      }

      console.log('✅ [SUPABASE_SERVICE] Total de assinantes encontrados:', data?.length || 0);
      console.log('✅ [SUPABASE_SERVICE] Lista completa:', data);
      
      // Transformar os dados do formato do banco para o formato esperado pela aplicação
      const transformedData = (data || []).map((item: any) => ({
        id: item.id,
        concessionaria: item.concessionaria,
        subscriber: item.subscriber,
        administrator: item.administrator,
        energyAccount: item.energy_account,
        planContract: item.plan_contract,
        planDetails: item.plan_details,
        notifications: item.notifications,
        attachments: item.attachments || {}
      }));
      
      return transformedData;
    } catch (error) {
      console.error('❌ [SUPABASE_SERVICE] Erro ao buscar assinantes:', error);
      throw error;
    }
  },

  // Buscar assinante por ID
  async getSubscriberById(id: string): Promise<(SubscriberFormData & { id: string }) | null> {
    try {
      const { data, error } = await (supabase as any)
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
      
      // Transformar os dados do formato do banco para o formato esperado pela aplicação
      return {
        id: data.id,
        concessionaria: data.concessionaria,
        subscriber: data.subscriber,
        administrator: data.administrator,
        energyAccount: data.energy_account,
        planContract: data.plan_contract,
        planDetails: data.plan_details,
        notifications: data.notifications,
        attachments: data.attachments || {}
      };
    } catch (error) {
      console.error('Erro ao buscar assinante:', error);
      throw error;
    }
  },

  // Atualizar assinante
  async updateSubscriber(id: string, data: Partial<SubscriberFormData>): Promise<void> {
    try {
      // Transformar os dados para o formato do banco
      const updateData: any = {};
      
      if (data.concessionaria) updateData.concessionaria = data.concessionaria;
      if (data.subscriber) updateData.subscriber = data.subscriber;
      if (data.administrator) updateData.administrator = data.administrator;
      if (data.energyAccount) updateData.energy_account = data.energyAccount;
      if (data.planContract) updateData.plan_contract = data.planContract;
      if (data.planDetails) updateData.plan_details = data.planDetails;
      if (data.notifications) updateData.notifications = data.notifications;
      if (data.attachments) updateData.attachments = data.attachments;

      const { error } = await (supabase as any)
        .from(COLLECTION_NAME)
        .update(updateData)
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
      const { error } = await (supabase as any)
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
