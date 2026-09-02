import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) return new TextEncoder().encode('dev-secret-key-sirad-erp-dashboard-2024-not-for-production');
  return new TextEncoder().encode(secret);
}

// Next.js 16 renamed "middleware" to "proxy"
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── Dashboard Routes ───
  if (pathname.startsWith('/dashboard')) {
    // Allow login page and API auth routes without session
    if (pathname === '/dashboard/login' || pathname.startsWith('/api/dashboard/auth')) {
      return NextResponse.next();
    }

    // Check for valid session cookie
    const token = request.cookies.get('sirad-session')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/dashboard/login', request.url));
    }

    try {
      await jwtVerify(token, getJwtSecret());
      return NextResponse.next();
    } catch {
      // Invalid/expired token — redirect to login
      const response = NextResponse.redirect(new URL('/dashboard/login', request.url));
      response.cookies.delete('sirad-session');
      return response;
    }
  }

  // ─── API Routes ───
  if (pathname.startsWith('/api')) {
    // Auth endpoints are public
    if (pathname.startsWith('/api/dashboard/auth')) {
      return NextResponse.next();
    }

    // Dashboard API endpoints require valid JWT session
    if (pathname.startsWith('/api/dashboard')) {
      const token = request.cookies.get('sirad-session')?.value;
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      try {
        await jwtVerify(token, getJwtSecret());
        return NextResponse.next();
      } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    return NextResponse.next();
  }

  // ─── Public i18n Routes ───
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(ar|en)/:path*', '/dashboard/:path*', '/api/dashboard/:path*'],
};
