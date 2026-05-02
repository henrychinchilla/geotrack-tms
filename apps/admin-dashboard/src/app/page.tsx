'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useVehiculos } from '@/hooks/useVehiculos';
import { useKPIs } from '@/hooks/useKPIs';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function DashboardPage() {
  const [autorizado, setAutorizado] = useState(false);
  const { vehiculos, loading, error } = useVehiculos();
  const { totalGastos, loadingKPIs } = useKPIs();

  // Verificación de seguridad correcta (lee el LocalStorage)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        window.location.href = '/login'; // Si no hay sesión real, pa'fuera
      } else {
        setAutorizado(true); // Acceso concedido
      }
    });
  }, []);

  if (!autorizado || loading) return <div className="p-10 text-center font-sans font-bold text-blue-600">Verificando credenciales y cargando flota...</div>;
  if (error) return <div className="p-10 text-center font-sans text-red-500 font-bold">Error: {error}</div>;

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

      {/* Tarjetas de KPIs (El Dinero y la Flota) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-600">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Flota Activa</h3>
          <p className="text-4xl font-black text-gray-900">{vehiculos.length} <span className="text-lg text-gray-500">unidades</span></p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Gastos Totales (Mantenimiento)</h3>
          {loadingKPIs ? (
            <p className="text-2xl font-bold text-gray-300">Calculando...</p>
          ) : (
            <p className="text-4xl font-black text-red-600">
              Q {totalGastos.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
            </p>
          )}
        </div>
      </div>

      {/* Tabla de Vehículos */}
      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 border-b-2 border-gray-200">
            <tr>
              <th className="p-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Placa</th>
              <th className="p-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Vehículo</th>
              <th className="p-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Estado</th>
              <th className="p-4 font-bold text-gray-700 uppercase text-xs tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {vehiculos.map((v) => (
              <tr key={v.id} className="hover:bg-blue-50 transition">
                <td className="p-4 font-black text-blue-800">{v.placa}</td>
                <td className="p-4 text-gray-800 font-medium">{v.marca} {v.modelo}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                    v.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {v.estado}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <a href={`/vehiculo/${v.id}`} className="bg-gray-900 text-white px-4 py-2 rounded font-bold text-xs hover:bg-gray-700 transition shadow">
                    VER HISTORIAL
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}