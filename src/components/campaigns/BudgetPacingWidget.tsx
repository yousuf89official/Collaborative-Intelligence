'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';

// ─── Types ──────────────────────────────────────────────────────────────────

interface PacingData {
    campaign: string;
    totalBudget: number;
    totalSpent: number;
    remainingBudget: number;
    daysTotal: number;
    daysElapsed: number;
    daysRemaining: number;
    dailyRunRate: number;
    idealDailySpend: number;
    projectedTotalSpend: number;
    paceStatus: 'on_track' | 'overpacing' | 'underpacing' | 'no_data';
    pacePercentage: number;
    budgetUtilization: number;
    projectedOverUnder: number;
}

interface BudgetPacingWidgetProps {
    campaignId: string;
    compact?: boolean;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(value);

const STATUS_CONFIG = {
    on_track: { label: 'On Track', color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)' },
    overpacing: { label: 'Overpacing', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' },
    underpacing: { label: 'Underpacing', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
    no_data: { label: 'No Data', color: '#6b7280', bg: 'rgba(107,114,128,0.12)', border: 'rgba(107,114,128,0.3)' },
} as const;

// ─── Sub-components ─────────────────────────────────────────────────────────

function StatusBadge({ status, large }: { status: PacingData['paceStatus']; large?: boolean }) {
    const config = STATUS_CONFIG[status];
    return (
        <span
            className={`inline-flex items-center font-medium rounded-full ${large ? 'px-4 py-1.5 text-sm' : 'px-2.5 py-0.5 text-xs'}`}
            style={{ color: config.color, backgroundColor: config.bg, border: `1px solid ${config.border}` }}
        >
            <span
                className={`rounded-full ${large ? 'w-2 h-2 mr-2' : 'w-1.5 h-1.5 mr-1.5'}`}
                style={{ backgroundColor: config.color }}
            />
            {config.label}
        </span>
    );
}

function ProgressBar({
    utilization,
    status,
    idealPercent,
    spentLabel,
    budgetLabel,
    mini,
}: {
    utilization: number;
    status: PacingData['paceStatus'];
    idealPercent?: number;
    spentLabel?: string;
    budgetLabel?: string;
    mini?: boolean;
}) {
    const barColor = STATUS_CONFIG[status].color;
    const clampedUtilization = Math.min(utilization, 100);

    return (
        <div className="w-full">
            <div className={`relative w-full rounded-full overflow-hidden ${mini ? 'h-1.5' : 'h-3'}`} style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${clampedUtilization}%`, backgroundColor: barColor }}
                />
                {idealPercent != null && !mini && (
                    <div
                        className="absolute top-0 h-full w-0.5"
                        style={{ left: `${Math.min(idealPercent, 100)}%`, backgroundColor: 'rgba(255,255,255,0.5)' }}
                        title={`Ideal: ${idealPercent.toFixed(0)}%`}
                    />
                )}
            </div>
            {!mini && spentLabel && budgetLabel && (
                <div className="flex justify-between mt-1.5 text-xs text-white/40">
                    <span>{spentLabel} spent</span>
                    <span>{budgetLabel} budget</span>
                </div>
            )}
        </div>
    );
}

function MetricCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg px-4 py-3" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-xs text-white/40 mb-1">{label}</p>
            <p className="text-sm font-semibold text-white/90">{value}</p>
        </div>
    );
}

// ─── Loading State ──────────────────────────────────────────────────────────

function LoadingSkeleton({ compact }: { compact?: boolean }) {
    if (compact) {
        return (
            <div className="rounded-xl p-4 animate-pulse" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="h-4 w-24 rounded bg-white/10 mb-3" />
                <div className="h-1.5 w-full rounded bg-white/10" />
            </div>
        );
    }

    return (
        <div className="rounded-xl p-6 animate-pulse" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="h-6 w-32 rounded bg-white/10 mb-4" />
            <div className="h-3 w-full rounded bg-white/10 mb-6" />
            <div className="grid grid-cols-4 gap-3">
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="h-16 rounded-lg bg-white/5" />
                ))}
            </div>
        </div>
    );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function BudgetPacingWidget({ campaignId, compact = false }: BudgetPacingWidgetProps) {
    const [data, setData] = useState<PacingData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        setLoading(true);
        setError(false);

        api.campaigns.getPacing(campaignId)
            .then((result: PacingData) => {
                if (!cancelled) {
                    setData(result);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setError(true);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => { cancelled = true; };
    }, [campaignId]);

    // Loading
    if (loading) {
        return <LoadingSkeleton compact={compact} />;
    }

    // Error / No Data
    if (error || !data || data.paceStatus === 'no_data') {
        return (
            <div
                className="rounded-xl p-6 text-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
                <p className="text-sm text-white/40">No pacing data available</p>
            </div>
        );
    }

    // ── Compact View ────────────────────────────────────────────────────────

    if (compact) {
        return (
            <div
                className="rounded-xl p-4"
                style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-white/80 truncate mr-2">{data.campaign}</p>
                    <StatusBadge status={data.paceStatus} />
                </div>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/40">Utilization</span>
                    <span className="text-xs font-medium text-white/60">{data.budgetUtilization.toFixed(0)}%</span>
                </div>
                <ProgressBar
                    utilization={data.budgetUtilization}
                    status={data.paceStatus}
                    mini
                />
            </div>
        );
    }

    // ── Full View ───────────────────────────────────────────────────────────

    const idealPercent = data.daysTotal > 0 ? (data.daysElapsed / data.daysTotal) * 100 : 0;

    return (
        <div
            className="rounded-xl p-6"
            style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-white/90">Budget Pacing</h3>
                <StatusBadge status={data.paceStatus} large />
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <ProgressBar
                    utilization={data.budgetUtilization}
                    status={data.paceStatus}
                    idealPercent={idealPercent}
                    spentLabel={formatCurrency(data.totalSpent)}
                    budgetLabel={formatCurrency(data.totalBudget)}
                />
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                <MetricCard label="Daily Run Rate" value={`${formatCurrency(data.dailyRunRate)}/day`} />
                <MetricCard label="Ideal Daily Spend" value={`${formatCurrency(data.idealDailySpend)}/day`} />
                <MetricCard label="Projected Total" value={formatCurrency(data.projectedTotalSpend)} />
                <MetricCard label="Days Remaining" value={`${data.daysRemaining} days`} />
            </div>

            {/* Projected Over/Under */}
            {data.projectedOverUnder !== 0 && (
                <div
                    className="rounded-lg px-4 py-3 text-sm"
                    style={{
                        backgroundColor: data.paceStatus === 'overpacing' ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
                        border: `1px solid ${data.paceStatus === 'overpacing' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}`,
                        color: data.paceStatus === 'overpacing' ? '#ef4444' : '#f59e0b',
                    }}
                >
                    {data.projectedOverUnder > 0
                        ? `Projected to overspend by ${formatCurrency(data.projectedOverUnder)}`
                        : `Projected to underspend by ${formatCurrency(Math.abs(data.projectedOverUnder))}`}
                </div>
            )}
        </div>
    );
}
