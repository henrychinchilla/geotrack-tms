import React from 'react';

// Simularemos los datos que vendrán de Supabase
const GeoTrackDashboard = ({ userRole = 'vendedor' }) => {
  const isAdmin = userRole === 'admin';

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">GeoTrack TMS</h1>
        <p className="text-slate-500 italic">Control total en cada kilómetro</p>
      </header>

      {/* Sección de KPIs */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Visitas Completadas</h3>
          <p className="text-2xl font-bold">124</p>
          <p className="text-xs text-gray-400 mt-2">
            {isAdmin ? 'Historial Completo' : 'Últimos 15 días'}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Ventas Liquidadas</h3>
          <p className="text-2xl font-bold">Q 12,450.00</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Alertas de Auditoría</h3>
          <p className="text-2xl font-bold text-red-500">3</p>
        </div>
      </section>

      {/* Contenedor del Mapa (Placeholder) */}
      <div className="bg-slate-200 w-full h-96 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-300">
        <p className="text-slate-600 font-medium">
          [ Mapa de Monitoreo en Tiempo Real ]
          <br />
          <span className="text-sm font-normal text-slate-400">
            Los iconos cambiarán de Rojo a Verde al completar entregas[cite: 1]
          </span>
        </p>
      </div>
    </div>
  );
};

export default GeoTrackDashboard;