'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Truck, 
  AlertCircle, 
  TrendingUp, 
  Users, 
  Map as MapIcon, 
  ClipboardList, 
  Settings,
  LogOut
} from 'lucide-react';

// Tipado básico para TypeScript
interface Vehicle {
  id: string;
  plate_number: string;
  model: string;
  brand: string;
  current_km: number;
  status: string;
  maintenance_status?: 'ok' | 'warning' | 'overdue';
}

export default function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [stats, setStats] = useState({
    flota_activa: 0,
    gastos_mes: 0,
    alertas_riesgo: 0,
    visitas_hoy: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      // 1. Obtener Vehículos y sus estados de mantenimiento
      const { data: vehiclesData } = await supabase
        .from('vehicles')
        .select('*')
        .eq('is_deleted', false)
        .order('plate_number', { ascending: true });

      // 2. Obtener Gastos Reales
      const { data: expenses } = await supabase
        .from('route_expenses')
        .select('amount')
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

      const totalGastos = expenses?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

      // 3. Contar alertas críticas (Mantenimiento Overdue)
      // Nota: Esta columna 'status' en maintenance_plans la creamos con el trigger SQL
      const { data: maintenance } = await supabase
        .from('maintenance_plans')
        .select('status')
        .eq('status', 'overdue');

      // 4. Visitas del día (Puntos Verdes)
      const { count: visitsCount } = await supabase
        .from('sales_visits')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed')
        .gte('completed_at', new Date().toISOString().split('T')[0]);

      setVehicles(vehiclesData || []);
      setStats({
        flota_activa: vehiclesData?.length || 0,
        gastos_mes: totalGastos,
        alertas_riesgo: maintenance?.length || 0,
        visitas_hoy: visitsCount || 0
      });
    } catch (error) {
      console.error("Error cargando GeoTrack Data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Sincronizando con GeoTrack TMS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Lateral */}
      <aside className="w-64 bg-slate-900 text-slate-300 p-6 flex flex-col">
        <div className="mb-10">
          <h2 className="text-white text-2xl font-black tracking-tighter italic">GEOTRACK <span className="text-blue-500">TMS</span></h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Enterprise Edition</p>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button className="flex items-center gap-3 w-full p-3 bg-blue-600 text-white rounded-lg transition-all">
            <MapIcon size={20} /> <span className="font-medium">Gestión de Viajes</span>
          </button>
          <button className="flex items-center gap-3 w-full p-3 hover:bg-slate-800 rounded-lg transition-all">
            <Truck size={20} /> <span className="font-medium">Flota</span>
          </button>
          <button className="flex items-center gap-3 w-full p-3 hover:bg-slate-800 rounded-lg transition-all">
            <ClipboardList size={20} /> <span className="font-medium">Inventarios</span>
          </button>
          <button className="flex items-center gap-3 w-full p-3 hover:bg-slate-800 rounded-lg transition-all">
            <Users size={20} /> <span className="font-medium">Colaboradores</span>
          </button>
        </nav>

        <div className="pt-6 border-t border-slate-800 space-y-2">
          <button className="flex items-center gap-3 w-full p-3 hover:bg-slate-800 rounded-lg transition-all text-sm">
            <Settings size={18} /> Configuración
          </button>
          <button className="flex items-center gap-3 w-full p-3 hover:bg-red-900/30 text-red-400 rounded-lg transition-all text-sm">
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Panel de Control</h1>
            <p className="text-slate-500">Bienvenido, Henry. Aquí está el estado real de tu operación.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 text-sm font-bold text-slate-700">
            {new Date().toLocaleDateString('es-GT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        {/* KPIs Dinámicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center text-blue-600 mb-4">
              <Truck size={24} />
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Flota Activa</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.flota_activa} <span className="text-sm font-normal text-slate-400">Unidades</span></h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="bg-green-50 w-10 h-10 rounded-lg flex items-center justify-center text-green-600 mb-4">
              <TrendingUp size={24} />
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Gastos del Mes</p>
            <h3 className="text-2xl font-black text-slate-800">Q {stats.gastos_mes.toLocaleString()}</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="bg-orange-50 w-10 h-10 rounded-lg flex items-center justify-center text-orange-600 mb-4">
              <AlertCircle size={24} />
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Alertas Críticas</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.alertas_riesgo} <span className="text-sm font-normal text-slate-400">Servicios</span></h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="bg-purple-50 w-10 h-10 rounded-lg flex items-center justify-center text-purple-600 mb-4">
              <MapIcon size={24} />
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Visitas Hoy</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.visitas_hoy} <span className="text-sm font-normal text-slate-400">Puntos</span></h3>
          </div>
        </div>

        {/* Listado Real de Vehículos */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Gestión de Flota Real</h3>
            <button className="text-blue-600 text-sm font-bold hover:underline">Ver todos los activos</button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400">
              <tr>
                <th className="px-6 py-4">Placa</th>
                <th className="px-6 py-4">Vehículo</th>
                <th className="px-6 py-4">Kilometraje</th>
                <th className="px-6 py-4">Estado Mantenimiento</th>
                <th className="px-6 py-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-black text-blue-600">{v.plate_number}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-700 text-sm">{v.brand}</p>
                    <p className="text-xs text-slate-400">{v.model}</p>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-slate-600">{v.current_km.toLocaleString()} KM</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      v.status === 'maintenance' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {v.status === 'maintenance' ? '⚠️ Servicio Urgente' : '✓ Operativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="bg-slate-800 text-white text-[10px] font-bold px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors uppercase">
                      Bitácora
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {vehicles.length === 0 && (
            <div className="p-10 text-center text-slate-400 italic">
              No hay vehículos registrados en tu base de datos de Supabase.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
