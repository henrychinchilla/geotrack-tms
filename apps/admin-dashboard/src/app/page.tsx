'use client';
import { useVehiculos } from '@/hooks/useVehiculos';

export default function DashboardPage() {
  const { vehiculos, loading, error } = useVehiculos();

  if (loading) return <div className="p-10 text-center font-sans">Cargando flota de GeoTrack...</div>;
  if (error) return <div className="p-10 text-center font-sans text-red-500">Error: {error}</div>;

  return (
    <main className="p-8 font-sans bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900">GeoTrack TMS - Dashboard</h1>
          <p className="text-gray-500 font-medium">Control de flota y mantenimientos</p>
        </div>
        <a href="/registro" className="bg-blue-700 text-white px-6 py-3 rounded-lg font-bold shadow-md hover:bg-blue-800 transition">
          + NUEVA UNIDAD
        </a>
      </div>

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