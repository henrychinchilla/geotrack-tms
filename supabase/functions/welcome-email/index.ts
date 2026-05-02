import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, fullName, temporaryPassword, role } = await req.json()

    // 1. Configuración del Cliente Supabase Admin
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 2. Cuerpo del correo (HTML con branding de GeoTrack TMS)
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #1e40af;">Bienvenido a GeoTrack TMS</h2>
        <p>Hola <strong>${fullName}</strong>,</p>
        <p>Has sido registrado como <strong>${role}</strong> en la plataforma.</p>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Usuario:</strong> ${email}</p>
          <p style="margin: 0;"><strong>Contraseña Temporal:</strong> ${temporaryPassword}</p>
        </div>
        <p>Por seguridad, se te pedirá cambiar tu contraseña al ingresar por primera vez.</p>
        <a href="https://geotrack-tms.vercel.app/login" 
           style="display: inline-block; padding: 10px 20px; background: #2563eb; color: #fff; text-decoration: none; border-radius: 5px;">
           Acceder al Dashboard
        </a>
        <p style="font-size: 12px; color: #9ca3af; margin-top: 30px;">
          Control total en cada kilómetro.
        </p>
      </div>
    `;

    // Aquí llamarías a la API de correo (Resend/SendGrid)
    console.log(`Enviando correo a ${email}...`);

    return new Response(
      JSON.stringify({ message: 'Correo de bienvenida encolado' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
