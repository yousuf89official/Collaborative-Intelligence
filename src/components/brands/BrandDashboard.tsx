'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Activity, Target, Share2, ArrowLeft, Globe, Loader2, RefreshCw, Pencil
} from 'lucide-react';
import { toast } from 'sonner';

import {
    Brand, Campaign, Metric, Creative, INITIAL_DATA
} from '@/lib/brand-constants';
import { EnrichedBrand } from '@/lib/brands-data';
import { Badge, Button } from './BrandPrimitives';
import { BrandAvatar } from './BrandAvatar';
import { ShareLinkDialog } from './ShareLinkDialog';
import { DashboardAnalyticsView } from './DashboardAnalyticsView';
import DataManagementView from './DataManagementView';
import { IntelligencePanel } from './IntelligencePanel';
import { EditBrandModal } from './EditBrandModal';
import { cn } from '@/lib/utils';

interface BrandDashboardProps {
    brand: EnrichedBrand;
    industries: any[];
}

/**
 * Map a Prisma campaign record to the legacy Campaign type used by UI components.
 */
function mapDbCampaign(c: any, brandId: string): Campaign {
    return {
        id: c.id,
        brand_id: brandId,
        name: c.name,
        types: [],
        configurations: [],
        status: c.status === 'Active' ? 'running' : c.status === 'Draft' ? 'draft' : 'finished',
        is_active: c.status === 'Active',
        funnel_type: 'TOP',
        start_date: c.startDate || '',
        end_date: c.endDate || '',
        cost_idr: c.budgetPlanned || 0,
        markup_percent: 0,
        channel_ids: (c.channels || []).map((ch: any) => ch.channelId || ch.channel?.id),
    };
}

/**
 * Map Prisma metric records to the legacy Metric type used by UI components.
 */
function mapDbMetric(m: any): Metric {
    return {
        campaign_id: m.campaignId || '',
        date: typeof m.date === 'string' ? m.date : new Date(m.date).toISOString().split('T')[0],
        impressions: m.impressions || 0,
        clicks: m.clicks || 0,
        spend: m.spend || 0,
        reach: m.reach || 0,
        engagements: m.engagement || 0,
    };
}

