
import { supabase } from "@/integrations/supabase/client";

interface AssinanteParaRateio {
  subscriber_id: string;
  valor: string;
}

export const rateioService = {
  async cadastrarRateio({
    geradoraId,
    tipoRateio,
    dataRateio,
    assinantes,
  }: {
    geradoraId: string;
    tipoRateio: "porcentagem" | "prioridade";
    dataRateio: string;
    assinantes: AssinanteParaRateio[];
  }) {
    // 1. Cria o registro do rateio
    const { data: rateio, error: errRateio } = await (supabase as any)
      .from('rateios')
      .insert({
        geradora_id: geradoraId,
        tipo_rateio: tipoRateio,
        data_rateio: dataRateio,
        status: 'pendente',
      })
      .select()
      .single();

    if (errRateio || !rateio?.id) throw new Error("Erro ao cadastrar rateio");

    // 2. Cria os vínculos com assinantes (supondo existe tabela rateio_assinantes)
    for (const assinante of assinantes) {
      const { error: errVinculo } = await (supabase as any)
        .from('rateio_assinantes')
        .insert({
          rateio_id: rateio.id,
          subscriber_id: assinante.subscriber_id,
          valor: assinante.valor,
        });
      if (errVinculo) throw new Error("Erro ao vincular assinante");
    }

    return rateio;
  }
};
