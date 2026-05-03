'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircle, Navigation, MapPin, Clock } from 'lucide-react';

interface Visita {
  id: string;
  completed_at: string;
  customers?: {
    business_name: string;
    tax_id: string;
    latitude?: number;
    longitude?: number;
  };
}

export default function MonitorPage() {
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVisitas = async () => {
      try {
        const { data, error } = await supabase
          .from('sales_visits')
          .select('*, customers(business_name, tax_id, latitude, longitude)')
          .order('completed_at', { ascending: false })
          .limit(20);

        if (error) throw error;
        setVisitas(data || []);
      } catch (err: any) {
        setError('Error al cargar los datos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitas();
  }, []);

  const abrirWaze = (lat?: number, lng?: number) => {
    if (!lat || !lng) return alert('Coordenadas no disponibles');
    window.open(`https://waze.com/ul?ll=\( {lat}, \){lng}&navigate=yes`, '_blank');
  };

  const abrirGoogleMaps = (lat?: number, lng?: number) => {
    if (!lat || !lng) return alert('Coordenadas no disponibles');
    window.open(`https://www.google.com/maps/search/?api=1&query=\( {lat}, \){lng}`, '_blank');
  };

  if (loading) return <div className="
