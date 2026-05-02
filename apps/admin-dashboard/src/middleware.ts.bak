import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Verificación ligera: Busca cualquier cookie de sesión de Supabase
  const hasAuth = req.cookies.getAll().some(c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'));

  // Si no hay sesión y el usuario no está ya en la página de login, lo pateamos al login
  if (!hasAuth && req.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Si hay sesión pero intenta ir al login, lo mandamos al dashboard
  if (hasAuth && req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
}

// Esto evita que el middleware bloquee imágenes, scripts o rutas internas de Next.js
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};