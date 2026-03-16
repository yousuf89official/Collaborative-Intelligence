'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Activity, Search, Filter, Download, User, Shield, Settings, Database, Globe } from 'lucide-react';

const EVENTS = [
    { id: 1, user: 'System Admin', email: 'admin@collaborativeintelligence.io', action: 'login', target: 'Authentication', detail: 'Successful login from 103.42.12.xxx (Jakarta, ID)', severity: 'info', timestamp: '2026-03-10T14:32:00Z', ip: '103.42.12.xxx' },
    { id: 2, user: 'System Admin', email: 'admin@collaborativeintelligence.io', action: 'update', target: 'CMS', detail: 'Updated landing page hero section content', severity: 'info', timestamp: '2026-03-10T14:28:00Z', ip: '103.42.12.xxx' },
    { id: 3, user: 'Sarah Chen', email: 'sarah.chen@acmecorp.com', action: 'create', target: 'Campaign', detail: 'Created campaign "Q1 2026 Brand Awareness" for Nexus Technologies', severity: 'info', timestamp: '2026-03-10T13:45:00Z', ip: '198.51.100.xxx' },
    { id: 4, user: 'James Wilson', email: 'james.wilson@globalbrands.com', action: 'export', target: 'Reports', detail: 'Exported monthly performance report (PDF, 12 pages)', severity: 'info', timestamp: '2026-03-10T12:15:00Z', ip: '203.0.113.xxx' },
    { id: 5, user: 'System', email: 'system', action: 'sync', target: 'Integration', detail: 'Google Ads data sync completed — 2,450 new data points', severity: 'info', timestamp: '2026-03-10T12:00:00Z', ip: 'internal' },
    { id: 6, user: 'Unknown', email: 'unknown@test.com', action: 'login_failed', target: 'Authentication', detail: 'Failed login attempt (invalid credentials) from 185.220.101.xxx', severity: 'warning', timestamp: '2026-03-10T11:30:00Z', ip: '185.220.101.xxx' },
    { id: 7, user: 'System Admin', email: 'admin@collaborativeintelligence.io', action: 'update', target: 'Security', detail: 'Enabled MFA requirement for all admin users', severity: 'critical', timestamp: '2026-03-10T10:00:00Z', ip: '103.42.12.xxx' },
    { id: 8, user: 'Maria Rodriguez', email: 'maria@pinnacleagency.com', action: 'view', target: 'Dashboard', detail: 'Accessed Velocity Motors campaign dashboard', severity: 'info', timestamp: '2026-03-10T09:45:00Z', ip: '104.28.xxx.xxx' },
    { id: 9, user: 'System', email: 'system', action: 'backup', target: 'Database', detail: 'Automated daily backup completed (2.3 GB)', severity: 'info', timestamp: '2026-03-10T03:00:00Z', ip: 'internal' },
    { id: 10, user: 'System', email: 'system', action: 'sync', target: 'Integration', detail: 'Meta Ads data sync completed — 1,820 new data points', severity: 'info', timestamp: '2026-03-10T02:00:00Z', ip: 'internal' },
    { id: 11, user: 'David Kim', email: 'david.kim@asiadigital.co', action: 'update', target: 'Brand', detail: 'Updated Pinnacle Bank brand settings and logo', severity: 'info', timestamp: '2026-03-09T16:30:00Z', ip: '118.99.xxx.xxx' },
    { id: 12, user: 'System Admin', email: 'admin@collaborativeintelligence.io', action: 'create', target: 'API Key', detail: 'Generated new production API key (imh_prod_****)', severity: 'critical', timestamp: '2026-03-09T14:00:00Z', ip: '103.42.12.xxx' },
];

const LIVE_SESSIONS = [
    { user: 'System Admin', page: '/admin/cms', started: '14 min ago', actions: 8, country: 'Indonesia' },
    { user: 'Sarah Chen', page: '/brands/nexus-technologies', started: '25 min ago', actions: 12, country: 'United States' },
    { user: 'James Wilson', page: '/reports', started: '45 min ago', actions: 5, country: 'Singapore' },
    { user: 'Maria Rodriguez', page: '/dashboard', started: '2 hours ago', actions: 18, country: 'Philippines' },
];

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

    const filtered = EVENTS.filter(e => {
        if (filterSeverity !== 'all' && e.severity !== filterSeverity) return false;
        if (searchQuery && !JSON.stringify(e).toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                icon={Activity}
                category="Platform"
                title="Activity Logs & Live Tracking"
                description="Monitor all user actions, security events, and live sessions in real-time."
                actions={
                    <button className="flex items-center gap-2 px-4 py-2 border border-white/10 bg-white/[0.03] text-white/70 rounded-xl font-bold text-xs hover:bg-white/[0.06] hover:text-white transition-all">
                        <Download className="h-4 w-4" /> EXPORT
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
                            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search events..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-[#0D9488]/40 focus:ring-2 focus:ring-[#0D9488]/20 transition-all" />
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
                    <div className="space-y-2">
                        {filtered.map(e => {
                            const Icon = getActionIcon(e.action);
                            return (
                                <div key={e.id} className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 p-4 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.4)] hover:bg-[rgba(22,32,50,0.55)] transition-all">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${getSeverityColor(e.severity)}`}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <span className="text-sm font-medium text-white">{e.user}</span>
                                            <span className="text-[10px] text-white/20">·</span>
                                            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-lg ${getSeverityColor(e.severity)}`}>{e.action}</span>
                                            <span className="text-[10px] text-white/20 hidden sm:inline">·</span>
                                            <span className="text-[10px] text-white/30 hidden sm:inline">{e.target}</span>
                                        </div>
                                        <p className="text-xs text-white/50 leading-relaxed">{e.detail}</p>
                                    </div>
                                    <div className="text-left sm:text-right shrink-0 flex sm:block items-center gap-3 sm:gap-0">
                                        <p className="text-[10px] text-white/30">{new Date(e.timestamp).toLocaleString()}</p>
                                        <p className="text-[10px] text-white/20 font-mono">{e.ip}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {activeTab === 'live' && (
                <div className="space-y-6">
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-500/5 border border-green-500/10">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                        </span>
                        <span className="text-sm font-bold text-green-400">{LIVE_SESSIONS.length} active sessions</span>
                    </div>
                    <div className="space-y-3">
                        {LIVE_SESSIONS.map(s => (
                            <div key={s.user} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)]">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0D9488] to-[#0EA5E9] flex items-center justify-center text-white text-xs font-bold shrink-0">
                                    {s.user.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-white">{s.user}</p>
                                    <p className="text-[10px] text-white/30">Currently on: <span className="text-white/50 font-mono">{s.page}</span></p>
                                </div>
                                <div className="sm:text-right flex sm:block items-center gap-3 sm:gap-0">
                                    <p className="text-xs text-white/60">{s.actions} actions</p>
                                    <p className="text-[10px] text-white/30">{s.country} · Started {s.started}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
