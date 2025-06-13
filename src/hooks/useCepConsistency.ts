
import { useCallback } from 'react';
import { useCepLookup } from '@/hooks/useCepLookup';

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
        }
      } catch (error) {
        console.error('❌ Erro ao buscar CEP:', error);
      }
    }
  }, [lookupCep]);

  return {
    handleCepLookup: handleCepLookupConsistent,
    formatCep,
    loading
  };
};
