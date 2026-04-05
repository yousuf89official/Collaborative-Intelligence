'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
    LogIn,
    Plus,
    Pencil,
    Trash2,
    RefreshCw,
    Bell,
    Zap,
    Activity,
    type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ActivityLog {
    id: string;
    userId: string | null;
    userName: string;
    userEmail: string;
    action: string;
    target: string;
    detail: string;
    severity: string;
    ip: string | null;
    createdAt: string;
}

interface ActivityFeedProps {
    limit?: number;
    brandId?: string;
    compact?: boolean;
}

// ---------------------------------------------------------------------------
// Action icon / color mapping
// ---------------------------------------------------------------------------

const ACTION_MAP: Record<string, { icon: LucideIcon; color: string; dot: string }> = {
    login:           { icon: LogIn,     color: 'text-teal-400',   dot: 'bg-teal-400' },
    create:          { icon: Plus,      color: 'text-green-400',  dot: 'bg-green-400' },
    update:          { icon: Pencil,    color: 'text-blue-400',   dot: 'bg-blue-400' },
    delete:          { icon: Trash2,    color: 'text-red-400',    dot: 'bg-red-400' },
    sync:            { icon: RefreshCw, color: 'text-purple-400', dot: 'bg-purple-400' },
    alert_triggered: { icon: Bell,      color: 'text-yellow-400', dot: 'bg-yellow-400' },
    rule_triggered:  { icon: Zap,       color: 'text-orange-400', dot: 'bg-orange-400' },
};

const DEFAULT_ACTION = { icon: Activity, color: 'text-gray-400', dot: 'bg-gray-400' };

function getActionMeta(action: string) {
    return ACTION_MAP[action] ?? DEFAULT_ACTION;
}

// ---------------------------------------------------------------------------
// Relative time helper
// ---------------------------------------------------------------------------

