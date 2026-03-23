import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';
import { createSnapToken } from '@/lib/midtrans';
import { logActivity } from '@/lib/activity-log';
import { randomBytes } from 'crypto';

// POST /api/payments — Create a Midtrans Snap payment for a plan upgrade
export async function POST(request: Request) {
    const { error, session } = await requireAuth();
    if (error) return error;

    try {
        const { planSlug, billingCycle, region } = await request.json();

        if (!planSlug || !billingCycle) {
            return NextResponse.json({ error: 'planSlug and billingCycle are required' }, { status: 400 });
        }

        if (!['monthly', 'yearly'].includes(billingCycle)) {
            return NextResponse.json({ error: 'billingCycle must be monthly or yearly' }, { status: 400 });
        }

        const plan = await prisma.plan.findUnique({ where: { slug: planSlug } });
        if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
        if (plan.slug === 'free') return NextResponse.json({ error: 'Free plan does not require payment' }, { status: 400 });
        if (plan.slug === 'enterprise') return NextResponse.json({ error: 'Contact sales for Enterprise plan' }, { status: 400 });

        // Get regional price
        const price = await prisma.planPrice.findFirst({
            where: { planId: plan.id, region: region || 'global_us' },
        });

        if (!price) return NextResponse.json({ error: 'Pricing not available for this region' }, { status: 404 });

        // Calculate amount — stored in smallest unit (e.g. IDR 14900000 = Rp149,000 * 100)
        // Midtrans expects the actual amount (e.g. 149000 for Rp149,000)
        const rawAmount = billingCycle === 'yearly' ? price.yearly * 12 : price.monthly;
        const amount = Math.round(rawAmount / 100);

        // Generate unique order ID
        const orderId = `CI-${Date.now()}-${randomBytes(4).toString('hex')}`;

        const { token, redirectUrl } = await createSnapToken({
            orderId,
            amount,
            customerName: session!.user.name || 'Customer',
            customerEmail: session!.user.email || '',
            itemName: `${plan.name} Plan (${billingCycle})`,
        });

        // Store pending subscription with payment reference
        await prisma.subscription.create({
            data: {
                userId: session!.user.id,
                planId: plan.id,
                status: 'pending',
                billingCycle,
                region: region || 'global_us',
                currency: price.currency,
                amountPaid: rawAmount,
                paymentProvider: 'midtrans',
                paymentId: orderId,
            },
        });

        await logActivity({
            userId: session!.user.id,
            userName: session!.user.name || 'User',
            userEmail: session!.user.email || '',
            action: 'create',
            target: 'Payment',
            detail: `Initiated ${plan.name} upgrade (${billingCycle}, ${price.currency} ${amount})`,
        });

        return NextResponse.json({ token, redirectUrl, orderId });
    } catch (err: any) {
        console.error('Payment creation error:', err);
        return NextResponse.json({ error: err.message || 'Failed to create payment' }, { status: 500 });
    }
}
