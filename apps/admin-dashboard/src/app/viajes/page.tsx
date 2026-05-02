'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MapPin, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ViajesPage() {
  const [visitas, setVisitas] = useState<any[]>([]);

  useEffect(() => {
    const fetchVisitas = async () => {
      const { data } = await supabase
        .from('sales_visits')
        .select('*, customers(business_name, tax_id)')
        .order('completed_at', { ascending: false });
      if (data) setVisitas(data);
    };
    fetchVisitas();
  }, []);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-800 uppercase">Monitor de Visitas</h1>
        <p className="text-xs text-slate-500">Auditoría en tiempo real - Doble Llave</p>
      </div>

      <div className="space-y-4">
        {visitas.map(v => (
          <div key={v.id} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-800 uppercase">{v.customers?.business_name}</h3>
              <p className="text-[10px] text-slate-400 font-bold">NIT: {v.customers?.tax_id}</p>
              <div className="flex items-center gap-1 mt-2 text-green-600">
                <CheckCircle2 size={14} />
                <span className="text-[10px] font-black uppercase">Visita Completada</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold">{new Date(v.completed_at).toLocaleDateString()}</p>
              <p className="text-xs font-black text-slate-700">{new Date(v.completed_at).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
        {visitas.length === 0 && <p className="text-slate-400 italic text-center p-10">Esperando sincronización de rutas...</p>}
      </div>
    </div>
  );
}
