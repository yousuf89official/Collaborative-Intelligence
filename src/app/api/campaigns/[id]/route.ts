import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api-auth';

// GET /api/campaigns/:id
export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    const { error } = await requireAuth();
    if (error) return error;
    try {
        const params = await props.params;
        const { id } = params;
        const campaign = await prisma.campaign.findUnique({
            where: { id },
            include: {
                subCampaigns: true
            }
        });

        if (campaign) return NextResponse.json(campaign);

        // Fallback: Check if it is a sub-campaign (Legacy behavior supported finding sub-campaigns at this endpoint too?)
        // The legacy server checked `get_sub_campaign_by_id` if not found.
        // Let's replicate this behavior.
        const sub = await prisma.subCampaign.findUnique({ where: { id } });
        if (sub) return NextResponse.json(sub);

        return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PUT /api/campaigns/:id
export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    const { error } = await requireAuth();
    if (error) return error;
    try {
        const params = await props.params;
        const { id } = params;
        const body = await request.json();

        // Legacy behavior: Check if sub or main campaign to update
        const sub = await prisma.subCampaign.findUnique({ where: { id } });

        if (sub) {
            const updated = await prisma.subCampaign.update({
                where: { id },
                data: {
                    name: body.name,
                    slug: body.slug,
                    description: body.description,
                    status: body.status,
                    startDate: body.startDate ? new Date(body.startDate) : null,
                    endDate: body.endDate ? new Date(body.endDate) : null,
                    budgetPlanned: parseFloat(body.budgetPlanned || 0),
                    targetAudience: body.targetAudience ? JSON.stringify(body.targetAudience) : null,
                    configuration: body.configuration ? JSON.stringify(body.configuration) : null,
                }
            });
            return NextResponse.json({ success: true, ...updated });
        } else {
            const updated = await prisma.campaign.update({
                where: { id },
                data: {
                    name: body.name,
                    slug: body.slug,
                    description: body.description,
                    status: body.status,
                    startDate: body.startDate ? new Date(body.startDate) : null,
                    endDate: body.endDate ? new Date(body.endDate) : null,
                    budgetPlanned: parseFloat(body.budgetPlanned || 0),
                }
            });
            return NextResponse.json({ success: true, ...updated });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE /api/campaigns/:id
export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    const { error } = await requireAuth();
    if (error) return error;
    try {
        const params = await props.params;
        const { id } = params;
        // Check Sub
        const sub = await prisma.subCampaign.findUnique({ where: { id } });
        if (sub) {
            await prisma.$transaction([
                prisma.metric.deleteMany({ where: { subCampaignId: id } }),
                prisma.subCampaignChannel.deleteMany({ where: { subCampaignId: id } }),
                prisma.subCampaign.delete({ where: { id } })
            ]);
        } else {
            await prisma.$transaction([
                prisma.metric.deleteMany({ where: { campaignId: id } }),
                prisma.subCampaignChannel.deleteMany({ where: { subCampaign: { campaignId: id } } }),
                prisma.campaignChannel.deleteMany({ where: { campaignId: id } }),
                prisma.subCampaign.deleteMany({ where: { campaignId: id } }),
                prisma.campaign.delete({ where: { id } })
            ]);
        }
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