function relativeTime(dateStr: string): string {
    const now = Date.now();
    const then = new Date(dateStr).getTime();
    const diff = Math.max(0, now - then);
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ---------------------------------------------------------------------------
// Date grouping helper (full view)
// ---------------------------------------------------------------------------

function dateLabel(dateStr: string): string {
    const d = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const target = new Date(d);
    target.setHours(0, 0, 0, 0);

    if (target.getTime() === today.getTime()) return 'Today';
    if (target.getTime() === yesterday.getTime()) return 'Yesterday';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function groupByDate(logs: ActivityLog[]): { label: string; items: ActivityLog[] }[] {
    const groups: { label: string; items: ActivityLog[] }[] = [];
    let currentLabel = '';
    for (const log of logs) {
        const lbl = dateLabel(log.createdAt);
        if (lbl !== currentLabel) {
            currentLabel = lbl;
            groups.push({ label: lbl, items: [] });
        }
        groups[groups.length - 1].items.push(log);
    }
    return groups;
}

// ---------------------------------------------------------------------------
// Skeleton loader
// ---------------------------------------------------------------------------

function SkeletonLines({ count }: { count: number }) {
    return (
        <div className="space-y-4 p-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 animate-pulse">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08] mt-1.5 shrink-0" />
                    <div className="flex-1 space-y-2">
                        <div className="h-3 w-3/4 rounded bg-white/[0.08]" />
                        <div className="h-2.5 w-1/2 rounded bg-white/[0.06]" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Single activity item
// ---------------------------------------------------------------------------

function ActivityItem({
    log,
    compact,
    isLast,
}: {
    log: ActivityLog;
    compact: boolean;
    isLast: boolean;
}) {
    const { icon: Icon, color, dot } = getActionMeta(log.action);
    const severityBorder =
        log.severity === 'critical'
            ? 'border-l-2 border-l-red-500'
            : log.severity === 'warning'
              ? 'border-l-2 border-l-yellow-500'
              : '';

    const actionLabel = log.action.replace(/_/g, ' ');
    const truncatedDetail =
        log.detail && log.detail.length > 80
            ? `${log.detail.slice(0, 80)}...`
            : log.detail;

    if (compact) {
        return (
            <div
                className={cn(
                    'flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors',
                    severityBorder,
                )}
            >
                <div className={cn('mt-0.5 shrink-0', color)}>
                    <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/90 leading-snug truncate">
                        <span className="font-medium">{log.userName}</span>{' '}
                        {actionLabel}d{' '}
                        <span className="text-white/60">{log.target}</span>
                    </p>
                </div>
                <span className="text-[10px] text-white/40 shrink-0 mt-0.5">
                    {relativeTime(log.createdAt)}
                </span>
            </div>
        );
    }

    // Full view — timeline layout
    return (
        <div className={cn('relative flex gap-4 pl-1', severityBorder && 'pl-0')}>
            {/* Timeline column */}
            <div className="flex flex-col items-center shrink-0">
                <div className={cn('w-2.5 h-2.5 rounded-full mt-1.5 ring-2 ring-background', dot)} />
                {!isLast && <div className="w-px flex-1 bg-white/[0.08]" />}
            </div>

            {/* Content */}
            <div className={cn('pb-6 flex-1 min-w-0', severityBorder)}>
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className={cn('shrink-0', color)}>
                            <Icon size={14} />
                        </div>
                        <p className="text-sm text-white/90 leading-snug">
                            <span className="font-medium">{log.userName}</span>{' '}
                            {actionLabel}d{' '}
                            <span className="text-white/60">{log.target}</span>
                        </p>
                    </div>
                    <span className="text-[10px] text-white/40 shrink-0 whitespace-nowrap mt-0.5">
                        {relativeTime(log.createdAt)}
                    </span>
                </div>
                {log.detail && (
                    <p className="text-xs text-white/40 mt-1 leading-relaxed">
                        {compact ? truncatedDetail : log.detail}
                    </p>
                )}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ActivityFeed({
    limit = 10,
    brandId,
    compact = false,
}: ActivityFeedProps) {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = useCallback(async () => {
        try {
            const params = new URLSearchParams({ limit: String(limit) });
            if (brandId) params.set('brandId', brandId);
            const res = await fetch(`/api/activity-logs?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data: ActivityLog[] = await res.json();
            setLogs(data);
        } catch {
            // Silently fail — keep stale data if any
        } finally {
            setLoading(false);
        }
    }, [limit, brandId]);

    // Initial fetch + polling every 30s
    useEffect(() => {
        fetchLogs();
        const interval = setInterval(fetchLogs, 30_000);
        return () => clearInterval(interval);
    }, [fetchLogs]);

    // Date-grouped data for full view
    const groups = useMemo(() => groupByDate(logs), [logs]);

    // -----------------------------------------------------------------------
    // Loading state
    // -----------------------------------------------------------------------
    if (loading) {
        return <SkeletonLines count={compact ? 5 : limit} />;
    }

    // -----------------------------------------------------------------------
    // Empty state
    // -----------------------------------------------------------------------
    if (logs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-white/40">
                <Activity size={28} className="mb-2" />
                <p className="text-sm">No activity yet</p>
            </div>
        );
    }

    // -----------------------------------------------------------------------
    // Compact view
    // -----------------------------------------------------------------------
    if (compact) {
        return (
            <div>
                <div className="divide-y divide-white/[0.06]">
                    {logs.map((log) => (
                        <ActivityItem
                            key={log.id}
                            log={log}
                            compact
                            isLast={false}
                        />
                    ))}
                </div>
                <div className="px-3 py-2 border-t border-white/[0.06]">
                    <Link
                        href="/admin/activity-logs"
                        className="text-xs text-primary hover:underline"
                    >
                        View all activity &rarr;
                    </Link>
                </div>
            </div>
        );
    }

    // -----------------------------------------------------------------------
    // Full view — grouped by date with timeline
    // -----------------------------------------------------------------------
    return (
        <div className="space-y-6">
            {groups.map((group) => (
                <div key={group.label}>
                    <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 pl-7">
                        {group.label}
                    </p>
                    {group.items.map((log, idx) => (
                        <ActivityItem
                            key={log.id}
                            log={log}
                            compact={false}
                            isLast={idx === group.items.length - 1}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
