
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
      console.log('🔄 Carregando assinantes...');
      const data = await subscriberService.getSubscribers();
      console.log('✅ Assinantes carregados:', data);
      setSubscribers(data);
    } catch (err) {
      console.error('❌ Erro ao carregar assinantes:', err);
      setError('Erro ao carregar assinantes');
    } finally {
      setLoading(false);
    }
  };

  const createSubscriber = async (data: SubscriberFormData) => {
    setLoading(true);
    try {
      console.log('🚀 Hook: Iniciando criação de assinante...');
      console.log('📊 Hook: Dados recebidos:', data);
      
      const id = await subscriberService.createSubscriber(data);
      
      console.log('✅ Hook: Assinante criado com ID:', id);
      toast.success('Assinante cadastrado com sucesso!');
      
      console.log('🔄 Hook: Recarregando lista...');
      await loadSubscribers(); // Recarrega a lista
      
      return id;
    } catch (err) {
      console.error('❌ Hook: Erro ao cadastrar assinante:', err);
      
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
