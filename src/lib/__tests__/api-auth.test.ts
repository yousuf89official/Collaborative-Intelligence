import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock auth options
vi.mock('@/lib/auth', () => ({
    authOptions: {},
}));

// Mock getServerSession
const mockGetServerSession = vi.fn();
vi.mock('next-auth', () => ({
    getServerSession: (...args: any[]) => mockGetServerSession(...args),
}));

import { requireAuth, requireAdmin } from '../api-auth';

describe('requireAuth', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns error response when no session', async () => {
        mockGetServerSession.mockResolvedValue(null);

        const result = await requireAuth();

        expect(result.error).not.toBeNull();
        expect(result.session).toBeNull();
        // Verify 401 status
        const response = result.error!;
        expect(response.status).toBe(401);
    });

    it('returns error when session has no user', async () => {
        mockGetServerSession.mockResolvedValue({});

        const result = await requireAuth();

        expect(result.error).not.toBeNull();
        expect(result.session).toBeNull();
    });

    it('returns session when authenticated', async () => {
        const session = {
            user: {
                id: 'user-1',
                name: 'Test User',
                email: 'test@example.com',
                role: 'viewer',
            },
        };
        mockGetServerSession.mockResolvedValue(session);

        const result = await requireAuth();

        expect(result.error).toBeNull();
        expect(result.session).toEqual(session);
    });
});

describe('requireAdmin', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns 401 when not authenticated', async () => {
        mockGetServerSession.mockResolvedValue(null);

        const result = await requireAdmin();

        expect(result.error).not.toBeNull();
        expect(result.session).toBeNull();
        expect(result.error!.status).toBe(401);
    });

    it('returns 403 for non-admin roles', async () => {
        mockGetServerSession.mockResolvedValue({
            user: { id: 'user-1', role: 'viewer' },
        });

        const result = await requireAdmin();

        expect(result.error).not.toBeNull();
        expect(result.session).toBeNull();
        expect(result.error!.status).toBe(403);
    });

    it('returns session for admin role', async () => {
        const session = {
            user: { id: 'user-1', role: 'admin' },
        };
        mockGetServerSession.mockResolvedValue(session);

        const result = await requireAdmin();

        expect(result.error).toBeNull();
        expect(result.session).toEqual(session);
    });

    it('returns session for super_admin role', async () => {
        const session = {
            user: { id: 'user-1', role: 'super_admin' },
        };
        mockGetServerSession.mockResolvedValue(session);

        const result = await requireAdmin();

        expect(result.error).toBeNull();
        expect(result.session).toEqual(session);
    });

    it('returns session for masteradmin role', async () => {
        const session = {
            user: { id: 'user-1', role: 'masteradmin' },
        };
        mockGetServerSession.mockResolvedValue(session);

        const result = await requireAdmin();

        expect(result.error).toBeNull();
        expect(result.session).toEqual(session);
    });

    it('is case-insensitive for role matching', async () => {
        const session = {
            user: { id: 'user-1', role: 'Admin' },
        };
        mockGetServerSession.mockResolvedValue(session);

        const result = await requireAdmin();

        expect(result.error).toBeNull();
        expect(result.session).toEqual(session);
    });
});
