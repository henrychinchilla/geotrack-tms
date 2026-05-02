'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else window.location.href = '/';
  };

  return (
    <div className="flex justify-center mt-20 font-sans">
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-80 p-6 border rounded shadow">
        <h2 className="text-center font-bold text-xl">GeoTrack TMS Login</h2>
        <input type="email" placeholder="Correo" className="border p-2" onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" className="border p-2" onChange={e => setPassword(e.target.value)} required />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">Entrar</button>
      </form>
    </div>
  );
}