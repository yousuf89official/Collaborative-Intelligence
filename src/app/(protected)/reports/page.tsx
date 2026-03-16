'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import {
    FileBarChart,
    Download,
    Calendar,
    TrendingUp,
    Users,
    MousePointer2,
    BarChart3,
    Loader2
} from 'lucide-react';
import { ReportCard } from '@/components/reports/ReportCard';
import { AnalyticsChart } from '@/components/reports/AnalyticsChart';
import { toast } from 'sonner';

export default function ReportsPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{ trend: any[], demographics: any[] } | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const resp = await fetch('/api/analytics');
                if (!resp.ok) throw new Error(`Analytics API error: ${resp.status}`);
                const result = await resp.json();
                setData(result);
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
                toast.error('Failed to load report data');
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const handleExport = () => {
        if (!data || data.trend.length === 0) return;

        const headers = ['Date', 'Impressions', 'Clicks', 'Engagement', 'Spend'];
        const csvRows = [
            headers.join(','),
            ...data.trend.map(row => [
                row.date,
                row.impressions,
                row.clicks,
                row.value, // engagement
                row.spend
            ].join(','))
        ];

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ci_report_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        toast.success('Report exported successfully');
    };

    if (loading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-[#0D9488]" />
                <p className="text-sm font-black text-white/40 uppercase tracking-widest animate-pulse">Generating Report Intelligence...</p>
            </div>
        );
    }

    const totalImpressions = data?.trend.reduce((acc, curr) => acc + curr.impressions, 0) || 0;
    const totalClicks = data?.trend.reduce((acc, curr) => acc + curr.clicks, 0) || 0;
    const avgEngagement = data?.trend.length ? Math.round(data.trend.reduce((acc, curr) => acc + curr.value, 0) / data.trend.length) : 0;
    const totalSpend = data?.trend.reduce((acc, curr) => acc + curr.spend, 0) || 0;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                icon={FileBarChart}
                category="System Intelligence"
                title="Performance Reports"
                description="Consolidated analytics across all brands, campaigns, and platforms."
                actions={
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white/60 rounded-xl font-bold text-xs hover:bg-white/10 transition-all">
                            <Calendar className="h-4 w-4" /> FILTERS
                        </button>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-6 py-2 bg-[#0D9488] text-white rounded-xl font-bold text-xs hover:bg-[#0F766E] transition-all shadow-lg shadow-teal-500/20"
                        >
                            <Download className="h-4 w-4" /> EXPORT REPORT
                        </button>
                    </div>
                }
            />

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <ReportCard
                    title="Total Impressions"
                    value={totalImpressions}
                    change={12.5}
                    icon={TrendingUp}
                    description="Total visibility across all active campaigns."
                    color="indigo"
                />
                <ReportCard
                    title="Total Clicks"
                    value={totalClicks}
                    change={5.2}
                    icon={MousePointer2}
                    description="Total user interactions and site visits."
                    color="emerald"
                />
                <ReportCard
                    title="Avg. Engagement"
                    value={avgEngagement}
                    change={-2.4}
                    icon={Users}
                    description="Average audience engagement rate per post."
                    color="amber"
                />
                <ReportCard
                    title="Media Spend"
                    value={`$${totalSpend.toLocaleString()}`}
                    change={8.1}
                    icon={BarChart3}
                    description="Consolidated media investment period."
                    color="rose"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Trend Analysis */}
                <div className="lg:col-span-2 p-8 bg-[rgba(22,32,50,0.5)] backdrop-blur-xl border border-white/[0.06] rounded-2xl space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-white uppercase tracking-tight">Engagement Trend</h3>
                            <p className="text-sm font-medium text-white/50">Daily performance metrics for the current period</p>
                        </div>
                        <div className="flex p-1 bg-white/5 rounded-lg">
                            <button className="px-3 py-1 text-[10px] font-black bg-[#0D9488] text-white rounded shadow-sm">AREA</button>
                            <button className="px-3 py-1 text-[10px] font-black text-white/40 hover:text-white/60 transition-colors">BAR</button>
                        </div>
                    </div>
                    <div className="h-[250px] lg:h-[350px]">
                        {data && <AnalyticsChart data={data.trend} type="area" dataKey="value" />}
                    </div>
                </div>

                {/* Audience Demographics */}
                <div className="p-8 bg-[rgba(22,32,50,0.5)] backdrop-blur-xl border border-white/[0.06] rounded-2xl space-y-8">
                    <div className="space-y-1">
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">Audience Split</h3>
                        <p className="text-sm font-medium text-white/50">Breakdown by age group (Mock Data)</p>
                    </div>
                    <div className="h-[250px] lg:h-[350px]">
                        {data && <AnalyticsChart data={data.demographics} type="bar" dataKey="value" color="#10b981" />}
                    </div>
                </div>
            </div>
        </div>
    );
}
