'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function HistorialVehiculoPage() {
  const { id } = useParams();
  const [vehiculo, setVehiculo] = useState<any>(null);
  const [servicios, setServicios] = useState<any[]>([]);
  const [cargasCombustible, setCargasCombustible] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados Formulario Mantenimiento
  const [tipo, setTipo] = useState('Preventivo');
  const [costo, setCosto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Estados Formulario Combustible
  const [galones, setGalones] = useState('');
  const [costoCombustible, setCostoCombustible] = useState('');
  const [kmCombustible, setKmCombustible] = useState('');
  const [guardandoComb, setGuardandoComb] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data: vData } = await supabase.from('vehiculos').select('*').eq('id', id).single();
      const { data: sData } = await supabase.from('servicios').select('*').eq('vehiculo_id', id).order('fecha', { ascending: false });
      const { data: cData } = await supabase.from('combustible').select('*').eq('vehiculo_id', id).order('fecha', { ascending: false });
      
      setVehiculo(vData);
      setServicios(sData || []);
      setCargasCombustible(cData || []);
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

  const handleAddCombustible = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardandoComb(true);
    const { error } = await supabase.from('combustible').insert([
      { 
        vehiculo_id: id, 
        galones: parseFloat(galones), 
        costo_total: parseFloat(costoCombustible), 
        kilometraje_actual: parseInt(kmCombustible) 
      }
    ]);
    
    // El sistema actualiza el kilometraje global del camión al cargar diésel
    if (!error) {
        await supabase.from('vehiculos').update({ kilometraje_actual: parseInt(kmCombustible) }).eq('id', id);
        window.location.reload();
    } else { 
        alert('Error: ' + error.message); setGuardandoComb(false); 
    }
  };

  if (loading) return <div className="p-10 font-sans text-xl font-bold">Cargando bitácora y consumos...</div>;
  if (!vehiculo) return <div className="p-10 font-sans text-red-600 font-bold">Error: Unidad no encontrada</div>;

  return (
    <main className="p-8 font-sans max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* COLUMNA IZQUIERDA: Info y Formularios */}
      <div className="md:col-span-1 flex flex-col gap-6">
        
        {/* Tarjeta de Vehículo */}
        <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg">
          <h1 className="text-3xl font-black text-blue-400">{vehiculo.placa}</h1>
          <p className="text-lg font-medium">{vehiculo.marca} {vehiculo.modelo}</p>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-sm text-gray-400">Kilometraje: <span className="text-white font-bold">{vehiculo.kilometraje_actual} km</span></p>
            <p className="text-sm text-gray-400">Estado: <span className="text-green-400 font-bold uppercase">{vehiculo.estado}</span></p>
          </div>
          <a href="/" className="block mt-6 text-center bg-gray-800 p-2 rounded text-sm font-bold hover:bg-gray-700 transition">VOLVER AL DASHBOARD</a>
        </div>

        {/* Formulario de Combustible (NUEVO) */}
        <form onSubmit={handleAddCombustible} className="bg-white p-6 rounded-xl shadow-md border border-l-4 border-l-orange-500 border-gray-100">
          <h2 className="font-black text-gray-800 mb-4">Cargar Combustible</h2>
          <div className="flex flex-col gap-3">
            <input type="number" step="0.01" className="border-2 p-2 rounded focus:border-orange-500 text-sm font-bold" placeholder="Galones Despachados" required value={galones} onChange={(e) => setGalones(e.target.value)} />
            <input type="number" step="0.01" className="border-2 p-2 rounded focus:border-orange-500 text-sm font-bold" placeholder="Costo Total (GTQ)" required value={costoCombustible} onChange={(e) => setCostoCombustible(e.target.value)} />
            <input type="number" className="border-2 p-2 rounded focus:border-orange-500 text-sm font-bold" placeholder="Kilometraje en bomba" required value={kmCombustible} onChange={(e) => setKmCombustible(e.target.value)} />
            <button type="submit" disabled={guardandoComb} className={`p-3 rounded font-black text-white shadow transition ${guardandoComb ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'}`}>
              {guardandoComb ? 'REGISTRANDO...' : 'GUARDAR CARGA'}
            </button>
          </div>
        </form>

        {/* Formulario de Mantenimiento */}
        <form onSubmit={handleAddService} className="bg-white p-6 rounded-xl shadow-md border border-l-4 border-l-blue-600 border-gray-100">
          <h2 className="font-black text-gray-800 mb-4">Registrar Mantenimiento</h2>
          <div className="flex flex-col gap-3">
            <select className="border-2 p-2 rounded focus:border-blue-500 font-bold text-sm" value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="Preventivo">Preventivo</option>
              <option value="Correctivo">Correctivo</option>
              <option value="Llantas">Llantas</option>
            </select>
            <input type="number" step="0.01" className="border-2 p-2 rounded focus:border-blue-500 text-sm font-bold" placeholder="Costo Total (GTQ)" required value={costo} onChange={(e) => setCosto(e.target.value)} />
            <textarea className="border-2 p-2 rounded focus:border-blue-500 text-sm" placeholder="Descripción de los trabajos" required rows={2} value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></textarea>
            <button type="submit" disabled={guardando} className={`p-3 rounded font-black text-white shadow transition ${guardando ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {guardando ? 'REGISTRANDO...' : 'GUARDAR GASTO'}
            </button>
          </div>
        </form>
      </div>

      {/* COLUMNA DERECHA: Historiales */}
      <div className="md:col-span-2 flex flex-col gap-8">
        
        {/* Historial de Combustible (NUEVO) */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-black text-gray-800 mb-6">Registro de Combustible (Diésel/Gasolina)</h2>
          {cargasCombustible.length === 0 ? (
            <p className="text-gray-500 italic">No hay cargas de combustible registradas.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {cargasCombustible.map((c) => (
                <div key={c.id} className="border border-gray-200 rounded-lg p-3 flex justify-between items-center hover:bg-orange-50 transition">
                  <div>
                    <p className="font-black text-gray-800">{c.galones} Galones</p>
                    <p className="text-xs text-gray-500 mt-1 font-bold">KM actual: {c.kilometraje_actual} | Fecha: {new Date(c.fecha).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-orange-600">Q {c.costo_total}</p>
                    <p className="text-xs font-bold text-gray-400">Q {(c.costo_total / c.galones).toFixed(2)}/gal</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Historial de Trabajos */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-black text-gray-800 mb-6">Historial de Mantenimiento</h2>
          {servicios.length === 0 ? (
            <p className="text-gray-500 italic">No hay mantenimientos registrados.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {servicios.map((s) => (
                <div key={s.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-start hover:bg-gray-50 transition">
                  <div>
                    <span className={`px-2 py-1 rounded text-xs font-black uppercase ${
                      s.tipo_servicio === 'Preventivo' ? 'bg-blue-100 text-blue-800' : 
                      s.tipo_servicio === 'Correctivo' ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-800'
                    }`}>
                      {s.tipo_servicio}
                    </span>
                    <p className="mt-2 text-gray-800 font-medium text-sm">{s.descripcion}</p>
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

      </div>
    </main>
  );
}