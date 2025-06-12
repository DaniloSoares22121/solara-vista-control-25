
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

export interface FaturaEmitida {
  id: string;
  user_id: string;
  subscriber_id?: string;
  uc: string;
  documento: string;
  tipo_pessoa: 'fisica' | 'juridica';
  fatura_url: string;
  valor_total?: number;
  referencia?: string;
  numero_fatura?: string;
  data_emissao: string;
  data_vencimento?: string;
  status_pagamento: 'pendente' | 'pago' | 'vencido';
  created_at: string;
  updated_at: string;
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
    
    // Se aprovada, move para faturas emitidas e remove da validação
    if (status === 'aprovada') {
      // Busca a fatura para mover
      const { data: fatura, error: fetchError } = await supabase
        .from('faturas_validacao')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Erro ao buscar fatura para aprovação:', fetchError);
        throw fetchError;
      }

      // Cria entrada na tabela de faturas emitidas
      const { error: insertError } = await supabase
        .from('faturas_emitidas')
        .insert({
          user_id: fatura.user_id,
          subscriber_id: fatura.subscriber_id,
          uc: fatura.uc,
          documento: fatura.documento,
          tipo_pessoa: fatura.tipo_pessoa,
          fatura_url: fatura.fatura_url,
          numero_fatura: `FAT-${Date.now()}`,
          referencia: new Date().toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' }),
          valor_total: 0, // Valor padrão, pode ser atualizado depois
          data_emissao: new Date().toISOString(),
          status_pagamento: 'pendente'
        });

      if (insertError) {
        console.error('Erro ao criar fatura emitida:', insertError);
        throw insertError;
      }

      // Remove da tabela de validação
      const { error: deleteError } = await supabase
        .from('faturas_validacao')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('Erro ao remover fatura da validação:', deleteError);
        throw deleteError;
      }
    } else {
      // Apenas atualiza o status
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
    }

    console.log('Status da fatura atualizado com sucesso');
  },

  async getFaturasEmitidas(): Promise<FaturaEmitida[]> {
    console.log('Buscando faturas emitidas...');
    
    const { data, error } = await supabase
      .from('faturas_emitidas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar faturas emitidas:', error);
      throw error;
    }

    console.log('Faturas emitidas encontradas:', data?.length || 0);
    return (data || []) as FaturaEmitida[];
  }
};
