'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { TrendingUp, CreditCard, Clock } from 'lucide-react';

export default function ReportesPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchReport = async () => {
      // Llamamos a la Vista que creamos en SQL
      const { data: report } = await supabase.from('consolidated_performance_report').select('*');
      if (report) setData(report);
    };
    fetchReport();
  }, []);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-black text-slate-800 mb-8 uppercase tracking-tighter">Resumen Ejecutivo</h1>
      
      <div className="space-y-6">
        {data.map(row => (
          <div key={row.colaborador} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-slate-800 uppercase">{row.colaborador}</h2>
              <span className="text-[10px] font-black px-3 py-1 bg-slate-100 rounded-full uppercase text-slate-500">{row.role}</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Km Recorridos</p>
                <p className="text-lg font-black text-slate-800">{row.km_totales || 0} km</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Efectividad</p>
                <p className="text-lg font-black text-blue-600">{Math.round(row.efectividad_promedio || 0)}%</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Gastos</p>
                <p className="text-lg font-black text-red-600">Q {row.total_gastos || 0}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Días Activos</p>
                <p className="text-lg font-black text-slate-800">{row.dias_trabajados || 0}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
