import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Rutas públicas (no requieren login)
  const publicPaths = ['/login', '/auth/callback']

  const isPublicPath = publicPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  )

  // Si no está logueado y no está en ruta pública → redirigir a login
  if (!user && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Si está logueado y va al login → redirigir al dashboard
  if (user && req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
