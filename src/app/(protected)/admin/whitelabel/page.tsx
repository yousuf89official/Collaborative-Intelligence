'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Building2, Plus, Check, Copy, Globe, Palette, Users, Shield, Settings } from 'lucide-react';

const WHITELABEL_CLIENTS = [
    { id: 1, agency: 'Pinnacle Media Group', domain: 'analytics.pinnaclemedia.com', status: 'active', plan: 'Enterprise', users: 24, brands: 12, mrr: 2499, created: '2025-08-15' },
    { id: 2, agency: 'Asia Digital Hub', domain: 'platform.asiadigitalhub.co', status: 'active', plan: 'Professional', users: 8, brands: 5, mrr: 999, created: '2025-10-01' },
    { id: 3, agency: 'MediaFirst Agency', domain: 'dash.mediafirst.agency', status: 'pending', plan: 'Professional', users: 0, brands: 0, mrr: 799, created: '2026-02-20' },
    { id: 4, agency: 'GlobalReach Partners', domain: 'intel.globalreach.io', status: 'active', plan: 'Enterprise', users: 32, brands: 18, mrr: 3499, created: '2025-06-01' },
];

const WHITELABEL_PLANS = [
    {
        name: 'Professional WL',
        price: '$799/mo',
        margin: '40-60%',
        features: ['Custom domain & SSL', 'Logo & brand colors', 'Up to 10 brands', 'Up to 15 users', 'Email support', 'Basic API access', 'Standard analytics'],
    },
    {
        name: 'Enterprise WL',
        price: '$2,499/mo',
        margin: '60-80%',
        highlighted: true,
        features: ['Everything in Professional', 'Unlimited brands & users', 'Full API access & webhooks', 'Custom email templates', 'SSO / SAML integration', 'Dedicated account manager', 'Priority SLA (99.9%)', 'White-label mobile app', 'Custom feature development'],
    },
    {
        name: 'Custom WL',
        price: 'Custom',
        margin: 'Negotiable',
        features: ['Everything in Enterprise', 'Dedicated infrastructure', 'On-premise deployment option', 'Custom SLA (99.99%)', 'Source code escrow', 'Training & onboarding', '24/7 premium support', 'Revenue share model'],
    },
];

const REFERRAL_TIERS = [
    { tier: 'Bronze', minReferrals: 1, maxReferrals: 5, commission: '15%', type: 'Recurring', cookie: '30 days' },
    { tier: 'Silver', minReferrals: 6, maxReferrals: 15, commission: '20%', type: 'Recurring', cookie: '60 days' },
    { tier: 'Gold', minReferrals: 16, maxReferrals: 50, commission: '25%', type: 'Recurring', cookie: '90 days' },
    { tier: 'Platinum', minReferrals: 51, maxReferrals: null, commission: '30%', type: 'Recurring + Bonus', cookie: '180 days' },
];

