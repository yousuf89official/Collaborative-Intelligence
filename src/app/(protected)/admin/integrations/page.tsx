'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Plug, Plus, Check, ExternalLink, RefreshCw, Settings, Unplug } from 'lucide-react';

const AD_PLATFORMS = [
    {
        id: 'google-ads', name: 'Google Ads', icon: 'search', color: '#4285F4', status: 'connected', account: 'IMH Global (123-456-7890)',
        metrics: ['Impressions', 'Clicks', 'CTR', 'CPC', 'Conversions', 'ROAS', 'Quality Score', 'Impression Share'],
        lastSync: '5 min ago', dataPoints: 45230,
    },
    {
        id: 'meta-ads', name: 'Meta Ads', icon: 'groups', color: '#1877F2', status: 'connected', account: 'IMH Business (act_987654321)',
        metrics: ['Impressions', 'Reach', 'Frequency', 'Clicks', 'CTR', 'CPM', 'Conversions', 'ROAS', 'Video Views'],
        lastSync: '12 min ago', dataPoints: 38450,
    },
    {
        id: 'tiktok-ads', name: 'TikTok Ads', icon: 'music_note', color: '#000000', status: 'connected', account: 'IMH TikTok Business',
        metrics: ['Impressions', 'Clicks', 'CTR', 'CPM', 'Conversions', 'Video Views', 'Engagement Rate', 'Profile Visits'],
        lastSync: '30 min ago', dataPoints: 12800,
    },
    {
        id: 'linkedin-ads', name: 'LinkedIn Ads', icon: 'work', color: '#0A66C2', status: 'disconnected', account: null,
        metrics: ['Impressions', 'Clicks', 'CTR', 'CPC', 'Conversions', 'Leads', 'Social Actions', 'Demographics'],
        lastSync: null, dataPoints: 0,
    },
    {
        id: 'twitter-ads', name: 'X (Twitter) Ads', icon: 'tag', color: '#1DA1F2', status: 'disconnected', account: null,
        metrics: ['Impressions', 'Engagements', 'Link Clicks', 'Retweets', 'Follows', 'App Installs'],
        lastSync: null, dataPoints: 0,
    },
    {
        id: 'dv360', name: 'Display & Video 360', icon: 'tv', color: '#0F9D58', status: 'disconnected', account: null,
        metrics: ['Impressions', 'Clicks', 'Viewability', 'CTR', 'CPM', 'Conversions', 'Reach'],
        lastSync: null, dataPoints: 0,
    },
];

const DATA_PLATFORMS = [
    {
        id: 'google-sheets', name: 'Google Sheets', icon: 'table_chart', color: '#0F9D58', status: 'connected',
        desc: 'Real-time bidirectional data sync with Google Sheets. Extract metrics, push reports, and modify campaign data.',
        sheets: [
            { name: 'Campaign Performance Q1 2026', lastSync: '10 min ago', rows: 1245, direction: 'pull' },
            { name: 'Budget Tracker - March', lastSync: '1 hour ago', rows: 48, direction: 'push' },
            { name: 'Media Plan Template', lastSync: '2 hours ago', rows: 156, direction: 'bidirectional' },
        ],
    },
    {
        id: 'google-analytics', name: 'Google Analytics 4', icon: 'analytics', color: '#E37400', status: 'connected',
        desc: 'Import GA4 metrics for cross-platform attribution and behavior analysis.',
        sheets: [],
    },
    {
        id: 'bigquery', name: 'Google BigQuery', icon: 'database', color: '#4285F4', status: 'disconnected',
        desc: 'Export raw data to BigQuery for advanced analysis and custom reporting.',
        sheets: [],
    },
];

