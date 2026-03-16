import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';

export async function GET(request: Request) {
    const { error } = await requireAuth();
    if (error) return error;
    try {
        const { searchParams } = new URL(request.url);
        const brandId = searchParams.get('brandId');
        const campaignId = searchParams.get('campaignId');

        // if (!brandId && !campaignId) {
        //     return NextResponse.json({ error: 'brandId or campaignId required' }, { status: 400 });
        // }

        const metrics = await prisma.metric.findMany({
            where: {
                ...(brandId && { brandId }),
                ...(campaignId && { campaignId })
            },
            orderBy: { date: 'asc' }
        });

        const chartData = metrics.map((m: any) => ({
            date: m.date.toISOString().split('T')[0],
            value: m.engagement, // Mapping for Engagement Trend Widget
            impressions: m.impressions,
            spend: m.spend,
            clicks: m.clicks,
            reach: m.reach,
            engagement: m.engagement,
            campaignId: m.campaignId
        }));

        // Mock Demographics (since we don't have a model for this yet, but we want to move logic to backend)
        const demographics = [
            { name: '18-24', value: 35 },
            { name: '25-34', value: 45 },
            { name: '35-44', value: 15 },
            { name: '45+', value: 5 },
        ];

        return NextResponse.json({
            trend: chartData,
            demographics
        });

    } catch (error) {
        console.error('Analytics Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
