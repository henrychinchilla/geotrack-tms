import React from 'react';
import { Clock, Navigation, CheckCircle2 } from 'lucide-react';

export const DailySummary = ({ data }: any) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 text-blue-600 mb-2">
          <Clock size={20} />
          <span className="font-semibold">Horas de Actividad</span>
        </div>
        <p className="text-3xl font-bold text-slate-800">{data.hours_active} hrs</p>
        <p className="text-xs text-slate-400 mt-1">Desde el inicio hasta el cierre de ruta</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 text-green-600 mb-2">
          <Navigation size={20} />
          <span className="font-semibold">Kilometraje Recorrido</span>
        </div>
        <p className="text-3xl font-bold text-slate-800">{data.total_km} km</p>
        <p className="text-xs text-slate-400 mt-1">Distancia real acumulada por GPS</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 text-orange-600 mb-2">
          <CheckCircle2 size={20} />
          <span className="font-semibold">Efectividad</span>
        </div>
        <p className="text-3xl font-bold text-slate-800">{data.efficiency}%</p>
        <p className="text-xs text-slate-400 mt-1">Visitas programadas vs completadas</p>
      </div>
    </div>
  );
};
