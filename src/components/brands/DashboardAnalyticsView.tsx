'use client';

import React, { useMemo } from 'react';
import {
    Activity,
    TrendingUp,
    DollarSign,
    Globe
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Helper for currency formatting
const formatCurrency = (amount: number, currency = 'IDR') => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount).replace('IDR', 'Rp');
};

import { Brand, Campaign, Metric, Creative } from '@/lib/brand-constants';

const FinancialCard = ({ label, value, trend, icon: Icon, color }: { label: string, value: string, trend: number, icon: any, color: string }) => (
    <Card className="p-4 border-none shadow-sm group hover:scale-[1.02] transition-transform duration-300">
        <div className="flex items-start justify-between">
            <div className="space-y-1">
                <Label className="text-[10px] font-bold tracking-widest text-white/40">{label}</Label>
                <div className="text-xl font-black text-white tracking-tight">{value}</div>
            </div>
            <div
                className="p-2.5 rounded-xl group-hover:scale-110 transition-transform"
                style={{
                    backgroundColor: color.startsWith('var') ? 'var(--brand-primary-light)' : `${color}20`,
                    color: color
                }}
            >
                <Icon className="h-4 w-4" />
            </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 pt-3 border-t border-white/[0.04]">
            <span className="text-[10px] font-black text-emerald-400 flex items-center gap-0.5"><TrendingUp className="h-2.5 w-2.5" /> +{trend}%</span>
            <span className="text-[10px] font-bold text-white/30">vs last month</span>
        </div>
    </Card>
);

export const DashboardAnalyticsView = ({
    brand,
    campaigns,
    metrics,
    creatives,
    onExecuteClick,
    isPublic = false
}: {
    brand: Brand,
    campaigns: Campaign[],
    metrics: Metric[],
    creatives: Creative[],
    onExecuteClick?: () => void,
    isPublic?: boolean
}) => {
    const brandCampaigns = campaigns.filter((c: Campaign) => c.brand_id === brand.id);
    const brandMetrics = metrics.filter((m: Metric) => brandCampaigns.some((c: Campaign) => c.id === m.campaign_id));

    const stats = useMemo(() => {
        const totalSpend = brandMetrics.reduce((sum: number, m: Metric) => sum + m.spend, 0);
        const totalImpressions = brandMetrics.reduce((sum: number, m: Metric) => sum + m.impressions, 0);
        const totalClicks = brandMetrics.reduce((sum: number, m: Metric) => sum + m.clicks, 0);
        const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

        return { totalSpend, totalImpressions, totalClicks, avgCtr };
    }, [brandMetrics]);

    // Aggregate by date
    const chartData = useMemo(() => {
        const dailyMap: Record<string, { date: string, impressions: number, clicks: number, spend: number }> = {};
        brandMetrics.forEach((m: Metric) => {
            const date = m.date;
            if (!dailyMap[date]) dailyMap[date] = { date, impressions: 0, clicks: 0, spend: 0 };
            dailyMap[date].impressions += m.impressions;
            dailyMap[date].clicks += m.clicks;
            dailyMap[date].spend += m.spend;
        });
        return Object.values(dailyMap).sort((a: any, b: any) => a.date.localeCompare(b.date)).slice(-30);
    }, [brandMetrics]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
            {/* Global Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FinancialCard
                    label="Total Inventory Spend"
                    value={`$${stats.totalSpend.toLocaleString()}`}
                    trend={8.2}
                    icon={DollarSign}
                    color="var(--brand-primary)"
                />
                <FinancialCard
                    label="Global Reach"
                    value={(stats.totalImpressions / 1e6).toFixed(1) + 'M'}
                    trend={14.5}
                    icon={Globe}
                    color="var(--brand-primary)"
                />
                <FinancialCard
                    label="Consumer Engagement"
                    value={(stats.totalClicks / 1e3).toFixed(1) + 'K'}
                    trend={2.4}
                    icon={Activity}
                    color="var(--brand-primary)"
                />
                <FinancialCard
                    label="Conversion Yield"
                    value={stats.avgCtr.toFixed(2) + '%'}
                    trend={-1.2}
                    icon={TrendingUp}
                    color="var(--brand-primary)"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 p-6 border-none shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-1.5 bg-[#0D9488] rounded-full shadow-[0_0_12px_var(--brand-primary)] animate-pulse" />
                                <h2 className="text-[11px] font-black text-white uppercase tracking-widest">Market Performance</h2>
                            </div>
                            <p className="text-xs text-white/40 font-medium">Daily impressions & spend correlation</p>
                        </div>
                        <div className="flex bg-white/[0.06] p-1 rounded-lg">
                            <button className="px-3 py-1.5 text-[10px] font-black rounded-md bg-white/[0.04] shadow-sm text-[#0D9488] uppercase tracking-wider">7 Days</button>
                            <button className="px-3 py-1.5 text-[10px] font-black rounded-md text-white/40 hover:text-white/60 uppercase tracking-wider">30 Days</button>
                        </div>
                    </div>
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorImp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        fontSize: '11px',
                                        fontWeight: 700
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="impressions"
                                    stroke="#6366f1"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorImp)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-6 border-none shadow-sm flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-lg font-black text-white uppercase tracking-tight">Top Campaigns</h3>
                        <p className="text-xs text-white/40 font-medium">Efficiency by funnel stage</p>
                    </div>
                    <div className="flex-1 space-y-4">
                        {brandCampaigns.map((c, i) => {
                            const cMetrics = metrics.filter(m => m.campaign_id === c.id);
                            const totalSpend = cMetrics.reduce((sum, m) => sum + m.spend, 0);
                            const maxSpend = Math.max(...brandCampaigns.map(bc => metrics.filter(m => m.campaign_id === bc.id).reduce((sum, m) => sum + m.spend, 0)), 1);
                            const percentage = (totalSpend / maxSpend) * 100;

                            return (
                                <div key={c.id} className="space-y-2 group">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-0.5">
                                            <span className="text-[9px] font-black text-[#0D9488] uppercase tracking-wider">{c.funnel_type}</span>
                                            <h4 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-[#0D9488] transition-colors">{c.name}</h4>
                                        </div>
                                        <div className="text-xs font-black text-white">{formatCurrency(totalSpend)}</div>
                                    </div>
                                    <div className="h-2 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/[0.06] p-[1px]">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#0D9488] to-violet-500 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {!isPublic && onExecuteClick && (
                        <Button
                            variant="secondary"
                            className="mt-6 w-full h-11 text-xs font-bold tracking-wider"
                            onClick={onExecuteClick}
                        >
                            VIEW DETAILED AUDIT
                        </Button>
                    )}
                </Card>
            </div>
        </div>
    );
};
