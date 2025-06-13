
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
          
          switch (payload.eventType) {
            case 'INSERT':
              console.log('✅ [SUBSCRIBERS] Novo assinante criado:', payload.new);
              // Adicionar o novo assinante ao cache
              queryClient.setQueryData(['subscribers'], (oldData: SubscriberRecord[] = []) => {
                return [payload.new as SubscriberRecord, ...oldData];
              });
              // Invalidar para garantir consistência
              queryClient.invalidateQueries({ queryKey: ['subscribers'] });
              break;
              
            case 'UPDATE':
              console.log('📝 [SUBSCRIBERS] Assinante atualizado:', payload.new);
              // Atualizar o assinante específico no cache
              queryClient.setQueryData(['subscribers'], (oldData: SubscriberRecord[] = []) => {
                return oldData.map(subscriber => 
                  subscriber.id === payload.new.id ? payload.new as SubscriberRecord : subscriber
                );
              });
              queryClient.setQueryData(['subscriber', payload.new.id], payload.new);
              break;
              
            case 'DELETE':
              console.log('🗑️ [SUBSCRIBERS] Assinante removido:', payload.old);
              // Remover o assinante do cache
              queryClient.setQueryData(['subscribers'], (oldData: SubscriberRecord[] = []) => {
                return oldData.filter(subscriber => subscriber.id !== payload.old.id);
              });
              queryClient.removeQueries({ queryKey: ['subscriber', payload.old.id] });
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
      // O tempo real já vai atualizar o cache, mas vamos garantir
      queryClient.setQueryData(['subscriber', data.id], data);
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
      // O tempo real já vai atualizar o cache
      queryClient.setQueryData(['subscriber', variables.id], data);
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
      // O tempo real já vai atualizar o cache
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
