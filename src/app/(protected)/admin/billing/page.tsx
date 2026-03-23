'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { CreditCard, TrendingUp, DollarSign, Users, ArrowUpRight, Download, Loader2, RefreshCw, Link2, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice, detectRegion } from '@/lib/region';

interface SubscriptionData {
    id: string;
    status: string;
    billingCycle: string;
    region: string;
    currency: string;
    amountPaid: number;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    createdAt: string;
}

interface PlanData {
    id: string;
    slug: string;
    name: string;
    description: string;
    quotas: Record<string, number>;
}

interface ReferralData {
    code: string;
    clicks: number;
    stats: {
        totalReferrals: number;
        activeReferrals: number;
        totalEarnings: number;
        pendingEarnings: number;
        paidEarnings: number;
        baseCommissionRate: number;
        totalBoost: number;
        effectiveRate: number;
    };
    referrals: any[];
    milestones: any[];
    nextMilestone: any;
}

export default function BillingPage() {
    const [activeTab, setActiveTab] = useState<'overview' | 'subscription' | 'referrals' | 'plans'>('overview');
    const [loading, setLoading] = useState(true);
    const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
    const [plan, setPlan] = useState<PlanData | null>(null);
    const [referral, setReferral] = useState<ReferralData | null>(null);
    const [plans, setPlans] = useState<any[]>([]);
    const [allSubscriptions, setAllSubscriptions] = useState<any[]>([]);
    const [upgrading, setUpgrading] = useState<string | null>(null);
    const [billingToggle, setBillingToggle] = useState<'monthly' | 'yearly'>('yearly');
    const region = detectRegion();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [subRes, refRes, plansRes, allSubsRes] = await Promise.allSettled([
                fetch('/api/subscriptions'),
                fetch('/api/referrals'),
                fetch(`/api/plans?region=${region.region}`),
                fetch('/api/users'), // admin: list all users with subscription info
            ]);

            if (subRes.status === 'fulfilled' && subRes.value.ok) {
                const data = await subRes.value.json();
                setSubscription(data.subscription);
                setPlan(data.plan);
            }
            if (refRes.status === 'fulfilled' && refRes.value.ok) {
                setReferral(await refRes.value.json());
            }
            if (plansRes.status === 'fulfilled' && plansRes.value.ok) {
                setPlans(await plansRes.value.json());
            }
        } catch {
            toast.error('Failed to load billing data');
        } finally {
            setLoading(false);
        }
    }, [region.region]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleUpgrade = async (planSlug: string) => {
        if (planSlug === 'free' || planSlug === 'enterprise') return;
        setUpgrading(planSlug);
        try {
            const res = await fetch('/api/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    planSlug,
                    billingCycle: billingToggle,
                    region: region.region,
                    paymentProvider: 'google_pay',
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error || 'Failed to process upgrade');
                return;
            }
            toast.success('Plan upgraded successfully!');
            fetchData();
        } catch (err) {
            toast.error('Payment error. Please try again.');
        } finally {
            setUpgrading(null);
        }
    };

    const copyReferralLink = () => {
        if (!referral) return;
        const url = `${window.location.origin}/register/${referral.code}`;
        navigator.clipboard.writeText(url);
        toast.success('Referral link copied!');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="h-8 w-8 animate-spin text-[#0D9488]" />
            </div>
        );
    }

    const currentPlan = plan?.slug || 'free';
    const quotas = plan?.quotas || {};
    const stats = referral?.stats;
    const currency = subscription?.currency || region.currency;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                icon={CreditCard}
                category="Growth & Revenue"
                title="Billing & Referrals"
                description="Manage your subscription, track referral earnings, and explore available plans."
                actions={
                    <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-xs hover:bg-white/10 transition-all">
                        <RefreshCw className="h-4 w-4" /> REFRESH
                    </button>
                }
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-5 rounded-xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-2">
                        <CreditCard className="h-4 w-4 text-white/30" />
                        <span className="text-[10px] font-bold text-[#0D9488] uppercase">{currentPlan}</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{plan?.name || 'Free'}</p>
                    <p className="text-[10px] text-white/40 mt-1">Current Plan</p>
                </div>
                <div className="p-5 rounded-xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-2">
                        <DollarSign className="h-4 w-4 text-white/30" />
                    </div>
                    <p className="text-2xl font-bold text-white">
                        {subscription?.amountPaid ? formatPrice(subscription.amountPaid, currency) : 'Free'}
                    </p>
                    <p className="text-[10px] text-white/40 mt-1">{subscription?.billingCycle === 'yearly' ? 'Per Month (Yearly)' : 'Per Month'}</p>
                </div>
                <div className="p-5 rounded-xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-2">
                        <Users className="h-4 w-4 text-white/30" />
                        {stats && stats.activeReferrals > 0 && <span className="text-[10px] font-bold text-green-400 flex items-center gap-0.5"><ArrowUpRight className="h-3 w-3" />{stats.activeReferrals} active</span>}
                    </div>
                    <p className="text-2xl font-bold text-white">{stats?.totalReferrals || 0}</p>
                    <p className="text-[10px] text-white/40 mt-1">Total Referrals</p>
                </div>
                <div className="p-5 rounded-xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="h-4 w-4 text-white/30" />
                    </div>
                    <p className="text-2xl font-bold text-white">
                        {stats ? `${(stats.effectiveRate * 100).toFixed(0)}%` : '10%'}
                    </p>
                    <p className="text-[10px] text-white/40 mt-1">Commission Rate</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/10 overflow-x-auto">
                {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'subscription', label: 'My Subscription' },
                    { id: 'referrals', label: 'Referral Program' },
                    { id: 'plans', label: 'Available Plans' },
                ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-[#0D9488] text-[#0D9488]' : 'border-transparent text-white/40'}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Quota Usage */}
                    <div className="p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                        <h3 className="font-bold text-white mb-4">Quota Usage</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Brands', quota: quotas.brands, icon: '🏢' },
                                { label: 'Campaigns/Brand', quota: quotas.campaignsPerBrand, icon: '📊' },
                                { label: 'Team Members', quota: quotas.users, icon: '👥' },
                                { label: 'Integrations', quota: quotas.integrations, icon: '🔗' },
                                { label: 'AI Queries/Month', quota: quotas.aiQueriesPerMonth, icon: '🤖' },
                                { label: 'API Calls/Day', quota: quotas.apiCallsPerDay, icon: '⚡' },
                            ].map(q => (
                                <div key={q.label} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/5">
                                    <span className="text-xs text-white/60">{q.icon} {q.label}</span>
                                    <span className="text-sm font-bold text-white">{q.quota === -1 ? 'Unlimited' : q.quota?.toLocaleString() || '—'}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Referral Summary */}
                    <div className="p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                        <h3 className="font-bold text-white mb-4">Referral Earnings</h3>
                        {referral ? (
                            <div className="space-y-4">
                                {/* Referral link */}
                                <div className="p-3 rounded-lg bg-[#0D9488]/5 border border-[#0D9488]/10">
                                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Your Referral Code</p>
                                    <div className="flex items-center gap-2">
                                        <code className="text-sm font-bold text-[#0D9488] flex-1">{referral.code}</code>
                                        <button onClick={copyReferralLink} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                                            <Copy className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-white/30 mt-1">{referral.clicks} link clicks</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
                                        <p className="text-[10px] text-white/40">Total Earned</p>
                                        <p className="text-lg font-bold text-green-400">{formatPrice(stats?.totalEarnings || 0, currency)}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
                                        <p className="text-[10px] text-white/40">Pending</p>
                                        <p className="text-lg font-bold text-amber-400">{formatPrice(stats?.pendingEarnings || 0, currency)}</p>
                                    </div>
                                </div>

                                {/* Next milestone */}
                                {referral.nextMilestone && (
                                    <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
                                        <p className="text-[10px] text-white/40 uppercase mb-1">Next Milestone</p>
                                        <p className="text-xs font-bold text-white">{referral.nextMilestone.label}</p>
                                        <div className="mt-2 h-2 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-[#0D9488] to-[#0EA5E9] rounded-full transition-all" style={{ width: `${Math.min(100, (stats?.activeReferrals || 0) / referral.nextMilestone.threshold * 100)}%` }} />
                                        </div>
                                        <p className="text-[10px] text-white/30 mt-1">{stats?.activeReferrals || 0} / {referral.nextMilestone.threshold} referrals</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-white/40">No referral data available</p>
                        )}
                    </div>
                </div>
            )}

            {/* Subscription Tab */}
            {activeTab === 'subscription' && (
                <div className="p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                    <h3 className="font-bold text-white mb-6">Subscription Details</h3>
                    {subscription ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { label: 'Plan', value: plan?.name || 'Free' },
                                { label: 'Status', value: subscription.status },
                                { label: 'Billing Cycle', value: subscription.billingCycle },
                                { label: 'Amount', value: formatPrice(subscription.amountPaid, subscription.currency) },
                                { label: 'Region', value: subscription.region },
                                { label: 'Currency', value: subscription.currency },
                                { label: 'Period Start', value: subscription.currentPeriodStart ? new Date(subscription.currentPeriodStart).toLocaleDateString() : '—' },
                                { label: 'Period End', value: subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : '—' },
                            ].map(item => (
                                <div key={item.label} className="p-4 rounded-lg bg-white/[0.03] border border-white/5">
                                    <p className="text-[10px] text-white/40 uppercase tracking-wider">{item.label}</p>
                                    <p className="text-sm font-bold text-white mt-1 capitalize">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <CreditCard className="h-12 w-12 text-white/10 mx-auto mb-3" />
                            <p className="text-sm text-white/40">You&apos;re on the Free plan</p>
                            <p className="text-xs text-white/20 mt-1">Upgrade to unlock higher quotas</p>
                            <button onClick={() => setActiveTab('plans')} className="mt-4 px-6 py-2 bg-[#0D9488] text-white rounded-xl text-xs font-bold hover:bg-[#0F766E] transition-all shadow-lg shadow-teal-500/20">
                                View Plans
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Referrals Tab */}
            {activeTab === 'referrals' && referral && (
                <div className="space-y-6">
                    {/* Referral link card */}
                    <div className="p-6 rounded-2xl border border-[#0D9488]/20 bg-[#0D9488]/5 backdrop-blur-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex-1">
                                <h3 className="font-bold text-white mb-1">Share your referral link</h3>
                                <p className="text-xs text-white/40">Earn {(stats?.effectiveRate || 0.10) * 100}% recurring commission on every referral</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <code className="px-3 py-2 rounded-lg bg-black/20 text-[#0D9488] text-xs font-mono">{referral.code}</code>
                                <button onClick={copyReferralLink} className="px-4 py-2 bg-[#0D9488] text-white rounded-lg text-xs font-bold hover:bg-[#0F766E] transition-all flex items-center gap-1">
                                    <Copy className="h-3.5 w-3.5" /> Copy Link
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Milestone progress */}
                    <div className="p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                        <h3 className="font-bold text-white mb-4">Milestone Accelerators</h3>
                        <div className="space-y-3">
                            {[
                                { key: 'first_referral', threshold: 1, bonus: '$50', boost: '—', label: 'First Referral' },
                                { key: 'five_referrals', threshold: 5, bonus: '$200', boost: '+2%', label: '5 Active Referrals' },
                                { key: 'ten_referrals', threshold: 10, bonus: '$500 + Plan Upgrade', boost: '+3%', label: '10 Active Referrals' },
                                { key: 'twenty_five', threshold: 25, bonus: '$1,000', boost: '+5%', label: '25 Referrals — Ambassador' },
                                { key: 'fifty', threshold: 50, bonus: '$2,500', boost: '+5%', label: '50 Referrals — Custom Landing Page' },
                                { key: 'hundred', threshold: 100, bonus: '$5,000', boost: '+5%', label: '100 Referrals — Partner Status' },
                            ].map(m => {
                                const claimed = referral.milestones.some((cm: any) => cm.milestone === m.key);
                                const progress = Math.min(100, ((stats?.activeReferrals || 0) / m.threshold) * 100);
                                return (
                                    <div key={m.key} className={`p-4 rounded-lg border ${claimed ? 'border-green-500/20 bg-green-500/5' : 'border-white/5 bg-white/[0.03]'}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`text-xs font-bold ${claimed ? 'text-green-400' : 'text-white'}`}>{m.label}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] text-white/40">Bonus: {m.bonus}</span>
                                                {m.boost !== '—' && <span className="text-[10px] text-[#0D9488] font-bold">{m.boost} commission</span>}
                                            </div>
                                        </div>
                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full transition-all ${claimed ? 'bg-green-500' : 'bg-gradient-to-r from-[#0D9488] to-[#0EA5E9]'}`} style={{ width: `${claimed ? 100 : progress}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Referral list */}
                    {referral.referrals.length > 0 && (
                        <div className="p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                            <h3 className="font-bold text-white mb-4">Your Referrals</h3>
                            <table className="w-full">
                                <thead>
                                    <tr className="text-[10px] text-white/30 uppercase tracking-wider border-b border-white/5">
                                        <th className="text-left py-3 px-4">User</th>
                                        <th className="text-center py-3 px-4">Status</th>
                                        <th className="text-right py-3 px-4">Commission</th>
                                        <th className="text-left py-3 px-4">Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {referral.referrals.map((r: any) => (
                                        <tr key={r.id} className="border-b border-white/5">
                                            <td className="py-3 px-4">
                                                <p className="text-sm font-medium text-white">{r.user?.name || 'Unknown'}</p>
                                                <p className="text-[10px] text-white/30">{r.user?.email}</p>
                                            </td>
                                            <td className="text-center py-3 px-4">
                                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${r.status === 'active' ? 'bg-green-500/10 text-green-400' : r.status === 'pending' ? 'bg-amber-500/10 text-amber-400' : 'bg-white/5 text-white/30'}`}>{r.status}</span>
                                            </td>
                                            <td className="text-right py-3 px-4 text-sm font-bold text-white">{formatPrice(r.totalCommission || 0, currency)}</td>
                                            <td className="py-3 px-4 text-xs text-white/40">{new Date(r.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Plans Tab */}
            {activeTab === 'plans' && (
                <div className="space-y-6">
                    {/* Billing toggle */}
                    <div className="flex items-center justify-center gap-4">
                        <span className={`text-sm font-medium ${billingToggle === 'monthly' ? 'text-white' : 'text-white/40'}`}>Monthly</span>
                        <button onClick={() => setBillingToggle(billingToggle === 'monthly' ? 'yearly' : 'monthly')}
                            className={`relative w-14 h-7 rounded-full transition-colors ${billingToggle === 'yearly' ? 'bg-[#0D9488]' : 'bg-white/20'}`}>
                            <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${billingToggle === 'yearly' ? 'translate-x-7' : 'translate-x-0.5'}`} />
                        </button>
                        <span className={`text-sm font-medium ${billingToggle === 'yearly' ? 'text-white' : 'text-white/40'}`}>
                            Yearly <span className="text-[#0D9488] text-xs font-bold ml-1">Save 35%</span>
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {plans.map((p: any) => {
                            const isCurrent = p.slug === currentPlan;
                            const isEnterprise = p.slug === 'enterprise';
                            const isFree = p.slug === 'free';
                            const isUpgrading = upgrading === p.slug;
                            const price = p.pricing;
                            const displayPrice = price ? (billingToggle === 'yearly' ? price.yearly : price.monthly) : 0;

                            return (
                                <div key={p.id} className={`p-5 rounded-2xl border backdrop-blur-xl transition-all ${isCurrent ? 'border-[#0D9488]/30 bg-[#0D9488]/5' : 'border-white/[0.06] bg-[rgba(22,32,50,0.5)] hover:border-white/10'}`}>
                                    {isCurrent && <span className="text-[10px] font-bold text-[#0D9488] uppercase tracking-wider">Current Plan</span>}
                                    <h3 className="text-lg font-bold text-white mt-1">{p.name}</h3>
                                    <p className="text-xs text-white/40 mt-1 mb-4">{p.description}</p>
                                    <div className="mb-4">
                                        {isFree ? (
                                            <span className="text-2xl font-bold text-white">Free</span>
                                        ) : isEnterprise ? (
                                            <span className="text-2xl font-bold text-white">Custom</span>
                                        ) : price ? (
                                            <>
                                                <span className="text-2xl font-bold text-white">{formatPrice(displayPrice, price.currency)}</span>
                                                <span className="text-xs text-white/40">/mo</span>
                                                {billingToggle === 'yearly' && (
                                                    <p className="text-[10px] text-white/30 mt-0.5 line-through">{formatPrice(price.monthly, price.currency)}/mo</p>
                                                )}
                                            </>
                                        ) : (
                                            <span className="text-2xl font-bold text-white">—</span>
                                        )}
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        {[
                                            { k: 'brands', l: 'Brands' },
                                            { k: 'campaignsPerBrand', l: 'Campaigns/brand' },
                                            { k: 'users', l: 'Team members' },
                                            { k: 'integrations', l: 'Integrations' },
                                            { k: 'aiQueriesPerMonth', l: 'AI queries/mo' },
                                        ].map(q => (
                                            <div key={q.k} className="flex justify-between text-xs">
                                                <span className="text-white/40">{q.l}</span>
                                                <span className="font-bold text-white">{p.quotas[q.k] === -1 ? '∞' : p.quotas[q.k]}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {!isCurrent && (
                                        <button
                                            onClick={() => {
                                                if (isEnterprise) window.location.href = '/contact';
                                                else if (!isFree) handleUpgrade(p.slug);
                                            }}
                                            disabled={isUpgrading || isFree}
                                            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${isEnterprise ? 'bg-white/5 text-white border border-white/10 hover:bg-white/10' : isFree ? 'bg-white/5 text-white/30 cursor-not-allowed' : 'bg-[#0D9488] text-white hover:bg-[#0F766E] shadow-lg shadow-teal-500/20'}`}
                                        >
                                            {isUpgrading ? (
                                                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Processing...</>
                                            ) : isEnterprise ? 'Contact Sales' : isFree ? 'Current Tier' : (
                                                <><CreditCard className="h-3.5 w-3.5" /> Upgrade Now</>
                                            )}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="text-center">
                        <p className="text-[10px] text-white/20">Payments processed securely via Google Pay. All plans include 100% feature access.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
