import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Revisar si el usuario tiene una sesión activa
  const { data: { session } } = await supabase.auth.getSession();

  // Si NO hay sesión y el usuario intenta entrar al dashboard, mandarlo al login
  if (!session && !req.nextUrl.pathname.startsWith('/login')) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  // Protege todo excepto login, archivos estáticos y la API interna
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)'],
};