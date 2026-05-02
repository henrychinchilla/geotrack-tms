import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useKPIs() {
  const [totalGastos, setTotalGastos] = useState<number>(0);
  const [loadingKPIs, setLoadingKPIs] = useState(true);

  useEffect(() => {
    async function fetchGastos() {
      try {
        const { data, error } = await supabase.from('servicios').select('costo');
        if (error) throw error;
        
        if (data) {
          const suma = data.reduce((acc, servicio) => acc + Number(servicio.costo), 0);
          setTotalGastos(suma);
        }
      } catch (err) {
        console.error("Error cargando KPIs:", err);
      } finally {
        setLoadingKPIs(false);
      }
    }

    fetchGastos();
  }, []);

  return { totalGastos, loadingKPIs };
}