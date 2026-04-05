'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import {
    BarChart3, TrendingUp, TrendingDown, Loader2, AlertCircle,
    ChevronDown, Lightbulb, Target, DollarSign, MousePointer,
    Eye, Users
} from 'lucide-react';
import { toast } from 'sonner';

interface Brand {
    id: string;
    name: string;
}

interface BenchmarkComparison {
    metric: string;
    label: string;
    brandValue: number;
    industryAvg: number;
    platformAvg: number;
    previousPeriod: number;
    vsIndustry: number;
    vsPlatform: number;
    vsPrevious: number;
    rating: 'excellent' | 'good' | 'average' | 'below' | 'poor';
}

interface BenchmarkReport {
    brandId: string;
    brandName: string;
    period: string;
    comparisons: BenchmarkComparison[];
    overallRating: string;
    industryBenchmarkSource: string;
}

// Map metrics to icons and formatting
const METRIC_CONFIG: Record<string, { icon: typeof BarChart3; format: (v: number) => string; higherIsBetter: boolean }> = {
    ctr: { icon: MousePointer, format: (v) => `${v.toFixed(2)}%`, higherIsBetter: true },
    cpc: { icon: DollarSign, format: (v) => `$${v.toFixed(2)}`, higherIsBetter: false },
    cpm: { icon: Eye, format: (v) => `$${v.toFixed(2)}`, higherIsBetter: false },
    engagementRate: { icon: Users, format: (v) => `${v.toFixed(2)}%`, higherIsBetter: true },
};

const RATING_COLORS: Record<string, string> = {
    excellent: 'text-green-400 bg-green-500/10 border-green-500/20',
    good: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    average: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    below: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    poor: 'text-red-400 bg-red-500/10 border-red-500/20',
};

function generateRecommendations(comparisons: BenchmarkComparison[]): { title: string; message: string }[] {
    const recs: { title: string; message: string }[] = [];

    for (const c of comparisons) {
        const config = METRIC_CONFIG[c.metric];
        if (!config) continue;

        const diff = Math.abs(c.vsIndustry).toFixed(1);

        if (c.metric === 'ctr' && c.vsIndustry < -5) {
            recs.push({
                title: 'Improve Click-Through Rate',
                message: `Your CTR is ${diff}% below industry average. Consider testing new ad creatives, refining audience targeting, or A/B testing headlines and CTAs.`,
            });
        } else if (c.metric === 'cpc' && c.vsIndustry < -5) {
            recs.push({
                title: 'Reduce Cost Per Click',
                message: `Your CPC is ${diff}% above average. Review keyword targeting, pause underperforming ads, and optimize quality scores to lower costs.`,
            });
        } else if (c.metric === 'cpm' && c.vsIndustry < -5) {
            recs.push({
                title: 'Optimize CPM Efficiency',
                message: `Your CPM is ${diff}% above industry average. Consider adjusting bid strategies, refining audience segments, or exploring more cost-effective placements.`,
            });
        } else if (c.metric === 'engagementRate' && c.vsIndustry < -5) {
            recs.push({
                title: 'Boost Engagement Rate',
                message: `Your engagement rate is ${diff}% below industry average. Focus on creating more interactive content, using video formats, and engaging with comments.`,
            });
        }
    }

    // If doing well across the board
    if (recs.length === 0) {
        const aboveAvg = comparisons.filter(c => c.vsIndustry > 0);
        if (aboveAvg.length >= comparisons.length / 2) {
            recs.push({
                title: 'Strong Performance',
                message: 'Your brand is performing at or above industry benchmarks across most metrics. Maintain current strategies and consider scaling high-performing campaigns.',
            });
        } else {
            recs.push({
                title: 'Review Campaign Strategy',
                message: 'Performance is mixed across metrics. Consider a deeper audit of individual campaigns to identify what is working and what needs adjustment.',
            });
        }
    }

    return recs.slice(0, 3);
}

