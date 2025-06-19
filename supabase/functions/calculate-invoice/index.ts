
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
    
    console.log('=== EDGE FUNCTION DEBUG START ===');
    console.log('Discount:', discount);
    console.log('Payload keys:', Object.keys(payload));
    console.log('Payload.invoice_value:', payload.invoice_value);
    console.log('Payload.compensated_energy:', payload.compensated_energy);

    const apiUrl = `https://faturas.iasolar.app.br/calculate?discount=${discount}`;
    console.log('Calling API URL:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'EnergyPay-EdgeFunction/1.0'
      },
      body: JSON.stringify(payload)
    });

    console.log('API Response Status:', response.status);
    console.log('API Response Status Text:', response.statusText);
    console.log('API Response Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('=== API ERROR DETAILS ===');
      console.error('Status:', response.status);
      console.error('Status Text:', response.statusText);
      console.error('Error Body:', errorText);
      console.error('Request URL:', apiUrl);
      console.error('Request Payload:', JSON.stringify(payload, null, 2));
      
      return new Response(
        JSON.stringify({ 
          error: `API Error: ${response.status} - ${response.statusText}`,
          details: errorText,
          status: response.status,
          url: apiUrl
        }), {
          status: response.status,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          },
        }
      );
    }

    const contentType = response.headers.get('content-type') || '';
    console.log('Response Content-Type:', contentType);
    
    const responseText = await response.text();
    console.log('Response Length:', responseText.length);
    console.log('Response Preview (first 200 chars):', responseText.substring(0, 200));

    let result;
    
    try {
      result = JSON.parse(responseText);
      console.log('Successfully parsed JSON response');
      console.log('Result keys:', Object.keys(result));
      
    } catch (jsonError) {
      console.error('JSON Parse Error:', jsonError.message);
      console.error('Raw response:', responseText);
      
      return new Response(
        JSON.stringify({ 
          error: 'API returned invalid JSON response',
          details: jsonError.message,
          responseText: responseText.substring(0, 1000), // Limit response size
          contentType: contentType
        }), {
          status: 500,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          },
        }
      );
    }

    // Add debug information to the response
    result._debug = {
      contentType: contentType,
      responseLength: responseText.length,
      isJson: contentType.includes('application/json'),
      status: response.status,
      statusText: response.statusText,
      apiUrl: apiUrl,
      discount: discount
    };

    console.log('=== EDGE FUNCTION SUCCESS ===');
    console.log('Returning result with keys:', Object.keys(result));

    return new Response(JSON.stringify(result), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
    });

  } catch (error) {
    console.error('=== EDGE FUNCTION ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error occurred',
        details: 'Failed to process invoice calculation request',
        errorName: error.name,
        stack: error.stack
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
