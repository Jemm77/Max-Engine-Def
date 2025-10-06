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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Fetching publications from sergiobarajas...');
    
    // Fetch all publications from sergiobarajas
    const { data: publications, error: fetchError } = await supabaseClient
      .from('sergiobarajas')
      .select('*');

    if (fetchError) {
      console.error('Error fetching publications:', fetchError);
      throw fetchError;
    }

    console.log(`Processing ${publications?.length || 0} publications...`);

    let processed = 0;
    let errors = 0;

    for (const pub of publications || []) {
      try {
        console.log(`Processing: ${pub.Titulo}`);

        // Use Gemini to synthesize the summary and extract author names
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
                content: 'You are a research assistant that synthesizes academic summaries and extracts author names. Return JSON with format: {"synthesized_summary": "...", "authors": ["name1", "name2", ...]}'
              },
              {
                role: 'user',
                content: `Please process this academic article:

Title: ${pub.Titulo || 'N/A'}

Original Summary: ${pub.Resumen || 'N/A'}

Original Authors: ${pub.Autores || 'N/A'}

Task:
1. Create a concise, clear synthesis of the summary (2-3 sentences maximum)
2. Extract individual human names from the authors field as an array

Return your response as JSON with keys: synthesized_summary and authors`
              }
            ],
            response_format: { type: "json_object" }
          }),
        });

        if (!aiResponse.ok) {
          const errorText = await aiResponse.text();
          console.error(`AI API error for ${pub.Titulo}:`, aiResponse.status, errorText);
          errors++;
          continue;
        }

        const aiData = await aiResponse.json();
        const content = aiData.choices?.[0]?.message?.content;
        
        if (!content) {
          console.error(`No content in AI response for ${pub.Titulo}`);
          errors++;
          continue;
        }

        const parsed = JSON.parse(content);
        
        console.log(`AI processed: ${parsed.authors?.length || 0} authors, summary length: ${parsed.synthesized_summary?.length || 0}`);

        // Update the sergiobarajas table in place
        const { error: updateError } = await supabaseClient
          .from('sergiobarajas')
          .update({
            autores_procesados: parsed.authors || [],
            resumen_sintetizado: parsed.synthesized_summary || pub.Resumen
          })
          .eq('Titulo', pub.Titulo);

        if (updateError) {
          console.error(`Error updating ${pub.Titulo}:`, updateError);
          errors++;
        } else {
          processed++;
          console.log(`Successfully processed: ${pub.Titulo}`);
        }

      } catch (error) {
        console.error(`Error processing publication ${pub.Titulo}:`, error);
        errors++;
      }
    }

    console.log(`Processing complete: ${processed} successful, ${errors} errors`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed, 
        errors,
        total: publications?.length || 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in process-publications function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});