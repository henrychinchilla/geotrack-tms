'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function DespachoPage() {
  const [unidades, setUnidades] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);
  const [ruta, setRuta] = useState({
    vehiculo_id: '',
    cliente_id: '',
    lat: 14.6349,
    lng: -90.5069,
    km_estimados: 0
  });

  const ORIGEN = { lat: 14.2917, lng: -89.8944 }; // Jutiapa

  useEffect(() => {
    async function cargarDatos() {
      const { data: v } = await supabase.from('vehiculos').select('*');
      const { data: c } = await supabase.from('clientes').select('*');
      if (v) setUnidades(v);
      if (c) setClientes(c);
    }
    cargarDatos();
  }, []);

  const calcularDistancia = (lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - ORIGEN.lat) * Math.PI / 180;
    const dLon = (lon2 - ORIGEN.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(ORIGEN.lat * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLon/2)**2;
    return parseFloat((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(2));
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    const unidad = unidades.find(u => u.id === ruta.vehiculo_id);
    const cliente = clientes.find(c => c.id === ruta.cliente_id);

    // Encabezado Profesional
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text('GeoTrack TMS - Manifiesto de Carga', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Fecha de Emisión: ${new Date().toLocaleString()}`, 105, 28, { align: 'center' });
    doc.text('Jutiapa, Guatemala', 105, 33, { align: 'center' });

    // Tabla de Datos
    autoTable(doc, {
      startY: 45,
      head: [['Concepto', 'Detalle']],
      body: [
        ['Unidad de Transporte', unidad?.placa || 'N/A'],
        ['Marca / Modelo', `${unidad?.marca} ${unidad?.modelo}`],
        ['Cliente / Destino', cliente?.nombre || 'N/A'],
        ['Dirección', cliente?.direccion_texto || 'N/A'],
        ['Distancia Estimada', `${ruta.km_estimados} KM`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [30, 41, 59] }
    });

    // Secciones de Firmas
    const finalY = (doc as any).lastAutoTable.finalY + 30;
    doc.line(20, finalY, 80, finalY);
    doc.text('Firma Piloto / Despacho', 30, finalY + 5);
    
    doc.line(130, finalY, 190, finalY);
    doc.text('Sello y Firma Receptor', 140, finalY + 5);

    doc.save(`Manifiesto_${unidad?.placa || 'Ruta'}.pdf`);
  };

  const enviarDespacho = async () => {
    if (!ruta.vehiculo_id || !ruta.cliente_id) return alert("Selecciona unidad y cliente");
    setCargando(true);
    const clienteSel = clientes.find(c => c.id === ruta.cliente_id);
    const { error } = await supabase.from('rutas').insert([{
      vehiculo_id: ruta.vehiculo_id,
      cliente_nombre: clienteSel?.nombre,
      direccion_entrega: clienteSel?.direccion_texto,
      latitud: ruta.lat,
      longitud: ruta.lng,
      distancia_km: ruta.km_estimados,
      estado_ruta: 'En transito'
    }]);
    setCargando(false);
    if (error) alert(error.message);
    else {
      alert("✅ ¡Unidad Despachada!");
      generarPDF(); // Genera el PDF automáticamente al despachar
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 mb-8">Despacho y Documentación</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-6">
            <select className="w-full p-3 border rounded-xl" onChange={(e) => setRuta({...ruta, vehiculo_id: e.target.value})}>
              <option value="">Seleccionar Unidad...</option>
              {unidades.map(u => <option key={u.id} value={u.id}>{u.placa}</option>)}
            </select>

            <select className="w-full p-3 border rounded-xl font-bold text-blue-700" 
              onChange={(e) => {
                const c = clientes.find(cli => cli.id === e.target.value);
                if(c) setRuta({...ruta, cliente_id: c.id, lat: c.latitud, lng: c.longitud, km_estimados: calcularDistancia(c.latitud, c.longitud)});
              }}
            >
              <option value="">-- Seleccionar Cliente --</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>

            <div className="p-6 bg-slate-900 rounded-2xl text-center">
              <p className="text-slate-400 text-xs font-black uppercase">KM Estimados</p>
              <p className="text-5xl font-black text-white">{ruta.km_estimados}</p>
            </div>

            <button onClick={enviarDespacho} disabled={cargando} className="w-full bg-green-600 text-white py-4 rounded-xl font-black text-lg shadow-lg">
              {cargando ? 'REGISTRANDO...' : 'DESPACHAR E IMPRIMIR'}
            </button>
          </div>

          <div className="bg-slate-800 p-8 rounded-2xl flex flex-col items-center justify-center text-center">
             <h3 className="text-white text-xl font-black mb-6 italic">HERRAMIENTAS DEL PILOTO</h3>
             <a href={`https://waze.com/ul?ll=${ruta.lat},${ruta.lng}&navigate=yes`} target="_blank" className="w-full bg-[#33ccff] text-slate-900 py-4 rounded-2xl font-black text-xl mb-4">ABRIR WAZE</a>
             <button onClick={generarPDF} className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-xl border-2 border-slate-300">GENERAR PDF MANUEAL</button>
          </div>
        </div>
      </div>
    </div>
  );
}