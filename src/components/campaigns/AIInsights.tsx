'use client';

import { useState, useEffect } from 'react';
import { Sparkles, AlertTriangle, TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// ─── Types ──────────────────────────────────────────────────────────────────

interface AIInsightsProps {
    brandId: string;
    campaignId?: string;
    compact?: boolean;
}

interface BrandSummary {
    brandId: string;
    brandName: string;
    generatedAt: string;
    period: string;
    headline: string;
    executiveSummary: string;
    keyMetrics: {
        totalSpend: number;
        totalImpressions: number;
        totalClicks: number;
        totalEngagement: number;
        avgCTR: number;
        avgCPC: number;
        activeCampaigns: number;
    };
    topPerformers: { name: string; score: number; insight: string }[];
    underperformers: { name: string; score: number; recommendation: string }[];
    anomalies: { message: string; severity: string }[];
    recommendations: string[];
}

interface CampaignScore {
    campaignId: string;
    campaignName: string;
    brandId: string;
    overallScore: number;
    efficiencyScore: number;
    growthScore: number;
    engagementScore: number;
    spendScore: number;
    trend: 'improving' | 'stable' | 'declining';
    insights: string[];
    periodDays: number;
}

interface AnomalyItem {
    id: string;
    brandId: string;
    campaignId?: string;
    campaignName?: string;
    type: 'spike' | 'drop' | 'pacing' | 'flatline';
    severity: 'info' | 'warning' | 'critical';
    metric: string;
    currentValue: number;
    expectedValue: number;
    deviationPct: number;
    message: string;
    detectedAt: string;
}

interface AnomaliesResponse {
    brandId: string;
    period: string;
    total: number;
    critical: number;
    warnings: number;
    anomalies: AnomalyItem[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function scoreColor(score: number): string {
    if (score > 70) return 'text-emerald-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
}

function scoreBgColor(score: number): string {
    if (score > 70) return 'bg-emerald-500/15 border-emerald-500/25';
    if (score >= 40) return 'bg-yellow-500/15 border-yellow-500/25';
    return 'bg-red-500/15 border-red-500/25';
}

function severityStyles(severity: string): { border: string; badge: string; label: string } {
    switch (severity) {
        case 'critical':
            return {
                border: 'border-l-red-500',
                badge: 'bg-red-500/10 text-red-400 border-red-500/20',
                label: 'Critical',
            };
        case 'warning':
            return {
                border: 'border-l-yellow-500',
                badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
                label: 'Warning',
            };
        default:
            return {
                border: 'border-l-blue-500',
                badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                label: 'Info',
            };
    }
}

function trendIcon(trend: string) {
    switch (trend) {
        case 'improving':
            return <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />;
        case 'declining':
            return <TrendingDown className="h-3.5 w-3.5 text-red-400" />;
        default:
            return <Minus className="h-3.5 w-3.5 text-white/40" />;
    }
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

// ─── Skeleton ───────────────────────────────────────────────────────────────

function Skeleton({ className = '' }: { className?: string }) {
    return <div className={`animate-pulse rounded bg-white/[0.08] ${className}`} />;
}

function LoadingSkeleton({ compact }: { compact: boolean }) {
    if (compact) {
        return (
            <div className="flex flex-col gap-3 p-4">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="ml-auto h-6 w-12 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-6">
            {/* Summary skeleton */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-28" />
                </div>
                <Skeleton className="h-5 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
            </div>
            {/* Score skeleton */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-5">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Score Dimension Bar ────────────────────────────────────────────────────

function DimensionBar({ label, score }: { label: string; score: number }) {
    return (
        <div className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-xs text-white/50">{label}</span>
            <div className="flex-1 h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-700 ${
                        score > 70 ? 'bg-emerald-400' : score >= 40 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${Math.max(score, 2)}%` }}
                />
            </div>
            <span className={`w-8 text-right text-xs font-medium ${scoreColor(score)}`}>{score}</span>
        </div>
    );
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function AIInsights({ brandId, campaignId, compact = false }: AIInsightsProps) {
    const [summary, setSummary] = useState<BrandSummary | null>(null);
    const [scores, setScores] = useState<CampaignScore[] | CampaignScore | null>(null);
    const [anomaliesData, setAnomaliesData] = useState<AnomaliesResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        let active = true;

        async function fetchInsights() {
            setLoading(true);
            setError(false);

            const scoreParam = campaignId
                ? `campaignId=${campaignId}`
                : `brandId=${brandId}`;

            const requests = [
                fetch(`/api/intelligence/summary?brandId=${brandId}`)
                    .then((r) => (r.ok ? r.json() : null))
                    .catch(() => null),
                fetch(`/api/intelligence/score?${scoreParam}`)
                    .then((r) => (r.ok ? r.json() : null))
                    .catch(() => null),
                fetch(`/api/intelligence/anomalies?brandId=${brandId}`)
                    .then((r) => (r.ok ? r.json() : null))
                    .catch(() => null),
            ];

            const [summaryRes, scoreRes, anomaliesRes] = await Promise.all(requests);

            if (!active) return;

            if (!summaryRes && !scoreRes && !anomaliesRes) {
                setError(true);
            }

            setSummary(summaryRes);
            setScores(scoreRes);
            setAnomaliesData(anomaliesRes);
            setLoading(false);
        }

        fetchInsights();

        return () => {
            active = false;
        };
    }, [brandId, campaignId]);

    // ── Derive overall score ────────────────────────────────────────────────

    const overallScore: number | null = (() => {
        if (!scores) return null;
        if (Array.isArray(scores)) {
            if (scores.length === 0) return null;
            const avg = scores.reduce((s, c) => s + c.overallScore, 0) / scores.length;
            return Math.round(avg);
        }
        return (scores as CampaignScore).overallScore;
    })();

    const primaryScore: CampaignScore | null = (() => {
        if (!scores) return null;
        if (Array.isArray(scores)) return scores[0] ?? null;
        return scores as CampaignScore;
    })();

    // ── Compact View ────────────────────────────────────────────────────────

    if (compact) {
        return (
            <div
                className="group rounded-xl border border-white/[0.06] bg-white/[0.03] transition-colors hover:bg-white/[0.05] cursor-pointer"
                onClick={() => setExpanded(!expanded)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setExpanded(!expanded);
                    }
                }}
            >
                {loading ? (
                    <LoadingSkeleton compact />
                ) : error || (!summary && overallScore === null) ? (
                    <div className="flex items-center gap-2 p-4">
                        <Sparkles className="h-4 w-4 text-white/30" />
                        <span className="text-sm text-white/40">No AI insights available</span>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-2 p-4 pb-2">
                            <Sparkles className="h-4 w-4 text-teal-400" />
                            <span className="text-xs font-medium text-white/60">AI Insight</span>
                            {overallScore !== null && (
                                <span
                                    className={`ml-auto inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${scoreBgColor(overallScore)} ${scoreColor(overallScore)}`}
                                >
                                    {overallScore}
                                </span>
                            )}
                            <ChevronRight
                                className={`h-3.5 w-3.5 text-white/30 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
                            />
                        </div>
                        <div className="px-4 pb-4">
                            <p className="text-sm text-white/70 line-clamp-2">
                                {summary?.headline || summary?.executiveSummary || 'Analyzing campaign performance...'}
                            </p>
                        </div>
                        {expanded && (
                            <div className="border-t border-white/[0.06] p-4">
                                {summary?.recommendations && summary.recommendations.length > 0 && (
                                    <ul className="space-y-1.5">
                                        {summary.recommendations.slice(0, 3).map((rec, i) => (
                                            <li key={i} className="flex items-start gap-2 text-xs text-white/50">
                                                <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-teal-400" />
                                                {rec}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {anomaliesData && anomaliesData.total > 0 && (
                                    <div className="mt-3 flex items-center gap-2 text-xs text-white/40">
                                        <AlertTriangle className="h-3 w-3 text-yellow-400" />
                                        {anomaliesData.critical > 0 && (
                                            <span className="text-red-400">{anomaliesData.critical} critical</span>
                                        )}
                                        {anomaliesData.warnings > 0 && (
                                            <span className="text-yellow-400">{anomaliesData.warnings} warnings</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    }

    // ── Full View ───────────────────────────────────────────────────────────

    if (loading) {
        return <LoadingSkeleton compact={false} />;
    }

    if (error || (!summary && overallScore === null && !anomaliesData)) {
        return (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-6">
                <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 text-white/30" />
                    <span className="text-sm font-medium text-white/50">AI Analysis</span>
                </div>
                <p className="text-sm text-white/40">
                    No AI insights available yet. Add campaign data to generate insights.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* ── AI Summary Card ────────────────────────────────────── */}
            {summary && (
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] overflow-hidden">
                    {/* Gradient header */}
                    <div className="flex items-center gap-2.5 px-5 py-3 bg-gradient-to-r from-teal-500/10 to-purple-500/10 border-b border-white/[0.06]">
                        <Sparkles className="h-4.5 w-4.5 text-teal-400" />
                        <span className="text-sm font-semibold bg-gradient-to-r from-teal-300 to-purple-300 bg-clip-text text-transparent">
                            AI Analysis
                        </span>
                        <span className="ml-auto text-[10px] text-white/30">{summary.period}</span>
                    </div>

                    <div className="p-5 space-y-4">
                        {/* Headline */}
                        {summary.headline && (
                            <h3 className="text-base font-medium text-white/90">{summary.headline}</h3>
                        )}

                        {/* Executive summary */}
                        {summary.executiveSummary && (
                            <p className="text-sm leading-relaxed text-white/60">{summary.executiveSummary}</p>
                        )}

                        {/* Recommendations */}
                        {summary.recommendations && summary.recommendations.length > 0 && (
                            <div className="pt-2">
                                <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2.5">
                                    Recommendations
                                </h4>
                                <ul className="space-y-2">
                                    {summary.recommendations.map((rec, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-sm text-white/60">
                                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-teal-400 to-purple-400" />
                                            {rec}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Top performers / Underperformers */}
                        {(summary.topPerformers.length > 0 || summary.underperformers.length > 0) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                                {summary.topPerformers.length > 0 && (
                                    <div className="rounded-lg border border-emerald-500/10 bg-emerald-500/[0.04] p-3">
                                        <h4 className="text-xs font-medium text-emerald-400 mb-2">Top Performers</h4>
                                        {summary.topPerformers.slice(0, 3).map((tp, i) => (
                                            <div key={i} className="flex items-center justify-between py-1">
                                                <span className="text-xs text-white/60 truncate mr-2">{tp.name}</span>
                                                <span className={`text-xs font-semibold ${scoreColor(tp.score)}`}>
                                                    {tp.score}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {summary.underperformers.length > 0 && (
                                    <div className="rounded-lg border border-red-500/10 bg-red-500/[0.04] p-3">
                                        <h4 className="text-xs font-medium text-red-400 mb-2">Needs Attention</h4>
                                        {summary.underperformers.slice(0, 3).map((up, i) => (
                                            <div key={i} className="flex items-center justify-between py-1">
                                                <span className="text-xs text-white/60 truncate mr-2">{up.name}</span>
                                                <span className={`text-xs font-semibold ${scoreColor(up.score)}`}>
                                                    {up.score}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Score Card ─────────────────────────────────────────── */}
            {primaryScore && overallScore !== null && (
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-5">
                    <div className="flex items-start gap-5">
                        {/* Large score display */}
                        <div className="flex flex-col items-center shrink-0">
                            <div
                                className={`flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 ${scoreBgColor(overallScore)}`}
                            >
                                <span className={`text-2xl font-bold ${scoreColor(overallScore)}`}>
                                    {overallScore}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 mt-1.5">
                                {trendIcon(primaryScore.trend)}
                                <span className="text-[10px] text-white/40 capitalize">{primaryScore.trend}</span>
                            </div>
                        </div>

                        {/* Dimension scores */}
                        <div className="flex-1 space-y-2.5 min-w-0">
                            <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">
                                Performance Dimensions
                            </h4>
                            <DimensionBar label="Efficiency" score={primaryScore.efficiencyScore} />
                            <DimensionBar label="Growth" score={primaryScore.growthScore} />
                            <DimensionBar label="Engagement" score={primaryScore.engagementScore} />
                            <DimensionBar label="Spend" score={primaryScore.spendScore} />
                        </div>
                    </div>

                    {/* Insights */}
                    {primaryScore.insights && primaryScore.insights.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/[0.06]">
                            <div className="flex flex-wrap gap-2">
                                {primaryScore.insights.map((insight, i) => (
                                    <span
                                        key={i}
                                        className="inline-flex items-center rounded-md bg-white/[0.05] px-2.5 py-1 text-xs text-white/50"
                                    >
                                        {insight}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── Anomalies List ─────────────────────────────────────── */}
            {anomaliesData && anomaliesData.anomalies.length > 0 && (
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06]">
                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm font-medium text-white/70">Detected Anomalies</span>
                        <span className="ml-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/[0.08] px-1.5 text-xs text-white/50">
                            {anomaliesData.total}
                        </span>
                        {anomaliesData.critical > 0 && (
                            <Badge className="ml-auto bg-red-500/10 text-red-400 border-red-500/20 text-[10px]">
                                {anomaliesData.critical} critical
                            </Badge>
                        )}
                    </div>

                    <div className="divide-y divide-white/[0.04]">
                        {anomaliesData.anomalies.map((anomaly) => {
                            const styles = severityStyles(anomaly.severity);
                            return (
                                <div
                                    key={anomaly.id}
                                    className={`flex items-start gap-3 border-l-2 ${styles.border} px-5 py-3.5`}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge
                                                className={`text-[10px] px-2 py-0.5 border ${styles.badge}`}
                                            >
                                                {styles.label}
                                            </Badge>
                                            <span className="text-[10px] text-white/30 uppercase tracking-wide">
                                                {anomaly.metric}
                                            </span>
                                            {anomaly.campaignName && (
                                                <span className="text-[10px] text-white/25 truncate">
                                                    {anomaly.campaignName}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-white/60">{anomaly.message}</p>
                                    </div>
                                    <span className="shrink-0 text-[10px] text-white/25">
                                        {formatDate(anomaly.detectedAt)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
