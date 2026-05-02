'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function ViajesPage() {
  const [viajes, setViajes] = useState<any[]>([]);
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Formulario
  const [vehiculoId, setVehiculoId] = useState('');
  const [ruta, setRuta] = useState('');
  const [piloto, setPiloto] = useState('');
  const [viatico, setViatico] = useState('');

  const fetchDatos = async () => {
    // Traer vehículos operativos para el select
    const { data: vData } = await supabase.from('vehiculos').select('id, placa, marca').eq('estado', 'activo');
    setVehiculos(vData || []);
    if (vData && vData.length > 0) setVehiculoId(vData[0].id);

    // Traer viajes activos haciendo un JOIN manual simulado o pidiendo los datos
    const { data: viajesData } = await supabase.from('viajes').select(`*, vehiculos(placa, marca)`).order('fecha', { ascending: false });
    setViajes(viajesData || []);
    setLoading(false);
  };

  useEffect(() => { fetchDatos(); }, []);

  const handleAsignarViaje = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    const { error } = await supabase.from('viajes').insert([
      { vehiculo_id: vehiculoId, ruta, piloto, viatico: parseFloat(viatico) || 0 }
    ]);
    if (!error) {
      window.location.reload();
    } else {
      alert('Error: ' + error.message);
      setGuardando(false);
    }
  };

  const marcarCompletado = async (id: string) => {
    await supabase.from('viajes').update({ estado: 'Completado' }).eq('id', id);
    fetchDatos();
  };

  if (loading) return <div className="p-10 font-bold text-center">Cargando módulo logístico...</div>;

  return (
    <main className="p-8 font-sans max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Columna Izquierda: Formulario de Despacho */}
      <div className="md:col-span-1">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-gray-900">Despacho</h1>
          <p className="text-gray-500 font-medium">Asignación de viajes y viáticos</p>
          <a href="/" className="inline-block mt-4 text-blue-600 font-bold text-sm hover:underline">← VOLVER AL DASHBOARD</a>
        </div>

        <form onSubmit={handleAsignarViaje} className="bg-white p-6 rounded-xl shadow-md border border-l-4 border-l-indigo-600">
          <h2 className="font-black text-gray-800 mb-4">Nueva Hoja de Ruta</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Unidad</label>
              <select className="w-full border-2 p-2 rounded focus:border-indigo-500 font-bold text-sm mt-1" value={vehiculoId} onChange={(e) => setVehiculoId(e.target.value)}>
                {vehiculos.map(v => <option key={v.id} value={v.id}>{v.placa} - {v.marca}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Ruta / Destino</label>
              <input type="text" className="w-full border-2 p-2 rounded focus:border-indigo-500 text-sm font-bold mt-1" placeholder="Ej. Jutiapa - Escuintla" required value={ruta} onChange={(e) => setRuta(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Nombre del Piloto</label>
              <input type="text" className="w-full border-2 p-2 rounded focus:border-indigo-500 text-sm font-bold mt-1" placeholder="Nombre completo" required value={piloto} onChange={(e) => setPiloto(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Viático Asignado (GTQ)</label>
              <input type="number" step="0.01" className="w-full border-2 p-2 rounded focus:border-indigo-500 text-sm font-bold mt-1" placeholder="0.00" required value={viatico} onChange={(e) => setViatico(e.target.value)} />
            </div>
            <button type="submit" disabled={guardando} className={`p-3 rounded font-black text-white shadow transition mt-2 ${guardando ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
              {guardando ? 'AUTORIZANDO...' : 'INICIAR VIAJE'}
            </button>
          </div>
        </form>
      </div>

      {/* Columna Derecha: Tablero de Viajes */}
      <div className="md:col-span-2">
        <h2 className="text-xl font-black text-gray-800 mb-6">Rutas Activas e Historial</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-bold text-gray-600 text-xs uppercase">Unidad</th>
                <th className="p-4 font-bold text-gray-600 text-xs uppercase">Ruta / Piloto</th>
                <th className="p-4 font-bold text-gray-600 text-xs uppercase">Viático</th>
                <th className="p-4 font-bold text-gray-600 text-xs uppercase text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {viajes.length === 0 ? (
                <tr><td colSpan={4} className="p-6 text-center text-gray-500 italic">No hay viajes registrados.</td></tr>
              ) : (
                viajes.map((viaje) => (
                  <tr key={viaje.id} className="hover:bg-indigo-50 transition">
                    <td className="p-4 font-black text-blue-800">{viaje.vehiculos?.placa}</td>
                    <td className="p-4">
                      <p className="font-bold text-gray-800">{viaje.ruta}</p>
                      <p className="text-xs text-gray-500">{viaje.piloto} • {new Date(viaje.fecha).toLocaleDateString()}</p>
                    </td>
                    <td className="p-4 font-black text-green-700">Q {viaje.viatico}</td>
                    <td className="p-4 text-right">
                      {viaje.estado === 'En ruta' ? (
                        <button onClick={() => marcarCompletado(viaje.id)} className="bg-yellow-100 text-yellow-800 border border-yellow-300 px-3 py-1 rounded text-xs font-bold shadow-sm hover:bg-yellow-200">
                          FINALIZAR VIAJE
                        </button>
                      ) : (
                        <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded text-xs font-bold">COMPLETADO</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}