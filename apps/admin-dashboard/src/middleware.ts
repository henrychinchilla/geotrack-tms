import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Esto BLOQUEARÁ TODO y mostrará un mensaje de texto en el navegador
  return new NextResponse('MIDDLEWARE ACTIVO - SI VES ESTO, EL ARCHIVO FUNCIONA');
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};