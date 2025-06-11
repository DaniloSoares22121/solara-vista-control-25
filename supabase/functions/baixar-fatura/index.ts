
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FaturaRequest {
  uc: string;
  documento: string;
  data_nascimento?: string;
}

interface FaturaResponse {
  fatura_url: string;
  message: string;
  pdf_path: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    const requestData: FaturaRequest = await req.json();
    
    console.log('Recebendo solicitação de fatura:', requestData);

    // Validar dados obrigatórios
    if (!requestData.uc || !requestData.documento) {
      return new Response(
        JSON.stringify({ error: 'UC e documento são obrigatórios' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Chamar a API externa
    const apiResponse = await fetch('https://ab9d-2804-2904-44c-1d00-dcf6-f52f-d71-c571.ngrok-free.app/baixar-fatura', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    if (!apiResponse.ok) {
      console.error('Erro na API externa:', apiResponse.status, apiResponse.statusText);
      const errorText = await apiResponse.text();
      console.error('Resposta de erro:', errorText);
      
      return new Response(
        JSON.stringify({ 
          error: 'Erro ao consultar fatura na distribuidora',
          details: errorText 
        }),
        { 
          status: apiResponse.status, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    const result: FaturaResponse = await apiResponse.json();
    
    console.log('Fatura obtida com sucesso:', result.message);

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );

  } catch (error: any) {
    console.error('Erro interno na função:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno do servidor',
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
};

serve(handler);
