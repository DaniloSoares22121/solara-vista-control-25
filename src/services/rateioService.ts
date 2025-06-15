
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
    console.log('Cadastrando rateio:', { geradora, tipoRateio, dataRateio, assinantes });
    
    // Calcular total distribuído
    const totalDistribuido = assinantes.reduce((acc, curr) => {
      return acc + Number(curr.valor);
    }, 0);

    // 1. Criar registro principal de rateio
    const { data: rateio, error: errRateio } = await (supabase as any)
      .from('rateios')
      .insert({
        geradora_id: geradora.id,
        data_rateio: dataRateio,
        tipo_rateio: tipoRateio,
        status: 'ativo',
        total_distribuido: totalDistribuido,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (errRateio) {
      console.error('Erro ao cadastrar rateio:', errRateio);
      throw new Error("Erro ao cadastrar rateio principal");
    }

    console.log('Rateio criado:', rateio);

    // 2. Criar itens do rateio para cada assinante
    const rateioItems = assinantes.map(assinante => ({
      rateio_id: rateio.id,
      assinante_id: assinante.id,
      assinante_nome: assinante.nome,
      assinante_uc: assinante.uc,
      porcentagem: tipoRateio === "porcentagem" ? Number(assinante.valor) : null,
      prioridade: tipoRateio === "prioridade" ? Number(assinante.valor) : null,
      created_at: new Date().toISOString(),
    }));

    const { error: errItems } = await (supabase as any)
      .from('rateio_items')
      .insert(rateioItems);

    if (errItems) {
      console.error('Erro ao cadastrar itens do rateio:', errItems);
      // Se falhar ao inserir itens, remove o rateio principal
      await (supabase as any).from('rateios').delete().eq('id', rateio.id);
      throw new Error("Erro ao cadastrar itens do rateio");
    }

    console.log('Rateio cadastrado com sucesso:', rateio.id);
    return rateio;
  }
};
