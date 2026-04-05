'use client';

import React, { useEffect, useState } from 'react';
import { Service, type Campaign, type Brand } from '@/services/api';
import { PerformanceWidgets } from '@/components/brands/PerformanceWidgets';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardContent } from '@/components/ui/card';
import {
  DollarSign, BarChart2, Users, Briefcase,
  Plus, ClipboardCheck, ShieldCheck, FileText,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

import { PageHeader } from '@/components/layout/PageHeader';
import { LayoutDashboard, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

// Status badge color mapping
function statusColor(status: string) {
  switch (status?.toLowerCase()) {
    case 'active': return 'bg-green-500/10 text-green-500';
    case 'paused': return 'bg-yellow-500/10 text-yellow-500';
    case 'draft': return 'bg-zinc-500/10 text-zinc-400';
    case 'completed': return 'bg-blue-500/10 text-blue-400';
    default: return 'bg-zinc-500/10 text-zinc-400';
  }
}

function approvalColor(status: string) {
  switch (status?.toLowerCase()) {
    case 'approved': return 'bg-green-500/10 text-green-500';
    case 'pending': case 'pending_review': return 'bg-yellow-500/10 text-yellow-500';
    case 'rejected': return 'bg-red-500/10 text-red-500';
    case 'draft': return 'bg-zinc-500/10 text-zinc-400';
    default: return 'bg-zinc-500/10 text-zinc-400';
  }
}

function formatBudget(val?: number) {
  if (!val) return '$0';
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
  return `$${val.toFixed(0)}`;
}

const quickActions = [
  {
    label: 'New Campaign',
    href: '/admin/brand-campaign-settings?action=create',
    icon: Plus,
    color: 'text-teal-400',
    bgColor: 'bg-teal-500/10',
  },
  {
    label: 'Approval Board',
    href: '/admin/approval-workflow',
    icon: ClipboardCheck,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    label: 'Campaign Rules',
    href: '/admin/campaign-rules',
    icon: ShieldCheck,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
  {
    label: 'Templates',
    href: '/admin/campaign-templates',
    icon: FileText,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
];

export default function DashboardPage() {
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    totalSpend: 0,
    impressions: 0,
    avgRoas: 0,
  });
  const [recentCampaigns, setRecentCampaigns] = useState<(Campaign & { brandName?: string; approvalStatus?: string })[]>([]);
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

  const fetchRecentCampaigns = async () => {
    try {
      const [campaigns, brands] = await Promise.all([
        Service.campaigns.getAll(),
        Service.brands.getAll(),
      ]);
      const brandMap = new Map<string, string>(
        brands.map((b: Brand) => [b.id, b.name])
      );
      const recent = campaigns.slice(0, 5).map((c: any) => ({
        ...c,
        brandName: brandMap.get(c.brandId) || 'Unknown',
      }));
      setRecentCampaigns(recent);
    } catch (error) {
      console.error('Failed to fetch recent campaigns:', error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRecentCampaigns();
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
            <Link
              href="/admin/brand-campaign-settings?action=create"
              className="flex items-center gap-2 px-6 py-2 bg-[#0D9488] text-white rounded-xl font-bold text-xs hover:bg-[#0F766E] transition-all shadow-lg shadow-teal-500/20"
            >
              <Plus className="h-4 w-4" /> NEW CAMPAIGN
            </Link>
          </div>
        }
      />

      {/* Top Stats Row — Clickable */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          label="Active Campaigns"
          value={stats.activeCampaigns}
          icon={Briefcase}
          trend={2}
          subValue="vs last month"
          href="/admin/brand-campaign-settings?status=Active"
        />
        <StatCard
          label="Total Spend"
          value={`$${(stats.totalSpend / 1000).toFixed(1)}k`}
          icon={DollarSign}
          trend={12}
          subValue="vs last month"
          href="/admin/brand-campaign-settings?sort=spend"
        />
        <StatCard
          label="Impressions"
          value={`${(stats.impressions / 1000000).toFixed(1)}M`}
          icon={Users}
          trend={5}
          subValue="vs last month"
          href="/admin/brand-campaign-settings?sort=impressions"
        />
        <StatCard
          label="Avg. ROAS"
          value={`${stats.avgRoas}x`}
          icon={BarChart2}
          trend={-0.2}
          subValue="vs last month"
          href="/admin/brand-campaign-settings?sort=roas"
        />
      </div>

      {/* Performance Widgets (Charts) */}
      <section>
        <h2 className="text-xl font-bold mb-4">Performance Overview</h2>
        <PerformanceWidgets />
      </section>

      {/* Recent Campaigns + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Campaigns Table */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Recent Campaigns</h2>
          <Card className="bg-[rgba(22,32,50,0.5)] backdrop-blur-xl border-white/[0.06]">
            <CardContent className="p-0">
              {recentCampaigns.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[300px] text-muted-foreground">
                  <p>No recent campaigns found.</p>
                  <Link href="/admin/brand-campaign-settings" className="mt-4 text-primary hover:underline">
                    Go to Campaigns
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Campaign</th>
                        <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Brand</th>
                        <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
                        <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Approval</th>
                        <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Budget</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentCampaigns.map((campaign) => (
                        <tr key={campaign.id} className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors">
                          <td className="px-4 py-3">
                            <Link
                              href={`/admin/brand-campaign-settings?campaign=${campaign.id}`}
                              className="text-sm font-medium text-white hover:text-primary transition-colors"
                            >
                              {campaign.name}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{campaign.brandName}</td>
                          <td className="px-4 py-3">
                            <span className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                              statusColor(campaign.status)
                            )}>
                              {campaign.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                              approvalColor(campaign.approvalStatus || 'draft')
                            )}>
                              {(campaign.approvalStatus || 'draft').replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right text-muted-foreground font-medium">
                            {formatBudget(campaign.budgetPlanned)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="px-4 py-3 border-t border-white/[0.06]">
                    <Link
                      href="/admin/brand-campaign-settings"
                      className="flex items-center gap-1 text-xs text-primary hover:underline w-fit"
                    >
                      View all campaigns <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <Card className="bg-[rgba(22,32,50,0.5)] backdrop-blur-xl border-white/[0.06]">
            <CardContent className="p-2">
              <div className="space-y-1">
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/[0.06] transition-colors group"
                  >
                    <div className={cn("p-2 rounded-lg", action.bgColor)}>
                      <action.icon size={18} className={action.color} />
                    </div>
                    <span className="text-sm font-medium flex-1">{action.label}</span>
                    <ChevronRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
