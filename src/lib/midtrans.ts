/**
 * Midtrans Payment Gateway Integration
 * Docs: https://docs.midtrans.com/reference/getting-started-1
 *
 * Endpoints:
 *   Sandbox:    https://app.sandbox.midtrans.com/snap/v1/transactions
 *   Production: https://app.midtrans.com/snap/v1/transactions
 *
 * Auth: HTTP Basic Auth with Base64(server_key + ":")
 */

import { createHash } from 'crypto';

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || '';
const IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === 'true';

const SNAP_URL = IS_PRODUCTION
    ? 'https://app.midtrans.com/snap/v1/transactions'
    : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

const STATUS_URL = IS_PRODUCTION
    ? 'https://api.midtrans.com/v2'
    : 'https://api.sandbox.midtrans.com/v2';

function getAuthHeader(): string {
    return 'Basic ' + Buffer.from(SERVER_KEY + ':').toString('base64');
}

/**
 * Create a Midtrans Snap transaction token.
 * https://docs.midtrans.com/reference/request-body-json-parameter
 */
export async function createSnapToken(params: {
    orderId: string;
    amount: number;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    itemName: string;
    callbackFinish?: string;
}) {
    const body = {
        transaction_details: {
            order_id: params.orderId,
            gross_amount: params.amount,
        },
        item_details: [{
            id: params.orderId,
            price: params.amount,
            quantity: 1,
            name: params.itemName.substring(0, 50), // Max 50 chars
        }],
        customer_details: {
            first_name: params.customerName.substring(0, 20),
            email: params.customerEmail,
            phone: params.customerPhone || '',
        },
        callbacks: {
            finish: params.callbackFinish || `${process.env.NEXTAUTH_URL || 'https://integratedmediahub.com'}/admin/billing?payment=success`,
        },
    };

    const response = await fetch(SNAP_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': getAuthHeader(),
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const text = await response.text();
        console.error('[Midtrans] Snap token error:', response.status, text);
        throw new Error(`Midtrans API error (${response.status}): ${text}`);
    }

    const data = await response.json();
    return {
        token: data.token,
        redirectUrl: data.redirect_url,
    };
}

/**
 * Get transaction status from Midtrans.
 * GET https://api.sandbox.midtrans.com/v2/{order_id}/status
 */
export async function getTransactionStatus(orderId: string) {
    const response = await fetch(`${STATUS_URL}/${orderId}/status`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': getAuthHeader(),
        },
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Midtrans status error (${response.status}): ${text}`);
    }

    return response.json();
}

/**
 * Verify Midtrans webhook notification signature.
 * Formula: SHA512(order_id + status_code + gross_amount + server_key)
 */
export function verifySignature(
    orderId: string,
    statusCode: string,
    grossAmount: string,
    signatureKey: string
): boolean {
    const hash = createHash('sha512')
        .update(orderId + statusCode + grossAmount + SERVER_KEY)
        .digest('hex');
    return hash === signatureKey;
}

/**
 * Map Midtrans transaction_status to our subscription status.
 *
 * Midtrans statuses:
 *   capture    — Card payment captured (check fraud_status)
 *   settlement — Payment settled/completed
 *   pending    — Waiting for payment
 *   deny       — Payment denied
 *   cancel     — Cancelled by merchant/user
 *   expire     — Payment expired
 *   failure    — Payment failed
 *   refund     — Refunded
 *   partial_refund — Partially refunded
 */
export function mapTransactionStatus(transactionStatus: string, fraudStatus?: string): {
    subscriptionStatus: 'active' | 'pending' | 'canceled';
    shouldActivate: boolean;
} {
    switch (transactionStatus) {
        case 'capture':
            // For card payments, check fraud_status
            if (fraudStatus === 'accept') return { subscriptionStatus: 'active', shouldActivate: true };
            if (fraudStatus === 'challenge') return { subscriptionStatus: 'pending', shouldActivate: false };
            return { subscriptionStatus: 'canceled', shouldActivate: false };

        case 'settlement':
            return { subscriptionStatus: 'active', shouldActivate: true };

        case 'pending':
            return { subscriptionStatus: 'pending', shouldActivate: false };

        case 'deny':
        case 'cancel':
        case 'expire':
        case 'failure':
        case 'refund':
        case 'partial_refund':
            return { subscriptionStatus: 'canceled', shouldActivate: false };

        default:
            return { subscriptionStatus: 'pending', shouldActivate: false };
    }
}
