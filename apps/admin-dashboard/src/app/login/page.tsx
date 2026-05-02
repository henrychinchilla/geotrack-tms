'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Error de acceso: " + error.message);
      setCargando(false);
    } else {
      router.push('/'); // Redirigir al dashboard al tener éxito
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8 bg-blue-600 text-white text-center">
          <h1 className="text-3xl font-black italic tracking-tighter">GeoTrack TMS</h1>
          <p className="text-blue-100 text-sm mt-2 font-medium uppercase tracking-widest">Control Logístico Guatemala</p>
        </div>
        
        <form onSubmit={manejarLogin} className="p-8 space-y-6">
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              required
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="admin@geotrack.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 uppercase mb-2">Contraseña</label>
            <input 
              type="password" 
              required
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={cargando}
            className={`w-full py-4 rounded-xl font-black text-lg shadow-lg transition transform hover:scale-[1.02] ${
              cargando ? 'bg-slate-300' : 'bg-slate-900 text-white hover:bg-black'
            }`}
          >
            {cargando ? 'VALIDANDO...' : 'ENTRAR AL PANEL'}
          </button>
        </form>
        
        <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Exclusivo para Personal Autorizado</p>
        </div>
      </div>
    </div>
  );
}