
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { uc, documento, data_nascimento } = await req.json();

    // Validar campos obrigatórios
    if (!uc || !documento) {
      return new Response(
        JSON.stringify({
          status: 'error',
          message: "Campos 'uc' e 'documento' são obrigatórios"
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verificar se data de nascimento é obrigatória para CPF
    const documentoLimpo = documento.replace(/\D/g, '');
    const isCpf = documentoLimpo.length === 11;
    
    if (isCpf && !data_nascimento) {
      return new Response(
        JSON.stringify({
          status: 'error',
          message: "Campo 'data_nascimento' é obrigatório para CPF"
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Preparar body da requisição para a API externa
    const requestBody: any = {
      uc: uc,
      documento: documentoLimpo,
    };

    // Adicionar data de nascimento se for CPF
    if (isCpf && data_nascimento) {
      requestBody.data_nascimento = data_nascimento;
    }

    console.log('Enviando requisição para API externa:', requestBody);

    // Fazer requisição para a API externa
    const response = await fetch('https://3335-177-148-182-183.ngrok-free.app/verificar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log('Resposta da API externa:', data);

    // Retornar a resposta da API externa
    return new Response(
      JSON.stringify(data),
      { 
        status: response.status, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Erro na edge function:', error);
    return new Response(
      JSON.stringify({
        status: 'error',
        message: 'Erro interno do servidor'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})
