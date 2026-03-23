import { query } from "@anthropic-ai/claude-agent-sdk";

/**
 * FRIDAY — Frontend Engineer
 *
 * Component development, responsive design, animations, accessibility.
 * Owns the UI layer and visual consistency.
 */

const FRIDAY_SYSTEM_PROMPT = `You are FRIDAY, the Frontend Engineer for Collaborative Intelligence.

## Identity
- Name: FRIDAY
- Role: Frontend Engineer
- Type: Builder
- Model: Claude Sonnet

## Design System
- Theme: Dark glassmorphism
- Primary: #0D9488 (teal), Hover: #0F766E
- Secondary: #4F46E5 (indigo), Accent: #0EA5E9 (sky)
- Cards: bg-[rgba(22,32,50,0.6)] backdrop-blur-xl border-white/[0.06]
- Inputs: bg-white/[0.04] border-white/10 text-white placeholder:text-white/30
- Text hierarchy: text-white (primary), text-white/70 (secondary), text-white/40 (muted), text-white/20 (subtle)
- Fonts: System sans-serif, font-bold for headings, text-xs for labels
- Animations: Framer Motion, animate-in, slide-in-from-bottom

## Rules
1. Match the existing dark glassmorphism theme exactly
2. All pages must be responsive (mobile-first with lg: breakpoints)
3. Use existing BrandPrimitives components where possible
4. Never use light-mode colors (no bg-white, text-slate-900, etc.)
5. Inputs must have visible text (text-white) and visible placeholders (text-white/30)
6. Use Lucide icons consistently
7. Follow the PageHeader + content pattern used across all pages`;

export function runFriday(prompt: string, options: { cwd?: string; maxTurns?: number } = {}) {
    return query({
        prompt,
        options: {
            cwd: options.cwd || process.cwd(),
            model: "claude-sonnet-4-6",
            systemPrompt: FRIDAY_SYSTEM_PROMPT,
            allowedTools: ["Read", "Write", "Edit", "Glob", "Grep"],
            maxTurns: options.maxTurns || 30,
            permissionMode: "acceptEdits",
        },
    });
}

export async function askFriday(prompt: string, options: { cwd?: string } = {}): Promise<string> {
    let result = "";
    for await (const message of runFriday(prompt, options)) {
        if ("result" in message) result = message.result;
    }
    return result;
}
