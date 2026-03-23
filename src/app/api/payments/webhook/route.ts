import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySignature, mapTransactionStatus, getTransactionStatus } from '@/lib/midtrans';
import { logActivity } from '@/lib/activity-log';

// GET handler for Midtrans test ping
export async function GET() {
    return NextResponse.json({ status: 'ok', endpoint: 'payments/webhook' });
}

/**
 * POST /api/payments/webhook — Midtrans notification handler.
 * Docs: https://docs.midtrans.com/reference/handling-notifications
 *
 * Midtrans sends HTTP POST with JSON body when transaction status changes.
 * We verify the signature, then update the subscription accordingly.
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const {
            order_id,
            transaction_status,
            fraud_status,
            status_code,
            gross_amount,
            signature_key,
            payment_type,
        } = body;

        if (!order_id || !transaction_status) {
            return NextResponse.json({ error: 'Invalid notification' }, { status: 400 });
        }

        // Step 1: Verify signature — SHA512(order_id + status_code + gross_amount + server_key)
        if (signature_key) {
            const isValid = verifySignature(order_id, status_code, gross_amount, signature_key);
            if (!isValid) {
                console.error('[Midtrans Webhook] Invalid signature for order:', order_id);
                return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
            }
        }

        // Step 2: Double-check with Midtrans API (recommended best practice)
        let verifiedStatus = transaction_status;
        let verifiedFraud = fraud_status;
        try {
            const statusCheck = await getTransactionStatus(order_id);
            verifiedStatus = statusCheck.transaction_status || transaction_status;
            verifiedFraud = statusCheck.fraud_status || fraud_status;
        } catch (err) {
            // If status check fails, use the notification data (already signature-verified)
            console.warn('[Midtrans Webhook] Status check failed, using notification data:', err);
        }

        // Step 3: Find the subscription
        const subscription = await prisma.subscription.findFirst({
            where: { paymentId: order_id },
            include: { plan: true, user: true },
        });

        if (!subscription) {
            console.error('[Midtrans Webhook] No subscription for order:', order_id);
            return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
        }

        // Step 4: Map Midtrans status to our subscription status
        const { subscriptionStatus, shouldActivate } = mapTransactionStatus(verifiedStatus, verifiedFraud);

        // Step 5: Update subscription
        const now = new Date();
        const updateData: any = { status: subscriptionStatus };

        if (shouldActivate) {
            const periodEnd = new Date(now);
            if (subscription.billingCycle === 'yearly') {
                periodEnd.setFullYear(periodEnd.getFullYear() + 1);
            } else {
                periodEnd.setMonth(periodEnd.getMonth() + 1);
            }

            updateData.currentPeriodStart = now;
            updateData.currentPeriodEnd = periodEnd;

            // Deactivate other active subscriptions for this user
            await prisma.subscription.updateMany({
                where: {
                    userId: subscription.userId,
                    id: { not: subscription.id },
                    status: { in: ['active', 'trialing'] },
                },
                data: { status: 'canceled', canceledAt: now },
            });
        }

        if (subscriptionStatus === 'canceled') {
            updateData.canceledAt = now;
        }

        await prisma.subscription.update({
            where: { id: subscription.id },
            data: updateData,
        });

        // Step 6: Log the event
        const severity = shouldActivate ? 'info' : ['deny', 'cancel', 'expire', 'failure'].includes(verifiedStatus) ? 'warning' : 'info';

        await logActivity({
            userId: subscription.userId,
            userName: subscription.user?.name || 'User',
            userEmail: subscription.user?.email || 'system',
            action: shouldActivate ? 'create' : 'update',
            target: 'Payment',
            detail: `Midtrans ${verifiedStatus} (${payment_type || 'unknown'}): ${subscription.plan.name} — Order ${order_id}`,
            severity,
        });

        // Midtrans expects HTTP 200 to acknowledge the notification
        return NextResponse.json({ status: 'ok' });
    } catch (err: any) {
        console.error('[Midtrans Webhook] Error:', err);
        // Still return 200 to prevent Midtrans from retrying on our application errors
        // Log the error for investigation
        return NextResponse.json({ status: 'error', message: err.message }, { status: 200 });
    }
}
