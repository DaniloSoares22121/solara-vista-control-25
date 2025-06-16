
import { useState, useEffect } from 'react';
import { RateioData } from '@/types/rateio';

export const useRateio = () => {
  const [rateios, setRateios] = useState<RateioData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simular carregamento de dados
    const loadRateios = async () => {
      try {
        setIsLoading(true);
        // Dados mockados enquanto não há integração com assinantes
        setRateios([]);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar rateios');
      } finally {
        setIsLoading(false);
      }
    };

    loadRateios();
  }, []);

  const createRateio = async (data: Omit<RateioData, 'id'>) => {
    try {
      // Implementar criação de rateio
      console.log('Criando rateio:', data);
      return { success: true };
    } catch (error) {
      console.error('Erro ao criar rateio:', error);
      return { success: false, error: 'Erro ao criar rateio' };
    }
  };

  return {
    rateios,
    isLoading,
    error,
    createRateio
  };
};
