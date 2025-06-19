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
    console.log('HTML recebido (primeiros 1000 chars):', html.substring(0, 1000));
    
    // Extrair informações básicas usando regex mais específicos
    const clienteMatch = html.match(/<strong>Cliente:<\/strong>\s*([^<]+)/i) || 
                        html.match(/Cliente:\s*([^<\n]+)/i);
    const ucMatch = html.match(/<strong>Unidade Consumidora:<\/strong>\s*([^<]+)/i) || 
                   html.match(/Unidade Consumidora:\s*([^<\n]+)/i);
    const referenciaMatch = html.match(/<strong>Mês de Referência:<\/strong>\s*([^<]+)/i) || 
                           html.match(/Mês de Referência:\s*([^<\n]+)/i);
    const vencimentoMatch = html.match(/<strong>Vencimento:<\/strong>\s*([^<]+)/i) || 
                           html.match(/Vencimento:\s*([^<\n]+)/i);
    
    // Padrões mais amplos para valores financeiros
    const totalFaturaMatch = html.match(/TOTAL.*?FATURA.*?R\$\s*([\d,]+\.?\d*)/i) ||
                            html.match(/Total.*?da.*?Fatura.*?R\$\s*([\d,]+\.?\d*)/i) ||
                            html.match(/Valor.*?Total.*?R\$\s*([\d,]+\.?\d*)/i);
    
    const energiaInjetadaSemDescontoMatch = html.match(/Energia.*?Injetada.*?sem.*?desconto.*?R\$\s*([\d,]+\.?\d*)/i) ||
                                          html.match(/Valor.*?Energia.*?Injetada.*?R\$\s*([\d,]+\.?\d*)/i) ||
                                          html.match(/Energia.*?Compensada.*?R\$\s*([\d,]+\.?\d*)/i);
    
    const energiaInjetadaComDescontoMatch = html.match(/VALOR.*?FINAL.*?COM.*?DESCONTO.*?R\$\s*([\d,]+\.?\d*)/i) ||
                                          html.match(/Valor.*?Final.*?R\$\s*([\d,]+\.?\d*)/i) ||
                                          html.match(/Total.*?com.*?desconto.*?R\$\s*([\d,]+\.?\d*)/i);
    
    const descontoMatch = html.match(/Desconto.*?Aplicado.*?R\$\s*([\d,]+\.?\d*)/i) ||
                         html.match(/Desconto.*?R\$\s*([\d,]+\.?\d*)/i);
    
    const energiaCompensadaMatch = html.match(/Energia.*?Compensada.*?([0-9,]+\.?\d*)\s*kWh/i) ||
                                  html.match(/Energia.*?Injetada.*?([0-9,]+\.?\d*)\s*kWh/i) ||
                                  html.match(/Compensada.*?([0-9,]+\.?\d*)\s*kWh/i);
    
    const tarifaCheiaMatch = html.match(/Tarifa.*?Cheia.*?com.*?tributos.*?R\$\s*([0-9,]+\.?\d*)/i) ||
                           html.match(/Tarifa.*?com.*?tributos.*?R\$\s*([0-9,]+\.?\d*)/i);
    
    // Buscar impostos
    const icmsMatch = html.match(/ICMS.*?R\$\s*([\d,]+\.?\d*)/i);
    const pisMatch = html.match(/PIS.*?R\$\s*([\d,]+\.?\d*)/i);
    const cofinsMatch = html.match(/COFINS.*?R\$\s*([\d,]+\.?\d*)/i);
    
    // Buscar valores de economia
    const economiaMatch = html.match(/Economia.*?R\$\s*([\d,]+\.?\d*)/i) ||
                         html.match(/Desconto.*?Obtido.*?R\$\s*([\d,]+\.?\d*)/i);

    // Função auxiliar para converter string com vírgula para número
    const parseValue = (str: string | null): number => {
      if (!str) return 0;
      return parseFloat(str.replace(/,/g, ''));
    };

    // Calcular valores baseados nos dados extraídos ou payload original
    const valorOriginal = parseValue(totalFaturaMatch?.[1]) || 0;
    const valorEnergiaSemDesconto = parseValue(energiaInjetadaSemDescontoMatch?.[1]) || valorOriginal;
    const valorEnergiaComDesconto = parseValue(energiaInjetadaComDescontoMatch?.[1]) || (valorEnergiaSemDesconto * 0.85); // Assumindo 15% de desconto
    const valorDesconto = parseValue(descontoMatch?.[1]) || (valorEnergiaSemDesconto - valorEnergiaComDesconto);
    const energiaCompensada = parseValue(energiaCompensadaMatch?.[1]) || 0;
    const tarifaCheia = parseValue(tarifaCheiaMatch?.[1]) || 0;
    
    // Calcular impostos
    const icmsValue = parseValue(icmsMatch?.[1]) || 0;
    const pisValue = parseValue(pisMatch?.[1]) || 0;
    const cofinsValue = parseValue(cofinsMatch?.[1]) || 0;
    const totalImpostos = icmsValue + pisValue + cofinsValue;
    
    console.log('Valores extraídos:', {
      valorOriginal,
      valorEnergiaSemDesconto,
      valorEnergiaComDesconto,
      valorDesconto,
      energiaCompensada,
      tarifaCheia,
      totalImpostos
    });

    // Construir objeto de resposta estruturado com valores calculados
    const result = {
      consumer_unit: ucMatch?.[1]?.trim() || '',
      month_reference: referenciaMatch?.[1]?.trim() || '',
      invoice_value: valorOriginal,
      
      // Dados de consumo baseados no HTML
      consumo_nao_compensado: {
        description: "Consumo Não Compensado",
        quantity: energiaCompensada || 0,
        tax_no_rates: tarifaCheia || 0,
        tax_with_rates: tarifaCheia || 0,
        total_value: valorEnergiaSemDesconto || 0,
        icms_base: valorEnergiaSemDesconto || 0,
        icms_aliq: totalImpostos > 0 ? (icmsValue / valorEnergiaSemDesconto) * 100 : 0,
        icms: icmsValue || 0,
        pis_cofins_base: valorEnergiaSemDesconto || 0,
        pis: pisValue || 0,
        cofins: cofinsValue || 0
      },
      
      consumo_scee: {
        description: "Consumo SCEE",
        quantity: energiaCompensada || 0,
        tax_no_rates: tarifaCheia || 0,
        tax_with_rates: tarifaCheia || 0,
        total_value: valorEnergiaSemDesconto || 0,
        icms_base: valorEnergiaSemDesconto || 0,
        icms_aliq: totalImpostos > 0 ? (icmsValue / valorEnergiaSemDesconto) * 100 : 0,
        icms: icmsValue || 0,
        pis_cofins_base: valorEnergiaSemDesconto || 0,
        pis: pisValue || 0,
        cofins: cofinsValue || 0
      },
      
      injecao_scee: {
        description: "Injeção SCEE",
        quantity: energiaCompensada || 0,
        tax_no_rates: tarifaCheia || 0,
        tax_with_rates: tarifaCheia || 0,
        total_value: -(valorEnergiaSemDesconto || 0), // Negativo pois é crédito
        icms_base: valorEnergiaSemDesconto || 0,
        icms_aliq: totalImpostos > 0 ? (icmsValue / valorEnergiaSemDesconto) * 100 : 0,
        icms: -(icmsValue || 0), // Negativo pois é crédito
        pis_cofins_base: valorEnergiaSemDesconto || 0,
        pis: -(pisValue || 0), // Negativo pois é crédito
        cofins: -(cofinsValue || 0) // Negativo pois é crédito
      },
      
      // Valores financeiros principais
      valor_energia_injetada_sem_desconto: valorEnergiaSemDesconto,
      valor_energia_injetada_com_desconto: valorEnergiaComDesconto,
      total_impostos: totalImpostos,
      total_financeiro: valorEnergiaComDesconto,
      valor_final_fatura: valorEnergiaComDesconto,
      
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
    console.log('Content-Type da resposta:', contentType);
    
    // Pegar a resposta como texto primeiro para ver exatamente o que está vindo
    const responseText = await response.text();
    console.log('RESPOSTA EXATA DA API (texto):', responseText);
    console.log('RESPOSTA EXATA DA API (length):', responseText.length);
    console.log('RESPOSTA EXATA DA API (primeiros 500 chars):', responseText.substring(0, 500));
    
    let result;
    
    // Tentar fazer parse como JSON
    try {
      result = JSON.parse(responseText);
      console.log('RESPOSTA PARSEADA COMO JSON:', JSON.stringify(result, null, 2));
    } catch (jsonError) {
      console.log('ERRO AO FAZER PARSE JSON:', jsonError.message);
      console.log('A resposta não é um JSON válido, tratando como HTML...');
      
      // Se não conseguir fazer parse como JSON, tratar como HTML
      result = parseHtmlResponse(responseText);
    }

    // Adicionar informações de debug na resposta
    result._debug = {
      contentType: contentType,
      responseLength: responseText.length,
      isJson: contentType.includes('application/json'),
      responsePreview: responseText.substring(0, 500)
    };

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
