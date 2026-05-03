import './globals.css';
import { Inter } from 'next/font/google';
import { supabase } from '@/lib/supabase';
import LogoutButton from '@/components/LogoutButton';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'GeoTrack TMS - Panel de Administración',
  description: 'Sistema de Gestión de Transporte y Logística',
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="es">
      <body className={inter.className}>
        <main className="min-h-screen bg-gray-50">
          {/* Navbar solo si está logueado */}
          {user && (
            <nav className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50">
              <div className="flex items-center gap-3">
                <div className="font-black text-2xl tracking-tight text-blue-600">GEOTRACK</div>
                <span className="text-sm text-gray-500 font-medium">TMS</span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 hidden md:block">
                  {user.email}
                </span>
                <LogoutButton />
              </div>
            </nav>
          )}

          {children}
        </main>
      </body>
    </html>
  );
}
