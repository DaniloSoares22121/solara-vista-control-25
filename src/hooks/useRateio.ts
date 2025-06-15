
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface RateioGenerator {
  id: string;
  apelido: string;
  uc: string;
  geracao: string;
}

export interface RateioSubscriber {
  id:string;
  nome: string;
  uc: string;
  consumo: string;
  credito: string;
  rateio: string;
  ultimaFatura: string;
}

export interface RateioHistoryItem {
    id: string;
    data_rateio: string;
    tipo_rateio: string;
    status: string;
    total_distribuido: number;
}

const fetchGenerators = async (): Promise<RateioGenerator[]> => {
  const { data, error } = await supabase
    .from('generators')
    .select('id, owner, plants');

  if (error) {
    console.error('Error fetching generators:', error);
    throw new Error('Não foi possível buscar as geradoras.');
  }

  if (!data) return [];

  return data.map(g => {
    const plants = g.plants as any[] | null;
    // Busca o apelido da primeira planta cadastrada, se houver.
    return {
      id: g.id,
      apelido: plants?.[0]?.apelido || 'Sem apelido',
      uc: plants?.[0]?.uc || 'N/A',
      geracao: plants?.[0]?.geracaoProjetada
        ? `${plants[0].geracaoProjetada} kWh/mês`
        : plants?.[0]?.potenciaInstalada
        ? `${plants[0].potenciaInstalada} kWp`
        : 'N/A',
    };
  });
};

// Função corrigida para buscar todos os assinantes com dados corretos
const fetchAllSubscribers = async (): Promise<RateioSubscriber[]> => {
  const { data, error } = await supabase
    .from('subscribers')
    .select('id, subscriber, energy_account, plan_contract');

  if (error) {
    console.error('Error fetching subscribers:', error);
    throw new Error('Não foi possível buscar os assinantes.');
  }

  if (!data) return [];

  console.log('Raw subscriber data:', data);

  return data.map(s => {
    const subscriber = s.subscriber as any;
    const energyAccount = s.energy_account as any;
    const planContract = s.plan_contract as any;

    console.log('Processing subscriber:', { subscriber, energyAccount, planContract });

    // Extrai o nome do assinante (pessoa física ou jurídica)
    let nome = 'Nome não informado';
    if (subscriber?.nome_completo) {
      nome = subscriber.nome_completo;
    } else if (subscriber?.fullName) {
      nome = subscriber.fullName;
    } else if (subscriber?.razao_social) {
      nome = subscriber.razao_social;
    } else if (subscriber?.companyName) {
      nome = subscriber.companyName;
    }

    // Extrai a UC
    let uc = 'N/A';
    if (energyAccount?.numero_uc) {
      uc = energyAccount.numero_uc;
    } else if (energyAccount?.uc) {
      uc = energyAccount.uc;
    }

    // Extrai o consumo contratado
    let consumo = 'N/A';
    if (planContract?.consumo_contratado) {
      consumo = `${planContract.consumo_contratado} kWh`;
    } else if (planContract?.contractedKwh) {
      consumo = `${planContract.contractedKwh} kWh`;
    } else if (planContract?.informedKwh) {
      consumo = `${planContract.informedKwh} kWh`;
    }

    return {
      id: s.id,
      nome,
      uc,
      consumo,
      credito: 'N/A', // Data source to be defined
      rateio: 'A definir',
      ultimaFatura: 'N/A', // Data source to be defined
    };
  });
};

const fetchRateioHistoryForGenerator = async (generatorId: string): Promise<RateioHistoryItem[]> => {
    // The error is because Supabase types might not be updated yet. We use `as any` as a workaround.
    const { data, error } = await (supabase as any).from('rateios')
        .select('id, data_rateio, tipo_rateio, status, total_distribuido')
        .eq('geradora_id', generatorId)
        .order('data_rateio', { ascending: false });

    if (error) {
        console.error('Error fetching rateio history:', error);
        throw new Error('Não foi possível buscar o histórico de rateios.');
    }

    return data || [];
};

export const useRateioGenerators = () => {
    return useQuery({
        queryKey: ['generatorsForRateio'],
        queryFn: fetchGenerators,
    });
}

export const useRateioSubscribers = () => {
    return useQuery({
        queryKey: ['allSubscribersForRateio'],
        queryFn: fetchAllSubscribers,
    });
}

export const useHistoricoRateiosData = (generatorId?: string) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['rateioHistory', generatorId],
        queryFn: () => fetchRateioHistoryForGenerator(generatorId!),
        enabled: !!generatorId,
    });

    return {
        historico: data || [],
        isLoading,
        error,
    };
};
