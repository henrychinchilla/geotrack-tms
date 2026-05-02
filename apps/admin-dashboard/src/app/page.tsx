'use client';
import { useVehiculos } from '@/hooks/useVehiculos';

export default function DashboardPage() {
  const { vehiculos, loading, error } = useVehiculos();

  if (loading) return <div className="p-10 text-center font-sans">Cargando flota de GeoTrack...</div>;
  if (error) return <div className="p-10 text-center font-sans text-red-500">Error: {error}</div>;

  return (
    <main className="p-8 font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">GeoTrack TMS - Dashboard</h1>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
          {vehiculos.length} Unidades
        </span>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Placa</th>
              <th className="p-4 font-semibold text-gray-600">Vehículo</th>
              <th className="p-4 font-semibold text-gray-600">Estado</th>
            </tr>
          </thead>
          <tbody>
            {vehiculos.map((v) => (
              <tr key={v.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-bold text-blue-600">{v.placa}</td>
                <td className="p-4 text-gray-700">{v.marca} {v.modelo}</td>
                <td className="p-4 text-xs font-bold uppercase">{v.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}