export interface Mantenimiento {
  id: string;
  vehiculo_id: string;
  fecha: string;
  tipo: 'Correctivo' | 'Preventivo' | 'Diagnóstico';
  descripcion: string;
  kilometraje: number;
  costo_total: number;
  repuestos_utilizados?: {
    id: string;
    nombre: string;
    cantidad: number;
    precio_unitario: number;
  }[];
  codigo_dtc?: string; // Para capturar esos fallos de sensores
}