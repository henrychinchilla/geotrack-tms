'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Truck } from 'lucide-react';

export default function InventarioPage() {
  const [stock, setStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStock = async () => {
      const { data, error } = await supabase
        .from('vehicle_inventory')
        .select('*, products(name, sku, unit_measure), vehicles(plate_number)');
      
      if (error) console.error("Error de inventario:", error);
      if (data) setStock(data);
      setLoading(false);
    };
    getStock();
  }, []);

  if (loading) return <div className="p-10 font-bold text-slate-500">Sincronizando inventario...</div>;

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-black text-slate-800 mb-6 uppercase tracking-tight">Stock en Unidades</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stock.map(item => (
          <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                <Truck size={20} />
              </div>
              <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-1 rounded">
                {item.vehicles?.plate_number || 'Unidad N/A'}
              </span>
            </div>
            <h3 className="font-bold text-slate-800">{item.products?.name || 'Producto N/A'}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-4">SKU: {item.products?.sku || 'N/A'}</p>
            <div className="flex justify-between items-end border-t border-slate-50 pt-4 mt-2">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Disponible</p>
              <p className={`text-2xl font-black ${Number(item.quantity || 0) < 5 ? 'text-red-600' : 'text-slate-800'}`}>
                {Number(item.quantity || 0)} <span className="text-[10px] font-normal text-slate-400">{item.products?.unit_measure || 'unidades'}</span>
              </p>
            </div>
          </div>
        ))}
        {stock.length === 0 && (
          <div className="col-span-full text-slate-400 font-bold p-10 bg-white rounded-xl border border-dashed border-slate-200 text-center">
            No hay stock registrado o las tablas de inventario aún no están enlazadas en Supabase.
          </div>
        )}
      </div>
    </div>
  );
}
