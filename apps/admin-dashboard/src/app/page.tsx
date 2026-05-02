'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  BarChart3, Users, Truck, ClipboardList, Map as MapIcon, 
  Settings, Database, Zap, FileText, Package
} from 'lucide-react';

export default function GeoTrackEnterpriseDashboard() {
  const [data, setData] = useState({
    flotaActiva: 0,
    gastosMes: 0,
    visitasCompletadas: 0,
    alertasRiesgo: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEnterpriseData() {
      try {
        const { count: fleet } = await supabase.from('vehicles').select('*', { count: 'exact', head: true });
        
        const { data: expenses } = await supabase.from('route_expenses').select('amount');
        const totalGastos = expenses?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

        const { count: visits } = await supabase.from('sales_visits').select('*', { count: 'exact', head: true });

        const { count: alerts } = await supabase.from('vehicles')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'maintenance');

        setData({
          flotaActiva: fleet || 0,
          gastosMes: totalGastos,
          visitasCompletadas: visits || 0,
          alertasRiesgo: alerts || 0
        });
      } catch (error) {
        console.error("Error de sincronización Supabase", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEnterpriseData();
  }, []);

  return (
    <div className="flex h-screen bg-[#0B0F19] text-slate-300 font-sans overflow-hidden">
      
      {/* SIDEBAR TIPO TALLERPRO */}
      <aside className="w-64 bg-[#0F1423] border-r border-slate-800/50 flex flex-col justify-between hidden md:flex z-10">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-slate-800/50">
            <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              <span className="text-amber-500">≡</span> GEOTRACK <span className="text-slate-500 font-normal">/ TMS</span>
            </h1>
          </div>
          
          <div className="px-6 py-4">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Enterprise V2.0</p>
            <h2 className="text-sm font-bold text-slate-200">OPERACIONES LOGÍSTICAS SA</h2>
            <div className="w-4 h-0.5 bg-cyan-500 mt-2"></div>
          </div>

          <div className="px-4 py-2">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3 px-2">Módulos</p>
            <nav className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-[#1A2235] border-l-2 border-amber-500 text-amber-500 rounded-r-lg font-medium text-sm transition-colors">
                <BarChart3 size={18} /> Dashboard
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-slate-200 hover:bg-[#1A2235] rounded-lg font-medium text-sm transition-colors">
                <MapIcon size={18} className="text-blue-500" /> Logística y Rutas
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-slate-200 hover:bg-[#1A2235] rounded-lg font-medium text-sm transition-colors">
                <Truck size={18} className="text-red-500" /> Gestión de Flota
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-slate-200 hover:bg-[#1A2235] rounded-lg font-medium text-sm transition-colors">
                <Package size={18} className="text-amber-700" /> Inventario Móvil
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-slate-200 hover:bg-[#1A2235] rounded-lg font-medium text-sm transition-colors">
                <FileText size={18} className="text-slate-400" /> Facturación FEL
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-slate-200 hover:bg-[#1A2235] rounded-lg font-medium text-sm transition-colors">
                <Users size={18} className="text-blue-600" /> RRHH & Pilotos
              </button>
            </nav>
          </div>
        </div>

        <div>
          <div className="px-4 pb-4">
            <nav className="space-y-1 mb-4">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-300 transition-colors text-sm">
                <Settings size={18} /> Configuración
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-300 transition-colors text-sm">
                <Database size={18} /> Base de Datos
              </button>
            </nav>
            <div className="bg-[#151B2B] p-3 rounded-xl flex items-center gap-3 border border-slate-800">
              <div className="bg-amber-500/10 p-2 rounded-lg">
                <Zap size={16} className="text-amber-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">Henry Chinchilla</p>
                <p className="text-[10px] text-slate-500">Super Admin</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL CON GRID DE FONDO */}
      <main className="flex-1 relative overflow-y-auto bg-[#0B0F19]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none"></div>
        
        <div className="relative z-10 p-8">
          <header className="flex justify-between items-center mb-10">
            {/* Fix de hidratación aquí: suppressHydrationWarning */}
            <h2 suppressHydrationWarning className="text-slate-400 text-sm font-mono tracking-widest uppercase">
              {new Date().toLocaleDateString('es-GT', { month: 'long', year: 'numeric' })}
            </h2>
            {loading && <span className="text-cyan-500 text-xs animate-pulse">Sincronizando telemetría...</span>}
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="space-y-6">
              
              <div className="bg-[#111623] border border-slate-800/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-600 to-transparent"></div>
                <h3 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4">Unidades Activas</h3>
                <p className="text-5xl font-black text-cyan-400 mb-2">{data.flotaActiva}</p>
                <p className="text-xs text-cyan-600/70 font-medium">En ruta y monitoreadas</p>
              </div>

              <div className="bg-[#111623] border border-slate-800/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-transparent"></div>
                <h3 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4">Alertas de Servicio</h3>
                <p className={`text-5xl font-black mb-2 ${data.alertasRiesgo > 0 ? 'text-red-500' : 'text-slate-600'}`}>
                  {data.alertasRiesgo}
                </p>
                <p className={`text-xs font-medium ${data.alertasRiesgo > 0 ? 'text-red-500/70' : 'text-slate-600'}`}>
                  {data.alertasRiesgo > 0 ? 'Requieren atención inmediata' : 'Operación estable'}
                </p>
              </div>

              <div className="bg-[#111623] border border-slate-800/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 to-transparent"></div>
                <h3 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4">Gastos Operativos</h3>
                <p className="text-3xl font-black text-emerald-400 mb-2">Q {data.gastosMes.toLocaleString()}</p>
                <p className="text-xs text-emerald-600/70 font-medium">Acumulado del mes</p>
              </div>

            </div>

            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-[#111623] border border-slate-800/80 rounded-2xl p-6 shadow-2xl h-80 flex flex-col">
                <h3 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-6">Auditoría de Rutas (Puntos Visitados)</h3>
                <div className="flex-1 flex items-end justify-between gap-4 border-b border-slate-800 pb-4 relative">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                    <div className="border-t border-slate-700 w-full h-0"></div>
                    <div className="border-t border-slate-700 w-full h-0"></div>
                    <div className="border-t border-slate-700 w-full h-0"></div>
                    <div className="border-t border-slate-700 w-full h-0"></div>
                  </div>
                  
                  <div className="w-1/4 bg-slate-800/50 hover:bg-amber-500/20 border border-amber-500/50 rounded-t-sm h-[40%] transition-all relative group flex justify-center">
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-6 text-xs text-amber-500 font-bold transition-all">Feb</span>
                  </div>
                  <div className="w-1/4 bg-slate-800/50 hover:bg-amber-500/20 border border-amber-500/50 rounded-t-sm h-[70%] transition-all relative group flex justify-center">
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-6 text-xs text-amber-500 font-bold transition-all">Mar</span>
                  </div>
                  <div className="w-1/4 bg-amber-500/20 border border-amber-500 rounded-t-sm h-[90%] transition-all relative group flex justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                    <span className="opacity-100 absolute -top-6 text-xs text-amber-500 font-bold">{data.visitasCompletadas} Puntos</span>
                  </div>
                </div>
                <div className="flex justify-between mt-4 text-[10px] text-slate-500 font-mono font-bold uppercase">
                  <span>Febrero</span>
                  <span>Marzo</span>
                  <span className="text-amber-500">Abril</span>
                </div>
              </div>

              <div className="bg-[#111623] border border-slate-800/80 rounded-2xl p-6 shadow-2xl">
                 <h3 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4">Estado del Sistema</h3>
                 <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                      Base de Datos Supabase Conectada
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                      PostGIS Activo
                    </div>
                 </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}