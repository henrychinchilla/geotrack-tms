'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, criticos: 0, gastos: 0 });

  useEffect(() => {
    async function cargarResumen() {
      const { count: total } = await supabase.from('vehiculos').select('*', { count: 'exact', head: true });
      const { count: criticos } = await supabase.from('salud_vehiculo').select('*', { count: 'exact', head: true }).eq('gravedad', 'Critica');
      const { data: gastos } = await supabase.from('gastos_mantenimiento').select('monto');
      
      const totalGastos = gastos?.reduce((acc, curr) => acc + curr.monto, 0) || 0;
      setStats({ total: total || 0, criticos: criticos || 0, gastos: totalGastos });
    }
    cargarResumen();
  }, []);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Panel de Control GeoTrack</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500">
          <p className="text-slate-500 font-medium">Flota Total</p>
          <p className="text-4xl font-bold text-slate-800">{stats.total} Unidades</p>
        </div>
        
        <div className={`p-6 rounded-2xl shadow-sm border-l-4 ${stats.criticos > 0 ? 'bg-red-50 border-red-500' : 'bg-white border-green-500'}`}>
          <p className="text-slate-500 font-medium">Alertas Críticas</p>
          <p className={`text-4xl font-bold ${stats.criticos > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {stats.criticos} {stats.criticos === 1 ? 'Camión' : 'Camiones'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-amber-500">
          <p className="text-slate-500 font-medium">Inversión en Mantenimiento</p>
          <p className="text-4xl font-bold text-slate-800">Q{stats.gastos.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}