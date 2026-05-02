'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Truck, AlertTriangle, CheckCircle } from 'lucide-react';

export default function FlotaPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.from('vehicles').select('*').order('plate_number');
      if (data) setVehicles(data);
    };
    getData();
  }, []);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Gestión de Flota Real</h1>
      <div className="grid gap-4">
        {vehicles.map(v => (
          <div key={v.id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center border border-slate-200">
            <div>
              <p className="font-black text-blue-600">{v.plate_number}</p>
              <p className="text-sm text-slate-600 uppercase">{v.brand} {v.model}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold">{v.current_km.toLocaleString()} KM</p>
              <span className={`text-[10px] font-bold px-2 py-1 rounded ${v.status === 'maintenance' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {v.status === 'maintenance' ? 'REQUIERE SERVICIO' : 'OPERATIVO'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
