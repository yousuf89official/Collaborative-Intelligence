'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { BarChart3, Eye, MousePointer, Clock, Users, TrendingUp, MapPin, Smartphone, Globe, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const METRICS = [
    { label: 'Active Users', value: '2,847', change: '+12.3%', up: true, icon: Users },
    { label: 'Sessions', value: '8,432', change: '+8.7%', up: true, icon: Eye },
    { label: 'Engagement Rate', value: '68.4%', change: '+5.2%', up: true, icon: MousePointer },
    { label: 'Avg. Session Duration', value: '3m 42s', change: '-2.1%', up: false, icon: Clock },
    { label: 'Bounce Rate', value: '31.6%', change: '-5.2%', up: true, icon: ArrowDownRight },
    { label: 'Conversion Rate', value: '4.2%', change: '+1.8%', up: true, icon: TrendingUp },
];

const PAGES_DATA = [
    { path: '/', title: 'Home Page', views: 3421, avgTime: '2m 15s', bounceRate: '28%', entries: 2105 },
    { path: '/pricing', title: 'Pricing', views: 1847, avgTime: '4m 32s', bounceRate: '22%', entries: 845 },
    { path: '/about', title: 'About', views: 982, avgTime: '1m 48s', bounceRate: '45%', entries: 423 },
    { path: '/blog', title: 'Blog', views: 756, avgTime: '5m 12s', bounceRate: '35%', entries: 312 },
    { path: '/contact', title: 'Contact', views: 634, avgTime: '3m 05s', bounceRate: '18%', entries: 198 },
];

const TRAFFIC_SOURCES = [
    { source: 'Organic Search', sessions: 3842, pct: 45.6, color: '#0D9488' },
    { source: 'Direct', sessions: 1689, pct: 20.0, color: '#4F46E5' },
    { source: 'Social Media', sessions: 1256, pct: 14.9, color: '#22c55e' },
    { source: 'Paid Search', sessions: 892, pct: 10.6, color: '#f59e0b' },
    { source: 'Referral', sessions: 521, pct: 6.2, color: '#20C997' },
    { source: 'Email', sessions: 232, pct: 2.7, color: '#ef4444' },
];

const GEO_DATA = [
    { country: 'Indonesia', sessions: 2156, pct: 25.6, flag: '🇮🇩' },
    { country: 'United States', sessions: 1823, pct: 21.6, flag: '🇺🇸' },
    { country: 'Singapore', sessions: 945, pct: 11.2, flag: '🇸🇬' },
    { country: 'United Kingdom', sessions: 687, pct: 8.1, flag: '🇬🇧' },
    { country: 'India', sessions: 534, pct: 6.3, flag: '🇮🇳' },
    { country: 'Malaysia', sessions: 423, pct: 5.0, flag: '🇲🇾' },
    { country: 'Australia', sessions: 312, pct: 3.7, flag: '🇦🇺' },
    { country: 'Others', sessions: 1552, pct: 18.4, flag: '🌍' },
];

const DEVICE_DATA = [
    { device: 'Desktop', pct: 62, color: '#0D9488' },
    { device: 'Mobile', pct: 31, color: '#4F46E5' },
    { device: 'Tablet', pct: 7, color: '#22c55e' },
];

const HEATMAP_ZONES = [
    { zone: 'Hero CTA (Book a Demo)', clicks: 1245, color: 'bg-red-500' },
    { zone: 'Navigation - Pricing', clicks: 892, color: 'bg-orange-500' },
    { zone: 'Hero CTA (Login)', clicks: 756, color: 'bg-yellow-500' },
    { zone: 'Features Section', clicks: 623, color: 'bg-green-500' },
    { zone: 'Footer - Contact', clicks: 421, color: 'bg-blue-500' },
    { zone: 'CTA Email Input', clicks: 378, color: 'bg-purple-500' },
    { zone: 'Blog Articles', clicks: 234, color: 'bg-teal-500' },
];

