
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriberService, SubscriberRecord } from '@/services/supabaseSubscriberService';
import { SubscriberFormData } from '@/types/subscriber';
import { toast } from 'sonner';

export const useSubscribers = () => {
  const queryClient = useQueryClient();

  const {
    data: subscribers = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['subscribers'],
    queryFn: subscriberService.getSubscribers,
  });

  const createMutation = useMutation({
    mutationFn: subscriberService.createSubscriber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
      toast.success('Assinante criado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao criar assinante:', error);
      toast.error('Erro ao criar assinante. Tente novamente.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SubscriberFormData> }) =>
      subscriberService.updateSubscriber(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
      toast.success('Assinante atualizado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar assinante:', error);
      toast.error('Erro ao atualizar assinante. Tente novamente.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: subscriberService.deleteSubscriber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
      toast.success('Assinante removido com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao remover assinante:', error);
      toast.error('Erro ao remover assinante. Tente novamente.');
    },
  });

  return {
    subscribers,
    isLoading,
    error,
    refetch,
    createSubscriber: createMutation.mutate,
    updateSubscriber: updateMutation.mutate,
    deleteSubscriber: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
