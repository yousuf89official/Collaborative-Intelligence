'use client';

import React, { useEffect, useState } from 'react';
import { Service } from '@/services/api';
import { PerformanceWidgets } from '@/components/brands/PerformanceWidgets';
import { DashboardWidgets } from '@/components/brands/DashboardWidgets';
import { StatCard } from '@/components/dashboard/StatCard';
import { DollarSign, BarChart2, Users, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

import { PageHeader } from '@/components/layout/PageHeader';
import { LayoutDashboard, Plus, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    totalSpend: 0,
    impressions: 0,
    avgRoas: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await Service.getDashboardStats();
      setStats(data);
      toast.success('Dashboard metrics synchronized');
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      toast.error('Failed to sync dashboard metrics');
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
        icon={LayoutDashboard}
        category="Agency Intelligence"
        title="Performance Dashboard"
        description="Unified real-time analytics across all active brands and marketing channels."
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={fetchStats}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white/60 rounded-xl font-bold text-xs hover:bg-white/10 transition-all"
            >
              <RefreshCcw className={cn("h-4 w-4", loading && "animate-spin")} /> REFRESH
            </button>
            <button className="flex items-center gap-2 px-6 py-2 bg-[#0D9488] text-white rounded-xl font-bold text-xs hover:bg-[#0F766E] transition-all shadow-lg shadow-teal-500/20">
              <Plus className="h-4 w-4" /> NEW CAMPAIGN
            </button>
          </div>
        }
      />

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          label="Active Campaigns"
          value={stats.activeCampaigns}
          icon={Briefcase}
          trend={2}
          subValue="vs last month"
        />
        <StatCard
          label="Total Spend"
          value={`$${(stats.totalSpend / 1000).toFixed(1)}k`}
          icon={DollarSign}
          trend={12}
          subValue="vs last month"
        />
        <StatCard
          label="Impressions"
          value={`${(stats.impressions / 1000000).toFixed(1)}M`}
          icon={Users}
          trend={5}
          subValue="vs last month"
        />
        <StatCard
          label="Avg. ROAS"
          value={`${stats.avgRoas}x`}
          icon={BarChart2}
          trend={-0.2}
          subValue="vs last month"
        />
      </div>

      {/* Performance Widgets (Charts) */}
      <section>
        <h2 className="text-xl font-bold mb-4">Performance Overview</h2>
        <PerformanceWidgets />
      </section>

      {/* Recent Activity / Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Recent Campaigns</h2>
          <div className="bg-[rgba(22,32,50,0.5)] backdrop-blur-xl border border-white/[0.06] rounded-xl p-4 lg:p-6 flex flex-col items-center justify-center min-h-[300px] text-muted-foreground">
            <p>No recent campaigns found.</p>
            <Link href="/brands" className="mt-4 text-primary hover:underline">
              Go to Brands
            </Link>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <DashboardWidgets data={{
            impressions: { value: stats.impressions, trend: 5 },
            reach: { value: stats.impressions * 0.8, trend: 3 },
            spend: { value: stats.totalSpend, trend: -2 },
            engagementRate: { value: 2.4, trend: 0 }
          }} />
        </div>
      </div>
    </div>
  );
}
