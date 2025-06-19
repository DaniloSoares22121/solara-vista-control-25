
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
    
    // Tentar fazer parse como JSON primeiro
    try {
      result = JSON.parse(responseText);
      console.log('RESPOSTA PARSEADA COMO JSON:', JSON.stringify(result, null, 2));
      
      // Se foi parseado com sucesso como JSON, usar diretamente
      console.log('API retornou JSON válido, usando dados diretamente');
      
    } catch (jsonError) {
      console.log('ERRO AO FAZER PARSE JSON:', jsonError.message);
      console.log('A resposta não é um JSON válido, retornando erro');
      
      throw new Error('API retornou resposta inválida (não é JSON válido)');
    }

    // Adicionar informações de debug na resposta
    result._debug = {
      contentType: contentType,
      responseLength: responseText.length,
      isJson: contentType.includes('application/json'),
      responsePreview: responseText.substring(0, 500),
      rawResponse: responseText
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
