
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InvoicePayload {
  legal_name: string;
  compensated_energy: number;
  tarifa_com_tributos: number;
  consumer_unit: string;
  address: string;
  month_reference: string;
  expiration_date: string;
  invoice_value: number;
  lines: Array<{
    description: string;
    quantity: number;
    tax_no_rates: number;
    tax_with_rates: number;
    total_value: number;
    icms_base: number;
    icms_aliq: number;
    icms: number;
    pis_cofins_base: number;
    pis: number;
    cofins: number;
  }>;
  historical_lines: Array<{
    reference: string;
    consume_ponta: number;
    consume_fora_ponta: number;
  }>;
  extra: Record<string, any>;
}

// Função para extrair dados do HTML retornado pela API
function parseHtmlResponse(html: string) {
  try {
    // Extrair informações básicas usando regex
    const clienteMatch = html.match(/<strong>Cliente:<\/strong>\s*([^<]+)/);
    const ucMatch = html.match(/<strong>Unidade Consumidora:<\/strong>\s*([^<]+)/);
    const referenciaMatch = html.match(/<strong>Mês de Referência:<\/strong>\s*([^<]+)/);
    const vencimentoMatch = html.match(/<strong>Vencimento:<\/strong>\s*([^<]+)/);
    
    // Extrair valores financeiros
    const totalFaturaMatch = html.match(/TOTAL DA FATURA:\s*R\$\s*([\d,]+\.\d{2})/);
    const energiaInjetadaSemDescontoMatch = html.match(/Valor da Energia Injetada \(sem desconto\):[^R]*R\$\s*([\d,]+\.\d{2})/);
    const energiaInjetadaComDescontoMatch = html.match(/VALOR FINAL COM DESCONTO:[^R]*R\$\s*([\d,]+\.\d{2})/);
    const descontoMatch = html.match(/Desconto Aplicado \(([^)]+)\):[^R]*R\$\s*([\d,]+\.\d{2})/);
    const energiaCompensadaMatch = html.match(/Energia Compensada \(Injetada\):[^0-9]*([0-9,]+\.?\d*)\s*kWh/);
    const tarifaCheiaMatch = html.match(/Tarifa Cheia \(com tributos\):[^R]*R\$\s*([0-9,]+\.?\d*)/);

    // Função auxiliar para converter string com vírgula para número
    const parseValue = (str: string | null): number => {
      if (!str) return 0;
      return parseFloat(str.replace(',', ''));
    };

    // Construir objeto de resposta estruturado
    const result = {
      consumer_unit: ucMatch?.[1]?.trim() || '',
      month_reference: referenciaMatch?.[1]?.trim() || '',
      invoice_value: parseValue(totalFaturaMatch?.[1]) || 0,
      
      // Dados de consumo baseados no HTML
      consumo_nao_compensado: {
        description: "Consumo Não Compensado",
        quantity: parseValue(energiaCompensadaMatch?.[1]) || 0,
        tax_no_rates: parseValue(tarifaCheiaMatch?.[1]) || 0,
        tax_with_rates: parseValue(tarifaCheiaMatch?.[1]) || 0,
        total_value: parseValue(energiaInjetadaSemDescontoMatch?.[1]) || 0,
        icms_base: 0,
        icms_aliq: 0,
        icms: 0,
        pis_cofins_base: 0,
        pis: 0,
        cofins: 0
      },
      
      consumo_scee: {
        description: "Consumo SCEE",
        quantity: parseValue(energiaCompensadaMatch?.[1]) || 0,
        tax_no_rates: parseValue(tarifaCheiaMatch?.[1]) || 0,
        tax_with_rates: parseValue(tarifaCheiaMatch?.[1]) || 0,
        total_value: parseValue(energiaInjetadaSemDescontoMatch?.[1]) || 0,
        icms_base: 0,
        icms_aliq: 0,
        icms: 0,
        pis_cofins_base: 0,
        pis: 0,
        cofins: 0
      },
      
      injecao_scee: {
        description: "Injeção SCEE",
        quantity: parseValue(energiaCompensadaMatch?.[1]) || 0,
        tax_no_rates: parseValue(tarifaCheiaMatch?.[1]) || 0,
        tax_with_rates: parseValue(tarifaCheiaMatch?.[1]) || 0,
        total_value: parseValue(energiaInjetadaSemDescontoMatch?.[1]) || 0,
        icms_base: 0,
        icms_aliq: 0,
        icms: 0,
        pis_cofins_base: 0,
        pis: 0,
        cofins: 0
      },
      
      // Valores financeiros principais
      valor_energia_injetada_sem_desconto: parseValue(energiaInjetadaSemDescontoMatch?.[1]) || 0,
      valor_energia_injetada_com_desconto: parseValue(energiaInjetadaComDescontoMatch?.[1]) || 0,
      total_impostos: 0,
      total_financeiro: parseValue(energiaInjetadaComDescontoMatch?.[1]) || 0,
      valor_final_fatura: parseValue(energiaInjetadaComDescontoMatch?.[1]) || 0,
      
      // Histórico de consumo (vazio por enquanto, pois não está no HTML)
      historical_consumption: []
    };

    console.log('Dados extraídos do HTML:', JSON.stringify(result, null, 2));
    return result;
    
  } catch (error) {
    console.error('Erro ao fazer parse do HTML:', error);
    throw new Error('Falha ao processar resposta HTML da API');
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { payload, discount } = await req.json();
    
    console.log('Calling external API with discount:', discount);
    console.log('Payload:', JSON.stringify(payload, null, 2));

    const response = await fetch(`https://faturas.iasolar.app.br/calculate?discount=${discount}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    let result;
    
    if (contentType.includes('application/json')) {
      // Se for JSON, processa normalmente
      result = await response.json();
      console.log('JSON Response:', JSON.stringify(result, null, 2));
    } else {
      // Se não for JSON (provavelmente HTML), processa o HTML
      const htmlResult = await response.text();
      console.log('HTML Response received, parsing...');
      
      // Extrai dados do HTML
      result = parseHtmlResponse(htmlResult);
    }

    return new Response(JSON.stringify(result), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
    });

  } catch (error) {
    console.error('Error in calculate-invoice function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to calculate invoice via external API'
      }), {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );
  }
});
