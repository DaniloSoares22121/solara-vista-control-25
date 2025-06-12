
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

export const subscriberService = {
  async getSubscribers(): Promise<SubscriberRecord[]> {
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar assinantes:', error);
      throw error;
    }

    return data || [];
  },

  async createSubscriber(formData: SubscriberFormData): Promise<SubscriberRecord> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    // Safely stringify data, handling undefined values
    const safeStringify = (obj: any) => {
      if (obj === undefined || obj === null) {
        return {};
      }
      return JSON.parse(JSON.stringify(obj));
    };

    const subscriberData = {
      user_id: user.id,
      concessionaria: formData.concessionaria || null,
      subscriber: safeStringify(formData.subscriberType === 'person' ? formData.personalData : formData.companyData),
      administrator: safeStringify(formData.administratorData),
      energy_account: safeStringify(formData.energyAccount),
      plan_contract: safeStringify(formData.planContract),
      plan_details: safeStringify(formData.planDetails),
      notifications: safeStringify(formData.notificationSettings),
      attachments: safeStringify(formData.attachments),
      status: 'active'
    };

    console.log('Enviando dados para o Supabase:', subscriberData);

    const { data, error } = await supabase
      .from('subscribers')
      .insert(subscriberData)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar assinante:', error);
      throw error;
    }

    return data;
  },

  async updateSubscriber(id: string, formData: Partial<SubscriberFormData>): Promise<SubscriberRecord> {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (formData.concessionaria) updateData.concessionaria = formData.concessionaria;
    if (formData.personalData || formData.companyData) {
      updateData.subscriber = JSON.parse(JSON.stringify(formData.personalData || formData.companyData));
    }
    if (formData.administratorData) updateData.administrator = JSON.parse(JSON.stringify(formData.administratorData));
    if (formData.energyAccount) updateData.energy_account = JSON.parse(JSON.stringify(formData.energyAccount));
    if (formData.planContract) updateData.plan_contract = JSON.parse(JSON.stringify(formData.planContract));
    if (formData.planDetails) updateData.plan_details = JSON.parse(JSON.stringify(formData.planDetails));
    if (formData.notificationSettings) updateData.notifications = JSON.parse(JSON.stringify(formData.notificationSettings));
    if (formData.attachments) updateData.attachments = JSON.parse(JSON.stringify(formData.attachments));

    const { data, error } = await supabase
      .from('subscribers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar assinante:', error);
      throw error;
    }

    return data;
  },

  async deleteSubscriber(id: string): Promise<void> {
    const { error } = await supabase
      .from('subscribers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar assinante:', error);
      throw error;
    }
  }
};
