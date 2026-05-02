// Lógica de Alerta de Mantenimiento
import { serve } from "https://deno.land/std@0.131.0/http/server.ts"

serve(async (req) => {
  const { record } = await req.json() // Recibe el vehículo que cambió de estado

  if (record.status === 'overdue') {
    const message = `⚠️ ALERTA: El vehículo con placa ${record.plate_number} ha superado el límite de kilometraje. Requiere mantenimiento inmediato.`;
    
    // Aquí enviamos la Notificación Push (vía OneSignal o Firebase)
    await sendPushNotification("admin_group", "Mantenimiento Crítico", message);
  }

  return new Response("Alerta procesada", { status: 200 });
})
