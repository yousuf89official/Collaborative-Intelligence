'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { CreditCard, TrendingUp, DollarSign, Users, ArrowUpRight, Download, Calendar } from 'lucide-react';

const REVENUE_DATA = {
    mrr: 12497,
    arr: 149964,
    mrrGrowth: '+18.3%',
    activeSubscriptions: 47,
    churnRate: '2.1%',
    arpu: 265.89,
    ltv: 3190.68,
    referralIncome: 2845,
};

const SUBSCRIPTIONS = [
    { client: 'Global Brands Inc.', plan: 'Enterprise', mrr: 499, status: 'active', since: '2025-03-15', nextBilling: '2026-04-15' },
    { client: 'Pinnacle Agency', plan: 'Enterprise WL', mrr: 2499, status: 'active', since: '2025-08-01', nextBilling: '2026-04-01' },
    { client: 'FreshWave Consumer', plan: 'Professional', mrr: 199, status: 'active', since: '2025-10-20', nextBilling: '2026-04-20' },
    { client: 'Asia Digital Hub', plan: 'Professional WL', mrr: 999, status: 'active', since: '2025-10-01', nextBilling: '2026-04-01' },
    { client: 'MediaFirst Agency', plan: 'Professional WL', mrr: 799, status: 'trial', since: '2026-02-20', nextBilling: '2026-03-20' },
    { client: 'GlobalReach Partners', plan: 'Enterprise WL', mrr: 3499, status: 'active', since: '2025-06-01', nextBilling: '2026-04-01' },
];

const REFERRAL_EARNINGS = [
    { month: 'Oct 2025', referrals: 3, commission: '$234', status: 'paid' },
    { month: 'Nov 2025', referrals: 5, commission: '$412', status: 'paid' },
    { month: 'Dec 2025', referrals: 4, commission: '$389', status: 'paid' },
    { month: 'Jan 2026', referrals: 7, commission: '$623', status: 'paid' },
    { month: 'Feb 2026', referrals: 8, commission: '$745', status: 'paid' },
    { month: 'Mar 2026', referrals: 5, commission: '$442', status: 'pending' },
];

const COST_STRUCTURE = [
    { item: 'Infrastructure (Cloud)', monthly: 2800, pct: 22.4 },
    { item: 'API Costs (Ad Platforms)', monthly: 1200, pct: 9.6 },
    { item: 'AI/ML Processing', monthly: 850, pct: 6.8 },
    { item: 'Support & Success', monthly: 3200, pct: 25.6 },
    { item: 'Development Team', monthly: 4000, pct: 32.0 },
    { item: 'Marketing & Sales', monthly: 450, pct: 3.6 },
];

