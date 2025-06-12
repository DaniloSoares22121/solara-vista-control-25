
import { supabase } from '@/integrations/supabase/client';

export interface FaturaValidacao {
  id: string;
  user_id: string;
  subscriber_id?: string;
  uc: string;
  documento: string;
  data_nascimento?: string;
  tipo_pessoa: 'fisica' | 'juridica';
  fatura_url: string;
  pdf_path?: string;
  message?: string;
  status: 'pendente' | 'aprovada' | 'rejeitada';
  created_at: string;
  updated_at: string;
}

export interface CreateFaturaValidacao {
  subscriber_id?: string;
  uc: string;
  documento: string;
  data_nascimento?: string;
  tipo_pessoa: 'fisica' | 'juridica';
  fatura_url: string;
  pdf_path?: string;
  message?: string;
}

export const faturaValidacaoService = {
  async createFaturaValidacao(data: CreateFaturaValidacao): Promise<FaturaValidacao> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Usuário não autenticado');

    console.log('Criando fatura validação com dados:', data);

    const { data: result, error } = await supabase
      .from('faturas_validacao')
      .insert({
        user_id: user.user.id,
        ...data
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar fatura validação:', error);
      throw error;
    }

    console.log('Fatura validação criada com sucesso:', result);
    return result as FaturaValidacao;
  },

  async getFaturasValidacao(): Promise<FaturaValidacao[]> {
    console.log('Buscando faturas de validação...');
    
    const { data, error } = await supabase
      .from('faturas_validacao')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar faturas validação:', error);
      throw error;
    }

    console.log('Faturas encontradas:', data?.length || 0);
    return (data || []) as FaturaValidacao[];
  },

  async updateStatusFatura(id: string, status: 'pendente' | 'aprovada' | 'rejeitada'): Promise<void> {
    console.log('Atualizando status da fatura:', id, 'para:', status);
    
    const { error } = await supabase
      .from('faturas_validacao')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar status da fatura:', error);
      throw error;
    }

    console.log('Status da fatura atualizado com sucesso');
  }
};
