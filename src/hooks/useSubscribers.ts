import { useState, useEffect } from 'react';
import { supabaseSubscriberService } from '@/services/supabaseSubscriberService';
import { SubscriberFormData } from '@/types/subscriber';
import { toast } from 'sonner';

export const useSubscribers = () => {
  const [subscribers, setSubscribers] = useState<(SubscriberFormData & { id: string })[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSubscribers = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 [HOOK] Carregando assinantes...');
      const data = await supabaseSubscriberService.getSubscribers();
      console.log('✅ [HOOK] Assinantes carregados:', data);
      setSubscribers(data);
    } catch (err) {
      console.error('❌ [HOOK] Erro ao carregar assinantes:', err);
      setError('Erro ao carregar assinantes');
    } finally {
      setLoading(false);
    }
  };

  const createSubscriber = async (data: SubscriberFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🚀 [HOOK] Iniciando criação de assinante...');
      console.log('📊 [HOOK] Dados recebidos no hook:', JSON.stringify(data, null, 2));
      
      // Validar dados básicos antes de enviar
      if (!data.subscriber?.name) {
        throw new Error('Nome do assinante é obrigatório');
      }
      
      if (!data.subscriber?.cpfCnpj) {
        throw new Error('CPF/CNPJ é obrigatório');
      }
      
      if (!data.energyAccount?.originalAccount?.uc) {
        throw new Error('UC é obrigatória');
      }
      
      console.log('✅ [HOOK] Validação básica passou');
      
      const id = await supabaseSubscriberService.createSubscriber(data);
      
      console.log('✅ [HOOK] Assinante criado com ID:', id);
      
      // Recarregar lista
      console.log('🔄 [HOOK] Recarregando lista...');
      await loadSubscribers();
      
      console.log('✅ [HOOK] Lista recarregada com sucesso');
      
      return id;
    } catch (err: any) {
      console.error('❌ [HOOK] Erro completo ao cadastrar assinante:', err);
      console.error('❌ [HOOK] Tipo do erro:', typeof err);
      console.error('❌ [HOOK] Mensagem do erro:', err?.message);
      console.error('❌ [HOOK] Stack do erro:', err?.stack);
      
      let errorMessage = 'Erro desconhecido ao cadastrar assinante';
      
      if (err?.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err?.error?.message) {
        errorMessage = err.error.message;
      }
      
      console.error('❌ [HOOK] Mensagem final do erro:', errorMessage);
      setError(errorMessage);
      
      // Não mostrar toast aqui, deixar o componente decidir
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateSubscriber = async (id: string, data: Partial<SubscriberFormData>) => {
    setLoading(true);
    try {
      await supabaseSubscriberService.updateSubscriber(id, data);
      toast.success('Assinante atualizado com sucesso!');
      await loadSubscribers(); // Recarrega a lista
    } catch (err) {
      console.error('❌ Erro ao atualizar assinante:', err);
      toast.error('Erro ao atualizar assinante');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSubscriber = async (id: string) => {
    setLoading(true);
    try {
      await supabaseSubscriberService.deleteSubscriber(id);
      toast.success('Assinante removido com sucesso!');
      await loadSubscribers(); // Recarrega a lista
    } catch (err) {
      console.error('❌ Erro ao remover assinante:', err);
      toast.error('Erro ao remover assinante');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  return {
    subscribers,
    loading,
    error,
    createSubscriber,
    updateSubscriber,
    deleteSubscriber,
    loadSubscribers
  };
};
