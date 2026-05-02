import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Mantenimiento } from '@/types/mantenimiento';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export function useMantenimientos(vehiculoId: string) {
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMantenimientos = async () => {
      const { data, error } = await supabase
        .from('mantenimientos')
        .select('*')
        .eq('vehiculo_id', vehiculoId)
        .order('fecha', { ascending: false });

      if (!error) setMantenimientos(data || []);
      setLoading(false);
    };

    if (vehiculoId) fetchMantenimientos();
  }, [vehiculoId]);

  return { mantenimientos, loading };
}