'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function UnidadesPage() {
  const [unidades, setUnidades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para el formulario
  const [nuevaUnidad, setNuevaUnidad] = useState({
    placa: '',
    marca: '',
    modelo: '',
    estado: 'activo'
  });

  async function cargarUnidades() {
    setLoading(true);
    const { data, error } = await supabase
      .from('vehiculos')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setUnidades(data);
    setLoading(false);
  }

  useEffect(() => {
    cargarUnidades();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('vehiculos').insert([nuevaUnidad]);

    if (!error) {
      setNuevaUnidad({ placa: '', marca: '', modelo: '', estado: 'activo' });
      cargarUnidades(); // Refrescar la lista
      alert('¡Unidad registrada con éxito!');
    } else {
      alert('Error al registrar: ' + error.message);
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Gestión de Flota</h1>
        <p className="text-slate-500">Registra y administra tus camiones International y Foton</p>
      </div>

      {/* Formulario de Registro Rápido */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-slate-700">Registrar Nueva Unidad</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Placa (ej: C-123ABC)"
            value={nuevaUnidad.placa}
            onChange={(e) => setNuevaUnidad({...nuevaUnidad, placa: e.target.value.toUpperCase()})}
            required
          />
          <input
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Marca (ej: International)"
            value={nuevaUnidad.marca}
            onChange={(e) => setNuevaUnidad({...nuevaUnidad, marca: e.target.value})}
            required
          />
          <input
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Modelo (ej: 4300)"
            value={nuevaUnidad.modelo}
            onChange={(e) => setNuevaUnidad({...nuevaUnidad, modelo: e.target.value})}
            required
          />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition font-medium">
            Guardar Unidad
          </button>
        </form>
      </div>

      {/* Tabla de Resultados */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Placa</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Marca / Modelo</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-10 text-center text-slate-400 animate-pulse">Cargando...</td></tr>
            ) : unidades.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-10 text-center text-slate-400">Sin unidades registradas.</td></tr>
            ) : (
              unidades.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono font-bold text-blue-600">{u.placa}</td>
                  <td className="px-6 py-4 text-slate-700">{u.marca} {u.modelo}</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      {u.estado}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}