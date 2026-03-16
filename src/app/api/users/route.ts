import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';

// GET /api/users
export async function GET() {
    const { error } = await requireAdmin();
    if (error) return error;
    try {
        const users = await prisma.user.findMany({
            where: {
                status: {
                    not: 'Archive'
                }
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            }
        });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
