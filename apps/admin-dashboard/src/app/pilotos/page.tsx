'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function PilotosPage() {
  const [pilotos, setPilotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Formulario
  const [nombre, setNombre] = useState('');
  const [licencia, setLicencia] = useState('');
  const [vencimiento, setVencimiento] = useState('');
  const [telefono, setTelefono] = useState('');

  const fetchPilotos = async () => {
    const { data } = await supabase.from('pilotos').select('*').order('nombre_completo', { ascending: true });
    setPilotos(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPilotos(); }, []);

  const handleRegistrarPiloto = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    const { error } = await supabase.from('pilotos').insert([
      { nombre_completo: nombre, numero_licencia: licencia, vencimiento_licencia: vencimiento, telefono }
    ]);
    if (!error) {
      window.location.reload();
    } else {
      alert('Error al registrar: ' + error.message);
      setGuardando(false);
    }
  };

  const cambiarEstado = async (id: string, nuevoEstado: string) => {
    await supabase.from('pilotos').update({ estado: nuevoEstado }).eq('id', id);
    fetchPilotos();
  };

  if (loading) return <div className="p-10 font-bold text-center font-sans">Cargando módulo de RRHH...</div>;

  const hoy = new Date();

  return (
    <main className="p-8 font-sans max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Columna Izquierda: Formulario */}
      <div className="md:col-span-1">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-gray-900">Pilotos</h1>
          <p className="text-gray-500 font-medium">Gestión de personal y licencias</p>
          <a href="/" className="inline-block mt-4 text-blue-600 font-bold text-sm hover:underline">← VOLVER AL DASHBOARD</a>
        </div>

        <form onSubmit={handleRegistrarPiloto} className="bg-white p-6 rounded-xl shadow-md border border-l-4 border-l-teal-600">
          <h2 className="font-black text-gray-800 mb-4">Registrar Nuevo Piloto</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Nombre Completo</label>
              <input type="text" className="w-full border-2 p-2 rounded focus:border-teal-500 text-sm font-bold mt-1" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Número de Licencia</label>
              <input type="text" className="w-full border-2 p-2 rounded focus:border-teal-500 text-sm font-bold mt-1" required value={licencia} onChange={(e) => setLicencia(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Fecha de Vencimiento</label>
              <input type="date" className="w-full border-2 p-2 rounded focus:border-teal-500 text-sm font-bold mt-1" required value={vencimiento} onChange={(e) => setVencimiento(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Teléfono de Contacto</label>
              <input type="text" className="w-full border-2 p-2 rounded focus:border-teal-500 text-sm font-bold mt-1" required value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            </div>
            <button type="submit" disabled={guardando} className={`p-3 rounded font-black text-white shadow transition mt-2 ${guardando ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700'}`}>
              {guardando ? 'GUARDANDO...' : 'REGISTRAR PILOTO'}
            </button>
          </div>
        </form>
      </div>

      {/* Columna Derecha: Directorio */}
      <div className="md:col-span-2">
        <h2 className="text-xl font-black text-gray-800 mb-6">Directorio Activo</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-bold text-gray-600 text-xs uppercase">Piloto</th>
                <th className="p-4 font-bold text-gray-600 text-xs uppercase">Licencia</th>
                <th className="p-4 font-bold text-gray-600 text-xs uppercase">Estado</th>
                <th className="p-4 font-bold text-gray-600 text-xs uppercase text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pilotos.length === 0 ? (
                <tr><td colSpan={4} className="p-6 text-center text-gray-500 italic">No hay pilotos registrados.</td></tr>
              ) : (
                pilotos.map((p) => {
                  const fechaVencimiento = new Date(p.vencimiento_licencia);
                  const estaVencida = fechaVencimiento < hoy;

                  return (
                  <tr key={p.id} className="hover:bg-teal-50 transition">
                    <td className="p-4">
                      <p className="font-black text-gray-900">{p.nombre_completo}</p>
                      <p className="text-xs font-bold text-gray-500">📞 {p.telefono}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-gray-800">{p.numero_licencia}</p>
                      {estaVencida ? (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-black uppercase mt-1 inline-block">VENCIDA</span>
                      ) : (
                        <span className="text-xs text-green-600 font-bold mt-1 block">Vence: {fechaVencimiento.toLocaleDateString()}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded text-xs font-black uppercase ${
                        p.estado === 'Disponible' ? 'bg-green-100 text-green-800' : 
                        p.estado === 'En Viaje' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'
                      }`}>
                        {p.estado}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {p.estado === 'Disponible' ? (
                        <button onClick={() => cambiarEstado(p.id, 'Inactivo')} className="text-xs font-bold text-red-500 hover:underline">Dar de Baja</button>
                      ) : p.estado === 'Inactivo' ? (
                        <button onClick={() => cambiarEstado(p.id, 'Disponible')} className="text-xs font-bold text-green-500 hover:underline">Reactivar</button>
                      ) : (
                        <span className="text-xs text-gray-400 font-bold">En ruta</span>
                      )}
                    </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}