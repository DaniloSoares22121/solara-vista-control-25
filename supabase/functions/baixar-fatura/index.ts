
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FaturaRequest {
  uc: string;
  documento: string;
  data_nascimento?: string;
  customPdfBase64?: string;
}

interface FaturaResponse {
  fatura_url: string;
  message: string;
  pdf_path: string;
  pdf_combinado_url?: string;
  numero_fatura?: string;
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
    const apiResponse = await fetch('https://3335-177-148-182-183.ngrok-free.app/baixar-fatura', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uc: requestData.uc,
        documento: requestData.documento,
        data_nascimento: requestData.data_nascimento
      })
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

    // Se foi enviado PDF customizado, combinar os PDFs
    if (requestData.customPdfBase64) {
      try {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        // Converter base64 para Uint8Array
        const customPdfBytes = Uint8Array.from(atob(requestData.customPdfBase64), c => c.charCodeAt(0));
        
        // Baixar PDF original
        const originalResponse = await fetch(result.fatura_url);
        if (originalResponse.ok) {
          const originalPdfBytes = new Uint8Array(await originalResponse.arrayBuffer());
          
          // Combinar PDFs (customizado + original)
          const combinedPdfBytes = new Uint8Array([...customPdfBytes, ...originalPdfBytes]);
          
          // Gerar nome único para o arquivo
          const timestamp = Date.now();
          const fileName = `fatura_${requestData.uc}_${timestamp}.pdf`;
          
          // Upload do PDF combinado
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('faturas')
            .upload(`pdfs/${fileName}`, combinedPdfBytes, {
              contentType: 'application/pdf',
              upsert: true
            });

          if (uploadError) {
            console.error('Erro ao fazer upload:', uploadError);
          } else {
            const { data: urlData } = supabase.storage
              .from('faturas')
              .getPublicUrl(uploadData.path);

            // Salvar no banco de dados
            const { data: faturaData, error: dbError } = await supabase
              .from('faturas_pdf')
              .insert({
                numero_fatura: requestData.uc,
                pdf_original_url: result.fatura_url,
                pdf_customizado_url: '', // Seria necessário salvar o customizado separadamente
                pdf_combinado_url: urlData.publicUrl
              })
              .select()
              .single();

            if (dbError) {
              console.error('Erro ao salvar no banco:', dbError);
            } else {
              result.pdf_combinado_url = urlData.publicUrl;
              result.numero_fatura = requestData.uc;
            }
          }
        }
      } catch (error) {
        console.error('Erro ao processar PDFs:', error);
      }
    }

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
