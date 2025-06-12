
import { useCallback } from 'react';
import { useCepLookup } from '@/hooks/useCepLookup';
import { toast } from 'sonner';

// Hook centralizado para consistência do CEP em todos os formulários
export const useCepConsistency = () => {
  const { lookupCep, loading, formatCep } = useCepLookup();

  const handleCepLookupConsistent = useCallback(async (
    cep: string, 
    onSuccess: (cepData: any) => void
  ) => {
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length === 8) {
      console.log('🔍 Lookup CEP consistente:', cleanCep);
      try {
        const cepData = await lookupCep(cleanCep);
        console.log('📍 Dados CEP retornados:', cepData);
        
        if (cepData) {
          onSuccess(cepData);
        } else {
          toast.error('CEP não encontrado', { duration: 2000 });
        }
      } catch (error) {
        console.error('❌ Erro ao buscar CEP:', error);
        toast.error('Erro ao consultar CEP', { duration: 2000 });
      }
    }
  }, [lookupCep]);

  return {
    handleCepLookup: handleCepLookupConsistent,
    formatCep,
    loading
  };
};
