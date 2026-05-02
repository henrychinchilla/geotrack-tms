'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function RegistroPage() {
  const [formData, setFormData] = useState({ placa: '', marca: '', modelo: '', kilometraje: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('vehiculos').insert([
      { 
        placa: formData.placa, 
        marca: formData.marca, 
        modelo: formData.modelo, 
        kilometraje_actual: parseInt(formData.kilometraje) 
      }
    ]);

    if (error) alert('Error al registrar: ' + error.message);
    else {
      alert('Vehículo registrado con éxito');
      window.location.href = '/';
    }
  };

  return (
    <main className="p-8 font-sans max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Registrar Nueva Unidad</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-6 shadow rounded">
        <input className="border p-2 rounded" placeholder="Placa (ej. C-123ABC)" required
          onChange={e => setFormData({...formData, placa: e.target.value})} />
        <input className="border p-2 rounded" placeholder="Marca (ej. International)" required
          onChange={e => setFormData({...formData, marca: e.target.value})} />
        <input className="border p-2 rounded" placeholder="Modelo" required
          onChange={e => setFormData({...formData, modelo: e.target.value})} />
        <input className="border p-2 rounded" type="number" placeholder="Kilometraje Inicial" required
          onChange={e => setFormData({...formData, kilometraje: e.target.value})} />
        <button type="submit" className="bg-blue-600 text-white p-3 rounded font-bold">Guardar Vehículo</button>
        <a href="/" className="text-center text-gray-500 text-sm mt-2">Cancelar y volver</a>
      </form>
    </main>
  );
}