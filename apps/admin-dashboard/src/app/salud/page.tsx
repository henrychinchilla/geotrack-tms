'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SaludPage() {
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [historial, setHistorial] = useState<any[]>([]);
  const [seleccionado, setSeleccionado] = useState('');

  useEffect(() => {
    async function cargarDatos() {
      const { data } = await supabase.from('vehiculos').select('*');
      if (data) setVehiculos(data);
    }
    cargarDatos();
  }, []);

  const cargarSalud = async (id: string) => {
    setSeleccionado(id);
    const { data } = await supabase
      .from('salud_vehiculo')
      .select('*')
      .eq('vehiculo_id', id)
      .order('fecha', { ascending: false });
    if (data) setHistorial(data);
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Salud del Vehículo</h1>
      <p className="text-slate-500 mb-8">Diagnóstico de motor y sistemas electrónicos</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Selector de Unidades */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-semibold mb-4 text-slate-700">Seleccionar Unidad</h2>
          <div className="space-y-2">
            {vehiculos.map((v) => (
              <button
                key={v.id}
                onClick={() => cargarSalud(v.id)}
                className={`w-full text-left p-3 rounded-lg border transition ${
                  seleccionado === v.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-100 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold">{v.placa}</div>
                <div className="text-xs opacity-70">{v.marca} {v.modelo}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Panel de Diagnóstico */}
        <div className="lg:col-span-2 space-y-6">
          {seleccionado ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-600 p-6 rounded-xl text-white shadow-md">
                  <div className="text-blue-100 text-sm uppercase font-bold">Estado General</div>
                  <div className="text-3xl font-bold mt-1">Estable</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <div className="text-slate-400 text-sm uppercase font-bold">Alertas Activas</div>
                  <div className="text-3xl font-bold mt-1 text-red-500">{historial.filter(h => h.gravedad === 'Alta').length}</div>
                </div>
              </div>

              {/* Historial de Fallas */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-700">Bitácora de Diagnóstico (DTC)</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {historial.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 italic">No hay registros de fallas para esta unidad.</div>
                  ) : (
                    historial.map((h) => (
                      <div key={h.id} className="p-4 hover:bg-slate-50 transition">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-mono font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded text-sm mr-2">
                              {h.codigo_dtc}
                            </span>
                            <span className="text-slate-800 font-medium">{h.descripcion_falla}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                            h.gravedad === 'Critica' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {h.gravedad}
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-slate-500">
                          Detectado el: {new Date(h.fecha).toLocaleString()} • {h.kilometraje} KM
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-gray-200 rounded-xl p-12">
              <p>Selecciona un vehículo de la izquierda para ver su historial de salud.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}