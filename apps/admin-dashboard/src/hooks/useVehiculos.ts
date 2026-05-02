import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface Vehiculo {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  kilometraje_actual: number;
  estado: 'activo' | 'taller' | 'fuera_servicio';
}

export function useVehiculos() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehiculos = async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from('vehiculos')
        .select('*')
        .order('placa', { ascending: true });

      if (supabaseError) throw supabaseError;
      setVehiculos(data || []);
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