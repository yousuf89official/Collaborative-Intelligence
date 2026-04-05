'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { GitCompare, Loader2, RefreshCw, Trophy, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

// ─── Types ──────────────────────────────────────────────────────────────────

interface PlatformMetrics {
    spend: number;
    impressions: number;
    clicks: number;
    reach: number;
    engagement: number;
}

interface AttributionData {
    platforms: Record<string, PlatformMetrics>;
    brands: { id: string; name: string }[];
    unassignedMetrics: number;
    totalMetrics: number;
}

// ─── Platform Config ────────────────────────────────────────────────────────

const PLATFORMS = [
    { key: 'google', label: 'Google Ads', color: '#4285F4', gradient: 'from-[#4285F4]/20 to-[#4285F4]/5' },
    { key: 'meta', label: 'Meta Ads', color: '#1877F2', gradient: 'from-[#1877F2]/20 to-[#1877F2]/5' },
    { key: 'tiktok', label: 'TikTok Ads', color: '#FF0050', gradient: 'from-[#FF0050]/20 to-[#FF0050]/5' },
] as const;

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmt(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toLocaleString();
}

function fmtCurrency(n: number): string {
    return `$${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function ctr(clicks: number, impressions: number): string {
    if (impressions === 0) return '0.00%';
    return `${((clicks / impressions) * 100).toFixed(2)}%`;
}

function cpc(spend: number, clicks: number): string {
    if (clicks === 0) return '$0.00';
    return `$${(spend / clicks).toFixed(2)}`;
}

function perfScore(clicks: number, spend: number): number {
    if (spend === 0) return 0;
    return Math.round((clicks / spend) * 100) / 100;
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function AttributionPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<AttributionData | null>(null);
    const [brandId, setBrandId] = useState<string>('all');
    const [dateRange, setDateRange] = useState<string>('30d');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (brandId !== 'all') params.set('brandId', brandId);
            const res = await fetch(`/api/attribution?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const json: AttributionData = await res.json();
            setData(json);
        } catch {
            toast.error('Failed to load attribution data');
        } finally {
            setLoading(false);
        }
    }, [brandId]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Computed totals
    const totals: PlatformMetrics = data
        ? Object.values(data.platforms).reduce(
              (acc, p) => ({
                  spend: acc.spend + p.spend,
                  impressions: acc.impressions + p.impressions,
                  clicks: acc.clicks + p.clicks,
                  reach: acc.reach + p.reach,
                  engagement: acc.engagement + p.engagement,
              }),
              { spend: 0, impressions: 0, clicks: 0, reach: 0, engagement: 0 },
          )
        : { spend: 0, impressions: 0, clicks: 0, reach: 0, engagement: 0 };

    const hasData = data && totals.spend > 0;

    // Performance index rankings
    const rankings = data
        ? PLATFORMS.map((p) => ({
              ...p,
              score: perfScore(data.platforms[p.key]?.clicks ?? 0, data.platforms[p.key]?.spend ?? 0),
              metrics: data.platforms[p.key],
          }))
              .filter((p) => p.metrics && p.metrics.spend > 0)
              .sort((a, b) => b.score - a.score)
        : [];

    // ─── Loading state ──────────────────────────────────────────────────

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-[#0D9488] mx-auto mb-3" />
                    <p className="text-xs text-white/40">Loading cross-channel attribution...</p>
                </div>
            </div>
        );
    }

    // ─── Comparison table rows ──────────────────────────────────────────

    type MetricRow = {
        label: string;
        values: Record<string, string>;
        rawValues: Record<string, number>;
        total: string;
        isCurrency?: boolean;
    };

    const metricRows: MetricRow[] = data
        ? [
              {
                  label: 'Spend',
                  values: Object.fromEntries(PLATFORMS.map((p) => [p.key, fmtCurrency(data.platforms[p.key]?.spend ?? 0)])),
                  rawValues: Object.fromEntries(PLATFORMS.map((p) => [p.key, data.platforms[p.key]?.spend ?? 0])),
                  total: fmtCurrency(totals.spend),
                  isCurrency: true,
              },
              {
                  label: 'Impressions',
                  values: Object.fromEntries(PLATFORMS.map((p) => [p.key, fmt(data.platforms[p.key]?.impressions ?? 0)])),
                  rawValues: Object.fromEntries(PLATFORMS.map((p) => [p.key, data.platforms[p.key]?.impressions ?? 0])),
                  total: fmt(totals.impressions),
              },
              {
                  label: 'Clicks',
                  values: Object.fromEntries(PLATFORMS.map((p) => [p.key, fmt(data.platforms[p.key]?.clicks ?? 0)])),
                  rawValues: Object.fromEntries(PLATFORMS.map((p) => [p.key, data.platforms[p.key]?.clicks ?? 0])),
                  total: fmt(totals.clicks),
              },
              {
                  label: 'CTR',
                  values: Object.fromEntries(PLATFORMS.map((p) => [p.key, ctr(data.platforms[p.key]?.clicks ?? 0, data.platforms[p.key]?.impressions ?? 0)])),
                  rawValues: Object.fromEntries(
                      PLATFORMS.map((p) => {
                          const imp = data.platforms[p.key]?.impressions ?? 0;
                          return [p.key, imp > 0 ? (data.platforms[p.key]?.clicks ?? 0) / imp : 0];
                      }),
                  ),
                  total: ctr(totals.clicks, totals.impressions),
              },
              {
                  label: 'CPC',
                  values: Object.fromEntries(PLATFORMS.map((p) => [p.key, cpc(data.platforms[p.key]?.spend ?? 0, data.platforms[p.key]?.clicks ?? 0)])),
                  rawValues: Object.fromEntries(
                      PLATFORMS.map((p) => {
                          const clicks = data.platforms[p.key]?.clicks ?? 0;
                          // For CPC, lower is better — invert for "best" detection
                          return [p.key, clicks > 0 ? (data.platforms[p.key]?.spend ?? 0) / clicks : Infinity];
                      }),
                  ),
                  total: cpc(totals.spend, totals.clicks),
                  isCurrency: true,
              },
          ]
        : [];

    function bestPlatform(row: MetricRow): string | null {
        const entries = Object.entries(row.rawValues).filter(([, v]) => v > 0 && v !== Infinity);
        if (entries.length === 0) return null;
        // For CPC (lower is better) and Spend (lower is better), pick minimum
        if (row.label === 'CPC') {
            return entries.reduce((best, curr) => (curr[1] < best[1] ? curr : best))[0];
        }
        // For CTR, Clicks, Impressions — higher is better
        return entries.reduce((best, curr) => (curr[1] > best[1] ? curr : best))[0];
    }

    // ─── Render ─────────────────────────────────────────────────────────

    return (
        <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                icon={GitCompare}
                category="Analytics"
                title="Cross-Channel Attribution"
                description="Compare campaign performance across Google Ads, Meta Ads, and TikTok side-by-side."
                actions={
                    <div className="flex items-center gap-2">
                        {/* Brand selector */}
                        <select
                            value={brandId}
                            onChange={(e) => setBrandId(e.target.value)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/[0.03] text-white/60 border border-white/[0.06] focus:outline-none focus:border-[#0D9488]/40"
                        >
                            <option value="all">All Brands</option>
                            {data?.brands.map((b) => (
                                <option key={b.id} value={b.id}>
                                    {b.name}
                                </option>
                            ))}
                        </select>

                        {/* Date range presets */}
                        {['7d', '30d', '90d'].map((d) => (
                            <button
                                key={d}
                                onClick={() => setDateRange(d)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    dateRange === d
                                        ? 'bg-[#0D9488] text-white shadow-lg shadow-teal-500/20'
                                        : 'bg-white/[0.03] text-white/40 border border-white/[0.06]'
                                }`}
                            >
                                {d}
                            </button>
                        ))}

                        <button
                            onClick={fetchData}
                            className="p-2 rounded-lg hover:bg-white/[0.04] text-white/30 hover:text-white transition-colors ml-1"
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                }
            />

            {/* No data state */}
            {!hasData && !loading && (
                <div className="p-8 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl text-center">
                    <AlertTriangle className="h-8 w-8 text-amber-400/60 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-white mb-1">No Attribution Data</h3>
                    <p className="text-xs text-white/40 max-w-md mx-auto">
                        Connect your Google Ads, Meta Ads, and TikTok integrations to see cross-channel
                        performance data. Metrics will appear here once campaigns are linked and syncing.
                    </p>
                </div>
            )}

            {hasData && (
                <>
                    {/* ── Platform Summary Cards ─────────────────────────────────── */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {PLATFORMS.map((platform) => {
                            const m = data.platforms[platform.key];
                            if (!m) return null;
                            return (
                                <div
                                    key={platform.key}
                                    className={`p-5 rounded-2xl border border-white/[0.06] bg-gradient-to-br ${platform.gradient} backdrop-blur-xl relative overflow-hidden`}
                                >
                                    {/* Color accent bar */}
                                    <div
                                        className="absolute top-0 left-0 right-0 h-1"
                                        style={{ backgroundColor: platform.color }}
                                    />

                                    <div className="flex items-center gap-2 mb-4">
                                        <div
                                            className="w-2.5 h-2.5 rounded-full"
                                            style={{ backgroundColor: platform.color }}
                                        />
                                        <h3 className="text-sm font-bold text-white">{platform.label}</h3>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-[10px] text-white/40 uppercase tracking-wider">Spend</p>
                                            <p className="text-lg font-bold text-white">{fmtCurrency(m.spend)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-white/40 uppercase tracking-wider">Impressions</p>
                                            <p className="text-lg font-bold text-white">{fmt(m.impressions)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-white/40 uppercase tracking-wider">Clicks</p>
                                            <p className="text-lg font-bold text-white">{fmt(m.clicks)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-white/40 uppercase tracking-wider">CTR</p>
                                            <p className="text-lg font-bold text-white">
                                                {ctr(m.clicks, m.impressions)}
                                            </p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-[10px] text-white/40 uppercase tracking-wider">CPC</p>
                                            <p className="text-lg font-bold text-white">{cpc(m.spend, m.clicks)}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ── Comparison Table ────────────────────────────────────────── */}
                    <div className="p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl overflow-x-auto">
                        <h3 className="font-bold text-white mb-4">Platform Comparison</h3>
                        <table className="w-full min-w-[600px]">
                            <thead>
                                <tr className="text-[10px] text-white/30 uppercase tracking-wider border-b border-white/5">
                                    <th className="text-left py-3 px-4">Metric</th>
                                    {PLATFORMS.map((p) => (
                                        <th key={p.key} className="text-right py-3 px-4">
                                            <span className="flex items-center justify-end gap-1.5">
                                                <span
                                                    className="w-2 h-2 rounded-full inline-block"
                                                    style={{ backgroundColor: p.color }}
                                                />
                                                {p.label}
                                            </span>
                                        </th>
                                    ))}
                                    <th className="text-right py-3 px-4">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {metricRows.map((row, i) => {
                                    const best = bestPlatform(row);
                                    return (
                                        <tr
                                            key={row.label}
                                            className={`border-b border-white/5 ${
                                                i % 2 === 0 ? 'bg-white/[0.01]' : ''
                                            }`}
                                        >
                                            <td className="py-3 px-4 text-sm font-medium text-white/60">
                                                {row.label}
                                            </td>
                                            {PLATFORMS.map((p) => (
                                                <td
                                                    key={p.key}
                                                    className={`py-3 px-4 text-sm font-bold text-right ${
                                                        best === p.key ? 'text-green-400' : 'text-white'
                                                    }`}
                                                >
                                                    {row.values[p.key]}
                                                </td>
                                            ))}
                                            <td className="py-3 px-4 text-sm font-bold text-white/40 text-right">
                                                {row.total}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <p className="text-[10px] text-white/20 mt-3">
                            Green values indicate the best performer per metric row.
                        </p>
                    </div>

                    {/* ── Budget Allocation Bar ──────────────────────────────────── */}
                    <div className="p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                        <h3 className="font-bold text-white mb-4">Budget Allocation</h3>
                        {/* Proportional bar */}
                        <div className="flex h-8 rounded-lg overflow-hidden mb-4">
                            {PLATFORMS.map((p) => {
                                const spend = data.platforms[p.key]?.spend ?? 0;
                                const pct = totals.spend > 0 ? (spend / totals.spend) * 100 : 0;
                                if (pct === 0) return null;
                                return (
                                    <div
                                        key={p.key}
                                        className="h-full flex items-center justify-center text-[10px] font-bold text-white transition-all"
                                        style={{
                                            width: `${pct}%`,
                                            backgroundColor: p.color,
                                            minWidth: pct > 0 ? '40px' : '0',
                                        }}
                                    >
                                        {pct >= 8 ? `${pct.toFixed(1)}%` : ''}
                                    </div>
                                );
                            })}
                        </div>
                        {/* Legend */}
                        <div className="flex flex-wrap gap-4">
                            {PLATFORMS.map((p) => {
                                const spend = data.platforms[p.key]?.spend ?? 0;
                                const pct = totals.spend > 0 ? (spend / totals.spend) * 100 : 0;
                                return (
                                    <div key={p.key} className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-sm"
                                            style={{ backgroundColor: p.color }}
                                        />
                                        <span className="text-xs text-white/60">{p.label}</span>
                                        <span className="text-xs font-bold text-white">
                                            {fmtCurrency(spend)} ({pct.toFixed(1)}%)
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Performance Index ──────────────────────────────────────── */}
                    {rankings.length > 0 && (
                        <div className="p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                            <h3 className="font-bold text-white mb-1">Performance Index</h3>
                            <p className="text-[10px] text-white/30 mb-4">
                                Score = (Clicks / Spend) x 100 — higher is better
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {rankings.map((r, i) => (
                                    <div
                                        key={r.key}
                                        className={`p-5 rounded-xl border transition-all ${
                                            i === 0
                                                ? 'border-yellow-500/20 bg-yellow-500/5'
                                                : 'border-white/[0.06] bg-white/[0.02]'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-2.5 h-2.5 rounded-full"
                                                    style={{ backgroundColor: r.color }}
                                                />
                                                <span className="text-sm font-bold text-white">{r.label}</span>
                                            </div>
                                            {i === 0 && (
                                                <Trophy className="h-4 w-4 text-yellow-400" />
                                            )}
                                        </div>
                                        <p className="text-3xl font-bold text-white mb-1">{r.score.toFixed(2)}</p>
                                        <p className="text-[10px] text-white/30">
                                            Rank #{i + 1} of {rankings.length}
                                        </p>
                                        {/* Score bar relative to best */}
                                        {rankings[0].score > 0 && (
                                            <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: `${(r.score / rankings[0].score) * 100}%`,
                                                        backgroundColor: r.color,
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
