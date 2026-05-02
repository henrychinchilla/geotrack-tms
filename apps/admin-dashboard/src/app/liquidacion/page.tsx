'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function LiquidacionPage() {
  const [rutasActivas, setRutasActivas] = useState<any[]>([]);
  const [seleccionada, setSeleccionada] = useState<any>(null);
  const [datosCierre, setDatosCierre] = useState({
    km_finales: 0,
    galones: 0,
    peajes: 0,
    viaticos: 0,
    observaciones: ''
  });

  useEffect(() => {
    cargarRutasEnTransito();
  }, []);

  async function cargarRutasEnTransito() {
    const { data } = await supabase
      .from('rutas')
      .select('*, vehiculos(placa)')
      .eq('estado_ruta', 'En transito')
      .order('fecha_creacion', { ascending: false });
    if (data) setRutasActivas(data);
  }

  const liquidarViaje = async () => {
    if (!seleccionada) return;

    const { error } = await supabase
      .from('rutas')
      .update({
        km_finales: datosCierre.km_finales,
        galones_diesel: datosCierre.galones,
        gasto_peajes: datosCierre.peajes,
        viaticos_piloto: datosCierre.viaticos,
        observaciones_viaje: datosCierre.observaciones,
        estado_ruta: 'Liquidada'
      })
      .eq('id', seleccionada.id);

    if (error) {
      alert("Error al liquidar: " + error.message);
    } else {
      alert("✅ Viaje liquidado exitosamente. Los datos de rentabilidad han sido actualizados.");
      setSeleccionada(null);
      cargarRutasEnTransito();
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-black text-slate-900 mb-2">Liquidación de Viajes</h1>
      <p className="text-slate-500 mb-8">Cierre de operaciones y control de gastos reales</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LISTA DE RUTAS PENDIENTES */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <span>🚚</span> Unidades en Ruta
          </h2>
          <div className="space-y-3">
            {rutasActivas.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No hay rutas activas para liquidar.</p>
            ) : (
              rutasActivas.map(r => (
                <button 
                  key={r.id}
                  onClick={() => setSeleccionada(r)}
                  className={`w-full text-left p-4 rounded-xl border transition ${
                    seleccionada?.id === r.id ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-black text-blue-600">{r.vehiculos?.placa}</div>
                  <div className="text-sm font-bold text-slate-700">{r.cliente_nombre}</div>
                  <div className="text-xs text-slate-400 mt-1">Salida: {new Date(r.fecha_creacion).toLocaleDateString()}</div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* FORMULARIO DE CIERRE */}
        <div className="lg:col-span-2">
          {seleccionada ? (
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-800">Cerrar Ruta: {seleccionada.vehiculos?.placa}</h3>
                  <p className="text-slate-500 text-sm">Destino: {seleccionada.cliente_nombre}</p>
                </div>
                <div className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-black uppercase">
                  Estimado: {seleccionada.distancia_km} KM
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-1">Kilometraje Final</label>
                    <input 
                      type="number" 
                      className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      onChange={(e) => setDatosCierre({...datosCierre, km_finales: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-1">Galones de Diésel</label>
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      onChange={(e) => setDatosCierre({...datosCierre, galones: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-1">Gasto en Peajes (Q)</label>
                    <input 
                      type="number" 
                      className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      onChange={(e) => setDatosCierre({...datosCierre, peajes: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-1">Viáticos Piloto (Q)</label>
                    <input 
                      type="number" 
                      className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      onChange={(e) => setDatosCierre({...datosCierre, viaticos: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-xs font-black text-slate-500 uppercase mb-1">Observaciones del Viaje</label>
                <textarea 
                  className="w-full p-3 bg-slate-50 border rounded-xl h-24 focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={(e) => setDatosCierre({...datosCierre, observaciones: e.target.value})}
                  placeholder="Ej: Retraso por accidente en km 45, unidad sin novedad."
                ></textarea>
              </div>

              <button 
                onClick={liquidarViaje}
                className="w-full mt-8 bg-slate-900 text-white py-4 rounded-xl font-black text-lg hover:bg-black transition shadow-xl uppercase tracking-widest"
              >
                Finalizar y Liquidar Ruta
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center border-4 border-dashed border-slate-200 rounded-3xl p-12 text-slate-400">
              <span className="text-6xl mb-4">🚛</span>
              <p className="font-bold text-lg">Selecciona una unidad de la izquierda para liquidar su viaje.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}