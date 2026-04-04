'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ApprovalKanban } from '@/components/campaigns/ApprovalKanban';
import { api } from '@/services/api';
import { GitPullRequestArrow, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Brand {
    id: string;
    name: string;
}

interface Campaign {
    id: string;
    name: string;
    approvalStatus: string;
    budgetPlanned?: number;
    startDate?: string;
    endDate?: string;
    brand?: { name: string };
    brandName?: string;
}

export default function ApprovalWorkflowPage() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [selectedBrandId, setSelectedBrandId] = useState<string>('all');
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchBrands = useCallback(async () => {
        try {
            const data = await api.brands.getAll();
            setBrands(data);
        } catch { /* silent */ }
    }, []);

    const fetchCampaigns = useCallback(async () => {
        try {
            const query: Record<string, string> = {};
            if (selectedBrandId !== 'all') query.brandId = selectedBrandId;
            const data: any[] = await api.campaigns.getAll(query);
            setCampaigns(data);
        } catch { /* silent */ }
    }, [selectedBrandId]);

    useEffect(() => { fetchBrands(); }, [fetchBrands]);

    useEffect(() => {
        setLoading(true);
        fetchCampaigns().finally(() => setLoading(false));
    }, [fetchCampaigns]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchCampaigns();
        setRefreshing(false);
    };

    // Map campaigns to kanban card format
    const kanbanData = campaigns.map(c => ({
        id: c.id,
        name: c.name,
        brandName: c.brandName || c.brand?.name,
        approvalStatus: c.approvalStatus || 'draft',
        budgetPlanned: c.budgetPlanned,
        startDate: c.startDate,
        endDate: c.endDate,
    }));

    // Stats
    const statusCounts = kanbanData.reduce<Record<string, number>>((acc, c) => {
        acc[c.approvalStatus] = (acc[c.approvalStatus] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            <PageHeader
                icon={GitPullRequestArrow}
                category="Campaign Management"
                title="Approval Workflow"
                description="Drag campaigns between stages to manage the approval pipeline. Visual overview of all campaign statuses."
                actions={
                    <div className="flex items-center gap-3">
                        <Select value={selectedBrandId} onValueChange={setSelectedBrandId}>
                            <SelectTrigger className="w-[200px] bg-white/[0.04] border-white/10 text-white">
                                <SelectValue placeholder="All Brands" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#162032] border-white/10">
                                <SelectItem value="all" className="text-white/70">All Brands</SelectItem>
                                {brands.map(b => (
                                    <SelectItem key={b.id} value={b.id} className="text-white/70">{b.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="border-white/10 text-white/70 hover:bg-white/[0.06]"
                        >
                            <RefreshCw className={`w-4 h-4 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </div>
                }
            />

            {/* Quick Stats */}
            <div className="flex gap-3 flex-wrap">
                {[
                    { label: 'Total', count: kanbanData.length, color: '#8888aa' },
                    { label: 'Draft', count: statusCounts['draft'] || 0, color: '#8888aa' },
                    { label: 'Pending', count: statusCounts['pending_review'] || 0, color: '#f59e0b' },
                    { label: 'Approved', count: statusCounts['approved'] || 0, color: '#10b981' },
                    { label: 'Active', count: statusCounts['active'] || 0, color: '#0D9488' },
                    { label: 'Paused', count: statusCounts['paused'] || 0, color: '#f97316' },
                ].map(s => (
                    <div key={s.label} className="bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                        <span className="text-xs text-white/50">{s.label}</span>
                        <span className="text-sm font-bold text-white">{s.count}</span>
                    </div>
                ))}
            </div>

            {/* Kanban Board */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-white/10 border-t-[#0D9488] rounded-full animate-spin" />
                </div>
            ) : kanbanData.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-white/30 text-sm">No campaigns found. Create a campaign first.</p>
                </div>
            ) : (
                <ApprovalKanban campaigns={kanbanData} onStatusChange={handleRefresh} />
            )}

            {/* Legend */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
                <div className="text-xs font-bold text-white/30 uppercase tracking-wider mb-2">Workflow Rules</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-white/40">
                    <div>Draft → Pending Review</div>
                    <div>Pending Review → Approved / Rejected</div>
                    <div>Approved → Active</div>
                    <div>Active → Paused / Completed</div>
                </div>
            </div>
        </div>
    );
}
