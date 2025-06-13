
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
    staleTime: 5000, // Cache por apenas 5 segundos para garantir dados frescos
    retry: 3,
  });

  // Configurar atualizações em tempo real
  useEffect(() => {
    console.log('🔄 [SUBSCRIBERS] Configurando canal de tempo real...');
    
    const channel = supabase
      .channel('subscribers-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscribers'
        },
        (payload) => {
          console.log('🔄 [SUBSCRIBERS] Mudança detectada:', payload.eventType, payload);
          
          // Sempre invalida e refaz a query para garantir dados frescos
          queryClient.invalidateQueries({ queryKey: ['subscribers'] });
          
          switch (payload.eventType) {
            case 'INSERT':
              console.log('✅ [SUBSCRIBERS] Novo assinante criado:', payload.new);
              toast.success('Novo assinante adicionado!', { duration: 1500 });
              break;
              
            case 'UPDATE':
              console.log('📝 [SUBSCRIBERS] Assinante atualizado:', payload.new);
              toast.success('Assinante atualizado!', { duration: 1500 });
              break;
              
            case 'DELETE':
              console.log('🗑️ [SUBSCRIBERS] Assinante removido:', payload.old);
              toast.success('Assinante removido!', { duration: 1500 });
              break;
          }
        }
      )
      .subscribe((status) => {
        console.log('🔄 [SUBSCRIBERS] Status do canal:', status);
      });

    return () => {
      console.log('🔄 [SUBSCRIBERS] Removendo canal de tempo real...');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const createMutation = useMutation({
    mutationFn: subscriberService.createSubscriber,
    onSuccess: (data) => {
      console.log('✅ [SUBSCRIBERS] Assinante criado com sucesso:', data);
      // Força atualização imediata
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
      refetch();
      toast.success('Assinante criado com sucesso!', { duration: 1500 });
    },
    onError: (error: any) => {
      console.error('❌ [SUBSCRIBERS] Erro ao criar assinante:', error);
      const errorMessage = error?.message || 'Erro interno do servidor';
      toast.error(`Erro ao criar assinante: ${errorMessage}`, { duration: 3000 });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SubscriberFormData> }) =>
      subscriberService.updateSubscriber(id, data),
    onSuccess: (data, variables) => {
      console.log('✅ [SUBSCRIBERS] Assinante atualizado com sucesso:', data);
      // Força atualização imediata
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
      queryClient.setQueryData(['subscriber', variables.id], data);
      refetch();
      toast.success('Assinante atualizado com sucesso!', { duration: 1500 });
    },
    onError: (error: any) => {
      console.error('❌ [SUBSCRIBERS] Erro ao atualizar assinante:', error);
      const errorMessage = error?.message || 'Erro interno do servidor';
      toast.error(`Erro ao atualizar assinante: ${errorMessage}`, { duration: 3000 });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: subscriberService.deleteSubscriber,
    onSuccess: (_, deletedId) => {
      console.log('✅ [SUBSCRIBERS] Assinante removido com sucesso:', deletedId);
      // Força atualização imediata
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
      queryClient.removeQueries({ queryKey: ['subscriber', deletedId] });
      refetch();
      toast.success('Assinante removido com sucesso!', { duration: 1500 });
    },
    onError: (error: any) => {
      console.error('❌ [SUBSCRIBERS] Erro ao remover assinante:', error);
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
