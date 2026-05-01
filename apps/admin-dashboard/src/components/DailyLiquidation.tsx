import React from 'react';
import { Truck, FileText, MapPin, CheckCircle } from 'lucide-react';

const DailyLiquidation = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Liquidación de Jornada</h2>
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
          Ruta Completada
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Columna 1: Rendimiento Logístico */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center">
            <MapPin className="w-4 h-4 mr-2" /> Telemetría y Actividad
          </h3>
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-slate-600">Kilometraje Recorrido:</span>
              <span className="font-bold text-slate-900">{data.total_km} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Horas de Actividad:</span>
              <span className="font-bold text-slate-900">{data.active_hours} hrs</span>
            </div>
          </div>
        </div>

        {/* Columna 2: Resumen Financiero FEL */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center">
            <FileText className="w-4 h-4 mr-2" /> Ventas y Facturación (FEL)
          </h3>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex justify-between text-blue-800">
              <span>Total Facturado:</span>
              <span className="font-bold text-xl text-blue-900">Q {data.total_sales.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Conciliación de Inventario */}
      <div className="mt-8">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
          <Truck className="w-4 h-4 mr-2" /> Conciliación de Inventario
        </h3>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-3">Producto</th>
              <th className="p-3">Carga Inicial</th>
              <th className="p-3">Vendido</th>
              <th className="p-3">Sobrante Teórico</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.items.map((item, idx) => (
              <tr key={idx}>
                <td className="p-3 font-medium">{item.name}</td>
                <td className="p-3">{item.initial}</td>
                <td className="p-3 text-green-600">-{item.sold}</td>
                <td className="p-3 font-bold">{item.initial - item.sold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyLiquidation;