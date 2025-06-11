import { supabase } from '@/integrations/supabase/client';
import { SubscriberFormData } from '@/types/subscriber';

export interface SubscriberRecord {
  id: string;
  user_id: string;
  concessionaria: string | null;
  subscriber: any;
  administrator: any;
  energy_account: any;
  plan_contract: any;
  plan_details: any;
  notifications: any;
  attachments: any;
  status: string;
  created_at: string;
  updated_at: string;
}

export const SubscriberService = {
  async createSubscriber(data: SubscriberFormData) {
    try {
      console.log('Criando assinante:', data);
      
      const { data: result, error } = await supabase
        .from('subscribers')
        .insert({
          concessionaria: data.concessionaria,
          subscriber: data.subscriberType === 'person' ? data.personalData : data.companyData,
          administrator: data.administratorData,
          energy_account: data.energyAccount,
          plan_contract: data.planContract,
          plan_details: data.planDetails,
          notifications: data.notificationSettings,
          attachments: data.attachments,
          status: 'active'
        } as any)
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar assinante:', error);
        return { success: false, error: error.message };
      }

      console.log('Assinante criado:', result);
      return { success: true, id: result.id };
    } catch (error) {
      console.error('Erro inesperado:', error);
      return { success: false, error: 'Erro interno do servidor' };
    }
  },

  async getSubscribers() {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar assinantes:', error);
        return { success: false, error: error.message, data: [] };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Erro inesperado:', error);
      return { success: false, error: 'Erro interno do servidor', data: [] };
    }
  },

  async getSubscriber(id: string) {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao buscar assinante:', error);
        return { success: false, error: error.message, data: null };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Erro inesperado:', error);
      return { success: false, error: 'Erro interno do servidor', data: null };
    }
  },

  async updateSubscriber(id: string, data: Partial<SubscriberFormData>) {
    try {
      const { data: result, error } = await supabase
        .from('subscribers')
        .update({
          concessionaria: data.concessionaria,
          subscriber: data.subscriberType === 'person' ? data.personalData : data.companyData,
          administrator: data.administratorData,
          energy_account: data.energyAccount,
          plan_contract: data.planContract,
          plan_details: data.planDetails,
          notifications: data.notificationSettings,
          attachments: data.attachments,
        } as any)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar assinante:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('Erro inesperado:', error);
      return { success: false, error: 'Erro interno do servidor' };
    }
  },

  async deleteSubscriber(id: string) {
    try {
      const { error } = await supabase
        .from('subscribers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar assinante:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Erro inesperado:', error);
      return { success: false, error: 'Erro interno do servidor' };
    }
  }
};

// Keep the old export for backwards compatibility
export const subscriberService = SubscriberService;
