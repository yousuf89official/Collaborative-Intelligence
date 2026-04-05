'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
    Zap, BarChart3, Target, RefreshCw, Loader2, ChevronDown,
    ArrowUpRight, ArrowDownRight, Minus, FileText, Download
} from 'lucide-react';

interface CampaignScore {
    campaignId: string;
    campaignName: string;
    overallScore: number;
    efficiencyScore: number;
    growthScore: number;
    engagementScore: number;
    spendScore: number;
    trend: 'improving' | 'stable' | 'declining';
    insights: string[];
    metrics: Record<string, number>;
}

interface Anomaly {
    id: string;
    campaignName?: string;
    type: string;
    severity: string;
    metric: string;
    deviationPct: number;
    message: string;
    detectedAt: string;
}

interface BrandSummary {
    headline: string;
    executiveSummary: string;
    keyMetrics: Record<string, number>;
    topPerformers: { name: string; score: number; insight: string }[];
    underperformers: { name: string; score: number; recommendation: string }[];
    recommendations: string[];
    anomalies: { message: string; severity: string }[];
}

interface BenchmarkComparison {
    metric: string;
    label: string;
    brandValue: number;
    industryAvg: number;
    vsIndustry: number;
    vsPrevious: number;
    rating: string;
}

export function IntelligencePanel({ brandId }: { brandId: string }) {
    const [activeView, setActiveView] = useState<'summary' | 'scores' | 'anomalies' | 'benchmarks'>('summary');
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<BrandSummary | null>(null);
    const [scores, setScores] = useState<CampaignScore[]>([]);
    const [anomalies, setAnomalies] = useState<{ anomalies: Anomaly[]; critical: number; warnings: number; total: number } | null>(null);
    const [benchmarks, setBenchmarks] = useState<{ comparisons: BenchmarkComparison[]; overallRating: string } | null>(null);
    const [days, setDays] = useState(30);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        const params = `brandId=${brandId}&days=${days}`;
        const [sumRes, scoreRes, anomRes, benchRes] = await Promise.allSettled([
            fetch(`/api/intelligence/summary?${params}`),
            fetch(`/api/intelligence/score?${params}`),
            fetch(`/api/intelligence/anomalies?${params}`),
            fetch(`/api/intelligence/benchmarks?${params}`),
        ]);
        if (sumRes.status === 'fulfilled' && sumRes.value.ok) setSummary(await sumRes.value.json());
        if (scoreRes.status === 'fulfilled' && scoreRes.value.ok) setScores(await scoreRes.value.json());
        if (anomRes.status === 'fulfilled' && anomRes.value.ok) setAnomalies(await anomRes.value.json());
        if (benchRes.status === 'fulfilled' && benchRes.value.ok) setBenchmarks(await benchRes.value.json());
        setLoading(false);
    }, [brandId, days]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const ScoreRing = ({ score, size = 48 }: { score: number; size?: number }) => {
        const radius = (size - 6) / 2;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (score / 100) * circumference;
        const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';
        return (
            <svg width={size} height={size} className="shrink-0">
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={3} />
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={3}
                    strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`} className="transition-all duration-700" />
                <text x="50%" y="50%" textAnchor="middle" dy="0.35em" fill="white" fontSize={size * 0.28} fontWeight="bold">{score}</text>
            </svg>
        );
    };

    const TrendIcon = ({ trend }: { trend: string }) => {
        if (trend === 'improving') return <ArrowUpRight className="h-3.5 w-3.5 text-green-400" />;
        if (trend === 'declining') return <ArrowDownRight className="h-3.5 w-3.5 text-red-400" />;
        return <Minus className="h-3.5 w-3.5 text-white/30" />;
    };

    const SeverityDot = ({ severity }: { severity: string }) => (
        <div className={`w-2 h-2 rounded-full shrink-0 ${severity === 'critical' ? 'bg-red-500 shadow-[0_0_6px] shadow-red-500/50' : severity === 'warning' ? 'bg-amber-500 shadow-[0_0_6px] shadow-amber-500/50' : 'bg-white/30'}`} />
    );

    if (loading) {
        return (
            <div className="p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl flex items-center justify-center py-16">
                <div className="text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-[#0D9488] mx-auto mb-2" />
                    <p className="text-xs text-white/40">Analyzing campaign intelligence...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-[#0D9488]" />
                    <h3 className="font-bold text-white text-sm">AI Intelligence</h3>
                    {anomalies && anomalies.critical > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 animate-pulse">
                            {anomalies.critical} critical
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <select value={days} onChange={e => setDays(Number(e.target.value))} className="text-[10px] px-2 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-white/60 focus:outline-none">
                        <option value={7} className="bg-[#0a0f1a] text-white">7 days</option>
                        <option value={14} className="bg-[#0a0f1a] text-white">14 days</option>
                        <option value={30} className="bg-[#0a0f1a] text-white">30 days</option>
                        <option value={90} className="bg-[#0a0f1a] text-white">90 days</option>
                    </select>
                    <button onClick={fetchAll} className="p-1.5 rounded-lg hover:bg-white/[0.04] text-white/30 hover:text-white transition-colors">
                        <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            {/* View Tabs */}
            <div className="flex gap-1 overflow-x-auto">
                {[
                    { id: 'summary', label: 'Summary', icon: FileText },
                    { id: 'scores', label: 'Scores', icon: Target },
                    { id: 'anomalies', label: `Anomalies${anomalies?.total ? ` (${anomalies.total})` : ''}`, icon: AlertTriangle },
                    { id: 'benchmarks', label: 'Benchmarks', icon: BarChart3 },
                ].map(v => (
                    <button key={v.id} onClick={() => setActiveView(v.id as any)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeView === v.id ? 'bg-[#0D9488]/10 text-[#0D9488]' : 'text-white/30 hover:text-white/50'}`}>
                        <v.icon className="h-3 w-3" /> {v.label}
                    </button>
                ))}
            </div>

            {/* Summary View */}
            {activeView === 'summary' && summary && (
                <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-white/[0.06] bg-[rgba(22,32,50,0.4)]">
                        <p className="text-sm font-bold text-white mb-1">{summary.headline}</p>
                        <p className="text-xs text-white/50 leading-relaxed">{summary.executiveSummary}</p>
                    </div>

                    {summary.recommendations.length > 0 && (
                        <div className="p-4 rounded-xl border border-[#0D9488]/10 bg-[#0D9488]/5">
                            <p className="text-[10px] font-bold text-[#0D9488] uppercase tracking-wider mb-2">Recommendations</p>
                            <ul className="space-y-1.5">
                                {summary.recommendations.map((r, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                                        <Zap className="h-3 w-3 text-[#0D9488] shrink-0 mt-0.5" />
                                        {r}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {summary.anomalies.length > 0 && (
                        <div className="space-y-1.5">
                            {summary.anomalies.map((a, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5">
                                    <SeverityDot severity={a.severity} />
                                    <span className="text-xs text-white/50">{a.message}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeView === 'summary' && !summary && (
                <div className="text-center py-8">
                    <Brain className="h-10 w-10 text-white/10 mx-auto mb-2" />
                    <p className="text-xs text-white/30">No data available yet. Sync integrations to generate insights.</p>
                </div>
            )}

            {/* Scores View */}
            {activeView === 'scores' && (
                <div className="space-y-2">
                    {scores.length === 0 ? (
                        <div className="text-center py-8">
                            <Target className="h-10 w-10 text-white/10 mx-auto mb-2" />
                            <p className="text-xs text-white/30">No campaigns with metric data to score.</p>
                        </div>
                    ) : scores.map(s => (
                        <div key={s.campaignId} className="flex items-center gap-4 p-3 rounded-xl border border-white/[0.06] bg-[rgba(22,32,50,0.4)] hover:bg-[rgba(22,32,50,0.55)] transition-all">
                            <ScoreRing score={s.overallScore} />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <p className="text-sm font-bold text-white truncate">{s.campaignName}</p>
                                    <TrendIcon trend={s.trend} />
                                </div>
                                <p className="text-[10px] text-white/40 truncate">{s.insights[0]}</p>
                                <div className="flex gap-3 mt-1.5">
                                    {[
                                        { label: 'Efficiency', val: s.efficiencyScore },
                                        { label: 'Growth', val: s.growthScore },
                                        { label: 'Engagement', val: s.engagementScore },
                                        { label: 'Spend', val: s.spendScore },
                                    ].map(sub => (
                                        <div key={sub.label} className="text-[9px]">
                                            <span className="text-white/20">{sub.label}</span>
                                            <span className={`ml-1 font-bold ${sub.val >= 60 ? 'text-green-400' : sub.val >= 35 ? 'text-amber-400' : 'text-red-400'}`}>{sub.val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Anomalies View */}
            {activeView === 'anomalies' && (
                <div className="space-y-2">
                    {!anomalies || anomalies.anomalies.length === 0 ? (
                        <div className="text-center py-8">
                            <CheckCircle className="h-10 w-10 text-green-500/20 mx-auto mb-2" />
                            <p className="text-xs text-green-400/60">No anomalies detected. All metrics within normal range.</p>
                        </div>
                    ) : anomalies.anomalies.map(a => (
                        <div key={a.id} className={`flex items-start gap-3 p-3 rounded-xl border ${a.severity === 'critical' ? 'border-red-500/20 bg-red-500/5' : a.severity === 'warning' ? 'border-amber-500/10 bg-amber-500/5' : 'border-white/5 bg-white/[0.02]'}`}>
                            <SeverityDot severity={a.severity} />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-white/70">{a.message}</p>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[9px] text-white/20">{a.metric}</span>
                                    <span className={`text-[9px] font-bold ${a.deviationPct > 0 ? 'text-red-400' : 'text-amber-400'}`}>
                                        {a.deviationPct > 0 ? '+' : ''}{a.deviationPct.toFixed(0)}%
                                    </span>
                                    <span className="text-[9px] text-white/20">{new Date(a.detectedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Benchmarks View */}
            {activeView === 'benchmarks' && (
                <div className="space-y-3">
                    {!benchmarks ? (
                        <div className="text-center py-8">
                            <BarChart3 className="h-10 w-10 text-white/10 mx-auto mb-2" />
                            <p className="text-xs text-white/30">No benchmark data available.</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                <span className="text-xs text-white/40">Overall Rating</span>
                                <span className={`text-sm font-bold ${benchmarks.overallRating === 'Excellent' ? 'text-green-400' : benchmarks.overallRating === 'Good' ? 'text-[#0D9488]' : benchmarks.overallRating === 'Average' ? 'text-amber-400' : 'text-red-400'}`}>
                                    {benchmarks.overallRating}
                                </span>
                            </div>
                            {benchmarks.comparisons.map(c => {
                                const ratingColor = { excellent: 'text-green-400', good: 'text-[#0D9488]', average: 'text-amber-400', below: 'text-orange-400', poor: 'text-red-400' }[c.rating] || 'text-white/40';
                                return (
                                    <div key={c.metric} className="p-3 rounded-xl border border-white/[0.06] bg-[rgba(22,32,50,0.4)]">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-white">{c.label}</span>
                                            <span className={`text-[10px] font-bold uppercase ${ratingColor}`}>{c.rating}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="text-center p-1.5 rounded-lg bg-white/[0.03]">
                                                <p className="text-[9px] text-white/30">You</p>
                                                <p className="text-xs font-bold text-white">{c.brandValue.toFixed(2)}</p>
                                            </div>
                                            <div className="text-center p-1.5 rounded-lg bg-white/[0.03]">
                                                <p className="text-[9px] text-white/30">Industry</p>
                                                <p className="text-xs font-bold text-white/60">{c.industryAvg.toFixed(2)}</p>
                                            </div>
                                            <div className="text-center p-1.5 rounded-lg bg-white/[0.03]">
                                                <p className="text-[9px] text-white/30">vs Previous</p>
                                                <p className={`text-xs font-bold ${c.vsPrevious > 0 ? 'text-green-400' : c.vsPrevious < -5 ? 'text-red-400' : 'text-white/40'}`}>
                                                    {c.vsPrevious > 0 ? '+' : ''}{c.vsPrevious.toFixed(1)}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
