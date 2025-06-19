
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
  console.log('=== EDGE FUNCTION START ===');
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Parsing request body...');
    const requestBody = await req.json();
    console.log('Request body keys:', Object.keys(requestBody));
    
    const { payload, discount } = requestBody;
    
    if (!payload) {
      console.error('No payload provided in request');
      return new Response(
        JSON.stringify({ 
          error: 'No payload provided',
          details: 'Request must include a payload object'
        }), 
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('=== REQUEST DATA ===');
    console.log('Payload type:', typeof payload);
    console.log('Payload keys:', Object.keys(payload));
    console.log('Discount:', discount);
    
    // Validate required payload fields
    const requiredFields = ['legal_name', 'consumer_unit', 'invoice_value'];
    const missingFields = requiredFields.filter(field => !payload[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
          details: `Missing fields: ${missingFields.join(', ')}`
        }), 
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const apiUrl = `https://faturas.iasolar.app.br/calculate?discount=${discount || 15}`;
    console.log('Calling external API:', apiUrl);
    console.log('Payload to send:', JSON.stringify(payload, null, 2));

    let response;
    let responseText;
    
    try {
      console.log('Making fetch request...');
      response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'EnergyPay-EdgeFunction/1.0'
        },
        body: JSON.stringify(payload)
      });

      console.log('=== API RESPONSE INFO ===');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      console.log('OK:', response.ok);
      console.log('Headers:', Object.fromEntries(response.headers.entries()));

      responseText = await response.text();
      console.log('Response length:', responseText.length);
      console.log('Response preview (first 300 chars):', responseText.substring(0, 300));

    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      return new Response(
        JSON.stringify({ 
          error: 'Network error calling external API',
          details: fetchError.message,
          apiUrl: apiUrl
        }), 
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if response is OK
    if (!response.ok) {
      console.error('=== API ERROR ===');
      console.error('Status:', response.status);
      console.error('Status Text:', response.statusText);
      console.error('Response body:', responseText);
      
      return new Response(
        JSON.stringify({ 
          error: `External API error: ${response.status} - ${response.statusText}`,
          details: responseText.substring(0, 1000),
          status: response.status,
          statusText: response.statusText,
          apiUrl: apiUrl
        }), 
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse JSON response
    let result;
    const contentType = response.headers.get('content-type') || '';
    console.log('Content-Type:', contentType);

    try {
      console.log('Attempting to parse JSON...');
      result = JSON.parse(responseText);
      console.log('=== PARSED JSON SUCCESS ===');
      console.log('Result type:', typeof result);
      console.log('Result keys:', Object.keys(result));
      
    } catch (jsonError) {
      console.error('=== JSON PARSE ERROR ===');
      console.error('Error:', jsonError.message);
      console.error('Response text (first 500 chars):', responseText.substring(0, 500));
      console.error('Content-Type:', contentType);
      
      // If it's HTML response, the API might be returning an error page
      if (contentType.includes('text/html')) {
        return new Response(
          JSON.stringify({ 
            error: 'External API returned HTML instead of JSON',
            details: 'The API might be experiencing issues or the request format is incorrect',
            responsePreview: responseText.substring(0, 500),
            contentType: contentType,
            apiUrl: apiUrl
          }), 
          {
            status: 502,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON response from external API',
          details: jsonError.message,
          responsePreview: responseText.substring(0, 500),
          contentType: contentType
        }), 
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Add debug information
    result._debug = {
      requestPayload: payload,
      discount: discount,
      apiUrl: apiUrl,
      responseStatus: response.status,
      responseHeaders: Object.fromEntries(response.headers.entries()),
      contentType: contentType,
      responseLength: responseText.length
    };

    console.log('=== SUCCESS ===');
    console.log('Returning result with keys:', Object.keys(result));
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('=== EDGE FUNCTION ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message,
        errorName: error.name,
        timestamp: new Date().toISOString()
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