export default function WhitelabelPage() {
    const [activeTab, setActiveTab] = useState<'clients' | 'plans' | 'referrals' | 'setup'>('clients');
    const [copied, setCopied] = useState(false);

    const totalMrr = WHITELABEL_CLIENTS.reduce((s, c) => s + c.mrr, 0);
    const activeClients = WHITELABEL_CLIENTS.filter(c => c.status === 'active').length;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                icon={Building2}
                category="Growth & Revenue"
                title="Whitelabel System"
                description="Enable agencies to whitelabel the platform under their brand. Manage clients, pricing, and referral income."
                actions={
                    <button className="flex items-center gap-2 px-6 py-2 bg-[#0D9488] text-white rounded-xl font-bold text-xs hover:bg-[#0F766E] transition-all shadow-lg shadow-teal-500/20">
                        <Plus className="h-4 w-4" /> NEW WHITELABEL CLIENT
                    </button>
                }
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Active WL Clients', value: activeClients, sub: `of ${WHITELABEL_CLIENTS.length} total` },
                    { label: 'Total WL MRR', value: `$${totalMrr.toLocaleString()}`, sub: 'monthly recurring' },
                    { label: 'Total WL Users', value: WHITELABEL_CLIENTS.reduce((s, c) => s + c.users, 0), sub: 'across all clients' },
                    { label: 'Avg. Margin', value: '55%', sub: 'on whitelabel plans' },
                ].map(card => (
                    <div key={card.label} className="p-5 rounded-xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{card.label}</p>
                        <p className="text-2xl font-bold text-white">{card.value}</p>
                        <p className="text-[10px] text-white/40 mt-1">{card.sub}</p>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/10">
                {[
                    { id: 'clients', label: 'Clients' },
                    { id: 'plans', label: 'Plans & Pricing' },
                    { id: 'referrals', label: 'Referral Program' },
                    { id: 'setup', label: 'Setup Guide' },
                ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === tab.id ? 'border-[#0D9488] text-[#0D9488]' : 'border-transparent text-white/40'}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'clients' && (
                <div className="p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                    <table className="w-full">
                        <thead>
                            <tr className="text-[10px] text-white/30 uppercase tracking-wider border-b border-white/5">
                                <th className="text-left py-3 px-4">Agency</th>
                                <th className="text-left py-3 px-4">Domain</th>
                                <th className="text-left py-3 px-4">Plan</th>
                                <th className="text-center py-3 px-4">Users</th>
                                <th className="text-center py-3 px-4">Brands</th>
                                <th className="text-right py-3 px-4">MRR</th>
                                <th className="text-center py-3 px-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {WHITELABEL_CLIENTS.map(c => (
                                <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                                    <td className="py-3 px-4">
                                        <p className="text-sm font-medium text-white">{c.agency}</p>
                                        <p className="text-[10px] text-white/30">Since {c.created}</p>
                                    </td>
                                    <td className="py-3 px-4 text-xs text-[#0D9488] font-mono">{c.domain}</td>
                                    <td className="py-3 px-4 text-xs text-white/60">{c.plan}</td>
                                    <td className="text-center py-3 px-4 text-xs text-white/60">{c.users}</td>
                                    <td className="text-center py-3 px-4 text-xs text-white/60">{c.brands}</td>
                                    <td className="text-right py-3 px-4 text-sm font-bold text-white">${c.mrr.toLocaleString()}</td>
                                    <td className="text-center py-3 px-4">
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${c.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{c.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'plans' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {WHITELABEL_PLANS.map(plan => (
                        <div key={plan.name} className={`p-8 rounded-2xl ${plan.highlighted ? 'bg-gradient-to-b from-[#0D9488]/10 to-[#4F46E5]/5 border-2 border-[#0D9488]/30' : 'border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl'}`}>
                            {plan.highlighted && <div className="text-[10px] font-bold text-[#0D9488] uppercase tracking-wider mb-2">Most Popular</div>}
                            <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                            <p className="text-3xl font-bold text-white mb-1">{plan.price}</p>
                            <p className="text-[10px] text-white/30 mb-6">Reseller margin: {plan.margin}</p>
                            <ul className="space-y-2.5">
                                {plan.features.map(f => (
                                    <li key={f} className="flex items-start gap-2 text-xs text-white/60">
                                        <Check className="h-3.5 w-3.5 text-[#0D9488] shrink-0 mt-0.5" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'referrals' && (
                <div className="space-y-6">
                    <div className="p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                        <h3 className="font-bold text-white mb-4">Referral Commission Tiers</h3>
                        <p className="text-xs text-white/40 mb-6">Earn recurring commissions for every customer you refer. Commission is calculated on the referred customer&apos;s monthly subscription and paid out monthly.</p>
                        <table className="w-full">
                            <thead>
                                <tr className="text-[10px] text-white/30 uppercase tracking-wider border-b border-white/5">
                                    <th className="text-left py-3 px-4">Tier</th>
                                    <th className="text-center py-3 px-4">Referrals Required</th>
                                    <th className="text-center py-3 px-4">Commission</th>
                                    <th className="text-center py-3 px-4">Type</th>
                                    <th className="text-center py-3 px-4">Cookie Window</th>
                                </tr>
                            </thead>
                            <tbody>
                                {REFERRAL_TIERS.map(t => (
                                    <tr key={t.tier} className="border-b border-white/5">
                                        <td className="py-3 px-4 text-sm font-bold text-white">{t.tier}</td>
                                        <td className="text-center py-3 px-4 text-xs text-white/60">{t.minReferrals} - {t.maxReferrals || '∞'}</td>
                                        <td className="text-center py-3 px-4 text-sm font-bold text-[#0D9488]">{t.commission}</td>
                                        <td className="text-center py-3 px-4 text-xs text-white/60">{t.type}</td>
                                        <td className="text-center py-3 px-4 text-xs text-white/60">{t.cookie}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-6 rounded-2xl border border-[#0D9488]/20 bg-[#0D9488]/5">
                        <h3 className="font-bold text-white mb-2">Your Referral Link</h3>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 px-4 py-2.5 bg-white/5 rounded-lg text-xs text-white/60 font-mono border border-white/10">https://collaborativeintelligence.com/?ref=YOUR_CODE</code>
                            <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="px-4 py-2.5 bg-[#0D9488] text-white rounded-lg text-xs font-bold">
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'setup' && (
                <div className="space-y-6 max-w-3xl">
                    {[
                        { step: '1', icon: Globe, title: 'Configure Custom Domain', desc: 'Point your agency domain to our platform via CNAME record. SSL is automatically provisioned.' },
                        { step: '2', icon: Palette, title: 'Brand Customization', desc: 'Upload your logo, set brand colors, custom email templates, and login page styling.' },
                        { step: '3', icon: Users, title: 'Invite Team & Clients', desc: 'Create user accounts for your team and set up client workspaces with appropriate access levels.' },
                        { step: '4', icon: Shield, title: 'Security Setup', desc: 'Configure SSO/SAML, IP whitelisting, and data retention policies for your organization.' },
                        { step: '5', icon: Settings, title: 'Feature Configuration', desc: 'Enable/disable platform features per client. Set usage limits and billing thresholds.' },
                    ].map(s => (
                        <div key={s.step} className="flex gap-4 p-6 rounded-xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl hover:border-[#0D9488]/20 transition-all">
                            <div className="w-10 h-10 shrink-0 rounded-lg bg-gradient-to-br from-[#0D9488] to-[#4F46E5] flex items-center justify-center text-white font-bold text-sm">{s.step}</div>
                            <div>
                                <h4 className="font-bold text-white mb-1 flex items-center gap-2"><s.icon className="h-4 w-4 text-[#0D9488]" /> {s.title}</h4>
                                <p className="text-xs text-white/40">{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
