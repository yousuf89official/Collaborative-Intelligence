import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Global middleware for security headers, CORS, and API versioning.
 */
export function middleware(request: NextRequest) {
    const response = NextResponse.next();
    const { pathname } = request.nextUrl;

    // ─── Security Headers ───────────────────────────────────────────
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // Strict CSP for non-API routes
    if (!pathname.startsWith('/api/')) {
        response.headers.set(
            'Content-Security-Policy',
            "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.sandbox.midtrans.com https://app.midtrans.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https://*.midtrans.com https://*.neon.tech; frame-src https://app.sandbox.midtrans.com https://app.midtrans.com;"
        );
    }

    // ─── CORS for Public API (/api/v1/*) ────────────────────────────
    if (pathname.startsWith('/api/v1/')) {
        const origin = request.headers.get('origin') || '*';
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        response.headers.set('Access-Control-Max-Age', '86400');

        // Handle preflight
        if (request.method === 'OPTIONS') {
            return new NextResponse(null, { status: 204, headers: response.headers });
        }
    }

    // ─── CORS for Webhook (/api/payments/webhook) ───────────────────
    if (pathname === '/api/payments/webhook') {
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    }

    return response;
}

export const config = {
    matcher: [
        // Apply to all routes except static files and _next
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)).*)',
    ],
};
