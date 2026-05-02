'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircle, Navigation, MapPin } from 'lucide-react';

export default function ViajesPage() {
  const [visitas, setVisitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisitas = async () => {
      const { data, error } = await supabase
        .from('sales_visits')
        .select('*, customers(business_name, tax_id, latitude, longitude)')
        .order('completed_at', { ascending: false });
        
      if (data) setVisitas(data);
      setLoading(false);
    };
    fetchVisitas();
  }, []);

  const abrirGoogleMaps = (lat: number, lng: number) => {
    if (!lat || !lng) {
      alert('Coordenadas GPS no disponibles para este cliente.');
      return;
    }
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  };

  const abrirWaze = (lat: number, lng: number) => {
    if (!lat || !lng) {
      alert('Coordenadas GPS no disponibles para este cliente.');
      return;
    }
    window.open(`https://waze.com/ul?ll=${lat},${lng}&navigate=yes`, '_blank');
  };

  if (loading) {
    return <div className="p-10 text-slate-500 font-bold text-center">Cargando rutas y telemetría...</div>;
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Monitor de Visitas y Rutas</h1>
        <p className="text-xs text-slate-500 font-medium">Auditoría en tiempo real y Despacho GPS</p>
      </div>

      <div className="space-y-4">
        {visitas.map((v) => (
          <div key={v.id} className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-green-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 uppercase">{v.customers?.business_name || 'Cliente sin registro'}</h3>
              <p className="text-[10px] text-slate-400 font-bold">NIT: {v.customers?.tax_id || 'N/A'}</p>
              
              <div className="flex items-center gap-1 mt-2 text-green-600">
                <CheckCircle size={14} />
                <span className="text-[10px] font-black uppercase">Visita Completada</span>
              </div>

              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => abrirWaze(v.customers?.latitude, v.customers?.longitude)}
                  className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-blue-100 flex items-center gap-2 transition-colors"
                >
                  <Navigation size={14} />
                  Ruta Waze
                </button>
                <button 
                  onClick={() => abrirGoogleMaps(v.customers?.latitude, v.customers?.longitude)}
                  className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-emerald-100 flex items-center gap-2 transition-colors"
                >
                  <MapPin size={14} />
                  Google Maps
                </button>
              </div>
            </div>

            <div className="text-left md:text-right w-full md:w-auto bg-slate-50 md:bg-transparent p-3 md:p-0 rounded-lg border border-slate-100 md:border-none">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Última actualización</p>
              <p className="text-xs font-black text-slate-600">{new Date(v.completed_at).toLocaleDateString()}</p>
              <p className="text-lg font-black text-slate-800">{new Date(v.completed_at).toLocaleTimeString()}</p>
            </div>

          </div>
        ))}

        {visitas.length === 0 && (
          <div className="text-slate-400 font-medium text-center p-10 bg-white rounded-xl border border-dashed border-slate-200">
            Aún no hay visitas registradas ni rutas activas en el sistema.
          </div>
        )}
      </div>
    </div>
  );
}