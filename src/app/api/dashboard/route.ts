import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';

// GET /api/dashboard — Aggregated dashboard stats from real data
export async function GET() {
    const { error } = await requireAuth();
    if (error) return error;

    try {
        // Count active campaigns
        const activeCampaigns = await prisma.campaign.count({
            where: { status: 'Active' }
        });

        // Aggregate metrics
        const metrics = await prisma.metric.aggregate({
            _sum: {
                spend: true,
                impressions: true,
                clicks: true,
                reach: true,
                engagement: true,
            }
        });

        const totalSpend = metrics._sum.spend || 0;
        const totalImpressions = metrics._sum.impressions || 0;
        const totalClicks = metrics._sum.clicks || 0;

        // Calculate ROAS (if spend > 0, use clicks as proxy for conversions)
        const avgRoas = totalSpend > 0 ? Math.round((totalClicks / totalSpend) * 100) / 100 : 0;

        return NextResponse.json({
            activeCampaigns,
            totalSpend,
            impressions: totalImpressions,
            avgRoas,
        });
    } catch (err: any) {
        console.error('Dashboard stats error:', err);

        // Neon cold start — return zeros instead of 500
        if (err?.code === 'P1001') {
            return NextResponse.json({
                activeCampaigns: 0,
                totalSpend: 0,
                impressions: 0,
                avgRoas: 0,
                _dbOffline: true,
            });
        }

        return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
    }
}
