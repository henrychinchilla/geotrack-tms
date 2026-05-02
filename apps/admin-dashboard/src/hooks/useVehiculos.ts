import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Actualizamos la interfaz para incluir los datos del servicio
export interface Vehiculo {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  kilometraje_actual: number;
  estado: 'activo' | 'taller' | 'fuera_servicio';
  ultimo_servicio_km?: number | null;
  km_desde_servicio?: number;
}

export function useVehiculos() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehiculos = async () => {
    try {
      setLoading(true);
      
      // 1. Traemos la flota
      const { data: flotaData, error: errorFlota } = await supabase
        .from('vehiculos')
        .select('*')
        .order('placa', { ascending: true });

      if (errorFlota) throw errorFlota;

      // 2. Traemos todos los servicios "Preventivos" para calcular alertas
      const { data: serviciosData, error: errorServicios } = await supabase
        .from('servicios')
        .select('vehiculo_id, kilometraje_servicio')
        .eq('tipo_servicio', 'Preventivo')
        .order('fecha', { ascending: false });
        
      if (errorServicios) throw errorServicios;

      // 3. Procesamos los datos: Buscamos el último servicio de cada camión
      const flotaConAlertas = flotaData.map((camion) => {
        // Encontramos el servicio preventivo más reciente para este camión específico
        const ultimoServicio = serviciosData?.find(s => s.vehiculo_id === camion.id);
        
        let km_desde_servicio = 0;
        let ultimo_servicio_km = null;

        if (ultimoServicio && ultimoServicio.kilometraje_servicio) {
            ultimo_servicio_km = ultimoServicio.kilometraje_servicio;
            km_desde_servicio = camion.kilometraje_actual - ultimoServicio.kilometraje_servicio;
        }

        return {
          ...camion,
          ultimo_servicio_km,
          km_desde_servicio
        };
      });

      setVehiculos(flotaConAlertas || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehiculos();
  }, []);

  return { vehiculos, loading, error, refresh: fetchVehiculos };
}