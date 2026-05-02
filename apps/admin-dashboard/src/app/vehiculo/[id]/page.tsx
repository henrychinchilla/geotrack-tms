'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function HistorialVehiculoPage() {
  const { id } = useParams();
  const [vehiculo, setVehiculo] = useState<any>(null);
  const [servicios, setServicios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados del formulario
  const [tipo, setTipo] = useState('Preventivo');
  const [costo, setCosto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data: vData } = await supabase.from('vehiculos').select('*').eq('id', id).single();
      const { data: sData } = await supabase.from('servicios').select('*').eq('vehiculo_id', id).order('fecha', { ascending: false });
      setVehiculo(vData);
      setServicios(sData || []);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    const { error } = await supabase.from('servicios').insert([
      { vehiculo_id: id, tipo_servicio: tipo, costo: parseFloat(costo), descripcion }
    ]);
    if (!error) window.location.reload();
    else { alert('Error: ' + error.message); setGuardando(false); }
  };

  if (loading) return <div className="p-10 font-sans text-xl font-bold">Cargando bitácora...</div>;
  if (!vehiculo) return <div className="p-10 font-sans text-red-600 font-bold">Error: Unidad no encontrada</div>;

  return (
    <main className="p-8 font-sans max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* Columna Izquierda: Detalles y Formulario */}
      <div className="md:col-span-1 flex flex-col gap-6">
        <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg">
          <h1 className="text-3xl font-black text-blue-400">{vehiculo.placa}</h1>
          <p className="text-lg font-medium">{vehiculo.marca} {vehiculo.modelo}</p>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-sm text-gray-400">Kilometraje: <span className="text-white font-bold">{vehiculo.kilometraje_actual} km</span></p>
            <p className="text-sm text-gray-400">Estado: <span className="text-green-400 font-bold uppercase">{vehiculo.estado}</span></p>
          </div>
          <a href="/" className="block mt-6 text-center bg-gray-800 p-2 rounded text-sm font-bold hover:bg-gray-700">VOLVER AL INICIO</a>
        </div>

        <form onSubmit={handleAddService} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="font-black text-gray-800 mb-4">Registrar Mantenimiento</h2>
          <div className="flex flex-col gap-3">
            <select className="border-2 p-2 rounded focus:border-blue-500 font-bold text-sm" value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="Preventivo">Preventivo</option>
              <option value="Correctivo">Correctivo</option>
              <option value="Llantas">Llantas</option>
              <option value="Combustible">Combustible</option>
            </select>
            <input type="number" step="0.01" className="border-2 p-2 rounded focus:border-blue-500 text-sm font-bold" placeholder="Costo Total (GTQ)" required value={costo} onChange={(e) => setCosto(e.target.value)} />
            <textarea className="border-2 p-2 rounded focus:border-blue-500 text-sm" placeholder="Descripción de los trabajos" required rows={3} value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></textarea>
            <button type="submit" disabled={guardando} className={`p-3 rounded font-black text-white shadow transition ${guardando ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {guardando ? 'REGISTRANDO...' : 'GUARDAR GASTO'}
            </button>
          </div>
        </form>
      </div>

      {/* Columna Derecha: Historial de Servicios */}
      <div className="md:col-span-2 bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-black text-gray-800 mb-6">Historial de Trabajos</h2>
        {servicios.length === 0 ? (
          <p className="text-gray-500 italic">No hay mantenimientos registrados para esta unidad.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {servicios.map((s) => (
              <div key={s.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-start hover:bg-gray-50 transition">
                <div>
                  <span className={`px-2 py-1 rounded text-xs font-black uppercase ${
                    s.tipo_servicio === 'Preventivo' ? 'bg-blue-100 text-blue-800' : 
                    s.tipo_servicio === 'Correctivo' ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-800'
                  }`}>
                    {s.tipo_servicio}
                  </span>
                  <p className="mt-2 text-gray-800 font-medium">{s.descripcion}</p>
                  <p className="text-xs text-gray-400 mt-1 font-bold">{new Date(s.fecha).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-gray-900">Q {s.costo}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </main>
  );
}