'use client';
import { useVehiculos } from '@/hooks/useVehiculos';

export default function DashboardPage() {
  const { vehiculos, loading, error } = useVehiculos();

  if (loading) return <div className="p-10 text-center">Cargando flota...</div>;

  return (
    <main className="p-8 font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">GeoTrack TMS - Dashboard</h1>
          <p className="text-gray-500 text-sm">Control de flota activa en Guatemala</p>
        </div>
        <a href="/registro" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-700 transition">
          + Nueva Unidad
        </a>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Placa</th>
              <th className="p-4 font-semibold text-gray-600">Vehículo</th>
              <th className="p-4 font-semibold text-gray-600">Estado</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vehiculos.map((v) => (
              <tr key={v.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 font-bold text-blue-600">{v.placa}</td>
                <td className="p-4 text-gray-700">{v.marca} {v.modelo}</td>
                <td className="p-4">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase">
                    {v.estado}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-blue-500 hover:underline text-sm font-medium">Ver Historial</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}