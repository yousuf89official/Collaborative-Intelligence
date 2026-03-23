'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Activity, Search, Download, User, Shield, Settings, Database, Globe, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface ActivityEvent {
    id: string;
    userId: string | null;
    userName: string;
    userEmail: string;
    action: string;
    target: string;
    detail: string;
    severity: string;
    ip: string | null;
    createdAt: string;
}

function getSeverityColor(severity: string) {
    switch (severity) {
        case 'critical': return 'text-red-400 bg-red-500/10';
        case 'warning': return 'text-yellow-400 bg-yellow-500/10';
        default: return 'text-white/40 bg-white/[0.04]';
    }
}

function getActionIcon(action: string) {
    switch (action) {
        case 'login': case 'login_failed': return User;
        case 'update': return Settings;
        case 'create': return Database;
        case 'export': return Download;
        case 'sync': case 'backup': return Database;
        case 'view': return Globe;
        default: return Activity;
    }
}

export default function ActivityLogsPage() {
    const [activeTab, setActiveTab] = useState<'events' | 'live'>('events');
    const [filterSeverity, setFilterSeverity] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [events, setEvents] = useState<ActivityEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterSeverity !== 'all') params.set('severity', filterSeverity);
            if (searchQuery) params.set('search', searchQuery);
            params.set('limit', '100');

            const res = await fetch(`/api/activity-logs?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setEvents(data);
            } else {
                toast.error('Failed to load activity logs');
            }
        } catch {
            toast.error('Failed to load activity logs');
        } finally {
            setLoading(false);
        }
    }, [filterSeverity, searchQuery]);

    // Fetch users for live sessions (users active in last 30 minutes)
    const fetchOnlineUsers = useCallback(async () => {
        try {
            const res = await fetch('/api/activity-logs?limit=20');
            if (res.ok) {
                const data: ActivityEvent[] = await res.json();
                // Derive "live" users from recent login events (last 30 min)
                const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000);
                const recentLogins = data.filter(
                    e => e.action === 'login' && new Date(e.createdAt) > thirtyMinAgo
                );
                const uniqueUsers = new Map<string, ActivityEvent>();
                for (const e of recentLogins) {
                    if (!uniqueUsers.has(e.userEmail)) uniqueUsers.set(e.userEmail, e);
                }
                setOnlineUsers(Array.from(uniqueUsers.values()));
            }
        } catch {}
    }, []);

    useEffect(() => { fetchLogs(); }, [fetchLogs]);
    useEffect(() => { if (activeTab === 'live') fetchOnlineUsers(); }, [activeTab, fetchOnlineUsers]);

    return (
        <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                icon={Activity}
                category="Platform"
                title="Activity Logs & Live Tracking"
                description="Monitor all user actions, security events, and live sessions in real-time."
                actions={
                    <button
                        onClick={fetchLogs}
                        className="flex items-center gap-2 px-4 py-2 border border-white/10 bg-white/[0.03] text-white/70 rounded-xl font-bold text-xs hover:bg-white/[0.06] hover:text-white transition-all"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> REFRESH
                    </button>
                }
            />

            {/* Tabs */}
            <div className="flex gap-1 border-b border-white/[0.06]">
                {[{ id: 'events', label: 'Event Log' }, { id: 'live', label: 'Live Sessions' }].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === tab.id ? 'border-[#0D9488] text-[#0D9488]' : 'border-transparent text-white/40 hover:text-white/60'}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'events' && (
                <>
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search events..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#0D9488]/40 focus:ring-2 focus:ring-[#0D9488]/20 transition-all"
                            />
                        </div>
                        <div className="flex gap-1 overflow-x-auto">
                            {['all', 'info', 'warning', 'critical'].map(s => (
                                <button key={s} onClick={() => setFilterSeverity(s)} className={`px-3 py-2 rounded-xl text-xs font-bold uppercase whitespace-nowrap transition-all ${filterSeverity === s ? 'bg-[#0D9488] text-white shadow-lg shadow-teal-500/20' : 'bg-white/[0.03] text-white/40 hover:text-white/60 border border-white/[0.06]'}`}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Events */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-6 w-6 animate-spin text-white/30" />
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-20">
                            <Activity className="h-12 w-12 text-white/10 mx-auto mb-3" />
                            <p className="text-sm text-white/40">No activity logs found</p>
                            <p className="text-xs text-white/20 mt-1">User actions will appear here as they occur</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {events.map(e => {
                                const Icon = getActionIcon(e.action);
                                return (
                                    <div key={e.id} className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 p-4 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.4)] hover:bg-[rgba(22,32,50,0.55)] transition-all">
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${getSeverityColor(e.severity)}`}>
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <span className="text-sm font-medium text-white">{e.userName}</span>
                                                <span className="text-[10px] text-white/20">·</span>
                                                <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-lg ${getSeverityColor(e.severity)}`}>{e.action}</span>
                                                <span className="text-[10px] text-white/20 hidden sm:inline">·</span>
                                                <span className="text-[10px] text-white/30 hidden sm:inline">{e.target}</span>
                                            </div>
                                            <p className="text-xs text-white/50 leading-relaxed">{e.detail}</p>
                                        </div>
                                        <div className="text-left sm:text-right shrink-0 flex sm:block items-center gap-3 sm:gap-0">
                                            <p className="text-[10px] text-white/30">{new Date(e.createdAt).toLocaleString()}</p>
                                            <p className="text-[10px] text-white/20 font-mono">{e.ip || 'system'}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            {activeTab === 'live' && (
                <div className="space-y-6">
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-500/5 border border-green-500/10">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                        </span>
                        <span className="text-sm font-bold text-green-400">{onlineUsers.length} active session{onlineUsers.length !== 1 ? 's' : ''} (last 30 min)</span>
                    </div>
                    {onlineUsers.length === 0 ? (
                        <div className="text-center py-16">
                            <User className="h-12 w-12 text-white/10 mx-auto mb-3" />
                            <p className="text-sm text-white/40">No active sessions</p>
                            <p className="text-xs text-white/20 mt-1">Sessions appear when users log in</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {onlineUsers.map(s => (
                                <div key={s.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)]">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0D9488] to-[#0EA5E9] flex items-center justify-center text-white text-xs font-bold shrink-0">
                                        {s.userName.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-white">{s.userName}</p>
                                        <p className="text-[10px] text-white/30">{s.userEmail}</p>
                                    </div>
                                    <div className="sm:text-right">
                                        <p className="text-xs text-white/60">Logged in</p>
                                        <p className="text-[10px] text-white/30">{new Date(s.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