export default function BillingPage() {
    const [activeTab, setActiveTab] = useState<'overview' | 'subscriptions' | 'referrals' | 'costs'>('overview');

    const totalCosts = COST_STRUCTURE.reduce((s, c) => s + c.monthly, 0);
    const grossMargin = ((REVENUE_DATA.mrr - totalCosts) / REVENUE_DATA.mrr * 100).toFixed(1);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                icon={CreditCard}
                category="Growth & Revenue"
                title="Billing & Referrals"
                description="Revenue tracking, subscription management, referral income, and cost structure analysis."
                actions={
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-xs hover:bg-white/10 transition-all">
                        <Download className="h-4 w-4" /> EXPORT REPORT
                    </button>
                }
            />

            {/* Revenue Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Monthly Recurring Revenue', value: `$${REVENUE_DATA.mrr.toLocaleString()}`, change: REVENUE_DATA.mrrGrowth, icon: DollarSign },
                    { label: 'Annual Run Rate', value: `$${REVENUE_DATA.arr.toLocaleString()}`, change: '+18.3%', icon: TrendingUp },
                    { label: 'Active Subscriptions', value: REVENUE_DATA.activeSubscriptions, change: '+5 this month', icon: Users },
                    { label: 'Gross Margin', value: `${grossMargin}%`, change: `ARPU: $${REVENUE_DATA.arpu}`, icon: CreditCard },
                ].map(card => (
                    <div key={card.label} className="p-5 rounded-xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-2">
                            <card.icon className="h-4 w-4 text-white/30" />
                            <span className="text-[10px] font-bold text-green-400 flex items-center gap-0.5"><ArrowUpRight className="h-3 w-3" />{card.change}</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{card.value}</p>
                        <p className="text-[10px] text-white/40 mt-1">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/10">
                {[
                    { id: 'overview', label: 'Revenue Overview' },
                    { id: 'subscriptions', label: 'Subscriptions' },
                    { id: 'referrals', label: 'Referral Earnings' },
                    { id: 'costs', label: 'Cost Structure' },
                ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === tab.id ? 'border-[#0D9488] text-[#0D9488]' : 'border-transparent text-white/40'}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'overview' && (
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 lg:col-span-8 p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                        <h3 className="font-bold text-white mb-4">Key Financial Metrics</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'MRR', value: `$${REVENUE_DATA.mrr.toLocaleString()}` },
                                { label: 'ARR', value: `$${REVENUE_DATA.arr.toLocaleString()}` },
                                { label: 'ARPU', value: `$${REVENUE_DATA.arpu}` },
                                { label: 'LTV', value: `$${REVENUE_DATA.ltv.toLocaleString()}` },
                                { label: 'Churn Rate', value: REVENUE_DATA.churnRate },
                                { label: 'Referral Income', value: `$${REVENUE_DATA.referralIncome.toLocaleString()}` },
                                { label: 'Total Costs', value: `$${totalCosts.toLocaleString()}` },
                                { label: 'Net Profit', value: `$${(REVENUE_DATA.mrr - totalCosts).toLocaleString()}` },
                            ].map(m => (
                                <div key={m.label} className="p-4 rounded-lg bg-white/[0.03] border border-white/5">
                                    <p className="text-[10px] text-white/40 uppercase tracking-wider">{m.label}</p>
                                    <p className="text-lg font-bold text-white mt-1">{m.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-span-12 lg:col-span-4 p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                        <h3 className="font-bold text-white mb-4">Revenue Breakdown</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Direct Subscriptions', value: 5700, pct: 45.6, color: '#0D9488' },
                                { label: 'Whitelabel MRR', value: 6797, pct: 54.4, color: '#4F46E5' },
                            ].map(r => (
                                <div key={r.label}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-xs text-white/60">{r.label}</span>
                                        <span className="text-xs font-bold text-white">${r.value.toLocaleString()}</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${r.pct}%`, backgroundColor: r.color }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'subscriptions' && (
                <div className="p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                    <table className="w-full">
                        <thead>
                            <tr className="text-[10px] text-white/30 uppercase tracking-wider border-b border-white/5">
                                <th className="text-left py-3 px-4">Client</th>
                                <th className="text-left py-3 px-4">Plan</th>
                                <th className="text-right py-3 px-4">MRR</th>
                                <th className="text-center py-3 px-4">Status</th>
                                <th className="text-left py-3 px-4">Since</th>
                                <th className="text-left py-3 px-4">Next Billing</th>
                            </tr>
                        </thead>
                        <tbody>
                            {SUBSCRIPTIONS.map(s => (
                                <tr key={s.client} className="border-b border-white/5 hover:bg-white/[0.02]">
                                    <td className="py-3 px-4 text-sm font-medium text-white">{s.client}</td>
                                    <td className="py-3 px-4 text-xs text-white/60">{s.plan}</td>
                                    <td className="text-right py-3 px-4 text-sm font-bold text-white">${s.mrr.toLocaleString()}</td>
                                    <td className="text-center py-3 px-4">
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${s.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{s.status}</span>
                                    </td>
                                    <td className="py-3 px-4 text-xs text-white/40">{s.since}</td>
                                    <td className="py-3 px-4 text-xs text-white/40">{s.nextBilling}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'referrals' && (
                <div className="p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                    <h3 className="font-bold text-white mb-4">Referral Earnings History</h3>
                    <table className="w-full">
                        <thead>
                            <tr className="text-[10px] text-white/30 uppercase tracking-wider border-b border-white/5">
                                <th className="text-left py-3 px-4">Month</th>
                                <th className="text-center py-3 px-4">Referrals</th>
                                <th className="text-right py-3 px-4">Commission</th>
                                <th className="text-center py-3 px-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {REFERRAL_EARNINGS.map(r => (
                                <tr key={r.month} className="border-b border-white/5">
                                    <td className="py-3 px-4 text-sm text-white">{r.month}</td>
                                    <td className="text-center py-3 px-4 text-sm text-white/60">{r.referrals}</td>
                                    <td className="text-right py-3 px-4 text-sm font-bold text-white">{r.commission}</td>
                                    <td className="text-center py-3 px-4">
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${r.status === 'paid' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{r.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'costs' && (
                <div className="p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                    <h3 className="font-bold text-white mb-4">Monthly Cost Breakdown</h3>
                    <div className="space-y-3">
                        {COST_STRUCTURE.map(c => (
                            <div key={c.item} className="flex items-center gap-4">
                                <span className="text-sm text-white/60 w-48">{c.item}</span>
                                <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-[#0D9488] to-[#4F46E5]" style={{ width: `${c.pct}%` }} />
                                </div>
                                <span className="text-sm font-bold text-white w-20 text-right">${c.monthly.toLocaleString()}</span>
                                <span className="text-[10px] text-white/30 w-12 text-right">{c.pct}%</span>
                            </div>
                        ))}
                        <div className="pt-4 mt-4 border-t border-white/10 flex justify-between">
                            <span className="text-sm font-bold text-white">Total Monthly Costs</span>
                            <span className="text-lg font-bold text-white">${totalCosts.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
