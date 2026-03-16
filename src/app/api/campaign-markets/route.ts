import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';

export async function GET() {
    try {
        await requireAuth();
        return NextResponse.json([
            { id: 'mkt_id', name: 'Indonesia', code: 'ID', currency: 'IDR', region: 'SEA' },
            { id: 'mkt_my', name: 'Malaysia', code: 'MY', currency: 'MYR', region: 'SEA' },
            { id: 'mkt_sg', name: 'Singapore', code: 'SG', currency: 'SGD', region: 'SEA' },
            { id: 'mkt_us', name: 'United States', code: 'US', currency: 'USD', region: 'NA' },
            { id: 'mkt_uk', name: 'United Kingdom', code: 'UK', currency: 'GBP', region: 'EU' },
        ]);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to fetch markets' }, { status: error.message === 'Unauthorized' ? 401 : 500 });
    }
}
