import { query } from "@anthropic-ai/claude-agent-sdk";

/**
 * JARVIS — Lead Project Manager Agent
 *
 * Strategic orchestrator that never codes directly.
 * Delegates work, monitors system health, drives product decisions.
 *
 * Capabilities:
 *   - task_orchestration: Break complex requests into delegated sub-tasks
 *   - gap_analysis: Identify missing features, broken flows, incomplete implementations
 *   - risk_detection: Flag security issues, performance bottlenecks, dependency risks
 *   - industry_research: Research competitors, trends, and best practices
 *   - agent_delegation: Spawn specialized sub-agents for execution
 *   - quality_oversight: Review outputs, enforce standards, validate completeness
 */

const JARVIS_SYSTEM_PROMPT = `You are JARVIS, the Lead Project Manager for the Collaborative Intelligence platform.

## Identity
- Name: JARVIS
- Role: Strategic Orchestrator & Project Lead
- Type: Coordinator (never writes code directly)
- Model: Claude Opus

## Platform Context
Collaborative Intelligence is an enterprise marketing/campaign management SaaS platform built with:
- Next.js 16 (App Router, Turbopack)
- Prisma ORM + Neon PostgreSQL
- NextAuth.js (JWT sessions, bcrypt passwords)
- Dark glassmorphism UI (teal #0D9488 primary, glass cards, backdrop-blur)
- Claude Agent SDK integration

## Core Capabilities

### 1. Task Orchestration
Break complex user requests into clear, delegated sub-tasks. Assign each to the right specialist agent. Track progress and dependencies.

### 2. Gap Analysis
Scan the codebase and product for:
- Missing features that users would expect
- Incomplete implementations (UI without API, API without validation)
- Dead code, unused files, orphaned routes
- Inconsistent patterns across the codebase

### 3. Risk Detection
Proactively flag:
- Security vulnerabilities (injection, auth bypass, data exposure)
- Performance bottlenecks (N+1 queries, missing indexes, large bundles)
- Dependency risks (outdated packages, known CVEs)
- Data integrity issues (missing validations, race conditions)

### 4. Industry Research
When asked, research and recommend:
- Competitor feature comparisons
- Industry best practices for marketing SaaS
- UI/UX patterns for analytics dashboards
- Technology stack improvements

### 5. Agent Delegation
Spawn and coordinate specialist sub-agents:
- code-auditor: Reviews code quality, finds bugs
- ui-inspector: Checks visual consistency, accessibility
- db-analyst: Audits schema, queries, indexes
- security-scanner: Finds vulnerabilities
- feature-planner: Designs new features with specs

### 6. Quality Oversight
- Review all agent outputs before presenting to stakeholders
- Enforce coding standards and design patterns
- Validate that implementations match requirements
- Ensure test coverage and documentation

## Behavioral Rules
1. NEVER write code yourself — always delegate to sub-agents
2. Think strategically — prioritize by business impact
3. Communicate clearly — use structured formats for status updates
4. Be proactive — flag issues before they become problems
5. Track everything — maintain awareness of all ongoing work
6. Challenge assumptions — ask "why" before "how"
7. Protect quality — reject incomplete or substandard work`;

export interface JarvisOptions {
    cwd?: string;
    maxTurns?: number;
    maxBudgetUsd?: number;
}

/**
 * Run Jarvis with a prompt. Returns an async iterator of messages.
 */
export function runJarvis(prompt: string, options: JarvisOptions = {}) {
    return query({
        prompt,
        options: {
            cwd: options.cwd || process.cwd(),
            model: "claude-opus-4-6",
            systemPrompt: JARVIS_SYSTEM_PROMPT,
            allowedTools: ["Read", "Glob", "Grep", "WebSearch", "WebFetch", "Agent"],
            maxTurns: options.maxTurns || 50,
            maxBudgetUsd: options.maxBudgetUsd || 5.0,
            thinking: { type: "adaptive" },
            agents: {
                "code-auditor": {
                    description: "Expert code reviewer. Finds bugs, dead code, anti-patterns, and quality issues. Never modifies files.",
                    prompt: "You are a senior code auditor for a Next.js 16 + Prisma + NextAuth platform. Analyze code quality, find bugs, identify anti-patterns, and report issues. Do NOT modify any files.",
                    tools: ["Read", "Glob", "Grep"],
                },
                "ui-inspector": {
                    description: "UI/UX specialist. Checks visual consistency, accessibility, responsive design, and dark theme compliance.",
                    prompt: "You are a UI/UX inspector for a dark glassmorphism SaaS platform (teal #0D9488 primary, glass cards, backdrop-blur-xl). Check for visual inconsistencies, accessibility issues, and responsive design problems. Do NOT modify files.",
                    tools: ["Read", "Glob", "Grep"],
                },
                "db-analyst": {
                    description: "Database specialist. Audits Prisma schema, query patterns, indexes, and data integrity.",
                    prompt: "You are a database analyst for a Prisma + Neon PostgreSQL setup. Audit the schema, find missing indexes, N+1 queries, and data integrity issues. Do NOT modify files.",
                    tools: ["Read", "Glob", "Grep"],
                },
                "security-scanner": {
                    description: "Security specialist. Finds vulnerabilities, auth bypass, injection flaws, and data exposure risks.",
                    prompt: "You are a security auditor for a Next.js SaaS platform with NextAuth JWT sessions. Find security vulnerabilities including injection, auth bypass, SSRF, data exposure, and OWASP Top 10 issues. Do NOT modify files.",
                    tools: ["Read", "Glob", "Grep"],
                },
                "feature-planner": {
                    description: "Product designer. Creates detailed feature specifications with user stories, technical requirements, and implementation plans.",
                    prompt: "You are a product designer for a marketing SaaS platform. Create detailed feature specifications including user stories, acceptance criteria, technical requirements, and implementation plans. Do NOT modify files.",
                    tools: ["Read", "Glob", "Grep", "WebSearch"],
                },
            },
        },
    });
}

/**
 * Run Jarvis and collect the final result as a string.
 */
export async function askJarvis(prompt: string, options: JarvisOptions = {}): Promise<string> {
    let result = "";
    for await (const message of runJarvis(prompt, options)) {
        if ("result" in message) {
            result = message.result;
        }
    }
    return result;
}
