
import { useState, useEffect } from 'react';
import { useGenerators } from './useGenerators';
import { useSubscribers } from './useSubscribers';
import { RateioData, RateioGenerator, RateioSubscriber } from '@/types/rateio';
import { toast } from 'sonner';

export const useRateio = () => {
  const [rateios, setRateios] = useState<RateioData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedGenerator, setSelectedGenerator] = useState<RateioGenerator | null>(null);
  const [selectedSubscriber, setSelectedSubscriber] = useState<RateioSubscriber | null>(null);
  const [subscribersByGenerator, setSubscribersByGenerator] = useState<RateioSubscriber[]>([]);
  
  const { generators } = useGenerators();
  const { subscribers } = useSubscribers();

  // Função para buscar assinantes por geradora
  const getSubscribersByGenerator = (generatorId: string): RateioSubscriber[] => {
    // Aqui você implementaria a lógica para buscar assinantes vinculados à geradora
    // Por enquanto, vou simular com dados fake baseados nos assinantes existentes
    return subscribers.slice(0, 3).map((sub, index) => ({
      id: sub.id,
      name: sub.subscriber?.name || 'Nome não informado',
      uc: sub.energyAccount?.originalAccount?.uc || '0000000000',
      contractedConsumption: sub.planContract?.kwhContratado || 0,
      accumulatedCredit: Math.floor(Math.random() * 1000), // Simular crédito acumulado
      percentage: index === 0 ? 70 : index === 1 ? 25 : 5,
      priority: index + 1,
      lastInvoice: `${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}/${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}/2024`
    }));
  };

  // Função para selecionar geradora
  const selectGenerator = (generatorId: string) => {
    const generator = generators.find(g => g.id === generatorId);
    if (generator) {
      const plant = generator.plants?.[0]; // Pegar a primeira usina
      const rateioGenerator: RateioGenerator = {
        id: generator.id,
        nickname: plant?.apelido || generator.owner?.name || 'Geradora',
        uc: plant?.uc || 'UC não informada',
        generation: plant?.geracaoProjetada || 0
      };
      setSelectedGenerator(rateioGenerator);
      
      // Carregar assinantes da geradora
      const subscribers = getSubscribersByGenerator(generatorId);
      setSubscribersByGenerator(subscribers);
      
      return rateioGenerator;
    }
    return null;
  };

  // Função para selecionar assinante
  const selectSubscriber = (subscriberId: string) => {
    const subscriber = subscribers.find(s => s.id === subscriberId);
    if (subscriber) {
      const rateioSubscriber: RateioSubscriber = {
        id: subscriber.id,
        name: subscriber.subscriber?.name || 'Nome não informado',
        uc: subscriber.energyAccount?.originalAccount?.uc || '0000000000',
        contractedConsumption: subscriber.planContract?.kwhContratado || 0,
        accumulatedCredit: Math.floor(Math.random() * 500) // Simular crédito acumulado
      };
      setSelectedSubscriber(rateioSubscriber);
      return rateioSubscriber;
    }
    return null;
  };

  // Função para criar rateio
  const createRateio = async (rateioData: RateioData) => {
    setLoading(true);
    try {
      console.log('🔄 [RATEIO] Criando rateio...', rateioData);
      
      // Validações
      if (rateioData.type === 'percentage') {
        const totalPercentage = rateioData.subscribers.reduce((sum, sub) => sum + (sub.percentage || 0), 0);
        if (Math.abs(totalPercentage - 100) > 0.01) {
          throw new Error('A soma das porcentagens deve ser igual a 100%');
        }
      }
      
      if (rateioData.type === 'priority') {
        const priorities = rateioData.subscribers.map(sub => sub.priority).filter(p => p !== undefined);
        const uniquePriorities = new Set(priorities);
        if (priorities.length !== uniquePriorities.size) {
          throw new Error('Não pode haver prioridades duplicadas');
        }
        
        // Verificar se as prioridades estão em sequência
        const sortedPriorities = [...priorities].sort((a, b) => a! - b!);
        for (let i = 0; i < sortedPriorities.length; i++) {
          if (sortedPriorities[i] !== i + 1) {
            throw new Error('As prioridades devem estar em sequência (1, 2, 3, ...)');
          }
        }
      }
      
      // Simular salvamento
      const newRateio: RateioData = {
        ...rateioData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      setRateios(prev => [newRateio, ...prev]);
      toast.success('Rateio criado com sucesso!');
      
      return newRateio.id;
    } catch (error) {
      console.error('❌ [RATEIO] Erro ao criar rateio:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar histórico de rateios por geradora
  const getRateiosByGenerator = (generatorId: string): RateioData[] => {
    return rateios.filter(r => r.generatorId === generatorId);
  };

  // Reset selections
  const resetSelections = () => {
    setSelectedGenerator(null);
    setSelectedSubscriber(null);
    setSubscribersByGenerator([]);
  };

  return {
    rateios,
    loading,
    selectedGenerator,
    selectedSubscriber,
    subscribersByGenerator,
    generators,
    subscribers,
    selectGenerator,
    selectSubscriber,
    getSubscribersByGenerator,
    createRateio,
    getRateiosByGenerator,
    resetSelections
  };
};
