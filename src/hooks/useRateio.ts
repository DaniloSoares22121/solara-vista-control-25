
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
  tipo: string;
  ultimaFatura: string;
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
    const owner = g.owner as any;
    const plants = g.plants as any[] | null;
    return {
      id: g.id,
      apelido: owner?.razao_social || owner?.nome_completo || 'Geradora sem nome',
      uc: plants?.[0]?.ucGeradora || 'N/A',
      geracao: `${plants?.[0]?.potenciaInstalada || 0} kWp`,
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
    return {
      id: s.id,
      nome: subscriber?.nome_completo || subscriber?.razao_social || 'Assinante sem nome',
      uc: energyAccount?.numero_uc || 'N/A',
      consumo: `${planDetails?.consumo_contratado || 0} kWh`,
      credito: 'N/A',
      tipo: 'N/A',
      ultimaFatura: 'N/A',
    };
  });
};


export const useAssinantesPorGeradoraData = () => {
  const [selectedGeradoraId, setSelectedGeradoraId] = useState<string | undefined>();

  const { data: generators, isLoading: isLoadingGenerators, error: errorGenerators } = useQuery({
    queryKey: ['generatorsForRateio'],
    queryFn: fetchGenerators,
  });

  const { data: subscribers, isLoading: isLoadingSubscribers, error: errorSubscribers } = useQuery({
    queryKey: ['subscribersForGenerator', selectedGeradoraId],
    queryFn: () => fetchSubscribersForGenerator(selectedGeradoraId!),
    enabled: !!selectedGeradoraId,
  });

  return {
    generators: generators || [],
    subscribers: subscribers || [],
    selectedGeradoraId,
    setSelectedGeradoraId,
    isLoadingGenerators,
    isLoadingSubscribers,
    error: errorGenerators || errorSubscribers,
    selectedGeradora: generators?.find(g => g.id === selectedGeradoraId),
  };
};
