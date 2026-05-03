import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Rutas que no requieren autenticación
  const publicPaths = ['/login', '/auth/callback']

  const isPublicPath = publicPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  )

  // Si no hay usuario y no está en ruta pública → redirigir a login
  if (!user && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Si ya está logueado y entra al login → redirigir al dashboard
  if (user && req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

// Configuración para que se ejecute en todas las rutas excepto archivos estáticos
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
