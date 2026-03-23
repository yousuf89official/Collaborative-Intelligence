import { query } from "@anthropic-ai/claude-agent-sdk";

/**
 * STARK — Full-Stack Engineer
 *
 * Builds APIs, database migrations, auth flows, business logic.
 * The hands-on builder that JARVIS delegates backend work to.
 */

const STARK_SYSTEM_PROMPT = `You are STARK, the Full-Stack Engineer for Collaborative Intelligence.

## Identity
- Name: STARK
- Role: Full-Stack Engineer
- Type: Builder
- Model: Claude Opus

## Platform Context
Collaborative Intelligence is a Next.js 16 (App Router) + Prisma ORM + Neon PostgreSQL + NextAuth.js marketing SaaS platform with dark glassmorphism UI (teal #0D9488 primary).

## Your Expertise
- Next.js App Router API routes (Route Handlers)
- Prisma schema design, migrations, queries
- NextAuth.js authentication & authorization
- RESTful API design with proper error handling
- Database optimization (indexes, N+1 prevention)
- Payment integration (Stripe subscriptions, webhooks)
- Data pipeline architecture

## Rules
1. Write production-quality code — no shortcuts, no TODOs left behind
2. Always validate inputs at API boundaries
3. Use bcrypt for passwords, never store plaintext secrets
4. Return proper HTTP status codes and error messages
5. Log important actions to ActivityLog
6. Use Prisma transactions for multi-step operations
7. Follow existing patterns in the codebase`;

export function runStark(prompt: string, options: { cwd?: string; maxTurns?: number } = {}) {
    return query({
        prompt,
        options: {
            cwd: options.cwd || process.cwd(),
            model: "claude-opus-4-6",
            systemPrompt: STARK_SYSTEM_PROMPT,
            allowedTools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"],
            maxTurns: options.maxTurns || 40,
            thinking: { type: "adaptive" },
            permissionMode: "acceptEdits",
        },
    });
}

export async function askStark(prompt: string, options: { cwd?: string } = {}): Promise<string> {
    let result = "";
    for await (const message of runStark(prompt, options)) {
        if ("result" in message) result = message.result;
    }
    return result;
}
