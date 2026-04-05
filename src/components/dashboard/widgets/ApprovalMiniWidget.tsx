'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { api, type Campaign } from '@/services/api';

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    draft:          { label: 'Draft',    color: 'bg-white/20' },
    pending_review: { label: 'Pending',  color: 'bg-yellow-500' },
    approved:       { label: 'Approved', color: 'bg-green-500' },
    rejected:       { label: 'Rejected', color: 'bg-red-500' },
    active:         { label: 'Active',   color: 'bg-teal-500' },
    paused:         { label: 'Paused',   color: 'bg-orange-500' },
    completed:      { label: 'Done',     color: 'bg-indigo-500' },
};

const STATUS_ORDER = ['draft', 'pending_review', 'approved', 'rejected', 'active', 'paused', 'completed'];

export function ApprovalMiniWidget() {
    const router = useRouter();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCampaigns = useCallback(async () => {
        try {
            const data = await api.campaigns.getAll({});
            setCampaigns(data);
        } catch {
            // Silently fail
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);

    const statusCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        for (const c of campaigns) {
            const key = c.status || 'draft';
            counts[key] = (counts[key] || 0) + 1;
        }
        return counts;
    }, [campaigns]);

    const total = campaigns.length;

    // Only show statuses that have at least 1 campaign
    const visibleStatuses = useMemo(
        () => STATUS_ORDER.filter(s => (statusCounts[s] || 0) > 0),
        [statusCounts]
    );

    if (loading) {
        return (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 h-full flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-white/30" />
            </div>
        );
    }

    return (
        <div
            className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 cursor-pointer hover:bg-white/[0.05] transition-colors"
            onClick={() => router.push('/admin/approval-workflow')}
            role="button"
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') router.push('/admin/approval-workflow'); }}
        >
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
                Approval Pipeline
            </h3>

            {total === 0 ? (
                <p className="text-sm text-white/40">No campaigns</p>
            ) : (
                <>
                    {/* Stacked bar */}
                    <div className="flex h-3 rounded-full overflow-hidden mb-3 gap-px">
                        {visibleStatuses.map(s => {
                            const count = statusCounts[s] || 0;
                            const pct = (count / total) * 100;
                            const config = STATUS_CONFIG[s];
                            return (
                                <div
                                    key={s}
                                    className={`${config?.color || 'bg-white/10'} transition-all`}
                                    style={{ width: `${pct}%`, minWidth: count > 0 ? '4px' : '0' }}
                                    title={`${config?.label}: ${count}`}
                                />
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                        {visibleStatuses.map(s => {
                            const config = STATUS_CONFIG[s];
                            const count = statusCounts[s] || 0;
                            return (
                                <span key={s} className="inline-flex items-center gap-1.5 text-[10px] text-white/50">
                                    <span className={`h-1.5 w-1.5 rounded-full ${config?.color || 'bg-white/10'}`} />
                                    {config?.label} {count}
                                </span>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
