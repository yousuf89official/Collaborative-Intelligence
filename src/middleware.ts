import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Global middleware: security headers, CORS, session management, UTM tracking.
 */
export function middleware(request: NextRequest) {
    const response = NextResponse.next();
    const { pathname, searchParams } = request.nextUrl;

    // ─── Security Headers ───────────────────────────────────────────
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    if (!pathname.startsWith('/api/')) {
        response.headers.set(
            'Content-Security-Policy',
            "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.sandbox.midtrans.com https://app.midtrans.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https://*.midtrans.com https://*.neon.tech; frame-src https://app.sandbox.midtrans.com https://app.midtrans.com;"
        );
    }

    // ─── CORS for Public API (/api/v1/*) ────────────────────────────
    if (pathname.startsWith('/api/v1/') || pathname.startsWith('/api/track/')) {
        const origin = request.headers.get('origin') || '*';
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        response.headers.set('Access-Control-Max-Age', '86400');
        if (request.method === 'OPTIONS') {
            return new NextResponse(null, { status: 204, headers: response.headers });
        }
    }

    // ─── CORS for Webhook ───────────────────────────────────────────
    if (pathname === '/api/payments/webhook') {
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    }

    // ─── UTM Extraction ─────────────────────────────────────────────
    const utmSource = searchParams.get('utm_source');
    const utmMedium = searchParams.get('utm_medium');
    const utmCampaign = searchParams.get('utm_campaign');
    const utmContent = searchParams.get('utm_content');
    const utmTerm = searchParams.get('utm_term');

    if (utmSource || utmMedium || utmCampaign || utmContent || utmTerm) {
        const utmData = JSON.stringify({
            source: utmSource || null,
            medium: utmMedium || null,
            campaign: utmCampaign || null,
            content: utmContent || null,
            term: utmTerm || null,
        });
        response.cookies.set('ci_utm', utmData, {
            path: '/', maxAge: 60 * 60 * 24 * 30, httpOnly: false, sameSite: 'lax',
        });
    }

    // ─── Session Cookie (rolling 30-min) ────────────────────────────
    const existingSession = request.cookies.get('ci_session')?.value;
    if (!existingSession) {
        response.cookies.set('ci_session', crypto.randomUUID(), {
            path: '/', maxAge: 60 * 30, httpOnly: true, sameSite: 'lax',
        });
    } else {
        // Refresh TTL on every request
        response.cookies.set('ci_session', existingSession, {
            path: '/', maxAge: 60 * 30, httpOnly: true, sameSite: 'lax',
        });
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)).*)',
    ],
};
