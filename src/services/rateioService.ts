
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
    console.log('🔄 Iniciando cadastro de rateio:', { geradora, tipoRateio, dataRateio, assinantes });
    
    // Obter o usuário atual
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('❌ Erro de autenticação:', userError);
      throw new Error("Usuário não autenticado");
    }
    
    console.log('✅ Usuário autenticado:', user.id);
    
    // Calcular total distribuído
    const totalDistribuido = assinantes.reduce((acc, curr) => {
      return acc + Number(curr.valor);
    }, 0);

    console.log('📊 Total distribuído calculado:', totalDistribuido);

    // 1. Criar registro principal de rateio
    const rateioData = {
      user_id: user.id,
      geradora_id: geradora.id,
      geradora_nome: geradora.apelido,
      geradora_uc: geradora.uc,
      data_rateio: dataRateio,
      tipo_rateio: tipoRateio,
      status: 'ativo',
      total_distribuido: totalDistribuido,
      created_at: new Date().toISOString(),
    };

    console.log('📝 Dados do rateio a serem inseridos:', rateioData);

    const { data: rateio, error: errRateio } = await supabase
      .from('rateios')
      .insert(rateioData)
      .select()
      .single();

    if (errRateio) {
      console.error('❌ Erro detalhado ao cadastrar rateio:', {
        error: errRateio,
        code: errRateio.code,
        message: errRateio.message,
        details: errRateio.details,
        hint: errRateio.hint
      });
      throw new Error(`Erro ao cadastrar rateio: ${errRateio.message}`);
    }

    console.log('✅ Rateio criado com sucesso:', rateio);

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

    console.log('📝 Itens do rateio a serem inseridos:', rateioItems);

    const { error: errItems } = await supabase
      .from('rateio_items')
      .insert(rateioItems);

    if (errItems) {
      console.error('❌ Erro ao cadastrar itens do rateio:', {
        error: errItems,
        code: errItems.code,
        message: errItems.message,
        details: errItems.details
      });
      
      // Se falhar ao inserir itens, remove o rateio principal
      console.log('🔄 Removendo rateio principal devido ao erro nos itens...');
      await supabase.from('rateios').delete().eq('id', rateio.id);
      throw new Error(`Erro ao cadastrar itens do rateio: ${errItems.message}`);
    }

    console.log('✅ Rateio e itens cadastrados com sucesso! ID:', rateio.id);
    return rateio;
  }
};
