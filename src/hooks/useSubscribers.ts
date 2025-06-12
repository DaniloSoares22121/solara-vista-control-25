
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriberService, SubscriberRecord } from '@/services/supabaseSubscriberService';
import { SubscriberFormData } from '@/types/subscriber';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
    staleTime: 30000, // Cache por 30 segundos
    retry: 3,
  });

  // Configurar atualizações em tempo real
  useEffect(() => {
    const channel = supabase
      .channel('subscribers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscribers'
        },
        (payload) => {
          console.log('Mudança detectada na tabela subscribers:', payload);
          // Invalidar queries específicas para sincronização consistente
          queryClient.invalidateQueries({ queryKey: ['subscribers'] });
          queryClient.invalidateQueries({ queryKey: ['subscriber'] }); // Para queries individuais
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const createMutation = useMutation({
    mutationFn: subscriberService.createSubscriber,
    onSuccess: (data) => {
      // Invalidar e refetch para sincronização
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
      queryClient.setQueryData(['subscriber', data.id], data); // Cache individual
      toast.success('Assinante criado com sucesso!', { duration: 1500 });
    },
    onError: (error: any) => {
      console.error('Erro ao criar assinante:', error);
      const errorMessage = error?.message || 'Erro interno do servidor';
      toast.error(`Erro ao criar assinante: ${errorMessage}`, { duration: 3000 });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SubscriberFormData> }) =>
      subscriberService.updateSubscriber(id, data),
    onSuccess: (data, variables) => {
      // Atualizar cache específico e geral
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
      queryClient.setQueryData(['subscriber', variables.id], data);
      toast.success('Assinante atualizado com sucesso!', { duration: 1500 });
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar assinante:', error);
      const errorMessage = error?.message || 'Erro interno do servidor';
      toast.error(`Erro ao atualizar assinante: ${errorMessage}`, { duration: 3000 });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: subscriberService.deleteSubscriber,
    onSuccess: (_, deletedId) => {
      // Remover do cache e invalidar
      queryClient.removeQueries({ queryKey: ['subscriber', deletedId] });
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
      toast.success('Assinante removido com sucesso!', { duration: 1500 });
    },
    onError: (error: any) => {
      console.error('Erro ao remover assinante:', error);
      const errorMessage = error?.message || 'Erro interno do servidor';
      toast.error(`Erro ao remover assinante: ${errorMessage}`, { duration: 3000 });
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