const LIVE_USERS = [
    { id: 1, page: '/', country: 'Indonesia', device: 'Desktop', duration: '2m 15s', actions: 5 },
    { id: 2, page: '/pricing', country: 'United States', device: 'Mobile', duration: '4m 32s', actions: 8 },
    { id: 3, page: '/blog', country: 'Singapore', device: 'Desktop', duration: '1m 48s', actions: 3 },
    { id: 4, page: '/contact', country: 'India', device: 'Desktop', duration: '0m 45s', actions: 2 },
    { id: 5, page: '/', country: 'Malaysia', device: 'Mobile', duration: '3m 12s', actions: 6 },
];

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState('7d');
    const [activeTab, setActiveTab] = useState<'overview' | 'behavior' | 'heatmap' | 'live'>('overview');

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                icon={BarChart3}
                category="Growth"
                title="Analytics & Tracking"
                description="GA4-powered analytics with heatmaps, behavior tracking, and real-time visitor monitoring for global user acquisition and retention."
                actions={
                    <div className="flex gap-2">
                        {['24h', '7d', '30d', '90d'].map(range => (
                            <button key={range} onClick={() => setTimeRange(range)} className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${timeRange === range ? 'bg-[#0D9488] text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>
                                {range}
                            </button>
                        ))}
                    </div>
                }
            />

            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/10">
                {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'behavior', label: 'Behavior & Pages' },
                    { id: 'heatmap', label: 'Heatmap & Clicks' },
                    { id: 'live', label: 'Live Users' },
                ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === tab.id ? 'border-[#0D9488] text-[#0D9488]' : 'border-transparent text-white/40 hover:text-white/60'}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'overview' && (
                <>
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {METRICS.map(m => (
                            <div key={m.label} className="p-4 rounded-xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                                <div className="flex items-center justify-between mb-2">
                                    <m.icon className="h-4 w-4 text-white/30" />
                                    <span className={`text-[10px] font-bold flex items-center gap-0.5 ${m.up ? 'text-green-400' : 'text-red-400'}`}>
                                        {m.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                        {m.change}
                                    </span>
                                </div>
                                <p className="text-xl font-bold text-white">{m.value}</p>
                                <p className="text-[10px] text-white/40 mt-1">{m.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Traffic & Geo */}
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 lg:col-span-5 p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                            <h3 className="font-bold text-white mb-4">Traffic Sources</h3>
                            <div className="space-y-3">
                                {TRAFFIC_SOURCES.map(t => (
                                    <div key={t.source} className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                                        <span className="text-xs text-white/60 flex-1">{t.source}</span>
                                        <span className="text-xs font-mono text-white/40">{t.sessions.toLocaleString()}</span>
                                        <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full" style={{ width: `${t.pct}%`, backgroundColor: t.color }} />
                                        </div>
                                        <span className="text-[10px] text-white/30 w-10 text-right">{t.pct}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="col-span-12 lg:col-span-4 p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2"><MapPin className="h-4 w-4 text-[#0D9488]" /> Geographic Distribution</h3>
                            <div className="space-y-2.5">
                                {GEO_DATA.map(g => (
                                    <div key={g.country} className="flex items-center gap-2">
                                        <span className="text-sm">{g.flag}</span>
                                        <span className="text-xs text-white/60 flex-1">{g.country}</span>
                                        <span className="text-[10px] font-mono text-white/40">{g.pct}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="col-span-12 lg:col-span-3 p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Smartphone className="h-4 w-4 text-[#4F46E5]" /> Devices</h3>
                            <div className="space-y-4">
                                {DEVICE_DATA.map(d => (
                                    <div key={d.device}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-xs text-white/60">{d.device}</span>
                                            <span className="text-xs font-bold text-white">{d.pct}%</span>
                                        </div>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${d.pct}%`, backgroundColor: d.color }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'behavior' && (
                <div className="p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                    <h3 className="font-bold text-white mb-4">Page Performance</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-[10px] text-white/30 uppercase tracking-wider border-b border-white/5">
                                    <th className="text-left py-3 px-4">Page</th>
                                    <th className="text-right py-3 px-4">Views</th>
                                    <th className="text-right py-3 px-4">Avg. Time</th>
                                    <th className="text-right py-3 px-4">Bounce Rate</th>
                                    <th className="text-right py-3 px-4">Entries</th>
                                </tr>
                            </thead>
                            <tbody>
                                {PAGES_DATA.map(p => (
                                    <tr key={p.path} className="border-b border-white/5 hover:bg-white/[0.02]">
                                        <td className="py-3 px-4">
                                            <p className="text-sm text-white font-medium">{p.title}</p>
                                            <p className="text-[10px] text-white/30">{p.path}</p>
                                        </td>
                                        <td className="text-right py-3 px-4 text-sm text-white font-mono">{p.views.toLocaleString()}</td>
                                        <td className="text-right py-3 px-4 text-sm text-white/60">{p.avgTime}</td>
                                        <td className="text-right py-3 px-4 text-sm text-white/60">{p.bounceRate}</td>
                                        <td className="text-right py-3 px-4 text-sm text-white/60">{p.entries.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'heatmap' && (
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 lg:col-span-7 p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                        <h3 className="font-bold text-white mb-4">Click Heatmap Zones</h3>
                        <div className="space-y-3">
                            {HEATMAP_ZONES.map((zone, idx) => (
                                <div key={zone.zone} className="flex items-center gap-3">
                                    <span className="text-xs text-white/30 w-4">{idx + 1}</span>
                                    <div className={`w-3 h-3 rounded-full ${zone.color}`} />
                                    <span className="text-sm text-white/70 flex-1">{zone.zone}</span>
                                    <span className="text-sm font-bold text-white">{zone.clicks.toLocaleString()} clicks</span>
                                    <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${zone.color}`} style={{ width: `${(zone.clicks / 1245) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-span-12 lg:col-span-5 p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                        <h3 className="font-bold text-white mb-4">Scroll Depth</h3>
                        <div className="space-y-3">
                            {[
                                { depth: '25%', pct: 92 },
                                { depth: '50%', pct: 68 },
                                { depth: '75%', pct: 41 },
                                { depth: '100%', pct: 18 },
                            ].map(s => (
                                <div key={s.depth}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-xs text-white/60">Reached {s.depth}</span>
                                        <span className="text-xs font-bold text-white">{s.pct}% of visitors</span>
                                    </div>
                                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full bg-gradient-to-r from-[#0D9488] to-[#4F46E5]" style={{ width: `${s.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 p-4 rounded-xl bg-[#0D9488]/5 border border-[#0D9488]/10">
                            <p className="text-xs text-[#0D9488] font-medium mb-1">Insight</p>
                            <p className="text-[10px] text-white/50">Only 18% of visitors scroll to the bottom. Consider moving CTA higher or adding mid-page engagement elements.</p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'live' && (
                <div className="space-y-6">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                        </span>
                        <span className="text-sm font-bold text-green-400">{LIVE_USERS.length} users online right now</span>
                    </div>
                    <div className="p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                        <table className="w-full">
                            <thead>
                                <tr className="text-[10px] text-white/30 uppercase tracking-wider border-b border-white/5">
                                    <th className="text-left py-3 px-4">Visitor</th>
                                    <th className="text-left py-3 px-4">Current Page</th>
                                    <th className="text-left py-3 px-4">Country</th>
                                    <th className="text-left py-3 px-4">Device</th>
                                    <th className="text-right py-3 px-4">Duration</th>
                                    <th className="text-right py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {LIVE_USERS.map(u => (
                                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" /></span>
                                                <span className="text-xs text-white/60">Visitor #{u.id}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-xs text-white font-mono">{u.page}</td>
                                        <td className="py-3 px-4 text-xs text-white/60">{u.country}</td>
                                        <td className="py-3 px-4 text-xs text-white/60">{u.device}</td>
                                        <td className="text-right py-3 px-4 text-xs text-white/60">{u.duration}</td>
                                        <td className="text-right py-3 px-4 text-xs font-bold text-white">{u.actions}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
