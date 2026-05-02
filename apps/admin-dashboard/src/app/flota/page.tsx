'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function FlotaPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const { data, error } = await supabase.from('vehicles').select('*').order('plate_number');
      if (error) console.error("Error cargando flota:", error);
      if (data) setVehicles(data);
      setLoading(false);
    };
    getData();
  }, []);

  if (loading) return <div className="p-10 font-bold text-slate-500">Cargando flota...</div>;

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-black mb-6 text-slate-800 uppercase tracking-tight">Gestión de Flota Real</h1>
      <div className="grid gap-4">
        {vehicles.map(v => (
          <div key={v.id} className="bg-white p-5 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center border border-slate-200 gap-4">
            <div>
              <p className="font-black text-blue-600 text-lg">{v.plate_number || 'SIN PLACA'}</p>
              <p className="text-xs text-slate-600 font-bold uppercase">{v.brand || 'Marca N/A'} {v.model || ''}</p>
            </div>
            <div className="text-left md:text-right bg-slate-50 md:bg-transparent p-3 md:p-0 rounded-lg w-full md:w-auto">
              <p className="text-sm font-black text-slate-800 mb-1">
                {Number(v.current_km || 0).toLocaleString()} KM
              </p>
              <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${v.status === 'maintenance' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {v.status === 'maintenance' ? '⚠️ REQUIERE SERVICIO' : '✓ OPERATIVO'}
              </span>
            </div>
          </div>
        ))}
        {vehicles.length === 0 && <p className="text-slate-400 font-bold">No se encontraron vehículos.</p>}
      </div>
    </div>
  );
}
