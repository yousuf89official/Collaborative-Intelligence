import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';

export async function GET() {
    try {
        await requireAuth();
        return NextResponse.json([
            { id: 'obj_reach', name: 'Reach', slug: 'reach' },
            { id: 'obj_traffic', name: 'Traffic', slug: 'traffic' },
            { id: 'obj_conversions', name: 'Conversions', slug: 'conversions' },
            { id: 'obj_engagement', name: 'Engagement', slug: 'engagement' },
        ]);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to fetch objectives' }, { status: error.message === 'Unauthorized' ? 401 : 500 });
    }
}
