'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function RentabilidadPage() {
  const [datos, setDatos] = useState<any[]>([]);
  const [resumen, setResumen] = useState({ ingresos: 0, gastos: 0, utilidad: 0 });

  useEffect(() => {
    async function cargarRentabilidad() {
      const { data } = await supabase
        .from('rutas')
        .select('*, vehiculos(placa, marca)')
        .eq('estado_ruta', 'Liquidada');

      if (data) {
        setDatos(data);
        const totalGastos = data.reduce((acc, r) => 
          acc + (Number(r.galones_diesel) * 32) + Number(r.gasto_peajes) + Number(r.viaticos_piloto), 0
        );
        // Supongamos un flete promedio de Q2,500 por viaje para el ejemplo
        const totalIngresos = data.length * 2500; 
        setResumen({
          ingresos: totalIngresos,
          gastos: totalGastos,
          utilidad: totalIngresos - totalGastos
        });
      }
    }
    cargarRentabilidad();
  }, []);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-black text-slate-900 mb-6">Análisis de Rentabilidad</h1>

      {/* TARJETAS DE RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-green-500">
          <p className="text-slate-500 text-xs font-bold uppercase">Ingresos Estimados</p>
          <p className="text-3xl font-black text-slate-800">Q{resumen.ingresos.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-red-500">
          <p className="text-slate-500 text-xs font-bold uppercase">Gastos Operativos</p>
          <p className="text-3xl font-black text-slate-800">Q{resumen.gastos.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border-t-4 border-blue-400">
          <p className="text-blue-400 text-xs font-bold uppercase">Utilidad Neta</p>
          <p className="text-3xl font-black text-white">Q{resumen.utilidad.toLocaleString()}</p>
        </div>
      </div>

      {/* DETALLE POR UNIDAD */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800 text-white text-xs uppercase">
              <th className="p-4">Unidad</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">KM Recorridos</th>
              <th className="p-4">Eficiencia (KPG)</th>
              <th className="p-4">Costo Total</th>
              <th className="p-4">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {datos.map((r) => {
              const kmRecorridos = r.km_finales;
              const kpg = r.galones_diesel > 0 ? (kmRecorridos / r.galones_diesel).toFixed(2) : '0';
              const costoViaje = (Number(r.galones_diesel) * 32) + Number(r.gasto_peajes) + Number(r.viaticos_piloto);

              return (
                <tr key={r.id} className="hover:bg-slate-50 transition">
                  <td className="p-4">
                    <span className="font-black text-blue-600">{r.vehiculos?.placa}</span>
                    <p className="text-[10px] text-slate-400">{r.vehiculos?.marca}</p>
                  </td>
                  <td className="p-4 font-bold text-slate-700">{r.cliente_nombre}</td>
                  <td className="p-4 font-mono">{kmRecorridos} KM</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${Number(kpg) > 15 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {kpg} KPG
                    </span>
                  </td>
                  <td className="p-4 font-bold text-slate-900">Q{costoViaje.toLocaleString()}</td>
                  <td className="p-4">
                    <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded-full font-black uppercase">Liquidada</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}