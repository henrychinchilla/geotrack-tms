import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const body = await request.json();
  const { placa, falla, km } = body;

  // Buscar ID del vehículo por placa
  const { data: vehiculo } = await supabase.from('vehiculos').select('id').eq('placa', placa).single();

  if (!vehiculo) return NextResponse.json({ error: 'Vehículo no encontrado' }, { status: 404 });

  const { error } = await supabase.from('salud_vehiculo').insert([{
    vehiculo_id: vehiculo.id,
    descripcion_falla: falla,
    kilometraje: km,
    gravedad: 'Media',
    codigo_dtc: 'REPORTE_PILOTO'
  }]);

  return error 
    ? NextResponse.json({ error: error.message }, { status: 500 })
    : NextResponse.json({ message: 'Reporte recibido' });
}