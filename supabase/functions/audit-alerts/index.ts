import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { profile_id, organization_id, customer_id, distance_meters } = await req.json()

  // Definimos el umbral de auditoría (100 metros)
  const THRESHOLD = 100;

  if (distance_meters > THRESHOLD) {
    // 1. Registrar la alerta en la base de datos para el reporte de liquidación
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    await supabase
      .from('audit_logs')
      .insert({
        organization_id,
        profile_id,
        description: `Alerta: Visita marcada a ${Math.round(distance_meters)}m del cliente.`,
        severity: 'high'
      })

    // 2. Aquí integrarías el servicio de Push (Firebase/OneSignal)
    console.log(`ALERTA ENVIADA: Desviación detectada para el usuario ${profile_id}`);
  }

  return new Response(JSON.stringify({ status: "processed" }), {
    headers: { "Content-Type": "application/json" },
  })
})