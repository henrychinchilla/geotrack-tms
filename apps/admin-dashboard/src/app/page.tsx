'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function GeoTrackDashboard() {
  const [stats, setStats] = useState([
    { name: 'Visitas Completadas', value: '0', detail: 'Cargando...', color: 'border-blue-500' },
    { name: 'Alertas de Auditoría', value: '0', detail: 'Cargando...', color: 'border-red-500' },
    { name: 'Rendimiento Flota', value: '0%', detail: 'Cargando...', color: 'border-green-500' },
  ]);

  useEffect(() => {
    async function fetchStats() {
      // 1. Contar Visitas Completadas
      const { count: visitasCount } = await supabase
        .from('visitas')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'completada');

      // 2. Contar Alertas Activas
      const { count: alertasCount } = await supabase
        .from('alertas')
        .select('*', { count: 'exact', head: true })
        .eq('resuelta', false);

      setStats([
        { name: 'Visitas Completadas', value: String(visitasCount || 0), detail: 'Tiempo real', color: 'border-blue-500' },
        { name: 'Alertas de Auditoría', value: String(alertasCount || 0), detail: 'Pendientes de revisión', color: 'border-red-500' },
        { name: 'Rendimiento Flota', value: '100%', detail: 'Estado operativo', color: 'border-green-500' },
      ]);
    }

    fetchStats();
  }, []);

  return (
    <div className="p-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-800">GeoTrack TMS</h1>
        <p className="text-slate-500 italic">Control total en cada kilómetro</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat) => (
          <div key={stat.name} className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${stat.color}`}>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.name}</h3>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-2">{stat.detail}</p>
          </div>
        ))}
      </section>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Estado del Sistema</h2>
        <div className="flex items-center space-x-2 text-sm text-green-600 font-medium">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>Conectado a Supabase - Guatemala Cloud</span>
        </div>
      </div>
    </div>
  );
}