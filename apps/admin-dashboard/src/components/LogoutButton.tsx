'use client';

import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/supabase';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors"
    >
      <LogOut size={18} />
      Cerrar Sesión
    </button>
  );
}
