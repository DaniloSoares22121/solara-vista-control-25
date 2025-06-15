
import { useState, useEffect } from 'react';
import { RateioData, RateioFormData, Geradora, Assinante, VinculoData, RateioValidation } from '@/types/rateio';
import { supabaseRateioService } from '@/services/supabaseRateioService';

export const useRateio = () => {
  const [rateios, setRateios] = useState<RateioData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dados mockados para desenvolvimento
  const [geradoras] = useState<Geradora[]>([
    {
      id: "ger1",
      apelido: "Solar Fazenda Norte",
      uc: "12345678",
      geracao: "15.000 kWh",
      geracaoNumero: 15000,
      percentualAlocado: 75.5,
      concessionaria: "CEMIG"
    },
    {
      id: "ger2", 
      apelido: "Solar Rio Verde",
      uc: "87654321",
      geracao: "8.500 kWh",
      geracaoNumero: 8500,
      percentualAlocado: 45.0,
      concessionaria: "CPFL"
    }
  ]);

  const [assinantes] = useState<Assinante[]>([
    {
      id: "ass1",
      nome: "João Silva",
      uc: "11111111",
      consumoContratado: "500 kWh",
      consumoNumero: 500,
      creditoAcumulado: "100 kWh",
      concessionaria: "CEMIG"
    },
    {
      id: "ass2",
      nome: "Maria Santos", 
      uc: "22222222",
      consumoContratado: "300 kWh",
      consumoNumero: 300,
      creditoAcumulado: "50 kWh",
      concessionaria: "CEMIG"
    },
    {
      id: "ass3",
      nome: "Carlos Oliveira",
      uc: "33333333", 
      consumoContratado: "800 kWh",
      consumoNumero: 800,
      creditoAcumulado: "200 kWh",
      concessionaria: "CPFL"
    }
  ]);

  const [vinculos] = useState<VinculoData[]>([
    {
      geradoraId: "ger1",
      assinanteId: "ass1",
      tipoRateio: "porcentagem",
      valorRateio: 50,
      percentualAlocacao: 50,
      status: "ativo"
    },
    {
      geradoraId: "ger1", 
      assinanteId: "ass2",
      tipoRateio: "porcentagem",
      valorRateio: 25.5,
      percentualAlocacao: 25.5,
      status: "ativo"
    }
  ]);

  useEffect(() => {
    const loadRateios = async () => {
      try {
        setIsLoading(true);
        console.log('🔄 [RATEIO] Carregando rateios do banco...');
        const data = await supabaseRateioService.getRateios();
        setRateios(data);
        setError(null);
        console.log('✅ [RATEIO] Rateios carregados:', data.length);
      } catch (err) {
        console.error('❌ [RATEIO] Erro ao carregar rateios:', err);
        setError('Erro ao carregar rateios');
      } finally {
        setIsLoading(false);
      }
    };

    loadRateios();
  }, []);

  const getGeradoras = () => geradoras;
  
  const getAssinantes = () => assinantes;

  const getAssinantesVinculados = (geradoraId: string) => {
    const vinculosAtivos = vinculos.filter(v => v.geradoraId === geradoraId && v.status === "ativo");
    return vinculosAtivos.map(vinculo => {
      const assinante = assinantes.find(a => a.id === vinculo.assinanteId);
      if (!assinante) return null;
      
      return {
        assinanteId: assinante.id,
        nome: assinante.nome,
        uc: assinante.uc,
        consumoNumero: assinante.consumoNumero,
        porcentagem: vinculo.tipoRateio === "porcentagem" ? vinculo.valorRateio : undefined,
        prioridade: vinculo.tipoRateio === "prioridade" ? vinculo.valorRateio : undefined,
        isNew: false
      };
    }).filter(Boolean);
  };

  const validateRateio = (
    rateioItems: any[], 
    tipoRateio: "porcentagem" | "prioridade",
    geracaoEsperada: number
  ): RateioValidation => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (tipoRateio === "porcentagem") {
      const totalPercentual = rateioItems.reduce((sum, item) => sum + (item.porcentagem || 0), 0);
      
      if (totalPercentual > 100) {
        errors.push(`Total de ${totalPercentual.toFixed(1)}% excede 100%. Ajuste as porcentagens.`);
      }
      
      if (totalPercentual < 50) {
        warnings.push(`Apenas ${totalPercentual.toFixed(1)}% da energia será distribuída. Considere adicionar mais assinantes.`);
      }

      const energiaSobra = geracaoEsperada * (100 - totalPercentual) / 100;
      
      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        totalPercentual,
        energiaSobra
      };
    } else {
      // Validação para rateio por prioridade
      const prioridades = rateioItems.map(item => item.prioridade).filter(p => p !== undefined).sort((a, b) => a - b);
      
      // Verificar sequência
      for (let i = 0; i < prioridades.length; i++) {
        if (prioridades[i] !== i + 1) {
          errors.push("As prioridades devem ser sequenciais (1, 2, 3...)");
          break;
        }
      }

      // Verificar duplicatas
      const prioridadeSet = new Set(prioridades);
      if (prioridadeSet.size !== prioridades.length) {
        errors.push("Não pode haver prioridades duplicadas");
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };
    }
  };

  const calculateDistribuicao = (
    rateioItems: any[],
    tipoRateio: "porcentagem" | "prioridade", 
    geracaoEsperada: number
  ) => {
    if (tipoRateio === "porcentagem") {
      return rateioItems.map(item => ({
        ...item,
        valorAlocado: Math.round(geracaoEsperada * (item.porcentagem || 0) / 100)
      }));
    } else {
      // Rateio por prioridade - distribuir sequencialmente
      const itemsOrdenados = [...rateioItems].sort((a, b) => (a.prioridade || 0) - (b.prioridade || 0));
      let energiaRestante = geracaoEsperada;
      
      return itemsOrdenados.map(item => {
        const valorAlocado = Math.min(item.consumoNumero, energiaRestante);
        energiaRestante -= valorAlocado;
        
        return {
          ...item,
          valorAlocado
        };
      });
    }
  };

  const createRateio = async (data: RateioFormData) => {
    try {
      console.log('📊 [RATEIO] Criando rateio:', data);
      
      const validation = validateRateio(
        data.rateioItems, 
        data.configuracao.tipoRateio,
        data.configuracao.geracaoEsperada
      );
      
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      const rateioCalculado = calculateDistribuicao(
        data.rateioItems,
        data.configuracao.tipoRateio,
        data.configuracao.geracaoEsperada
      );

      const formDataWithCalculations = {
        ...data,
        rateioItems: rateioCalculado
      };

      const result = await supabaseRateioService.createRateio(formDataWithCalculations);
      
      if (result.success && result.data) {
        setRateios(prev => [result.data!, ...prev]);
      }
      
      return result;
    } catch (error) {
      console.error('❌ [RATEIO] Erro ao criar rateio:', error);
      return { success: false, error: 'Erro ao criar rateio' };
    }
  };

  return {
    rateios,
    isLoading,
    error,
    createRateio,
    getGeradoras,
    getAssinantes,
    getAssinantesVinculados,
    validateRateio,
    calculateDistribuicao
  };
};
