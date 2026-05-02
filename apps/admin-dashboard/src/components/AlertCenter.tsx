// Componente de Alertas en Tiempo Real
export const AlertCenter = ({ alerts }: any) => {
  return (
    <div className="space-y-2">
      {alerts.map((alert: any) => (
        <div key={alert.id} className="flex items-center gap-3 p-3 bg-red-50 border-l-4 border-red-500 rounded">
          <AlertCircle className="text-red-500" size={18} />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-800">{alert.title}</p>
            <p className="text-xs text-red-700">{alert.message}</p>
          </div>
          <span className="text-[10px] text-red-400">{new Date(alert.created_at).toLocaleTimeString()}</span>
        </div>
      ))}
    </div>
  );
};
