import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

/**
 * Require authentication for an API route. Returns the session or a 401 response.
 */
export async function requireAuth() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), session: null };
    }
    return { error: null, session };
}

/**
 * Require admin role for an API route. Returns the session or a 401/403 response.
 */
export async function requireAdmin() {
    const { error, session } = await requireAuth();
    if (error) return { error, session: null };
    const adminRoles = ["admin", "super_admin", "masteradmin"];
    if (!adminRoles.includes(session!.user.role.toLowerCase())) {
        return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), session: null };
    }
    return { error: null, session };
}