export default function IntegrationsPage() {
    const [activeTab, setActiveTab] = useState<'ad-platforms' | 'data' | 'webhooks'>('ad-platforms');

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                icon={Plug}
                category="Platform"
                title="Integrations"
                description="Connect ad platforms, data sources, and productivity tools. Real-time data sync across Google Ads, Meta, TikTok, LinkedIn, Google Sheets, and more."
                actions={
                    <button className="flex items-center gap-2 px-6 py-2 bg-[#0D9488] text-white rounded-xl font-bold text-xs hover:bg-[#0F766E] transition-all shadow-lg shadow-teal-500/20">
                        <Plus className="h-4 w-4" /> ADD INTEGRATION
                    </button>
                }
            />

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Connected Platforms', value: AD_PLATFORMS.filter(p => p.status === 'connected').length + DATA_PLATFORMS.filter(p => p.status === 'connected').length },
                    { label: 'Total Data Points', value: `${(AD_PLATFORMS.reduce((s, p) => s + p.dataPoints, 0) / 1000).toFixed(1)}K` },
                    { label: 'Last Sync', value: '5 min ago' },
                    { label: 'Sync Frequency', value: 'Every 15 min' },
                ].map(s => (
                    <div key={s.label} className="p-5 rounded-xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{s.label}</p>
                        <p className="text-2xl font-bold text-white">{s.value}</p>
                    </div>
                ))}
            </div>

            <div className="flex gap-2 border-b border-white/10">
                {[{ id: 'ad-platforms', label: 'Ad Platforms' }, { id: 'data', label: 'Data & Sheets' }, { id: 'webhooks', label: 'Webhooks' }].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === tab.id ? 'border-[#0D9488] text-[#0D9488]' : 'border-transparent text-white/40'}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'ad-platforms' && (
                <div className="grid md:grid-cols-2 gap-4">
                    {AD_PLATFORMS.map(p => (
                        <div key={p.id} className={`p-6 rounded-2xl border ${p.status === 'connected' ? 'border-green-500/10' : 'border-white/10'} bg-white/[0.02]`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${p.color}15` }}>
                                        <span className="material-symbols-outlined text-lg" style={{ color: p.color }}>{p.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">{p.name}</h3>
                                        {p.account && <p className="text-[10px] text-white/30">{p.account}</p>}
                                    </div>
                                </div>
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${p.status === 'connected' ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/30'}`}>
                                    {p.status}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-1 mb-4">
                                {p.metrics.slice(0, 6).map(m => (
                                    <span key={m} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40">{m}</span>
                                ))}
                                {p.metrics.length > 6 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/30">+{p.metrics.length - 6} more</span>}
                            </div>
                            {p.status === 'connected' ? (
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-white/30">Last sync: {p.lastSync} · {p.dataPoints.toLocaleString()} data points</span>
                                    <div className="flex gap-1">
                                        <button className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white"><RefreshCw className="h-3.5 w-3.5" /></button>
                                        <button className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white"><Settings className="h-3.5 w-3.5" /></button>
                                        <button className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400"><Unplug className="h-3.5 w-3.5" /></button>
                                    </div>
                                </div>
                            ) : (
                                <button className="w-full py-2.5 bg-[#0D9488] text-white rounded-lg text-xs font-bold hover:bg-[#0F766E] transition-all">
                                    Connect {p.name}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'data' && (
                <div className="space-y-6">
                    {DATA_PLATFORMS.map(p => (
                        <div key={p.id} className="p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${p.color}15` }}>
                                        <span className="material-symbols-outlined text-lg" style={{ color: p.color }}>{p.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">{p.name}</h3>
                                        <p className="text-xs text-white/40">{p.desc}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${p.status === 'connected' ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/30'}`}>{p.status}</span>
                            </div>
                            {p.id === 'google-sheets' && p.sheets.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    <h4 className="text-xs font-bold text-white/30 uppercase tracking-wider">Connected Sheets</h4>
                                    {p.sheets.map(s => (
                                        <div key={s.name} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/5">
                                            <div>
                                                <p className="text-sm text-white font-medium">{s.name}</p>
                                                <p className="text-[10px] text-white/30">{s.rows} rows · Last sync: {s.lastSync}</p>
                                            </div>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${s.direction === 'pull' ? 'bg-blue-500/10 text-blue-400' : s.direction === 'push' ? 'bg-green-500/10 text-green-400' : 'bg-purple-500/10 text-purple-400'}`}>
                                                {s.direction}
                                            </span>
                                        </div>
                                    ))}
                                    <button className="w-full py-2 border border-dashed border-white/10 text-white/30 rounded-lg text-xs hover:border-[#0D9488]/30 hover:text-[#0D9488] transition-all">
                                        + Connect Another Sheet
                                    </button>
                                </div>
                            )}
                            {p.status === 'disconnected' && (
                                <button className="mt-4 w-full py-2.5 bg-[#0D9488] text-white rounded-lg text-xs font-bold hover:bg-[#0F766E] transition-all">
                                    Connect {p.name}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'webhooks' && (
                <div className="space-y-6">
                    <div className="p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                        <h3 className="font-bold text-white mb-4">Webhook Endpoints</h3>
                        <div className="space-y-3">
                            {[
                                { url: 'https://hooks.example.com/imh/campaigns', events: ['campaign.created', 'campaign.updated'], status: 'active' },
                                { url: 'https://api.slack.com/webhooks/T0123/B456', events: ['alert.triggered', 'report.generated'], status: 'active' },
                            ].map((wh, idx) => (
                                <div key={idx} className="p-4 rounded-lg bg-white/[0.03] border border-white/5">
                                    <div className="flex justify-between items-start mb-2">
                                        <code className="text-xs text-white/60 font-mono">{wh.url}</code>
                                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">{wh.status}</span>
                                    </div>
                                    <div className="flex gap-1">
                                        {wh.events.map(e => (
                                            <span key={e} className="text-[10px] px-2 py-0.5 rounded-full bg-[#0D9488]/10 text-[#0D9488]">{e}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="mt-4 w-full py-2 border border-dashed border-white/10 text-white/30 rounded-lg text-xs hover:border-[#0D9488]/30 hover:text-[#0D9488] transition-all">
                            + Add Webhook Endpoint
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