export default function BenchmarksPage() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [selectedBrandId, setSelectedBrandId] = useState<string>('');
    const [report, setReport] = useState<BenchmarkReport | null>(null);
    const [loading, setLoading] = useState(false);
    const [brandsLoading, setBrandsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Fetch brands on mount
    useEffect(() => {
        async function fetchBrands() {
            try {
                const res = await fetch('/api/brands');
                if (!res.ok) throw new Error('Failed to fetch brands');
                const data = await res.json();
                setBrands(data);
            } catch (err) {
                toast.error('Failed to load brands');
            } finally {
                setBrandsLoading(false);
            }
        }
        fetchBrands();
    }, []);

    // Fetch benchmarks when brand selected
    const fetchBenchmarks = useCallback(async (brandId: string) => {
        if (!brandId) return;
        setLoading(true);
        setError(null);
        setReport(null);

        try {
            const res = await fetch(`/api/intelligence/benchmarks?brandId=${brandId}`);
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || 'Failed to fetch benchmarks');
            }
            const data: BenchmarkReport = await res.json();
            setReport(data);
        } catch (err: any) {
            console.error('Benchmark fetch error:', err);
            setError(err.message || 'Benchmark data unavailable. Ensure campaign data is synced.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selectedBrandId) {
            fetchBenchmarks(selectedBrandId);
        }
    }, [selectedBrandId, fetchBenchmarks]);

    const selectedBrand = brands.find(b => b.id === selectedBrandId);

    return (
        <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                icon={BarChart3}
                category="Analytics"
                title="Industry Benchmarks"
                description="Compare your brand's performance against industry averages."
                actions={
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm font-medium text-white hover:bg-white/[0.06] transition-all min-w-[200px] justify-between"
                        >
                            <span className={selectedBrand ? 'text-white' : 'text-white/40'}>
                                {brandsLoading ? 'Loading...' : selectedBrand ? selectedBrand.name : 'Select a brand'}
                            </span>
                            <ChevronDown className={`h-4 w-4 text-white/30 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {dropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                                <div className="absolute right-0 top-full mt-2 w-full min-w-[240px] max-h-60 overflow-y-auto rounded-xl bg-[rgba(22,32,50,0.95)] border border-white/[0.08] shadow-2xl shadow-black/30 z-20 backdrop-blur-xl">
                                    {brands.length === 0 ? (
                                        <p className="px-4 py-3 text-xs text-white/30">No brands found</p>
                                    ) : (
                                        brands.map(brand => (
                                            <button
                                                key={brand.id}
                                                onClick={() => {
                                                    setSelectedBrandId(brand.id);
                                                    setDropdownOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-white/[0.06] ${
                                                    brand.id === selectedBrandId
                                                        ? 'text-[#0D9488] font-bold bg-[#0D9488]/5'
                                                        : 'text-white/70'
                                                }`}
                                            >
                                                {brand.name}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                }
            />

            {/* Empty State — No Brand Selected */}
            {!selectedBrandId && !loading && (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-4">
                        <Target className="h-8 w-8 text-white/20" />
                    </div>
                    <p className="text-sm font-medium text-white/40">Select a brand to see benchmarks</p>
                    <p className="text-xs text-white/20 mt-1">Choose a brand from the dropdown above to compare against industry averages</p>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] animate-pulse">
                                <div className="h-4 w-32 bg-white/[0.06] rounded mb-4" />
                                <div className="flex gap-8">
                                    <div className="space-y-2 flex-1">
                                        <div className="h-3 w-20 bg-white/[0.04] rounded" />
                                        <div className="h-8 w-24 bg-white/[0.06] rounded" />
                                    </div>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-3 w-20 bg-white/[0.04] rounded" />
                                        <div className="h-8 w-24 bg-white/[0.06] rounded" />
                                    </div>
                                </div>
                                <div className="mt-4 h-3 bg-white/[0.04] rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 mb-4">
                        <AlertCircle className="h-8 w-8 text-red-400/60" />
                    </div>
                    <p className="text-sm font-medium text-white/50">Benchmark data unavailable</p>
                    <p className="text-xs text-white/25 mt-1">Ensure campaign data is synced and try again.</p>
                    <button
                        onClick={() => fetchBenchmarks(selectedBrandId)}
                        className="mt-4 px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-bold text-white/50 hover:text-white hover:bg-white/[0.08] transition-all"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Benchmark Results */}
            {report && !loading && (
                <>
                    {/* Overall Rating Badge */}
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)]">
                        <div className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                            RATING_COLORS[report.overallRating.toLowerCase()] || RATING_COLORS.average
                        }`}>
                            {report.overallRating}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">{report.brandName} — {report.period}</p>
                            <p className="text-[10px] text-white/30 mt-0.5">Source: {report.industryBenchmarkSource}</p>
                        </div>
                    </div>

                    {/* Metric Comparison Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {report.comparisons.map(comp => {
                            const config = METRIC_CONFIG[comp.metric] || { icon: BarChart3, format: (v: number) => v.toFixed(2), higherIsBetter: true };
                            const Icon = config.icon;
                            const isPositive = comp.vsIndustry > 0;
                            const absDiff = Math.abs(comp.vsIndustry).toFixed(1);

                            return (
                                <div
                                    key={comp.metric}
                                    className="p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl"
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="flex items-center gap-2.5">
                                            <div className="p-2 rounded-lg bg-white/[0.04]">
                                                <Icon className="h-4 w-4 text-[#0D9488]" />
                                            </div>
                                            <span className="text-sm font-bold text-white">{comp.label}</span>
                                        </div>
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold border capitalize ${RATING_COLORS[comp.rating]}`}>
                                            {comp.rating}
                                        </span>
                                    </div>

                                    {/* Values Side by Side */}
                                    <div className="flex gap-6 mb-4">
                                        <div className="flex-1">
                                            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Your Brand</p>
                                            <p className="text-xl font-bold text-white">{config.format(comp.brandValue)}</p>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Industry Avg</p>
                                            <p className="text-xl font-bold text-white/50">{config.format(comp.industryAvg)}</p>
                                        </div>
                                    </div>

                                    {/* Delta Indicator */}
                                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                        {isPositive ? (
                                            <TrendingUp className="h-4 w-4 text-green-400 shrink-0" />
                                        ) : (
                                            <TrendingDown className="h-4 w-4 text-red-400 shrink-0" />
                                        )}
                                        <span className={`text-xs font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                            {isPositive ? '+' : '-'}{absDiff}% vs industry
                                        </span>
                                        {comp.vsPrevious !== 0 && (
                                            <span className="text-[10px] text-white/25 ml-auto">
                                                {comp.vsPrevious > 0 ? '+' : ''}{comp.vsPrevious.toFixed(1)}% vs prev period
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Performance Comparison Bars */}
                    <div className="p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                        <h3 className="text-sm font-bold text-white mb-6">Performance Comparison</h3>
                        <div className="space-y-6">
                            {report.comparisons.map(comp => {
                                const config = METRIC_CONFIG[comp.metric] || { format: (v: number) => v.toFixed(2), higherIsBetter: true };
                                const maxVal = Math.max(comp.brandValue, comp.industryAvg, 0.01);
                                const brandPct = (comp.brandValue / maxVal) * 100;
                                const industryPct = (comp.industryAvg / maxVal) * 100;

                                return (
                                    <div key={comp.metric}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-medium text-white/60">{comp.label}</span>
                                        </div>
                                        <div className="space-y-1.5">
                                            {/* Brand Bar */}
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] text-white/30 w-16 shrink-0">Your brand</span>
                                                <div className="flex-1 h-5 bg-white/[0.03] rounded overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-[#0D9488] to-[#0D9488]/60 rounded transition-all duration-700"
                                                        style={{ width: `${Math.max(brandPct, 2)}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-bold text-white w-16 text-right">{config.format(comp.brandValue)}</span>
                                            </div>
                                            {/* Industry Bar */}
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] text-white/30 w-16 shrink-0">Industry</span>
                                                <div className="flex-1 h-5 bg-white/[0.03] rounded overflow-hidden">
                                                    <div
                                                        className="h-full bg-white/[0.15] rounded transition-all duration-700"
                                                        style={{ width: `${Math.max(industryPct, 2)}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-bold text-white/40 w-16 text-right">{config.format(comp.industryAvg)}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-6 mt-6 pt-4 border-t border-white/[0.04]">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-gradient-to-r from-[#0D9488] to-[#0D9488]/60" />
                                <span className="text-[10px] text-white/30">Your Brand</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-white/[0.15]" />
                                <span className="text-[10px] text-white/30">Industry Average</span>
                            </div>
                        </div>
                    </div>

                    {/* Recommendations */}
                    {(() => {
                        const recommendations = generateRecommendations(report.comparisons);
                        return recommendations.length > 0 ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <Lightbulb className="h-4 w-4 text-[#0D9488]" />
                                    <h3 className="text-sm font-bold text-white">Recommendations</h3>
                                </div>
                                {recommendations.map((rec, idx) => (
                                    <div
                                        key={idx}
                                        className="p-4 rounded-xl bg-white/[0.03] border-l-2 border-l-[#0D9488] border border-white/[0.04]"
                                    >
                                        <p className="text-xs font-bold text-white mb-1">{rec.title}</p>
                                        <p className="text-xs text-white/40 leading-relaxed">{rec.message}</p>
                                    </div>
                                ))}
                            </div>
                        ) : null;
                    })()}
                </>
            )}
        </div>
    );
}
