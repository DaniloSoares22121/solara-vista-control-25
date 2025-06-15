
import { useState, useEffect } from 'react';
import { RateioData, RateioFormData, Geradora, Assinante, VinculoData, RateioValidation } from '@/types/rateio';
import { supabaseRateioService } from '@/services/supabaseRateioService';
import { supabase } from '@/integrations/supabase/client';

export const useRateio = () => {
  const [rateios, setRateios] = useState<RateioData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [geradoras, setGeradoras] = useState<Geradora[]>([]);
  const [assinantes, setAssinantes] = useState<Assinante[]>([]);
  const [vinculos, setVinculos] = useState<VinculoData[]>([]);

  // Carregar dados do Supabase ao montar
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Buscar geradoras
        const { data: generatorsData, error: genErr } = await supabase
          .from('generators')
          .select('*');
        if (genErr) throw new Error('Erro ao buscar geradoras');

        setGeradoras(
          (generatorsData || []).map((g: any) => ({
            id: g.id,
            apelido: g.plants && Array.isArray(g.plants) && g.plants.length > 0 ? g.plants[0].apelido : g.id,
            uc: g.plants && Array.isArray(g.plants) && g.plants.length > 0 ? g.plants[0].uc : '',
            geracao: g.plants && Array.isArray(g.plants) && g.plants.length > 0 ? g.plants[0].geracao : '0 kWh',
            geracaoNumero: g.plants && Array.isArray(g.plants) && g.plants.length > 0 ? Number(g.plants[0].geracaoNumero) : 0,
            percentualAlocado: g.plants && Array.isArray(g.plants) && g.plants.length > 0 ? Number(g.plants[0].percentualAlocado) : 0,
            concessionaria: g.concessionaria || '',
          }))
        );

        // Buscar assinantes
        const { data: subscribersData, error: subErr } = await supabase
          .from('subscribers')
          .select('*');
        if (subErr) throw new Error('Erro ao buscar assinantes');

        setAssinantes(
          (subscribersData || []).map((a: any) => {
            // Tenta extrair os campos do objeto a.subscriber/plan_details/etc
            let nome = '';
            let uc = '';
            let consumoContratado = '';
            let consumoNumero = 0;
            let creditoAcumulado = '';
            let concessionaria = a.concessionaria || '';
            // muitos campos costumam vir "dentro" do json subscriber ou plan_details...
            if (a.subscriber && typeof a.subscriber === 'object') {
              nome = a.subscriber.nome || '';
              uc = a.subscriber.uc || '';
            }
            if (a.plan_details && typeof a.plan_details === 'object') {
              consumoContratado = a.plan_details.consumoContratado || '';
              consumoNumero = Number(a.plan_details.consumoNumero) || 0;
            }
            if (a.energy_account && typeof a.energy_account === 'object') {
              creditoAcumulado = a.energy_account.creditoAcumulado || '';
            }
            return {
              id: a.id,
              nome: nome,
              uc: uc,
              consumoContratado,
              consumoNumero,
              creditoAcumulado,
              concessionaria,
            };
          })
        );

        // Vinculos: neste exemplo, sem endpoint específico para a relação, deixo vazio
        setVinculos([]);

        // Rateios do banco
        const rateiosFromDb = await supabaseRateioService.getRateios();
        setRateios(rateiosFromDb);

        setError(null);
      } catch (err) {
        setError('Erro ao carregar dados do Supabase');
        setGeradoras([]);
        setAssinantes([]);
        setVinculos([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getGeradoras = () => geradoras;
  const getAssinantes = () => assinantes;

  // Retorna os assinantes já vinculados (mock minimizado: não há vinculos RDB no banco, só rateios prévios)
  const getAssinantesVinculados = (geradoraId: string) => {
    // Sugestão: usar rateios existentes para sugerir últimos vínculos
    const rateioParaGeradora = rateios.find(r => r.geradoraId === geradoraId);
    if (rateioParaGeradora && rateioParaGeradora.assinantes.length) {
      return rateioParaGeradora.assinantes.map(item => ({
        assinanteId: item.assinanteId,
        nome: item.nome,
        uc: item.uc,
        consumoNumero: item.consumoNumero,
        porcentagem: item.porcentagem,
        prioridade: item.prioridade,
        isNew: false,
      }));
    }
    return [];
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
      const prioridades = rateioItems.map(item => item.prioridade).filter(p => p !== undefined).sort((a, b) => a - b);
      for (let i = 0; i < prioridades.length; i++) {
        if (prioridades[i] !== i + 1) {
          errors.push("As prioridades devem ser sequenciais (1, 2, 3...)");
          break;
        }
      }
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