export default function BrandDashboard({ brand: initialBrand, industries }: BrandDashboardProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'new-campaign'>('dashboard');
    const [brand, setBrand] = useState<Brand>(initialBrand as unknown as Brand);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [creatives, setCreatives] = useState<Creative[]>([]);
    const [loading, setLoading] = useState(true);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Fetch real data from database
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [campRes, analyticsRes] = await Promise.allSettled([
                fetch(`/api/campaigns?brandId=${brand.id}`),
                fetch(`/api/analytics?brandId=${brand.id}`),
            ]);

            // Map campaigns from DB format to UI format
            if (campRes.status === 'fulfilled' && campRes.value.ok) {
                const dbCampaigns = await campRes.value.json();
                const mapped = dbCampaigns.map((c: any) => mapDbCampaign(c, brand.id));
                if (mapped.length > 0) {
                    setCampaigns(mapped);
                } else {
                    // Fallback to mock data only if no real campaigns exist
                    const mocks = INITIAL_DATA.campaigns.filter(c => c.brand_id === brand.id);
                    setCampaigns(mocks);
                }
            }

            // Map metrics from DB
            if (analyticsRes.status === 'fulfilled' && analyticsRes.value.ok) {
                const data = await analyticsRes.value.json();
                if (data.trend && data.trend.length > 0) {
                    const mapped = data.trend.map((m: any) => mapDbMetric(m));
                    setMetrics(mapped);
                } else {
                    // Fallback to mock metrics only if no real data
                    const campaignIds = campaigns.map(c => c.id);
                    const mocks = INITIAL_DATA.metrics.filter(m => campaignIds.includes(m.campaign_id));
                    setMetrics(mocks);
                }
            }

            // Creatives — will be from DB once creative API is built
            setCreatives(INITIAL_DATA.creatives);
        } catch (err) {
            console.error('Failed to fetch brand data:', err);
            // Fall back to mock data on error
            const mocks = INITIAL_DATA.campaigns.filter(c => c.brand_id === brand.id);
            setCampaigns(mocks);
            setMetrics(INITIAL_DATA.metrics.filter(m => mocks.some(c => c.id === m.campaign_id)));
            setCreatives(INITIAL_DATA.creatives);
        } finally {
            setLoading(false);
        }
    }, [brand.id]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Refresh handler — re-fetches from database
    const handleRefreshBrand = () => {
        fetchData();
        router.refresh();
    };

    // Campaign Handlers
    const handleUpdateCampaign = async (id: string, field: string, val: any) => {
        // Update local state immediately (optimistic)
        setCampaigns(prev => prev.map(c => c.id === id ? { ...c, [field]: val } : c));

        // Persist to database
        try {
            const updateData: any = {};
            if (field === 'name') updateData.name = val;
            if (field === 'status') updateData.status = val === 'running' ? 'Active' : val === 'draft' ? 'Draft' : 'Completed';
            if (field === 'is_active') updateData.status = val ? 'Active' : 'Paused';
            if (field === 'cost_idr') updateData.budgetPlanned = val;

            if (Object.keys(updateData).length > 0) {
                const res = await fetch(`/api/campaigns/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updateData),
                });
                if (!res.ok) {
                    toast.error('Failed to save changes');
                    fetchData(); // Revert on error
                }
            }
        } catch {
            toast.error('Failed to save changes');
        }
    };

    const handleAddCampaign = (newCampaign: Campaign) => {
        setCampaigns(prev => [newCampaign, ...prev]);
        toast.success("New campaign initialized");
        // Refresh to get the full campaign data from DB
        setTimeout(fetchData, 500);
    };

    const handleSaveCampaign = async () => {
        toast.success("Campaign configuration saved");
        await fetchData();
    };

    const handleDeleteCampaign = async (id: string, name: string) => {
        if (!confirm(`Delete campaign "${name}"?`)) return;

        try {
            const res = await fetch(`/api/campaigns/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setCampaigns(prev => prev.filter(c => c.id !== id));
                toast.success("Campaign deleted");
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to delete campaign');
            }
        } catch {
            toast.error('Failed to delete campaign');
        }
    };

    const handleAddCreative = (creative: Creative) => {
        setCreatives(prev => [...prev, creative]);
    };

    const handleAlert = (title: string, message: string, type: any) => {
        toast(title, { description: message });
    };

    // Derived State
    const activeCampaigns = campaigns.filter(c => c.is_active).length;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="flex flex-col gap-6">
                <Link href="/brands" className="flex items-center gap-2 text-xs font-bold text-white/40 hover:text-[#0D9488] transition-colors w-fit group">
                    <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
                    BACK TO PORTFOLIO
                </Link>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#0D9488]/20 to-purple-600/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                            <BrandAvatar
                                logo_url={brand.logo_url}
                                name={brand.name}
                                size="lg"
                                brand_color={brand.brandColor || undefined}
                                containerClassName="h-20 w-20 ring-4 ring-white shadow-xl relative z-10"
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-3xl font-black text-white tracking-tight">{brand.name}</h1>
                                <Badge variant={brand.status === 'Active' ? 'active' : 'inactive'}>{brand.status}</Badge>
                                <button onClick={() => setIsEditModalOpen(true)} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-[#0D9488] transition-colors" title="Edit brand">
                                    <Pencil className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-bold text-white/50">
                                <span className="flex items-center gap-1.5 bg-white/[0.06] px-2 py-1 rounded-md">
                                    <Globe className="h-3 w-3" />
                                    {brand.markets?.[0] || 'Global'}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-white/30" />
                                <span className="uppercase tracking-wider">{brand.categories?.[0] || 'General'}</span>
                                <span className="w-1 h-1 rounded-full bg-white/30" />
                                <span className="text-[#0D9488]">{activeCampaigns} Active Campaigns</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-white/[0.04] p-1 rounded-2xl shadow-sm border border-white/10 flex items-center">
                            <button onClick={() => setActiveTab('dashboard')} className={cn("px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all gap-2 flex items-center", activeTab === 'dashboard' ? "bg-[#0D9488] text-white shadow-md shadow-teal-500/25" : "text-white/50 hover:text-white hover:bg-white/[0.06]")}>
                                <Activity className="h-4 w-4" /> Overview
                            </button>
                            <button onClick={() => setActiveTab('new-campaign')} className={cn("px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all gap-2 flex items-center", activeTab === 'new-campaign' ? "bg-[#0D9488] text-white shadow-md shadow-teal-600/25" : "text-white/50 hover:text-white hover:bg-white/[0.06]")}>
                                <Target className="h-4 w-4" /> Operations
                            </button>
                        </div>
                        <div className="h-8 w-px bg-white/[0.08] mx-2" />
                        <button onClick={handleRefreshBrand} className="p-2.5 rounded-xl border border-white/10 text-white/40 hover:text-white hover:bg-white/[0.04] transition-all" title="Refresh data">
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <Button variant="primary" onClick={() => setIsShareDialogOpen(true)} className="h-12 px-6 shadow-lg shadow-teal-500/20 gap-2">
                            <Share2 className="h-4 w-4" /> SHARE
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="mt-8">
                {loading && campaigns.length === 0 ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin text-[#0D9488] mx-auto mb-3" />
                            <p className="text-xs text-white/40">Loading campaign data...</p>
                        </div>
                    </div>
                ) : activeTab === 'dashboard' ? (
                    <div className="space-y-8">
                        <DashboardAnalyticsView
                            brand={brand}
                            campaigns={campaigns}
                            metrics={metrics}
                            creatives={creatives}
                            onExecuteClick={() => setActiveTab('new-campaign')}
                        />
                        <div className="p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                            <IntelligencePanel brandId={brand.id} />
                        </div>
                    </div>
                ) : (
                    <DataManagementView
                        brand={brand}
                        campaigns={campaigns}
                        creatives={creatives}
                        onUpdateCampaign={handleUpdateCampaign}
                        onAddCampaign={handleAddCampaign}
                        onSaveCampaign={handleSaveCampaign}
                        onDeleteCampaign={handleDeleteCampaign}
                        onAddCreative={handleAddCreative}
                        showAlert={handleAlert}
                        onRefreshBrand={handleRefreshBrand}
                    />
                )}
            </div>

            <ShareLinkDialog
                isOpen={isShareDialogOpen}
                onClose={() => setIsShareDialogOpen(false)}
                brandId={brand.id}
                brandName={brand.name}
            />

            <EditBrandModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                brand={brand}
                industries={industries}
                onUpdated={() => { handleRefreshBrand(); }}
            />
        </div>
    );
}
