import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const ExecutiveSummary = ({ reportData }: any) => {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Consolidado Mensual de Operaciones</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Eficiencia por Vendedor */}
        <div className="h-80">
          <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase">Eficiencia por Colaborador (%)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="colaborador" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="efectividad_promedio" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tabla de Costos vs Movilidad */}
        <div>
          <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase">Resumen de Gastos y Movilidad</h3>
          <div className="space-y-4">
            {reportData.map((row: any) => (
              <div key={row.colaborador} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-bold text-slate-700">{row.colaborador}</p>
                  <p className="text-xs text-slate-500">{row.km_totales} km recorridos</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-600">Q {row.total_gastos}</p>
                  <p className="text-[10px] text-slate-400">Gastos reportados</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
