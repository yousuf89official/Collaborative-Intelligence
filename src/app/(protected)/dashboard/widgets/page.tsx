'use client';

import { DashboardWidgets } from '@/components/brands/DashboardWidgets';
import { Service } from '@/services/api'; // Assuming you need data
import { useEffect, useState } from 'react';

import { PageHeader } from '@/components/layout/PageHeader';
import { Grid, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function WidgetsPage() {
    const [stats, setStats] = useState({
        impressions: { value: 0, trend: 0 },
        reach: { value: 0, trend: 0 },
        spend: { value: 0, trend: 0 },
        engagementRate: { value: 0, trend: 0 }
    });
    const [loading, setLoading] = useState(false);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const data = await Service.getDashboardStats();
            setStats({
                impressions: { value: data.impressions, trend: 5 },
                reach: { value: data.impressions * 0.8, trend: 3 },
                spend: { value: data.totalSpend, trend: -2 },
                engagementRate: { value: 2.4, trend: 0 }
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                icon={Grid}
                category="Interface Elements"
                title="Widgets & Cards"
                description="Customizable data visualization modules and interactive card components."
                actions={
                    <button
                        onClick={fetchStats}
                        className="flex items-center gap-2 px-4 py-2 bg-[rgba(22,32,50,0.6)] border border-white/[0.06] text-white/50 rounded-xl font-bold text-xs hover:bg-white/[0.03] transition-all shadow-sm"
                    >
                        <RefreshCcw className={cn("h-4 w-4", loading && "animate-spin")} /> REFRESH
                    </button>
                }
            />

            <div className="bg-[rgba(22,32,50,0.6)] p-8 rounded-2xl border border-white/[0.06] shadow-sm">
                <DashboardWidgets data={stats} />
            </div>
        </div>
    );
}
