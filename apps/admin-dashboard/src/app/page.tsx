'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // Verifica que esta ruta a tu cliente sea correcta
import { Truck, AlertCircle, TrendingUp, Users } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    flota_activa: 0,
    gastos_mes: 0,
    alertas_riesgo: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRealData() {
      // 1. Contar vehículos reales de tu tabla
      const { count: fleetCount } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact', head: true });

      // 2. Sumar gastos reales de tu tabla route_expenses
      const { data: expenses } = await supabase
        .from('route_expenses')
        .select('amount');
      
      const totalGastos = expenses?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

      // 3. Contar alertas de mantenimiento reales
      const { count: alertCount } = await supabase
        .from('maintenance_plans')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'overdue');

      setStats({
        flota_activa: fleetCount || 0,
        gastos_mes: totalGastos,
        alertas_riesgo: alertCount || 0
      });
      setLoading(false);
    }

    loadRealData();
  }, []);

  if (loading) return <div className="p-10">Cargando datos reales de GeoTrack...</div>;

  return (
    <main className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">GeoTrack TMS - Panel Real</h1>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Gestionar Viajes</button>
        </div>
      </div>

      {/* KPIs Conectados a Supabase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500 uppercase font-bold">Flota Real</p>
              <h2 className="text-3xl font-black text-slate-800">{stats.flota_activa} unidades</h2>
            </div>
            <Truck className="text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500 uppercase font-bold">Gastos Reportados</p>
              <h2 className="text-3xl font-black text-slate-800">Q {stats.gastos_mes.toLocaleString()}</h2>
            </div>
            <TrendingUp className="text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500 uppercase font-bold">Riesgo Mantenimiento</p>
              <h2 className="text-3xl font-black text-slate-800">{stats.alertas_riesgo} en riesgo</h2>
            </div>
            <AlertCircle className="text-orange-500" />
          </div>
        </div>
      </div>

      {/* Aquí irían los componentes que ya definimos antes: LiveMap, VehicleStatus, etc. */}
    </main>
  );
      }
