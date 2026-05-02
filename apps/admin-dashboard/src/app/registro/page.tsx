'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function RegistroPage() {
  const [formData, setFormData] = useState({ placa: '', marca: '', modelo: '', kilometraje: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.from('vehiculos').insert([
      { 
        placa: formData.placa, 
        marca: formData.marca, 
        modelo: formData.modelo, 
        kilometraje_actual: parseInt(formData.kilometraje) || 0 
      }
    ]);

    if (error) {
      alert('Error al registrar: ' + error.message);
      setLoading(false);
    } else {
      alert('Unidad ' + formData.placa + ' registrada con éxito');
      window.location.href = '/';
    }
  };

  return (
    <main className="p-8 font-sans max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Nueva Unidad - GeoTrack</h1>
        <p className="text-gray-500">Ingresa los datos técnicos del vehículo</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-white p-8 shadow-xl rounded-xl border border-gray-100">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-600">Placa</label>
          <input className="border-2 p-3 rounded-lg focus:border-blue-500 outline-none transition" 
            placeholder="C-123ABC" required
            onChange={e => setFormData({...formData, placa: e.target.value.toUpperCase()})} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-600">Marca</label>
          <input className="border-2 p-3 rounded-lg focus:border-blue-500 outline-none transition" 
            placeholder="Ej. International" required
            onChange={e => setFormData({...formData, marca: e.target.value})} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-600">Modelo / Línea</label>
          <input className="border-2 p-3 rounded-lg focus:border-blue-500 outline-none transition" 
            placeholder="Ej. 4300" required
            onChange={e => setFormData({...formData, modelo: e.target.value})} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-gray-600">Kilometraje Actual</label>
          <input className="border-2 p-3 rounded-lg focus:border-blue-500 outline-none transition" 
            type="number" placeholder="0" required
            onChange={e => setFormData({...formData, kilometraje: e.target.value})} />
        </div>

        <button type="submit" disabled={loading}
          className={`p-4 rounded-lg font-black text-white shadow-lg transition ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}>
          {loading ? 'GUARDANDO...' : 'GUARDAR VEHÍCULO'}
        </button>
        
        <a href="/" className="text-center text-gray-400 font-bold hover:text-gray-600 transition text-sm">
          CANCELAR Y VOLVER
        </a>
      </form>
    </main>
  );
}