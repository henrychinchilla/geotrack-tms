'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Package, Truck } from 'lucide-react';

export default function InventarioPage() {
  const [stock, setStock] = useState<any[]>([]);

  useEffect(() => {
    const fetchStock = async () => {
      const { data } = await supabase
        .from('vehicle_inventory')
        .select('*, products(name, sku, unit_measure), vehicles(plate_number)');
      if (data) setStock(data);
    };
    fetchStock();
  }, []);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-black text-slate-800 mb-6 uppercase tracking-tight">Stock en Unidades</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stock.map(item => (
          <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                <Truck size={20} />
              </div>
              <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-1 rounded">
                {item.vehicles?.plate_number}
              </span>
            </div>
            <h3 className="font-bold text-slate-800">{item.products?.name}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-4">SKU: {item.products?.sku}</p>
            <div className="flex justify-between items-end">
              <p className="text-xs text-slate-400 font-bold uppercase">Disponible</p>
              <p className={`text-2xl font-black ${item.quantity < 5 ? 'text-red-600' : 'text-slate-800'}`}>
                {item.quantity} <span className="text-xs font-normal text-slate-400">{item.products?.unit_measure}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
