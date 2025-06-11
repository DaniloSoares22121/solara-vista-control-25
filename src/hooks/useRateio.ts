
import { useState, useEffect, useCallback } from 'react';
import { useGenerators } from './useGenerators';
import { useSubscribers } from './useSubscribers';
import { RateioData, RateioGenerator, RateioSubscriber, RateioCalculation, RateioValidation } from '@/types/rateio';
import { toast } from 'sonner';

export const useRateio = () => {
  const [rateios, setRateios] = useState<RateioData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedGenerator, setSelectedGenerator] = useState<RateioGenerator | null>(null);
  const [selectedSubscriber, setSelectedSubscriber] = useState<RateioSubscriber | null>(null);
  const [subscribersByGenerator, setSubscribersByGenerator] = useState<RateioSubscriber[]>([]);
  const [currentRateio, setCurrentRateio] = useState<RateioData | null>(null);
  
  const { generators } = useGenerators();
  const { subscribers } = useSubscribers();

  // Simular dados de assinantes por geradora com mais realismo
  const getSubscribersByGenerator = useCallback((generatorId: string): RateioSubscriber[] => {
    const baseSubscribers = subscribers.slice(0, Math.floor(Math.random() * 5) + 2);
    
    return baseSubscribers.map((sub, index) => {
      const consumption = sub.planContract?.kwhContratado || Math.floor(Math.random() * 10000) + 1000;
      const credit = Math.floor(Math.random() * 2000);
      
      return {
        id: sub.id,
        name: sub.subscriber?.name || `Assinante ${index + 1}`,
        uc: sub.energyAccount?.originalAccount?.uc || `${String(Math.floor(Math.random() * 9000000000) + 1000000000)}`,
        contractedConsumption: consumption,
        accumulatedCredit: credit,
        percentage: undefined,
        priority: undefined,
        lastInvoice: `${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}/${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}/2024`,
        allocatedEnergy: 0,
        creditUsed: 0,
        remainingCredit: credit
      };
    });
  }, [subscribers]);

  // Calcular distribuição automática baseada no consumo
  const calculateAutoDistribution = useCallback((
    subscribers: RateioSubscriber[], 
    type: 'percentage' | 'priority',
    totalGeneration: number
  ): RateioSubscriber[] => {
    if (subscribers.length === 0) return [];

    const totalConsumption = subscribers.reduce((sum, sub) => sum + sub.contractedConsumption, 0);
    
    return subscribers.map((subscriber, index) => {
      if (type === 'percentage') {
        const percentage = totalConsumption > 0 
          ? Math.round((subscriber.contractedConsumption / totalConsumption) * 100 * 100) / 100
          : Math.round(100 / subscribers.length * 100) / 100;
        
        const allocatedEnergy = Math.round((percentage / 100) * totalGeneration);
        const creditUsed = Math.min(subscriber.accumulatedCredit, allocatedEnergy);
        
        return {
          ...subscriber,
          percentage,
          priority: undefined,
          allocatedEnergy,
          creditUsed,
          remainingCredit: subscriber.accumulatedCredit - creditUsed
        };
      } else {
        const priority = index + 1;
        return {
          ...subscriber,
          percentage: undefined,
          priority,
          allocatedEnergy: 0,
          creditUsed: 0,
          remainingCredit: subscriber.accumulatedCredit
        };
      }
    });
  }, []);

  // Validação avançada do rateio
  const validateRateio = useCallback((subscribers: RateioSubscriber[], type: 'percentage' | 'priority'): RateioValidation => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (subscribers.length === 0) {
      errors.push('Nenhum assinante foi adicionado ao rateio');
      return { isValid: false, errors, warnings };
    }

    if (type === 'percentage') {
      const total = subscribers.reduce((sum, sub) => sum + (sub.percentage || 0), 0);
      const diff = Math.abs(total - 100);
      
      if (diff > 0.01) {
        errors.push(`A soma das porcentagens deve ser 100%. Atual: ${total.toFixed(2)}%`);
      }
      
      const zeroPercentage = subscribers.filter(sub => (sub.percentage || 0) === 0);
      if (zeroPercentage.length > 0) {
        warnings.push(`${zeroPercentage.length} assinante(s) com 0% de participação`);
      }
      
      const highPercentage = subscribers.filter(sub => (sub.percentage || 0) > 80);
      if (highPercentage.length > 0) {
        warnings.push(`Assinante com participação muito alta (>80%): ${highPercentage.map(s => s.name).join(', ')}`);
      }
    }

    if (type === 'priority') {
      const priorities = subscribers.map(sub => sub.priority).filter(p => p !== undefined);
      const uniquePriorities = new Set(priorities);
      
      if (priorities.length !== uniquePriorities.size) {
        errors.push('Existem prioridades duplicadas');
      }
      
      const sortedPriorities = [...priorities].sort((a, b) => a! - b!);
      for (let i = 0; i < sortedPriorities.length; i++) {
        if (sortedPriorities[i] !== i + 1) {
          errors.push('As prioridades devem estar em sequência (1, 2, 3, ...)');
          break;
        }
      }
      
      if (subscribers.some(sub => !sub.priority || sub.priority < 1)) {
        errors.push('Todas as prioridades devem ser números positivos');
      }
    }

    // Validações gerais
    const invalidUCs = subscribers.filter(sub => !sub.uc || sub.uc.length < 10);
    if (invalidUCs.length > 0) {
      warnings.push(`${invalidUCs.length} assinante(s) com UC inválida`);
    }

    const lowConsumption = subscribers.filter(sub => sub.contractedConsumption < 100);
    if (lowConsumption.length > 0) {
      warnings.push(`${lowConsumption.length} assinante(s) com consumo muito baixo (<100 kWh)`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }, []);

  // Calcular distribuição por prioridade
  const calculatePriorityDistribution = useCallback((
    subscribers: RateioSubscriber[], 
    totalGeneration: number
  ): RateioSubscriber[] => {
    const sortedSubscribers = [...subscribers].sort((a, b) => (a.priority || 0) - (b.priority || 0));
    let remainingGeneration = totalGeneration;
    
    return sortedSubscribers.map(subscriber => {
      const needed = Math.max(0, subscriber.contractedConsumption - subscriber.accumulatedCredit);
      const allocated = Math.min(needed, remainingGeneration);
      const creditUsed = Math.min(subscriber.accumulatedCredit, subscriber.contractedConsumption);
      
      remainingGeneration -= allocated;
      
      return {
        ...subscriber,
        allocatedEnergy: allocated,
        creditUsed,
        remainingCredit: subscriber.accumulatedCredit - creditUsed
      };
    });
  }, []);

  // Função para selecionar geradora
  const selectGenerator = useCallback((generatorId: string) => {
    const generator = generators.find(g => g.id === generatorId);
    if (generator) {
      const plant = generator.plants?.[0];
      const rateioGenerator: RateioGenerator = {
        id: generator.id,
        nickname: plant?.apelido || generator.owner?.name || 'Geradora',
        uc: plant?.uc || 'UC não informada',
        generation: plant?.geracaoProjetada || 0,
        ownerName: generator.owner?.name,
        status: generator.status === 'active' ? 'active' : 'inactive'
      };
      setSelectedGenerator(rateioGenerator);
      
      const subscribers = getSubscribersByGenerator(generatorId);
      setSubscribersByGenerator(subscribers);
      
      return rateioGenerator;
    }
    return null;
  }, [generators, getSubscribersByGenerator]);

  // Função para selecionar assinante
  const selectSubscriber = useCallback((subscriberId: string) => {
    const subscriber = subscribers.find(s => s.id === subscriberId);
    if (subscriber) {
      const rateioSubscriber: RateioSubscriber = {
        id: subscriber.id,
        name: subscriber.subscriber?.name || 'Nome não informado',
        uc: subscriber.energyAccount?.originalAccount?.uc || '0000000000',
        contractedConsumption: subscriber.planContract?.kwhContratado || 0,
        accumulatedCredit: Math.floor(Math.random() * 500),
        lastInvoice: `${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}/${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}/2024`
      };
      setSelectedSubscriber(rateioSubscriber);
      return rateioSubscriber;
    }
    return null;
  }, [subscribers]);

  // Função para criar rateio
  const createRateio = useCallback(async (rateioData: RateioData) => {
    setLoading(true);
    try {
      console.log('🔄 [RATEIO] Criando rateio...', rateioData);
      
      const validation = validateRateio(rateioData.subscribers, rateioData.type);
      if (!validation.isValid) {
        throw new Error(validation.errors.join('; '));
      }
      
      // Calcular distribuições finais
      let finalSubscribers = rateioData.subscribers;
      if (rateioData.type === 'priority') {
        finalSubscribers = calculatePriorityDistribution(rateioData.subscribers, rateioData.expectedGeneration);
      }
      
      const newRateio: RateioData = {
        ...rateioData,
        id: Date.now().toString(),
        subscribers: finalSubscribers,
        status: 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setRateios(prev => [newRateio, ...prev]);
      setCurrentRateio(newRateio);
      
      if (validation.warnings.length > 0) {
        toast.warning(`Rateio criado com avisos: ${validation.warnings.join('; ')}`);
      } else {
        toast.success('Rateio criado com sucesso!');
      }
      
      return newRateio.id;
    } catch (error) {
      console.error('❌ [RATEIO] Erro ao criar rateio:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [validateRateio, calculatePriorityDistribution]);

  // Buscar histórico de rateios por geradora
  const getRateiosByGenerator = useCallback((generatorId: string): RateioData[] => {
    return rateios.filter(r => r.generatorId === generatorId);
  }, [rateios]);

  // Reset selections
  const resetSelections = useCallback(() => {
    setSelectedGenerator(null);
    setSelectedSubscriber(null);
    setSubscribersByGenerator([]);
    setCurrentRateio(null);
  }, []);

  // Atualizar rateio existente
  const updateRateio = useCallback(async (rateioId: string, updates: Partial<RateioData>) => {
    setLoading(true);
    try {
      setRateios(prev => prev.map(r => 
        r.id === rateioId 
          ? { ...r, ...updates, updatedAt: new Date().toISOString() }
          : r
      ));
      toast.success('Rateio atualizado com sucesso!');
    } catch (error) {
      console.error('❌ [RATEIO] Erro ao atualizar rateio:', error);
      toast.error('Erro ao atualizar rateio');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Excluir rateio
  const deleteRateio = useCallback(async (rateioId: string) => {
    setLoading(true);
    try {
      setRateios(prev => prev.filter(r => r.id !== rateioId));
      toast.success('Rateio excluído com sucesso!');
    } catch (error) {
      console.error('❌ [RATEIO] Erro ao excluir rateio:', error);
      toast.error('Erro ao excluir rateio');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    rateios,
    loading,
    selectedGenerator,
    selectedSubscriber,
    subscribersByGenerator,
    currentRateio,
    generators,
    subscribers,
    selectGenerator,
    selectSubscriber,
    getSubscribersByGenerator,
    createRateio,
    updateRateio,
    deleteRateio,
    getRateiosByGenerator,
    resetSelections,
    validateRateio,
    calculateAutoDistribution,
    calculatePriorityDistribution
  };
};
