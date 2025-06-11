
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
  status: string | null;
  created_at: string;
  updated_at: string;
}

export class SubscriberService {
  static async createSubscriber(formData: SubscriberFormData): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const subscriberData = {
        concessionaria: formData.concessionaria,
        subscriber: formData.subscriberType === 'person' ? formData.personalData : formData.companyData,
        administrator: formData.administratorData,
        energy_account: formData.energyAccount,
        plan_contract: formData.planContract,
        plan_details: formData.planDetails,
        notifications: formData.notificationSettings,
        attachments: formData.attachments,
        status: 'active'
      };

      const { data, error } = await supabase.rpc('create_subscriber', {
        subscriber_data: subscriberData
      });

      if (error) {
        console.error('Erro ao criar assinante:', error);
        return { success: false, error: error.message };
      }

      return { success: true, id: data };
    } catch (error) {
      console.error('Erro inesperado:', error);
      return { success: false, error: 'Erro interno do servidor' };
    }
  }

  static async getSubscribers(): Promise<{ success: boolean; data?: SubscriberRecord[]; error?: string }> {
    try {
      const { data, error } = await supabase.rpc('get_user_subscribers');

      if (error) {
        console.error('Erro ao buscar assinantes:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Erro inesperado:', error);
      return { success: false, error: 'Erro interno do servidor' };
    }
  }

  static async getSubscriberById(id: string): Promise<{ success: boolean; data?: SubscriberRecord; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao buscar assinante:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Erro inesperado:', error);
      return { success: false, error: 'Erro interno do servidor' };
    }
  }

  static async updateSubscriber(id: string, formData: Partial<SubscriberFormData>): Promise<{ success: boolean; error?: string }> {
    try {
      const updateData: any = {};
      
      if (formData.concessionaria) updateData.concessionaria = formData.concessionaria;
      if (formData.personalData || formData.companyData) {
        updateData.subscriber = formData.subscriberType === 'person' ? formData.personalData : formData.companyData;
      }
      if (formData.administratorData) updateData.administrator = formData.administratorData;
      if (formData.energyAccount) updateData.energy_account = formData.energyAccount;
      if (formData.planContract) updateData.plan_contract = formData.planContract;
      if (formData.planDetails) updateData.plan_details = formData.planDetails;
      if (formData.notificationSettings) updateData.notifications = formData.notificationSettings;
      if (formData.attachments) updateData.attachments = formData.attachments;

      const { error } = await supabase
        .from('subscribers')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar assinante:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Erro inesperado:', error);
      return { success: false, error: 'Erro interno do servidor' };
    }
  }

  static async deleteSubscriber(id: string): Promise<{ success: boolean; error?: string }> {
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
}
