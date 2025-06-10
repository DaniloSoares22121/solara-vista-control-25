
import { useState, useEffect } from 'react';
import { subscriberService } from '@/services/subscriberService';
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
      const data = await subscriberService.getSubscribers();
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
    try {
      console.log('🚀 [HOOK] Iniciando criação de assinante...');
      console.log('📊 [HOOK] Dados recebidos:', JSON.stringify(data, null, 2));
      
      const id = await subscriberService.createSubscriber(data);
      
      console.log('✅ [HOOK] Assinante criado com ID:', id);
      
      // Verificar se realmente foi criado recarregando a lista
      console.log('🔄 [HOOK] Recarregando lista para verificar...');
      await loadSubscribers();
      
      // Verificar se o novo assinante aparece na lista
      const updatedSubscribers = await subscriberService.getSubscribers();
      const newSubscriber = updatedSubscribers.find(sub => sub.id === id);
      
      if (newSubscriber) {
        console.log('✅ [HOOK] Assinante confirmado na lista:', newSubscriber);
        toast.success('Assinante cadastrado com sucesso!');
      } else {
        console.error('❌ [HOOK] Assinante não encontrado na lista após criação!');
        toast.error('Erro: Assinante não foi salvo corretamente');
        throw new Error('Assinante não foi salvo corretamente');
      }
      
      return id;
    } catch (err) {
      console.error('❌ [HOOK] Erro ao cadastrar assinante:', err);
      
      // Mostrar erro mais específico
      let errorMessage = 'Erro ao cadastrar assinante';
      if (err?.message) {
        errorMessage += `: ${err.message}`;
      }
      
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSubscriber = async (id: string, data: Partial<SubscriberFormData>) => {
    setLoading(true);
    try {
      await subscriberService.updateSubscriber(id, data);
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
      await subscriberService.deleteSubscriber(id);
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
