
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { createHash } from "crypto";
import bcrypt from "bcryptjs";

// Fire-and-forget activity log (no await needed in authorize)
function logAuth(userName: string, email: string, action: string, detail: string, severity: string = 'info') {
    prisma.activityLog.create({
        data: { userName, userEmail: email, action, target: 'Authentication', detail, severity }
    }).catch(() => {});
}

// Dummy hash to compare against when user doesn't exist (prevents timing attacks)
const DUMMY_HASH = "$2b$12$LJ3m4ys3Lg7RHSfLWxKnaeGBa4eL8XmEBK.LCiEEWO.WRa/B2PpKG";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                // Retry logic for Neon cold starts (free tier suspends after 5min)
                let user;
                for (let attempt = 0; attempt < 3; attempt++) {
                    try {
                        user = await prisma.user.findUnique({
                            where: { email: credentials.email.toLowerCase().trim() }
                        });
                        break; // Success — exit retry loop
                    } catch (dbErr: any) {
                        if (attempt === 2) {
                            console.error('[Auth] DB query failed after 3 attempts:', dbErr.message);
                            return null;
                        }
                        // Wait before retry (Neon waking up)
                        await new Promise(r => setTimeout(r, 2000));
                    }
                }

                // Always run bcrypt compare to prevent timing-based user enumeration
                if (!user) {
                    await bcrypt.compare(credentials.password, DUMMY_HASH);
                    return null;
                }

                let isValid = false;

                if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
                    isValid = await bcrypt.compare(credentials.password, user.password);
                } else {
                    // Legacy SHA-256 fallback — auto-migrate to bcrypt on success
                    const sha256Hash = createHash('sha256').update(credentials.password).digest('hex');
                    if (user.password === sha256Hash) {
                        isValid = true;
                        const bcryptHash = await bcrypt.hash(credentials.password, 12);
                        await prisma.user.update({
                            where: { id: user.id },
                            data: { password: bcryptHash }
                        });
                    }
                }

                if (!isValid) {
                    logAuth(user.name || 'Unknown', credentials.email, 'login_failed', 'Invalid password attempt', 'warning');
                    return null;
                }

                // Block login for non-Active users
                if (user.status !== 'Active') {
                    throw new Error(
                        user.status === 'Pending' ? 'Your account is pending admin approval'
                        : user.status === 'Suspended' ? 'Your account has been suspended'
                        : 'Your account is inactive'
                    );
                }

                logAuth(user.name || 'Unknown', user.email, 'login', `Successful login (${user.role})`);

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    permissions: user.permissions,
                };
            }
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 8 * 60 * 60, // 8 hours
    },
    jwt: {
        maxAge: 8 * 60 * 60, // 8 hours
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
                token.permissions = (user as any).permissions;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role;
                session.user.id = token.id as string;
                (session.user as any).permissions = token.permissions;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/auth',
    }
};
