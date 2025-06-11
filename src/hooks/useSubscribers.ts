
import { useState, useEffect } from 'react';
import { SubscriberService, SubscriberRecord } from '@/services/subscriberService';
import { SubscriberFormData } from '@/types/subscriber';
import { toast } from 'sonner';

export const useSubscribers = () => {
  const [subscribers, setSubscribers] = useState<SubscriberRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscribers = async () => {
    setIsLoading(true);
    setError(null);
    
    const result = await SubscriberService.getSubscribers();
    
    if (result.success) {
      setSubscribers(result.data || []);
    } else {
      setError(result.error || 'Erro ao carregar assinantes');
      toast.error('Erro ao carregar assinantes');
    }
    
    setIsLoading(false);
  };

  const createSubscriber = async (formData: SubscriberFormData) => {
    const result = await SubscriberService.createSubscriber(formData);
    
    if (result.success) {
      toast.success('Assinante cadastrado com sucesso!');
      fetchSubscribers(); // Reload list
      return { success: true, id: result.id };
    } else {
      toast.error(result.error || 'Erro ao cadastrar assinante');
      return { success: false, error: result.error };
    }
  };

  const updateSubscriber = async (id: string, formData: Partial<SubscriberFormData>) => {
    const result = await SubscriberService.updateSubscriber(id, formData);
    
    if (result.success) {
      toast.success('Assinante atualizado com sucesso!');
      fetchSubscribers(); // Reload list
      return { success: true };
    } else {
      toast.error(result.error || 'Erro ao atualizar assinante');
      return { success: false, error: result.error };
    }
  };

  const deleteSubscriber = async (id: string) => {
    const result = await SubscriberService.deleteSubscriber(id);
    
    if (result.success) {
      toast.success('Assinante removido com sucesso!');
      fetchSubscribers(); // Reload list
      return { success: true };
    } else {
      toast.error(result.error || 'Erro ao remover assinante');
      return { success: false, error: result.error };
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  return {
    subscribers,
    isLoading,
    error,
    createSubscriber,
    updateSubscriber,
    deleteSubscriber,
    refetch: fetchSubscribers,
  };
};
