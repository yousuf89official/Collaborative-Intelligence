'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Key, Plus, Copy, Check, Eye, EyeOff, Trash2, RefreshCw } from 'lucide-react';

const API_KEYS = [
    { id: 1, name: 'Production API Key', prefix: 'imh_prod_', key: '••••••••••••••••abcd1234', created: '2025-06-01', lastUsed: '2 min ago', status: 'active', requests: 45230, rateLimit: '1000/min', scopes: ['read:campaigns', 'read:metrics', 'read:reports', 'write:campaigns'] },
    { id: 2, name: 'Staging API Key', prefix: 'imh_stg_', key: '••••••••••••••••efgh5678', created: '2025-08-15', lastUsed: '3 hours ago', status: 'active', requests: 8420, rateLimit: '500/min', scopes: ['read:campaigns', 'read:metrics'] },
    { id: 3, name: 'Webhook Secret', prefix: 'imh_whk_', key: '••••••••••••••••ijkl9012', created: '2025-10-01', lastUsed: '1 day ago', status: 'active', requests: 2150, rateLimit: '100/min', scopes: ['webhooks'] },
    { id: 4, name: 'Legacy Integration Key', prefix: 'imh_leg_', key: '••••••••••••••••mnop3456', created: '2025-03-01', lastUsed: '30 days ago', status: 'inactive', requests: 0, rateLimit: '500/min', scopes: ['read:campaigns'] },
];

const SCOPES = [
    { scope: 'read:campaigns', desc: 'Read campaign data and configurations' },
    { scope: 'write:campaigns', desc: 'Create and modify campaigns' },
    { scope: 'read:metrics', desc: 'Access performance metrics and analytics' },
    { scope: 'write:metrics', desc: 'Push metrics data via API' },
    { scope: 'read:reports', desc: 'Generate and download reports' },
    { scope: 'read:users', desc: 'Access user information' },
    { scope: 'write:users', desc: 'Create and manage users via API' },
    { scope: 'read:brands', desc: 'Access brand information' },
    { scope: 'write:brands', desc: 'Create and modify brands' },
    { scope: 'webhooks', desc: 'Receive webhook events' },
    { scope: 'admin', desc: 'Full administrative access (use with caution)' },
];

export default function ApiKeysPage() {
    const [copied, setCopied] = useState<number | null>(null);
    const [showCreate, setShowCreate] = useState(false);

    const handleCopy = (id: number) => {
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                icon={Key}
                category="Platform"
                title="API Keys"
                description="Manage API keys for platform integrations, webhooks, and third-party connections. All keys are encrypted at rest."
                actions={
                    <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 px-6 py-2 bg-[#0D9488] text-white rounded-xl font-bold text-xs hover:bg-[#0F766E] transition-all shadow-lg shadow-teal-500/20">
                        <Plus className="h-4 w-4" /> GENERATE NEW KEY
                    </button>
                }
            />

            {/* Create form */}
            {showCreate && (
                <div className="p-6 rounded-2xl border border-[#0D9488]/20 bg-[#0D9488]/5 space-y-4">
                    <h3 className="font-bold text-white">Generate New API Key</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-white/60">Key Name</label>
                            <input placeholder="e.g., Production API" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#0D9488]/50 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-white/60">Rate Limit</label>
                            <select className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#0D9488]/50 transition-all">
                                <option value="100" className="bg-[#161616]">100 requests/min</option>
                                <option value="500" className="bg-[#161616]">500 requests/min</option>
                                <option value="1000" className="bg-[#161616]">1,000 requests/min</option>
                                <option value="5000" className="bg-[#161616]">5,000 requests/min</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-white/60">Scopes</label>
                        <div className="grid grid-cols-3 gap-2">
                            {SCOPES.map(s => (
                                <label key={s.scope} className="flex items-center gap-2 p-2 rounded-lg border border-white/5 hover:border-white/10 cursor-pointer">
                                    <input type="checkbox" className="rounded border-white/20" />
                                    <div>
                                        <span className="text-xs font-mono text-white/70">{s.scope}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-6 py-2 bg-[#0D9488] text-white rounded-xl font-bold text-xs">Generate Key</button>
                        <button onClick={() => setShowCreate(false)} className="px-6 py-2 bg-white/5 text-white/60 rounded-xl font-bold text-xs">Cancel</button>
                    </div>
                </div>
            )}

            {/* Keys List */}
            <div className="space-y-4">
                {API_KEYS.map(k => (
                    <div key={k.id} className={`p-6 rounded-2xl border ${k.status === 'active' ? 'border-white/10' : 'border-white/5 opacity-60'} bg-[rgba(22,32,50,0.5)] backdrop-blur-xl`}>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-white">{k.name}</h3>
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${k.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/30'}`}>{k.status}</span>
                                </div>
                                <p className="text-[10px] text-white/30 mt-1">Created: {k.created} · Last used: {k.lastUsed}</p>
                            </div>
                            <div className="flex gap-1">
                                <button className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition-colors"><RefreshCw className="h-3.5 w-3.5" /></button>
                                <button className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-white/[0.03] border border-white/5">
                            <code className="flex-1 text-xs font-mono text-white/50">{k.prefix}{k.key}</code>
                            <button onClick={() => handleCopy(k.id)} className="p-1 text-white/30 hover:text-white transition-colors">
                                {copied === k.id ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                            </button>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] text-white/30">
                            <span>Rate: {k.rateLimit}</span>
                            <span>Requests: {k.requests.toLocaleString()}</span>
                            <span>Scopes: {k.scopes.join(', ')}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
