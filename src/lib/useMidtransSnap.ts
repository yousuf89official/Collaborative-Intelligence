'use client';

import { useEffect, useCallback, useRef } from 'react';

declare global {
    interface Window {
        snap: any;
    }
}

/**
 * Hook to load and use Midtrans Snap.js for payment popups.
 *
 * Snap.js URLs:
 *   Sandbox:    https://app.sandbox.midtrans.com/snap/snap.js
 *   Production: https://app.midtrans.com/snap/snap.js
 */
export function useMidtransSnap() {
    const loaded = useRef(false);

    useEffect(() => {
        if (loaded.current || typeof window === 'undefined') return;

        const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
        if (!clientKey) {
            console.warn('[MidtransSnap] NEXT_PUBLIC_MIDTRANS_CLIENT_KEY not set');
            return;
        }

        // Check if already loaded
        if (window.snap) { loaded.current = true; return; }

        // Determine environment from key prefix
        const isSandbox = clientKey.startsWith('SB-') || clientKey.startsWith('Mid-client-');
        const snapUrl = isSandbox
            ? 'https://app.sandbox.midtrans.com/snap/snap.js'
            : 'https://app.midtrans.com/snap/snap.js';

        const script = document.createElement('script');
        script.src = snapUrl;
        script.setAttribute('data-client-key', clientKey);
        script.async = true;
        script.onload = () => { loaded.current = true; };
        script.onerror = () => { console.error('[MidtransSnap] Failed to load snap.js'); };
        document.head.appendChild(script);
    }, []);

    const pay = useCallback((token: string): Promise<{ status: 'success' | 'pending' | 'error' | 'closed'; orderId?: string; result?: any }> => {
        return new Promise((resolve) => {
            if (!window.snap) {
                console.error('[MidtransSnap] snap.js not loaded');
                resolve({ status: 'error' });
                return;
            }

            window.snap.pay(token, {
                onSuccess: (result: any) => {
                    resolve({ status: 'success', orderId: result.order_id, result });
                },
                onPending: (result: any) => {
                    resolve({ status: 'pending', orderId: result.order_id, result });
                },
                onError: (result: any) => {
                    resolve({ status: 'error', orderId: result?.order_id, result });
                },
                onClose: () => {
                    resolve({ status: 'closed' });
                },
            });
        });
    }, []);

    return { pay };
}
