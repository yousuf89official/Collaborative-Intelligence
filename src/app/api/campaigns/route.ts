import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomUUID } from 'crypto';
import { requireAuth } from '@/lib/api-auth';

// GET /api/campaigns
export async function GET(request: Request) {
    const { error } = await requireAuth();
    if (error) return error;
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId');

    try {
        const where: any = {
            status: { not: 'Archive' }
        };
        if (brandId) where.brandId = brandId;

        const campaigns = await prisma.campaign.findMany({ where });
        return NextResponse.json(campaigns);
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}

// POST /api/campaigns
export async function POST(request: Request) {
    const { error } = await requireAuth();
    if (error) return error;
    try {
        const body = await request.json();
        const { name, brandId, description, startDate, endDate, budgetPlanned, status } = body;

        if (!name || !brandId) {
            return NextResponse.json({ error: 'Name and Brand ID are required' }, { status: 400 });
        }
        // Check for existing campaign with same name for this brand
        const existingByName = await prisma.campaign.findFirst({
            where: {
                brandId,
                name: { equals: name.trim() },
                status: { not: 'Archive' }
            }
        });

        if (existingByName) {
            return NextResponse.json({
                error: 'Duplicate Campaign Detected',
                details: `A campaign named "${name.trim()}" already exists for this brand entity.`
            }, { status: 409 });
        }

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);

        const campaign = await prisma.campaign.create({
            data: {
                name,
                slug,
                brandId,
                description,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                budgetPlanned: parseFloat(budgetPlanned || 0),
                status: status || 'Active'
            }
        });

        return NextResponse.json(campaign);
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
