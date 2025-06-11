
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { representativeService } from '@/services/supabaseRepresentativeService';
import { Representative, RepresentativeFormData } from '@/types/representative';
import { toast } from 'sonner';

export const useRepresentatives = () => {
  const queryClient = useQueryClient();

  const {
    data: representatives = [],
    isLoading: loading,
    error,
    refetch: refreshRepresentatives
  } = useQuery({
    queryKey: ['representatives'],
    queryFn: representativeService.getRepresentatives,
  });

  const createMutation = useMutation({
    mutationFn: representativeService.createRepresentative,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['representatives'] });
      toast.success('Representante criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar representante:', error);
      toast.error('Erro ao criar representante. Tente novamente.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RepresentativeFormData> }) =>
      representativeService.updateRepresentative(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['representatives'] });
      toast.success('Representante atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar representante:', error);
      toast.error('Erro ao atualizar representante. Tente novamente.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: representativeService.deleteRepresentative,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['representatives'] });
      toast.success('Representante removido com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao deletar representante:', error);
      toast.error('Erro ao remover representante. Tente novamente.');
    }
  });

  const createRepresentative = (data: RepresentativeFormData) => {
    return createMutation.mutateAsync(data);
  };

  const updateRepresentative = (id: string, data: Partial<RepresentativeFormData>) => {
    return updateMutation.mutateAsync({ id, data });
  };

  const deleteRepresentative = (id: string) => {
    return deleteMutation.mutateAsync(id);
  };

  return {
    representatives,
    loading,
    error,
    refreshRepresentatives,
    createRepresentative,
    updateRepresentative,
    deleteRepresentative,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};
