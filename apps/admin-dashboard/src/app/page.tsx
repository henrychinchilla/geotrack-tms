import React from 'react';

export default function GeoTrackDashboard() {
  // Datos simulados para la visualización inicial
  const stats = [
    { name: 'Visitas Completadas', value: '124', detail: 'Últimos 15 días', color: 'border-blue-500' },
    { name: 'Alertas de Auditoría', value: '12', detail: 'Revisión pendiente', color: 'border-red-500' },
    { name: 'Rendimiento Flota', value: '92%', detail: 'Promedio mensual', color: 'border-green-500' },
  ];

  return (
    <div className="p-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-800">GeoTrack TMS</h1>
        <p className="text-slate-500 italic">Control total en cada kilómetro</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat) => (
          <div 
            key={stat.name} 
            className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${stat.color}`}
          >
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              {stat.name}
            </h3>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-2">{stat.detail}</p>
          </div>
        ))}
      </section>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Estado del Sistema</h2>
        <div className="flex items-center space-x-2 text-sm text-green-600 font-medium">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>Sincronizado con Supabase en tiempo real</span>
        </div>
      </div>
    </div>
  );
}