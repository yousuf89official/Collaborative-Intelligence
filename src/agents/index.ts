/**
 * Collaborative Intelligence — Agent Registry
 *
 * All platform agents are registered here.
 * Each agent is a specialized Claude instance with defined capabilities.
 */

export { runJarvis, askJarvis } from './jarvis';
export { runStark, askStark } from './stark';
export { runFriday, askFriday } from './friday';
export { runVision, askVision } from './vision';
export { runPepper, askPepper } from './pepper';
export { runHawkeye, askHawkeye } from './hawkeye';
export { runSentinel, askSentinel } from './sentinel';
export { runCommander, askCommander } from './commander';
export { runAutopilot, askAutopilot } from './autopilot';
export { runAllocator, askAllocator } from './allocator';

export type { JarvisOptions } from './jarvis';

/**
 * Agent catalog — used by the UI and API to list available agents.
 */
export const AGENT_CATALOG = [
    {
        id: 'jarvis',
        name: 'JARVIS',
        role: 'Lead Project Manager',
        type: 'Coordinator',
        model: 'claude-opus-4-6',
        description: 'Strategic orchestrator — delegates work, monitors system health, drives product decisions.',
        capabilities: ['task_orchestration', 'gap_analysis', 'risk_detection', 'industry_research', 'agent_delegation', 'quality_oversight'],
        subAgents: ['code-auditor', 'ui-inspector', 'db-analyst', 'security-scanner', 'feature-planner'],
        endpoint: '/api/agents/jarvis',
        requiredRole: 'admin',
    },
    {
        id: 'stark',
        name: 'STARK',
        role: 'Full-Stack Engineer',
        type: 'Builder',
        model: 'claude-opus-4-6',
        description: 'Builds APIs, database migrations, auth flows, payment processing, and business logic.',
        capabilities: ['api_development', 'database_design', 'auth_systems', 'integration_pipelines', 'payment_processing'],
        endpoint: '/api/agents/stark',
        requiredRole: 'admin',
    },
    {
        id: 'friday',
        name: 'FRIDAY',
        role: 'Frontend Engineer',
        type: 'Builder',
        model: 'claude-sonnet-4-6',
        description: 'Component development, responsive design, animations, accessibility, dark theme enforcement.',
        capabilities: ['component_development', 'responsive_design', 'animation', 'accessibility', 'theme_consistency'],
        endpoint: '/api/agents/friday',
        requiredRole: 'admin',
    },
    {
        id: 'vision',
        name: 'VISION',
        role: 'Data & Analytics Engineer',
        type: 'Builder',
        model: 'claude-opus-4-6',
        description: 'Data pipelines, metric aggregation, chart generation, forecasting, and report automation.',
        capabilities: ['data_pipelines', 'metric_aggregation', 'chart_generation', 'forecasting', 'report_automation'],
        endpoint: '/api/agents/vision',
        requiredRole: 'admin',
    },
    {
        id: 'pepper',
        name: 'PEPPER',
        role: 'Revenue & Billing Engine',
        type: 'Builder',
        model: 'claude-opus-4-6',
        description: 'Stripe integration, subscription management, referral tracking, commission calculation.',
        capabilities: ['stripe_integration', 'subscription_management', 'referral_tracking', 'commission_calculation', 'payout_system'],
        endpoint: '/api/agents/pepper',
        requiredRole: 'admin',
    },
    {
        id: 'hawkeye',
        name: 'HAWKEYE',
        role: 'Integration Specialist',
        type: 'Builder',
        model: 'claude-sonnet-4-6',
        description: 'Connects ad platforms (Google Ads, Meta, TikTok), syncs data, normalizes metrics.',
        capabilities: ['google_ads_sync', 'meta_ads_connector', 'tiktok_api', 'data_normalization', 'oauth_management'],
        endpoint: '/api/agents/hawkeye',
        requiredRole: 'admin',
    },
    {
        id: 'sentinel',
        name: 'SENTINEL',
        role: 'Security & DevOps',
        type: 'Guardian',
        model: 'claude-sonnet-4-6',
        description: 'Vulnerability scanning, deployment automation, CI/CD, monitoring, and compliance.',
        capabilities: ['vulnerability_scanning', 'deployment', 'ci_cd', 'monitoring', 'compliance', 'dependency_audit'],
        endpoint: '/api/agents/sentinel',
        requiredRole: 'admin',
    },
    {
        id: 'commander',
        name: 'COMMANDER',
        role: 'Campaign Lifecycle Manager',
        type: 'Builder',
        model: 'claude-opus-4-6',
        description: 'Campaign cloning, templates, bulk actions, approval workflows, and status enforcement.',
        capabilities: ['campaign_cloning', 'template_management', 'bulk_operations', 'approval_workflow', 'status_enforcement'],
        endpoint: '/api/agents/commander',
        requiredRole: 'admin',
    },
    {
        id: 'autopilot',
        name: 'AUTOPILOT',
        role: 'Automation & Rules Engine',
        type: 'Builder',
        model: 'claude-opus-4-6',
        description: 'Campaign rules creation, condition evaluation, automated actions, execution auditing.',
        capabilities: ['rule_creation', 'condition_evaluation', 'action_execution', 'consecutive_tracking', 'conflict_detection'],
        endpoint: '/api/agents/autopilot',
        requiredRole: 'admin',
    },
    {
        id: 'allocator',
        name: 'ALLOCATOR',
        role: 'Budget & Performance Intelligence',
        type: 'Builder',
        model: 'claude-opus-4-6',
        description: 'Budget pacing, spend forecasting, allocation management, cross-channel rebalancing.',
        capabilities: ['budget_pacing', 'spend_forecasting', 'allocation_management', 'alert_evaluation', 'performance_rebalancing'],
        endpoint: '/api/agents/allocator',
        requiredRole: 'admin',
    },
] as const;

export type AgentId = typeof AGENT_CATALOG[number]['id'];
