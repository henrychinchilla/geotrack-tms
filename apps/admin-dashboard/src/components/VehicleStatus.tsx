import React from 'react';
import { Truck, AlertCircle, CheckCircle2 } from 'lucide-react';

export const VehicleStatus = ({ vehicles }: any) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Estado de la Flota</h3>
      <div className="space-y-4">
        {vehicles.map((v: any) => (
          <div key={v.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${v.status === 'available' ? 'bg-green-100' : 'bg-orange-100'}`}>
                <Truck size={18} className={v.status === 'available' ? 'text-green-600' : 'text-orange-600'} />
              </div>
              <div>
                <p className="font-bold text-slate-700">{v.plate_number}</p>
                <p className="text-xs text-slate-500">{v.brand} {v.model}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{v.current_km.toLocaleString()} km</p>
              <span className={`text-[10px] uppercase font-bold ${v.status === 'available' ? 'text-green-500' : 'text-orange-500'}`}>
                {v.status === 'available' ? 'Disponible' : 'En Ruta'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
