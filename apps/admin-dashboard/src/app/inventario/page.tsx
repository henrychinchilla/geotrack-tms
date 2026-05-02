'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function InventarioPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    async function cargarInventario() {
      const { data } = await supabase.from('inventario').select('*').order('nombre_repuesto');
      if (data) setItems(data);
    }
    cargarInventario();
  }, []);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Bodega de Repuestos</h1>
          <p className="text-slate-500 font-medium">Control de existencias TallerPro</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition">
          + Registrar Compra
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {items.filter(i => i.cantidad_stock <= i.punto_reorden).map(i => (
          <div key={i.id} className="bg-red-50 border-2 border-red-200 p-4 rounded-2xl animate-pulse">
            <p className="text-red-600 text-xs font-black uppercase">Stock Crítico</p>
            <p className="text-slate-900 font-bold">{i.nombre_repuesto}</p>
            <p className="text-2xl font-black text-red-700">{i.cantidad_stock} {i.unidad_medida}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900 text-white text-xs uppercase">
            <tr>
              <th className="p-4 text-center">Estado</th>
              <th className="p-4">Repuesto</th>
              <th className="p-4">Categoría</th>
              <th className="p-4 text-right">Stock</th>
              <th className="p-4 text-right">Precio Unitario</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="p-4 text-center">
                  <div className={`w-3 h-3 rounded-full mx-auto ${item.cantidad_stock > item.punto_reorden ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </td>
                <td className="p-4 font-bold text-slate-800">{item.nombre_repuesto}</td>
                <td className="p-4 text-slate-500 text-sm">{item.categoria}</td>
                <td className="p-4 text-right font-mono font-bold">
                  {item.cantidad_stock} <span className="text-[10px] text-slate-400">{item.unidad_medida}</span>
                </td>
                <td className="p-4 text-right font-bold text-slate-900">Q{item.precio_unitario}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}