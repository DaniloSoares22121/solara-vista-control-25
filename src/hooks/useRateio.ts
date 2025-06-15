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

const fetchSubscribersForGenerator = async (generatorId: string): Promise<RateioSubscriber[]> => {
  const { data, error } = await supabase
    .from('subscribers')
    .select('id, subscriber, energy_account, plan_details')
    .eq('plan_details->>generatorId', generatorId);

  if (error) {
    console.error('Error fetching subscribers:', error);
    throw new Error('Não foi possível buscar os assinantes.');
  }

  if (!data) return [];

  return data.map(s => {
    const subscriber = s.subscriber as any;
    const energyAccount = s.energy_account as any;
    const planDetails = s.plan_details as any;

    let rateioDisplay = 'N/A';
    // Assuming plan_details contains rateio information
    if (planDetails?.rateio_tipo && planDetails?.rateio_valor) {
        if (planDetails.rateio_tipo === 'porcentagem') {
            rateioDisplay = `${planDetails.rateio_valor}%`;
        } else if (planDetails.rateio_tipo === 'prioridade') {
            rateioDisplay = `Prioridade ${planDetails.rateio_valor}`;
        }
    }

    return {
      id: s.id,
      nome: subscriber?.nome_completo || subscriber?.razao_social || 'Assinante sem nome',
      uc: energyAccount?.numero_uc || 'N/A',
      consumo: `${planDetails?.consumo_contratado || 0} kWh`,
      credito: 'N/A', // Data source to be defined
      rateio: rateioDisplay,
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

export const useRateioSubscribers = (generatorId?: string) => {
    return useQuery({
        queryKey: ['subscribersForGenerator', generatorId],
        queryFn: () => fetchSubscribersForGenerator(generatorId!),
        enabled: !!generatorId,
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
