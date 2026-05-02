'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useVehiculos } from '@/hooks/useVehiculos';
import { useKPIs } from '@/hooks/useKPIs';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// LIMITE DE KILOMETRAJE PARA ALERTA PREVENTIVA (Ej. 10,000 km)
const LIMITE_KM_SERVICIO = 10000; 

export default function DashboardPage() {
  const [autorizado, setAutorizado] = useState(false);
  const { vehiculos, loading, error } = useVehiculos();
  const { totalGastos, loadingKPIs } = useKPIs();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) window.location.href = '/login';
      else setAutorizado(true);
    });
  }, []);

  if (!autorizado || loading) return <div className="p-10 text-center font-sans font-bold text-blue-600">Verificando credenciales y cargando flota...</div>;
  if (error) return <div className="p-10 text-center font-sans text-red-500 font-bold">Error: {error}</div>;

  // Calculamos cuántos camiones están en alerta roja
  const unidadesEnRiesgo = vehiculos.filter(v => v.km_desde_servicio !== undefined && v.km_desde_servicio > LIMITE_KM_SERVICIO).length;

  return (
    <main className="p-8 font-sans bg-gray-50 min-h-screen">
      {/* Cabecera */}
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900">GeoTrack TMS</h1>
          <p className="text-gray-500 font-medium">Panel de Control Operativo y Financiero</p>
        </div>
        <div className="flex gap-4">
          <a href="/registro" className="bg-blue-700 text-white px-6 py-3 rounded-lg font-bold shadow-md hover:bg-blue-800 transition">
            + NUEVA UNIDAD
          </a>
          <button onClick={() => { supabase.auth.signOut(); window.location.href = '/login'; }} className="bg-gray-200 text-gray-800 px-4 py-3 rounded-lg font-bold hover:bg-gray-300 transition">
            Salir
          </button>
        </div>
      </div>

      {/* Tarjetas de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-600">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Flota Activa</h3>
          <p className="text-4xl font-black text-gray-900">{vehiculos.length} <span className="text-lg text-gray-500">unidades</span></p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Gastos (Mantenimiento)</h3>
          {loadingKPIs ? (
            <p className="text-2xl font-bold text-gray-300">Calculando...</p>
          ) : (
            <p className="text-4xl font-black text-red-600">
              Q {totalGastos.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
            </p>
          )}
        </div>

        {/* Nueva Tarjeta de Riesgo */}
        <div className={`p-6 rounded-xl shadow-sm border-l-4 ${unidadesEnRiesgo > 0 ? 'bg-red-50 border-red-600' : 'bg-white border-green-500'}`}>
          <h3 className={`text-sm font-bold uppercase tracking-wider mb-1 ${unidadesEnRiesgo > 0 ? 'text-red-800' : 'text-gray-400'}`}>
            Alertas de Servicio
          </h3>
          <p className={`text-4xl font-black ${unidadesEnRiesgo > 0 ? 'text-red-700' : 'text-green-600'}`}>
            {unidadesEnRiesgo} <span className="text-lg font-medium">en riesgo</span>
          </p>
        </div>
      </div>

      {/* Tabla de Vehículos con Semáforo */}
      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 border-b-2 border-gray-200">
            <tr>
              <th className="p-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Placa</th>
              <th className="p-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Vehículo</th>
              <th className="p-4 font-bold text-gray-700 uppercase text-xs tracking-wider text-center">Desgaste Actual</th>
              <th className="p-4 font-bold text-gray-700 uppercase text-xs tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {vehiculos.map((v) => {
              // Lógica de Semáforo
              let desgasteColor = "text-gray-500";
              let desgasteText = "Sin registro previo";
              
              if (v.km_desde_servicio !== undefined && v.ultimo_servicio_km) {
                  if (v.km_desde_servicio > LIMITE_KM_SERVICIO) {
                      desgasteColor = "text-red-600 bg-red-100 font-black border-red-300 border"; // Rojo (Peligro)
                      desgasteText = `Excedido: +${v.km_desde_servicio.toLocaleString()} km`;
                  } else if (v.km_desde_servicio > (LIMITE_KM_SERVICIO * 0.8)) {
                      desgasteColor = "text-orange-700 bg-orange-100 font-bold"; // Naranja (Advertencia - 80% usado)
                      desgasteText = `Próximo: ${v.km_desde_servicio.toLocaleString()} km`;
                  } else {
                      desgasteColor = "text-green-700 bg-green-50 font-medium"; // Verde (Ok)
                      desgasteText = `Óptimo: ${v.km_desde_servicio.toLocaleString()} km`;
                  }
              }

              return (
              <tr key={v.id} className="hover:bg-blue-50 transition">
                <td className="p-4 font-black text-blue-800">{v.placa}</td>
                <td className="p-4 text-gray-800 font-medium">{v.marca} {v.modelo}</td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-md text-xs inline-block min-w-[150px] ${desgasteColor}`}>
                    {desgasteText}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <a href={`/vehiculo/${v.id}`} className="bg-gray-900 text-white px-4 py-2 rounded font-bold text-xs hover:bg-gray-700 transition shadow">
                    VER BITÁCORA
                  </a>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </main>
  );
}