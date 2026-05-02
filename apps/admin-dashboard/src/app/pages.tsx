'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Truck, 
  AlertCircle, 
  TrendingUp, 
  Map as MapIcon, 
  ClipboardList, 
  Users,
  Plus
} from 'lucide-react';

export default function Dashboard() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [stats, setStats] = useState({
    flota: 0,
    gastos: 14900, // Mantengo tu dato inicial mientras sincroniza el resto
    alertas: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function syncGeoTrack() {
      try {
        // Traemos tus 9 unidades reales desde Supabase
        const { data: fleet } = await supabase
          .from('vehicles')
          .select('*')
          .order('plate_number', { ascending: true });

        if (fleet) {
          setVehicles(fleet);
          setStats(prev => ({ ...prev, flota: fleet.length }));
        }
      } catch (e) {
        console.error("Error de sincronización", e);
      } finally {
        setLoading(false);
      }
    }
    syncGeoTrack();
  }, []);

  if (loading) return <div className="p-10 text-center font-bold">Sincronizando GeoTrack TMS...</div>;

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* Header Superior */}
      <header className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">GeoTrack <span className="text-blue-600">TMS</span></h1>
          <p className="text-xs text-slate-500 font-medium">Panel de Control Operativo y Financiero</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="bg-teal-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
            <Users size={14}/> RRHH PILOTOS
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
            <MapIcon size={14}/> GESTIÓN DE VIAJES
          </button>
          <button className="bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
            <Plus size={14}/> NUEVA UNIDAD
          </button>
        </div>
      </header>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border-l-4 border-blue-500 shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400">Flota Activa</p>
          <h2 className="text-2xl font-black text-slate-800">{stats.flota} <span className="text-sm font-normal text-slate-500 text-lowercase">unidades</span></h2>
        </div>
        <div className="bg-white p-6 rounded-xl border-l-4 border-red-500 shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400">Gastos (Mantenimiento)</p>
          <h2 className="text-2xl font-black text-red-600">Q {stats.gastos.toLocaleString()}</h2>
        </div>
        <div className="bg-white p-6 rounded-xl border-l-4 border-emerald-500 shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400">Alertas de Servicio</p>
          <h2 className="text-2xl font-black text-emerald-600">{stats.alertas} <span className="text-sm font-normal text-slate-500">en riesgo</span></h2>
        </div>
      </div>

      {/* Tabla de Gestión de Flota */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b">
              <th className="px-6 py-4">Placa</th>
              <th className="px-6 py-4">Vehículo</th>
              <th className="px-6 py-4">Desgaste Actual</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {vehicles.map((v) => (
              <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-blue-700">{v.plate_number}</td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-700 uppercase">{v.brand}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{v.model}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-green-100 text-green-700 uppercase">
                    Óptimo: {v.current_km?.toLocaleString()} km
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="bg-slate-800 text-white text-[10px] font-bold px-4 py-2 rounded hover:bg-blue-600 transition-all uppercase">
                    Ver Bitácora
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
