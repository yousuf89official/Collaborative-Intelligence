'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Loader2, Zap } from 'lucide-react';
import { api } from '@/services/api';

interface Rule {
    id: string;
    name: string;
    isActive: boolean;
    lastTriggeredAt?: string;
}

export function RuleStatusWidget() {
    const [rules, setRules] = useState<Rule[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRules = useCallback(async () => {
        try {
            const data = await api.campaignRules.getAll();
            setRules(data);
        } catch {
            // Silently fail
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRules();
    }, [fetchRules]);

    const stats = useMemo(() => {
        const now = Date.now();
        const oneDayAgo = now - 24 * 60 * 60 * 1000;
        const active = rules.filter(r => r.isActive).length;
        const inactive = rules.length - active;
        const recentlyTriggered = rules.filter(
            r => r.lastTriggeredAt && new Date(r.lastTriggeredAt).getTime() > oneDayAgo
        ).length;
        return { total: rules.length, active, inactive, recentlyTriggered };
    }, [rules]);

    if (loading) {
        return (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 h-full flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-white/30" />
            </div>
        );
    }

    return (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
                <Zap className="h-3.5 w-3.5 text-teal-400" />
                <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                    Automation Rules
                </h3>
            </div>

            {/* Total */}
            <p className="text-2xl font-bold text-white mb-3">{stats.total}</p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium bg-green-500/10 text-green-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    {stats.active} active
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium bg-white/[0.06] text-white/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
                    {stats.inactive} inactive
                </span>
                {stats.recentlyTriggered > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium bg-yellow-500/10 text-yellow-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                        {stats.recentlyTriggered} triggered (24h)
                    </span>
                )}
            </div>

            {/* Link */}
            <Link
                href="/admin/campaign-rules"
                className="text-xs text-teal-400 hover:text-teal-300 transition-colors"
            >
                Manage Rules &rarr;
            </Link>
        </div>
    );
}
