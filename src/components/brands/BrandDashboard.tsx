
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Activity,
    Target,
    Share2,
    ArrowLeft,
    Check,
    Copy,
    Link as LinkIcon,
    Globe
} from 'lucide-react';
import { toast } from 'sonner';

import { PageHeader } from '@/components/layout/PageHeader';
import {
    Brand,
    Campaign,
    Metric,
    Creative,
    INITIAL_DATA
} from '@/lib/brand-constants';
import { EnrichedBrand } from '@/lib/brands-data';
import { Badge, Button } from './BrandPrimitives';
import { BrandAvatar } from './BrandAvatar';
import { ShareLinkDialog } from './ShareLinkDialog';
import { DashboardAnalyticsView } from './DashboardAnalyticsView';
import DataManagementView from './DataManagementView';
import { cn } from '@/lib/utils';

interface BrandDashboardProps {
    brand: EnrichedBrand;
    industries: any[];
}

export default function BrandDashboard({ brand: initialBrand, industries }: BrandDashboardProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'new-campaign'>('dashboard');
    const [brand, setBrand] = useState<Brand>(initialBrand as unknown as Brand); // Type cast for compatibility

    // State initialization from Mock Data to preserve existing behavior
    // In a real app, this would come from the server prop 'brand.campaigns'
    const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
        const mocks = INITIAL_DATA.campaigns.filter(c => c.brand_id === brand.id);
        return mocks.length > 0 ? mocks : [];
    });

    const [metrics, setMetrics] = useState<Metric[]>(() => {
        return INITIAL_DATA.metrics.filter(m =>
            campaigns.some(c => c.id === m.campaign_id)
        );
    });

    const [creatives, setCreatives] = useState<Creative[]>(INITIAL_DATA.creatives);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

    // Refresh handler (simulated)
    const handleRefreshBrand = () => {
        router.refresh();
        // In a real generic implementation, we might re-fetch data here
    };

    // Campaign Handlers
    const handleUpdateCampaign = (id: string, field: keyof Campaign, val: any) => {
        setCampaigns(prev => prev.map(c => c.id === id ? { ...c, [field]: val } : c));
    };

    const handleAddCampaign = (newCampaign: Campaign) => {
        setCampaigns(prev => [newCampaign, ...prev]);
        toast.success("New campaign initialized");
    };

    const handleSaveCampaign = () => {
        toast.success("Campaign configuration saved");
    };

    const handleDeleteCampaign = (id: string, name: string) => {
        if (confirm(`Delete campaign "${name}"?`)) {
            setCampaigns(prev => prev.filter(c => c.id !== id));
            toast.success("Campaign deleted");
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
            {/* Header Area with Breadcrumb and Actions */}
            <div className="flex flex-col gap-6">
                <Link
                    href="/brands"
                    className="flex items-center gap-2 text-xs font-bold text-white/40 hover:text-[#0D9488] transition-colors w-fit group"
                >
                    <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
                    BACK TO PORTFOLIO
                </Link>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="absolute -inset-1bg-gradient-to-r from-brand-primary/20 to-purple-600/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
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
                                <Badge variant={brand.status === 'Active' ? 'active' : 'inactive'}>
                                    {brand.status}
                                </Badge>
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
                            <button
                                onClick={() => setActiveTab('dashboard')}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all gap-2 flex items-center",
                                    activeTab === 'dashboard'
                                        ? "bg-[#0D9488] text-white shadow-md shadow-teal-500/25"
                                        : "text-white/50 hover:text-white hover:bg-white/[0.06]"
                                )}
                            >
                                <Activity className="h-4 w-4" />
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('new-campaign')}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all gap-2 flex items-center",
                                    activeTab === 'new-campaign'
                                        ? "bg-[#0D9488] text-white shadow-md shadow-teal-600/25"
                                        : "text-white/50 hover:text-white hover:bg-white/[0.06]"
                                )}
                            >
                                <Target className="h-4 w-4" />
                                Operations
                            </button>
                        </div>

                        <div className="h-8 w-px bg-white/[0.08] mx-2" />

                        <Button
                            variant="primary"
                            onClick={() => setIsShareDialogOpen(true)}
                            className="h-12 px-6 shadow-lg shadow-teal-500/20 gap-2"
                        >
                            <Share2 className="h-4 w-4" /> SHARE
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="mt-8">
                {activeTab === 'dashboard' ? (
                    <DashboardAnalyticsView
                        brand={brand}
                        campaigns={campaigns}
                        metrics={metrics}
                        creatives={creatives}
                        onExecuteClick={() => setActiveTab('new-campaign')}
                    />
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
        </div>
    );
}
