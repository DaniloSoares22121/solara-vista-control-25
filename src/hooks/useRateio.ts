
import { useState, useEffect } from 'react';
import { RateioData, RateioSubscriber, RateioGenerator } from '@/types/rateio';

export const useRateio = () => {
  const [rateios, setRateios] = useState<RateioData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenerator, setSelectedGenerator] = useState<RateioGenerator | null>(null);
  const [selectedSubscriber, setSelectedSubscriber] = useState<RateioSubscriber | null>(null);
  const [subscribersByGenerator, setSubscribersByGenerator] = useState<RateioSubscriber[]>([]);
  const [generators, setGenerators] = useState<RateioGenerator[]>([]);
  const [subscribers, setSubscribers] = useState<RateioSubscriber[]>([]);
  const [loading, setLoading] = useState(false);

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

  const selectGenerator = (generator: RateioGenerator) => {
    setSelectedGenerator(generator);
  };

  const selectSubscriber = (subscriber: RateioSubscriber) => {
    setSelectedSubscriber(subscriber);
  };

  const getRateiosByGenerator = (generatorId: string) => {
    return rateios.filter(rateio => rateio.generatorId === generatorId);
  };

  const resetSelections = () => {
    setSelectedGenerator(null);
    setSelectedSubscriber(null);
    setSubscribersByGenerator([]);
  };

  const validateRateio = (data: any) => {
    // Implementar validação
    return { isValid: true, errors: [], warnings: [] };
  };

  const calculateAutoDistribution = (subscribers: RateioSubscriber[], totalGeneration: number) => {
    // Implementar cálculo automático
    return subscribers.map(sub => ({
      ...sub,
      allocatedEnergy: totalGeneration / subscribers.length
    }));
  };

  return {
    rateios,
    isLoading,
    error,
    selectedGenerator,
    selectedSubscriber,
    subscribersByGenerator,
    generators,
    subscribers,
    loading,
    createRateio,
    selectGenerator,
    selectSubscriber,
    getRateiosByGenerator,
    resetSelections,
    validateRateio,
    calculateAutoDistribution
  };
};
