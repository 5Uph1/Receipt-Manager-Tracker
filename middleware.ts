import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key) => req.cookies.get(key)?.value,
        set: (key, value, options) => {
          res.cookies.set(key, value, options)
        },
        remove: (key, options) => {
          res.cookies.set(key, '', options)
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard')

  // ❌ belum login
  if (!session && isDashboard) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  // ✅ sudah login
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth'],
}
