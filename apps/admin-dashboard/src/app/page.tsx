'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { 
  Truck, 
  Map as MapIcon, 
  ClipboardList, 
  TrendingUp, 
  AlertCircle,
  ChevronRight
} from 'lucide-react';

export default function DashboardPrincipal() {
  const [resumen, setResumen] = useState({
    totalVehiculos: 0,
    totalGastos: 0,
    visitasHoy: 0,
    alertasStock: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarResumen() {
      // 1. Conteo de Unidades
      const { count: fleetCount } = await supabase.from('vehicles').select('*', { count: 'exact', head: true });
      
      // 2. Suma de Gastos (Filtro del mes actual)
      const { data: expenses } = await supabase.from('route_expenses').select('amount');
      const sumaGastos = expenses?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

      // 3. Visitas de Hoy
      const { count: visitsCount } = await supabase.from('sales_visits')
        .select('*', { count: 'exact', head: true })
        .gte('completed_at', new Date().toISOString().split('T')[0]);

      setResumen({
        totalVehiculos: fleetCount || 0,
        totalGastos: sumaGastos,
        visitasHoy: visitsCount || 0,
        alertasStock: 0 // Se activará cuando el trigger de bajo stock empiece a llenar la tabla
      });
      setLoading(false);
    }
    cargarResumen();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">GEOTRACK <span className="text-blue-600">TMS</span></h1>
          <p className="text-slate-500 font-medium">Centro de Mando Operativo</p>
        </div>
        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 text-xs font-bold text-slate-600">
          Sincronizado: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* KPIs Resumidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-blue-500">
          <Truck className="text-blue-500 mb-4" size={24} />
          <p className="text-[10px] font-black text-slate-400 uppercase">Flota Total</p>
          <h2 className="text-2xl font-black text-slate-800">{resumen.totalVehiculos} Unidades</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-emerald-500">
          <TrendingUp className="text-emerald-500 mb-4" size={24} />
          <p className="text-[10px] font-black text-slate-400 uppercase">Gastos de Operación</p>
          <h2 className="text-2xl font-black text-slate-800">Q {resumen.totalGastos.toLocaleString()}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-indigo-500">
          <MapIcon className="text-indigo-500 mb-4" size={24} />
          <p className="text-[10px] font-black text-slate-400 uppercase">Visitas del Día</p>
          <h2 className="text-2xl font-black text-slate-800">{resumen.visitasHoy} Puntos</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-orange-500">
          <AlertCircle className="text-orange-500 mb-4" size={24} />
          <p className="text-[10px] font-black text-slate-400 uppercase">Alertas Activas</p>
          <h2 className="text-2xl font-black text-slate-800">{resumen.alertasStock} Riesgos</h2>
        </div>
      </div>

      {/* Navegación a Módulos Reales */}
      <h3 className="text-sm font-black text-slate-400 uppercase mb-6 tracking-widest">Módulos del Sistema</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <Link href="/flota" className="group bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-blue-500 transition-all">
          <div className="flex justify-between items-center">
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Truck size={32} />
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-blue-500" />
          </div>
          <h4 className="mt-6 text-xl font-bold text-slate-800">Gestión de Flota</h4>
          <p className="text-sm text-slate-500 mt-2">Control de kilometraje, placas y mantenimiento preventivo.</p>
        </Link>

        <Link href="/viajes" className="group bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-indigo-500 transition-all">
          <div className="flex justify-between items-center">
            <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <MapIcon size={32} />
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-indigo-500" />
          </div>
          <h4 className="mt-6 text-xl font-bold text-slate-800">Logística y Rutas</h4>
          <p className="text-sm text-slate-500 mt-2">Seguimiento de visitas en tiempo real y auditoría GPS.</p>
        </Link>

        <Link href="/inventario" className="group bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-purple-500 transition-all">
          <div className="flex justify-between items-center">
            <div className="bg-purple-50 p-4 rounded-2xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
              <ClipboardList size={32} />
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-purple-500" />
          </div>
          <h4 className="mt-6 text-xl font-bold text-slate-800">Inventario Móvil</h4>
          <p className="text-sm text-slate-500 mt-2">Stock disponible en cada unidad y alertas de bajo stock.</p>
        </Link>

      </div>
    </main>
  );
            }
          
