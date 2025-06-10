
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
      const data = await subscriberService.getSubscribers();
      setSubscribers(data);
    } catch (err) {
      setError('Erro ao carregar assinantes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createSubscriber = async (data: SubscriberFormData) => {
    setLoading(true);
    try {
      const id = await subscriberService.createSubscriber(data);
      toast.success('Assinante cadastrado com sucesso!');
      await loadSubscribers(); // Recarrega a lista
      return id;
    } catch (err) {
      toast.error('Erro ao cadastrar assinante');
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
