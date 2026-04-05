'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import {
    FileBarChart, Download, Calendar, TrendingUp, Users, MousePointer2,
    BarChart3, Loader2, Brain, AlertTriangle, Target, RefreshCw,
    ChevronDown, FileText, Mail, Clock
} from 'lucide-react';
import { ReportCard } from '@/components/reports/ReportCard';
import { AnalyticsChart } from '@/components/reports/AnalyticsChart';
import { toast } from 'sonner';

export default function ReportsPage() {
    const [loading, setLoading] = useState(true);
    const [brands, setBrands] = useState<any[]>([]);
    const [selectedBrand, setSelectedBrand] = useState<string>('');
    const [period, setPeriod] = useState(30);
    const [data, setData] = useState<any>(null);
    const [report, setReport] = useState<any>(null);
    const [reportLoading, setReportLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'intelligence' | 'campaigns' | 'export'>('overview');

    // Fetch brands on mount
    useEffect(() => {
        fetch('/api/brands')
            .then(r => r.ok ? r.json() : [])
            .then(d => {
                setBrands(d);
                if (d.length > 0 && !selectedBrand) setSelectedBrand(d[0].id);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    // Fetch analytics + intelligence when brand/period changes
    const fetchReport = useCallback(async () => {
        if (!selectedBrand) return;
        setReportLoading(true);
        try {
            const [analyticsRes, reportRes] = await Promise.allSettled([
                fetch(`/api/analytics?brandId=${selectedBrand}`),
                fetch(`/api/intelligence/report?brandId=${selectedBrand}&days=${period}`),
            ]);

            if (analyticsRes.status === 'fulfilled' && analyticsRes.value.ok) {
                setData(await analyticsRes.value.json());
            }
            if (reportRes.status === 'fulfilled' && reportRes.value.ok) {
                setReport(await reportRes.value.json());
            }
        } catch {
            toast.error('Failed to load report data');
        } finally {
            setReportLoading(false);
        }
    }, [selectedBrand, period]);

    useEffect(() => { if (selectedBrand) fetchReport(); }, [fetchReport, selectedBrand]);

    // CSV Export
    const handleExportCSV = () => {
        if (!data?.trend?.length) { toast.error('No data to export'); return; }
        const headers = ['Date', 'Impressions', 'Clicks', 'Reach', 'Engagement', 'Spend'];
        const rows = [
            headers.join(','),
            ...data.trend.map((r: any) => [r.date, r.impressions, r.clicks, r.reach, r.engagement, r.spend].join(','))
        ];
        const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ci_report_${selectedBrandName}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        toast.success('CSV exported');
    };

    // JSON Report Export
    const handleExportJSON = () => {
        if (!report) { toast.error('No report data'); return; }
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ci_intelligence_report_${selectedBrandName}_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        toast.success('Intelligence report exported');
    };

    const selectedBrandName = brands.find((b: any) => b.id === selectedBrand)?.name || 'All';
    const summary = report?.summary;
    const campaigns = report?.campaigns || [];
    const anomalies = report?.anomalies;
    const benchmarks = report?.benchmarks;
    const totalImpressions = data?.summary?.totalImpressions || data?.trend?.reduce((a: number, c: any) => a + (c.impressions || 0), 0) || 0;
    const totalClicks = data?.summary?.totalClicks || data?.trend?.reduce((a: number, c: any) => a + (c.clicks || 0), 0) || 0;
    const totalSpend = data?.summary?.totalSpend || data?.trend?.reduce((a: number, c: any) => a + (c.spend || 0), 0) || 0;
    const totalEngagement = data?.summary?.totalEngagement || 0;
    const ctr = data?.summary?.ctr || (totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00');

    if (loading) {
        return <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-[#0D9488]" />
            <p className="text-sm font-black text-white/40 uppercase tracking-widest animate-pulse">Loading Report Hub...</p>
        </div>;
    }

    return (
        <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                icon={FileBarChart}
                category="System Intelligence"
                title="Performance Reports"
                description="AI-powered reporting across all brands, campaigns, and platforms."
                actions={
                    <div className="flex gap-3">
                        <button onClick={fetchReport} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white/60 rounded-xl font-bold text-xs hover:bg-white/10 transition-all">
                            <RefreshCw className={`h-4 w-4 ${reportLoading ? 'animate-spin' : ''}`} /> REFRESH
                        </button>
                        <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white/60 rounded-xl font-bold text-xs hover:bg-white/10 transition-all">
                            <Download className="h-4 w-4" /> CSV
                        </button>
                        <button onClick={handleExportJSON} className="flex items-center gap-2 px-6 py-2 bg-[#0D9488] text-white rounded-xl font-bold text-xs hover:bg-[#0F766E] transition-all shadow-lg shadow-teal-500/20">
                            <FileText className="h-4 w-4" /> FULL REPORT
                        </button>
                    </div>
                }
            />

            {/* Brand & Period Selector */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                    <select
                        value={selectedBrand}
                        onChange={e => setSelectedBrand(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#0D9488]/40 focus:ring-2 focus:ring-[#0D9488]/20"
                    >
                        <option value="" className="bg-[#0a0f1a] text-white">Select Brand</option>
                        {brands.map((b: any) => <option key={b.id} value={b.id} className="bg-[#0a0f1a] text-white">{b.name}</option>)}
                    </select>
                </div>
                <div className="flex gap-1">
                    {[7, 14, 30, 90].map(d => (
                        <button key={d} onClick={() => setPeriod(d)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${period === d ? 'bg-[#0D9488] text-white shadow-lg shadow-teal-500/20' : 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:text-white/60'}`}>
                            {d}d
                        </button>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 overflow-x-auto border-b border-white/[0.06]">
                {[
                    { id: 'overview', label: 'Overview', icon: BarChart3 },
                    { id: 'intelligence', label: 'AI Intelligence', icon: Brain },
                    { id: 'campaigns', label: 'Campaign Scores', icon: Target },
                    { id: 'export', label: 'Schedule & Export', icon: Mail },
                ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-[#0D9488] text-[#0D9488]' : 'border-transparent text-white/40 hover:text-white/60'}`}>
                        <tab.icon className="h-3.5 w-3.5" /> {tab.label}
                    </button>
                ))}
            </div>

            {reportLoading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-[#0D9488]" />
                </div>
            )}

            {!reportLoading && activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Metric Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <ReportCard title="Total Impressions" value={totalImpressions} change={0} icon={TrendingUp} description="Across all campaigns" color="indigo" />
                        <ReportCard title="Total Clicks" value={totalClicks} change={0} icon={MousePointer2} description={`CTR: ${ctr}%`} color="emerald" />
                        <ReportCard title="Engagement" value={totalEngagement} change={0} icon={Users} description="Likes, shares, comments" color="amber" />
                        <ReportCard title="Media Spend" value={`$${totalSpend.toLocaleString()}`} change={0} icon={BarChart3} description="Total investment" color="rose" />
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 p-6 bg-[rgba(22,32,50,0.5)] backdrop-blur-xl border border-white/[0.06] rounded-2xl">
                            <h3 className="text-sm font-bold text-white mb-4">Performance Trend</h3>
                            <div className="h-[300px]">
                                {data?.trend && <AnalyticsChart data={data.trend} type="area" dataKey="impressions" />}
                            </div>
                        </div>
                        <div className="p-6 bg-[rgba(22,32,50,0.5)] backdrop-blur-xl border border-white/[0.06] rounded-2xl">
                            <h3 className="text-sm font-bold text-white mb-4">Spend Distribution</h3>
                            <div className="h-[300px]">
                                {data?.trend && <AnalyticsChart data={data.trend.slice(-14)} type="bar" dataKey="spend" color="#0D9488" />}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!reportLoading && activeTab === 'intelligence' && (
                <div className="space-y-6">
                    {/* AI Summary */}
                    {summary ? (
                        <>
                            <div className="p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                                <div className="flex items-center gap-2 mb-3">
                                    <Brain className="h-5 w-5 text-[#0D9488]" />
                                    <h3 className="font-bold text-white text-sm">AI Executive Summary</h3>
                                </div>
                                <p className="text-lg font-bold text-white mb-2">{summary.headline}</p>
                                <p className="text-sm text-white/50 leading-relaxed">{summary.executiveSummary}</p>
                            </div>

                            {/* Recommendations */}
                            {summary.recommendations?.length > 0 && (
                                <div className="p-6 rounded-2xl border border-[#0D9488]/10 bg-[#0D9488]/5">
                                    <h3 className="text-sm font-bold text-[#0D9488] mb-3">AI Recommendations</h3>
                                    <ul className="space-y-2">
                                        {summary.recommendations.map((r: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                                                <span className="text-[#0D9488] font-bold mt-0.5">{i + 1}.</span> {r}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Anomalies */}
                            {anomalies && anomalies.total > 0 && (
                                <div className="p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                                    <div className="flex items-center gap-2 mb-3">
                                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                                        <h3 className="text-sm font-bold text-white">{anomalies.total} Anomalies Detected</h3>
                                        {anomalies.critical > 0 && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">{anomalies.critical} critical</span>}
                                    </div>
                                    <div className="space-y-2">
                                        {anomalies.items.map((a: any, i: number) => (
                                            <div key={i} className={`flex items-start gap-2 px-3 py-2 rounded-lg ${a.severity === 'critical' ? 'bg-red-500/5 border border-red-500/10' : a.severity === 'warning' ? 'bg-amber-500/5 border border-amber-500/10' : 'bg-white/[0.02] border border-white/5'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${a.severity === 'critical' ? 'bg-red-500' : a.severity === 'warning' ? 'bg-amber-500' : 'bg-white/30'}`} />
                                                <div>
                                                    <p className="text-xs text-white/60">{a.message}</p>
                                                    <p className="text-[10px] text-white/30 mt-0.5">{a.campaign} · {a.metric} · {a.deviation > 0 ? '+' : ''}{a.deviation?.toFixed(0)}%</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Benchmarks */}
                            {benchmarks && (
                                <div className="p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-bold text-white">Competitive Benchmarks</h3>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${benchmarks.overallRating === 'Excellent' ? 'bg-green-500/10 text-green-400' : benchmarks.overallRating === 'Good' ? 'bg-[#0D9488]/10 text-[#0D9488]' : 'bg-amber-500/10 text-amber-400'}`}>
                                            {benchmarks.overallRating}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                        {benchmarks.comparisons.map((c: any) => (
                                            <div key={c.metric} className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                                <p className="text-[10px] text-white/40 mb-1">{c.metric}</p>
                                                <p className="text-lg font-bold text-white">{typeof c.you === 'number' ? c.you.toFixed(2) : c.you}</p>
                                                <p className="text-[10px] text-white/30 mt-1">Industry: {typeof c.industry === 'number' ? c.industry.toFixed(2) : c.industry}</p>
                                                <p className={`text-[10px] font-bold mt-0.5 ${c.vsIndustry > 0 ? 'text-green-400' : c.vsIndustry < -10 ? 'text-red-400' : 'text-white/40'}`}>
                                                    {c.vsIndustry > 0 ? '+' : ''}{c.vsIndustry?.toFixed(1)}% vs industry
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <Brain className="h-12 w-12 text-white/10 mx-auto mb-3" />
                            <p className="text-sm text-white/40">No intelligence data available</p>
                            <p className="text-xs text-white/20 mt-1">Select a brand and ensure metric data exists</p>
                        </div>
                    )}
                </div>
            )}

            {!reportLoading && activeTab === 'campaigns' && (
                <div className="space-y-3">
                    {campaigns.length === 0 ? (
                        <div className="text-center py-16">
                            <Target className="h-12 w-12 text-white/10 mx-auto mb-3" />
                            <p className="text-sm text-white/40">No campaign scores available</p>
                        </div>
                    ) : campaigns.map((c: any) => (
                        <div key={c.id} className="flex items-center gap-4 p-4 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.4)] hover:bg-[rgba(22,32,50,0.55)] transition-all">
                            {/* Score Ring */}
                            <div className="shrink-0">
                                <svg width={56} height={56}>
                                    <circle cx={28} cy={28} r={24} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={3} />
                                    <circle cx={28} cy={28} r={24} fill="none"
                                        stroke={c.overallScore >= 70 ? '#22c55e' : c.overallScore >= 40 ? '#f59e0b' : '#ef4444'}
                                        strokeWidth={3}
                                        strokeDasharray={2 * Math.PI * 24}
                                        strokeDashoffset={2 * Math.PI * 24 * (1 - c.overallScore / 100)}
                                        strokeLinecap="round"
                                        transform="rotate(-90 28 28)"
                                    />
                                    <text x="50%" y="50%" textAnchor="middle" dy="0.35em" fill="white" fontSize={14} fontWeight="bold">{c.overallScore}</text>
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm font-bold text-white truncate">{c.name}</p>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${c.trend === 'improving' ? 'bg-green-500/10 text-green-400' : c.trend === 'declining' ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-white/30'}`}>{c.trend}</span>
                                </div>
                                <p className="text-[10px] text-white/40 truncate">{c.insights?.[0]}</p>
                                <div className="flex gap-4 mt-2">
                                    {[{ l: 'Efficiency', v: c.scores?.efficiency }, { l: 'Growth', v: c.scores?.growth }, { l: 'Engagement', v: c.scores?.engagement }, { l: 'Spend', v: c.scores?.spend }].map(s => (
                                        <div key={s.l} className="text-[9px]">
                                            <span className="text-white/20">{s.l}</span>
                                            <span className={`ml-1 font-bold ${(s.v || 0) >= 60 ? 'text-green-400' : (s.v || 0) >= 35 ? 'text-amber-400' : 'text-red-400'}`}>{s.v || 0}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="text-right shrink-0 hidden sm:block">
                                <p className="text-xs text-white/60">{(c.metrics?.totalImpressions || 0).toLocaleString()} imp</p>
                                <p className="text-xs text-white/40">${(c.metrics?.totalSpend || 0).toLocaleString()} spend</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!reportLoading && activeTab === 'export' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Manual Export */}
                    <div className="p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                        <h3 className="font-bold text-white mb-4">Export Options</h3>
                        <div className="space-y-3">
                            <button onClick={handleExportCSV} className="w-full flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all text-left">
                                <Download className="h-5 w-5 text-[#0D9488] shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-white">Export as CSV</p>
                                    <p className="text-[10px] text-white/40">Raw metric data for spreadsheet analysis</p>
                                </div>
                            </button>
                            <button onClick={handleExportJSON} className="w-full flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all text-left">
                                <FileText className="h-5 w-5 text-[#0D9488] shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-white">Export Intelligence Report (JSON)</p>
                                    <p className="text-[10px] text-white/40">Full AI analysis with scores, anomalies, benchmarks</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Scheduled Reports Info */}
                    <div className="p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                        <h3 className="font-bold text-white mb-4">Automated Reports</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#0D9488]/5 border border-[#0D9488]/10">
                                <Clock className="h-5 w-5 text-[#0D9488] shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-white">Scheduled Email Reports</p>
                                    <p className="text-[10px] text-white/40">Set up daily, weekly, or monthly automated reports delivered to your team and clients via email.</p>
                                </div>
                            </div>
                            <a href="/admin/billing" className="block w-full text-center py-2.5 rounded-xl bg-[#0D9488] text-white text-xs font-bold hover:bg-[#0F766E] transition-all shadow-lg shadow-teal-500/20">
                                Manage Scheduled Reports →
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
