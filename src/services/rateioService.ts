
import { supabase } from "@/integrations/supabase/client";

export const rateioService = {
  async cadastrarRateio({
    geradora,
    tipoRateio,
    dataRateio,
    assinantes,
  }: {
    geradora: { id: string; apelido: string; uc: string; geracao: string };
    tipoRateio: "porcentagem" | "prioridade";
    dataRateio: string;
    assinantes: { id: string; nome: string; uc: string; valor: string }[];
  }) {
    // 1. Criar registro de rateio em 'rateios'
    const { data: rateio, error: errRateio } = await (supabase as any)
      .from('rateios')
      .insert({
        geradora_id: geradora.id,
        geradora_nome: geradora.apelido,
        geradora_uc: geradora.uc,
        data_rateio: dataRateio,
        tipo_rateio: tipoRateio,
        geracao_esperada: Number(geradora.geracao?.split(" ")[0]) || 0,
        status: 'pending',
      })
      .select()
      .single();

    if (errRateio || !rateio?.id) throw new Error("Erro ao cadastrar rateio em rateios");

    // 2. Criar um item em rateio_items para cada assinante
    for (const assinante of assinantes) {
      const { error: errItem } = await (supabase as any)
        .from('rateio_items')
        .insert({
          rateio_id: rateio.id,
          assinante_id: assinante.id,
          assinante_nome: assinante.nome,
          assinante_uc: assinante.uc,
          porcentagem: tipoRateio === "porcentagem" ? Number(assinante.valor) : null,
          prioridade: tipoRateio === "prioridade" ? Number(assinante.valor) : null,
        });
      if (errItem) throw new Error("Erro ao adicionar item do rateio");
    }
    return rateio;
  }
};
