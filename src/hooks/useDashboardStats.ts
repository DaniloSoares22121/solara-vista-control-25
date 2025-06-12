
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalFaturas: number;
  valorTotal: number;
  totalAssinantes: number;
  totalGeradoras: number;
  faturasPendentes: number;
  faturasProcessadas: number;
  faturasEmitidas: number;
  faturasPagas: number;
  recentFaturas: any[];
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalFaturas: 0,
    valorTotal: 0,
    totalAssinantes: 0,
    totalGeradoras: 0,
    faturasPendentes: 0,
    faturasProcessadas: 0,
    faturasEmitidas: 0,
    faturasPagas: 0,
    recentFaturas: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        console.log('Buscando estatísticas do dashboard...');

        // Buscar total de assinantes
        const { data: subscribers, error: subscribersError } = await supabase
          .from('subscribers')
          .select('id, status');

        if (subscribersError) {
          console.error('Erro ao buscar assinantes:', subscribersError);
          throw subscribersError;
        }

        // Buscar total de geradoras
        const { data: generators, error: generatorsError } = await supabase
          .from('generators')
          .select('id, status');

        if (generatorsError) {
          console.error('Erro ao buscar geradoras:', generatorsError);
          throw generatorsError;
        }

        // Buscar faturas em validação (apenas pendentes e rejeitadas aparecem aqui)
        const { data: faturasValidacao, error: validacaoError } = await supabase
          .from('faturas_validacao')
          .select('id, status');

        if (validacaoError) {
          console.error('Erro ao buscar faturas em validação:', validacaoError);
          throw validacaoError;
        }

        // Buscar faturas emitidas
        const { data: faturasEmitidas, error: emitidasError } = await supabase
          .from('faturas_emitidas')
          .select('id, status_pagamento, valor_total, created_at, numero_fatura, uc')
          .order('created_at', { ascending: false })
          .limit(10);

        if (emitidasError) {
          console.error('Erro ao buscar faturas emitidas:', emitidasError);
          throw emitidasError;
        }

        // Calcular estatísticas
        const totalAssinantes = subscribers?.length || 0;
        const totalGeradoras = generators?.length || 0;
        
        // Contar faturas por status nas validações
        const faturasPendentes = faturasValidacao?.filter(f => f.status === 'pendente').length || 0;
        const faturasRejeitadas = faturasValidacao?.filter(f => f.status === 'rejeitada').length || 0;
        
        // Faturas emitidas (são as aprovadas)
        const totalFaturasEmitidas = faturasEmitidas?.length || 0;
        const faturasPagas = faturasEmitidas?.filter(f => f.status_pagamento === 'pago').length || 0;
        
        // Calcular valor total das faturas emitidas
        const valorTotal = faturasEmitidas?.reduce((total, fatura) => {
          return total + (Number(fatura.valor_total) || 0);
        }, 0) || 0;

        // Total geral de faturas (validação + emitidas)
        const totalFaturas = (faturasValidacao?.length || 0) + totalFaturasEmitidas;

        console.log('Estatísticas calculadas:', {
          totalAssinantes,
          totalGeradoras,
          faturasPendentes,
          faturasRejeitadas,
          totalFaturasEmitidas,
          faturasPagas,
          valorTotal,
          totalFaturas
        });

        setStats({
          totalFaturas,
          valorTotal,
          totalAssinantes,
          totalGeradoras,
          faturasPendentes,
          faturasProcessadas: totalFaturasEmitidas, // Faturas emitidas = processadas (aprovadas)
          faturasEmitidas: totalFaturasEmitidas,
          faturasPagas,
          recentFaturas: faturasEmitidas || []
        });

        setError(null);
      } catch (err) {
        console.error('Erro ao buscar estatísticas:', err);
        setError('Erro ao carregar dados do dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, isLoading, error };
};
