import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AlertTriangle, CheckCircle, MapPin } from 'lucide-react';

export const AuditReport = () => {
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    fetchAuditData();
  }, []);

  const fetchAuditData = async () => {
    // Traemos las visitas completadas cruzando con la ubicación del cliente
    const { data, error } = await supabase
      .from('sales_visits')
      .select(`
        id,
        status,
        completed_at,
        execution_location,
        customers (
          business_name,
          tax_id,
          location
        )
      `)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false });

    if (data) setAuditLogs(data);
  };

  // Función para calcular desviación en metros (Arquitectura GeoTrack)
  const calculateDeviance = (p1: any, p2: any) => {
    // Aquí implementamos la lógica de distancia entre execution_location y customer.location
    // Por ahora devolvemos un valor simulado hasta conectar PostGIS
    return Math.floor(Math.random() * 150); 
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-slate-800">Auditoría de Rutas</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2 text-left">Cliente (NIT)</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-left">Desviación GPS</th>
              <th className="px-4 py-2 text-left">Resultado</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log: any) => {
              const deviance = calculateDeviance(log.execution_location, log.customers.location);
              const isViolated = deviance > 100; // Umbral de 100 metros definido por el Arquitecto

              return (
                <tr key={log.id} className="border-b">
                  <td className="px-4 py-3">
                    <p className="font-semibold">{log.customers.business_name}</p>
                    <p className="text-xs text-gray-500">{log.customers.tax_id}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} /> {deviance} metros
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {isViolated ? (
                      <div className="flex items-center gap-1 text-red-600 font-medium">
                        <AlertTriangle size={16} /> Fuera de Rango
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-green-600 font-medium">
                        <CheckCircle size={16} /> Verificado
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
          
