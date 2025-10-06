import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Fetching context from databases...');

    // Fetch publications for context
    const [
      { data: publications, error: pubError },
      { data: opeData, error: opeError }
    ] = await Promise.all([
      supabaseClient.from('sergiobarajas').select('Titulo, resumen_sintetizado, autores_procesados, Page_URL').limit(50),
      supabaseClient.from('OpeDataScienceExtraction').select('Titulo, resumen_sintetizado, Organismos, AssayTypes').limit(50)
    ]);

    if (pubError) console.error('Error fetching publications:', pubError);
    if (opeError) console.error('Error fetching OPE data:', opeError);

    // Build context from the data
    let contextText = 'You have access to NASA bioscience research data:\n\n';
    
    if (publications && publications.length > 0) {
      contextText += 'Publications:\n';
      publications.forEach(pub => {
        contextText += `- ${pub.Titulo}: ${pub.resumen_sintetizado || 'No summary'}\n`;
      });
    }

    if (opeData && opeData.length > 0) {
      contextText += '\nExperiments:\n';
      opeData.forEach(exp => {
        contextText += `- ${exp.Titulo} (${exp.Organismos}): ${exp.resumen_sintetizado || 'No summary'}\n`;
      });
    }

    // Call Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are Houston, a NASA Bioscience AI assistant. Help users understand research publications and experiments. Be concise and helpful.\n\n${contextText}`
          },
          ...messages
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        throw new Error('Rate limit exceeded');
      } else if (aiResponse.status === 402) {
        throw new Error('AI credits depleted');
      }
      
      throw new Error('AI API error');
    }

    const aiData = await aiResponse.json();
    const response = aiData.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

    console.log('AI response generated successfully');

    return new Response(
      JSON.stringify({ response }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
