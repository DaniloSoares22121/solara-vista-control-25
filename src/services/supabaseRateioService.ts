
import { supabase } from '@/integrations/supabase/client';
import { RateioData, RateioFormData } from '@/types/rateio';

export interface DatabaseRateio {
  id: string;
  user_id: string;
  geradora_id: string;
  geradora_nome: string;
  geradora_uc: string;
  data_rateio: string;
  tipo_rateio: string;
  geracao_esperada: number;
  total_distribuido: number;
  energia_sobra: number;
  status: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseRateioItem {
  id: string;
  rateio_id: string;
  assinante_id: string;
  assinante_nome: string;
  assinante_uc: string;
  consumo_numero: number;
  porcentagem?: number;
  prioridade?: number;
  valor_alocado: number;
  is_new: boolean;
  created_at: string;
}

class SupabaseRateioService {
  async createRateio(formData: RateioFormData): Promise<{ success: boolean; data?: RateioData; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      console.log('🔄 [RATEIO-DB] Criando rateio:', formData);

      // Buscar dados da geradora
      const geradora = formData.configuracao.geradora;
      if (!geradora) {
        return { success: false, error: 'Dados da geradora não encontrados' };
      }

      // Calcular totais
      const totalDistribuido = formData.rateioItems.reduce((sum, item) => sum + (item.valorAlocado || 0), 0);
      const energiaSobra = formData.configuracao.geracaoEsperada - totalDistribuido;

      // Inserir rateio
      const { data: rateioData, error: rateioError } = await supabase
        .from('rateios')
        .insert({
          user_id: user.id,
          geradora_id: formData.configuracao.geradoraId,
          geradora_nome: geradora.apelido,
          geradora_uc: geradora.uc,
          tipo_rateio: formData.configuracao.tipoRateio,
          geracao_esperada: formData.configuracao.geracaoEsperada,
          total_distribuido: totalDistribuido,
          energia_sobra: energiaSobra,
          status: 'pending'
        })
        .select()
        .single();

      if (rateioError) {
        console.error('❌ [RATEIO-DB] Erro ao criar rateio:', rateioError);
        return { success: false, error: rateioError.message };
      }

      // Inserir itens do rateio
      const rateioItems = formData.rateioItems.map(item => ({
        rateio_id: rateioData.id,
        assinante_id: item.assinanteId,
        assinante_nome: item.nome,
        assinante_uc: item.uc,
        consumo_numero: item.consumoNumero,
        porcentagem: item.porcentagem,
        prioridade: item.prioridade,
        valor_alocado: item.valorAlocado || 0,
        is_new: item.isNew
      }));

      const { error: itemsError } = await supabase
        .from('rateio_items')
        .insert(rateioItems);

      if (itemsError) {
        console.error('❌ [RATEIO-DB] Erro ao criar itens do rateio:', itemsError);
        // Limpar rateio criado se houver erro nos itens
        await supabase.from('rateios').delete().eq('id', rateioData.id);
        return { success: false, error: itemsError.message };
      }

      // Converter para formato da aplicação
      const result: RateioData = {
        id: rateioData.id,
        geradoraId: rateioData.geradora_id,
        geradora: geradora,
        dataRateio: new Date(rateioData.data_rateio).toLocaleDateString('pt-BR'),
        tipoRateio: rateioData.tipo_rateio as 'porcentagem' | 'prioridade',
        geracaoEsperada: rateioData.geracao_esperada,
        assinantesVinculados: formData.rateioItems.length,
        assinantes: formData.rateioItems,
        totalDistribuido: rateioData.total_distribuido,
        energiaSobra: rateioData.energia_sobra,
        status: rateioData.status as 'pending' | 'processed' | 'completed',
        createdAt: rateioData.created_at,
        notes: rateioData.observacoes
      };

      console.log('✅ [RATEIO-DB] Rateio criado com sucesso:', result.id);
      return { success: true, data: result };

    } catch (error) {
      console.error('❌ [RATEIO-DB] Erro inesperado:', error);
      return { success: false, error: 'Erro interno do servidor' };
    }
  }

  async getRateios(): Promise<RateioData[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn('⚠️ [RATEIO-DB] Usuário não autenticado');
        return [];
      }

      const { data: rateios, error } = await supabase
        .from('rateios')
        .select(`
          *,
          rateio_items (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [RATEIO-DB] Erro ao buscar rateios:', error);
        return [];
      }

      return (rateios || []).map(rateio => ({
        id: rateio.id,
        geradoraId: rateio.geradora_id,
        geradora: {
          id: rateio.geradora_id,
          apelido: rateio.geradora_nome,
          uc: rateio.geradora_uc,
          geracao: '',
          geracaoNumero: rateio.geracao_esperada,
          percentualAlocado: 0,
          concessionaria: ''
        },
        dataRateio: new Date(rateio.data_rateio).toLocaleDateString('pt-BR'),
        tipoRateio: rateio.tipo_rateio as 'porcentagem' | 'prioridade',
        geracaoEsperada: rateio.geracao_esperada,
        assinantesVinculados: rateio.rateio_items?.length || 0,
        assinantes: (rateio.rateio_items || []).map(item => ({
          assinanteId: item.assinante_id,
          nome: item.assinante_nome,
          uc: item.assinante_uc,
          consumoNumero: item.consumo_numero,
          porcentagem: item.porcentagem,
          prioridade: item.prioridade,
          valorAlocado: item.valor_alocado,
          isNew: item.is_new
        })),
        totalDistribuido: rateio.total_distribuido,
        energiaSobra: rateio.energia_sobra,
        status: rateio.status as 'pending' | 'processed' | 'completed',
        createdAt: rateio.created_at,
        notes: rateio.observacoes
      }));

    } catch (error) {
      console.error('❌ [RATEIO-DB] Erro inesperado ao buscar rateios:', error);
      return [];
    }
  }
}

export const supabaseRateioService = new SupabaseRateioService();
