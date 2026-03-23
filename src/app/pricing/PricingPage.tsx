'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { PublicNav } from '@/components/public/PublicNav';
import { PublicFooter } from '@/components/public/PublicFooter';
import { ChatbotWidget } from '@/components/public/ChatbotWidget';
import { detectRegion, formatPrice, ALL_REGIONS } from '@/lib/region';
import type { RegionInfo } from '@/lib/region';

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as any } },
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
};

const FAQS = [
    { q: 'Do all plans have access to every feature?', a: 'Yes! Every plan — including Free — has 100% access to every feature in the platform. The only difference is quota limits. Higher plans give you more brands, campaigns, team members, API calls, and storage.' },
    { q: 'Can I switch plans at any time?', a: 'Absolutely. You can upgrade or downgrade at any time. Upgrades take effect immediately, downgrades apply at the end of your current billing cycle.' },
    { q: 'Is there a free trial for paid plans?', a: 'Yes. All paid plans include a 14-day free trial with full access. No credit card required to start.' },
    { q: 'How does the referral program work?', a: 'Every user gets a unique referral link. When someone signs up through your link and subscribes, you earn a recurring commission (10-30% depending on your plan) for as long as they remain subscribed. Hit milestones to unlock bonus rewards and permanent commission boosts.' },
    { q: 'Why is pricing different in my country?', a: 'We use purchasing power parity (PPP) pricing so our platform is accessible globally. Prices are localized to your region and currency so you always get a fair deal.' },
];

export function PricingPage() {
    const [yearly, setYearly] = useState(true);
    const [plans, setPlans] = useState<any[]>([]);
    const [region, setRegion] = useState<RegionInfo>(detectRegion());
    const [showRegionPicker, setShowRegionPicker] = useState(false);

    useEffect(() => {
        setRegion(detectRegion());
    }, []);

    useEffect(() => {
        fetch(`/api/plans?region=${region.region}`)
            .then(r => r.ok ? r.json() : [])
            .then(setPlans)
            .catch(() => {});
    }, [region]);

    const highlightedSlug = 'growth'; // Most popular

    return (
        <div className="public-site min-h-screen">
            <PublicNav />

            {/* Hero */}
            <section className="pt-32 pb-16 relative overflow-hidden">
                <div className="absolute inset-0 dark-grid-bg opacity-30" />
                <div className="absolute inset-0 hero-glow" />
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#0D9488] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
                        Pricing
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold text-white mb-6"
                    >
                        100% Features. <span className="gradient-text">Scale Your Quota.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg text-white/50 max-w-2xl mx-auto mb-10"
                    >
                        Every plan gives you full access to every feature. No restrictions, no lock-outs. The only thing that scales is how much you can use.
                    </motion.p>

                    {/* Toggle + Region */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-4">
                            <span className={`text-sm font-medium ${!yearly ? 'text-white' : 'text-white/40'}`}>Monthly</span>
                            <button
                                onClick={() => setYearly(!yearly)}
                                className={`relative w-14 h-7 rounded-full transition-colors ${yearly ? 'bg-[#0D9488]' : 'bg-white/20'}`}
                            >
                                <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${yearly ? 'translate-x-7' : 'translate-x-0.5'}`} />
                            </button>
                            <span className={`text-sm font-medium ${yearly ? 'text-white' : 'text-white/40'}`}>
                                Yearly <span className="text-[#0D9488] text-xs font-bold ml-1">Save 35%</span>
                            </span>
                        </div>
                        {/* Region selector */}
                        <div className="relative">
                            <button onClick={() => setShowRegionPicker(!showRegionPicker)} className="text-xs text-white/30 hover:text-white/60 transition-colors flex items-center gap-1">
                                Pricing for <span className="font-bold text-white/50">{region.label}</span> ({region.currency}) · Change
                            </button>
                            {showRegionPicker && (
                                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 max-h-72 overflow-y-auto p-2 rounded-xl bg-[rgba(22,32,50,0.95)] backdrop-blur-xl border border-white/10 shadow-2xl z-50">
                                    {ALL_REGIONS.map(r => (
                                        <button
                                            key={r.region}
                                            onClick={() => { setRegion(r); setShowRegionPicker(false); }}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${r.region === region.region ? 'bg-[#0D9488]/10 text-[#0D9488] font-bold' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                                        >
                                            {r.label} ({r.currency})
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Plans */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 lg:grid-cols-5 gap-5">
                        {plans.map((plan: any) => {
                            const isHighlighted = plan.slug === highlightedSlug;
                            const isEnterprise = plan.slug === 'enterprise';
                            const isFree = plan.slug === 'free';
                            const price = plan.pricing;

                            return (
                                <motion.div
                                    key={plan.id}
                                    variants={fadeInUp}
                                    className={`relative p-6 rounded-2xl ${
                                        isHighlighted
                                            ? 'bg-gradient-to-b from-[#0D9488]/10 to-[#6929C4]/5 border-2 border-[#0D9488]/30 shadow-lg shadow-[#0D9488]/10'
                                            : 'glass-card'
                                    }`}
                                >
                                    {isHighlighted && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#0D9488] to-[#6929C4] rounded-full text-xs font-bold text-white whitespace-nowrap">
                                            Most Popular
                                        </div>
                                    )}
                                    <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                                    <p className="text-xs text-white/40 mb-5 min-h-[32px]">{plan.description}</p>
                                    <div className="mb-6">
                                        {isFree ? (
                                            <div className="text-4xl font-bold text-white">Free</div>
                                        ) : isEnterprise ? (
                                            <div className="text-3xl font-bold text-white">Custom</div>
                                        ) : price ? (
                                            <>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-3xl font-bold text-white">{formatPrice(yearly ? price.yearly : price.monthly, price.currency)}</span>
                                                    <span className="text-white/40 text-sm">/mo</span>
                                                </div>
                                                {yearly && (
                                                    <p className="text-[10px] text-white/30 mt-1 line-through">{formatPrice(price.monthly, price.currency)}/mo monthly</p>
                                                )}
                                            </>
                                        ) : (
                                            <div className="text-3xl font-bold text-white">—</div>
                                        )}
                                    </div>
                                    <Link
                                        href={isEnterprise ? '/contact' : '/auth'}
                                        className={`block w-full py-2.5 rounded-xl font-bold text-sm text-center transition-all ${
                                            isHighlighted
                                                ? 'bg-gradient-to-r from-[#0D9488] to-[#0D9488]/90 text-white shadow-lg shadow-[#0D9488]/20 hover:shadow-[#0D9488]/40'
                                                : 'border border-white/10 text-white hover:bg-white/5 hover:border-white/20'
                                        }`}
                                    >
                                        {isFree ? 'Start Free' : isEnterprise ? 'Contact Sales' : 'Start 14-Day Trial'}
                                    </Link>
                                    <ul className="mt-6 space-y-2">
                                        {[
                                            { k: 'brands', l: 'brands' },
                                            { k: 'campaignsPerBrand', l: 'campaigns/brand' },
                                            { k: 'users', l: 'team members' },
                                            { k: 'integrations', l: 'integrations' },
                                            { k: 'aiQueriesPerMonth', l: 'AI queries/mo' },
                                            { k: 'whitelabelDomains', l: 'white-label domains' },
                                        ].map(q => {
                                            const val = plan.quotas?.[q.k];
                                            return (
                                                <li key={q.k} className="flex items-center gap-2 text-xs">
                                                    <span className="material-symbols-outlined text-[#0D9488] text-sm">check_circle</span>
                                                    <span className="text-white/60">
                                                        <span className="font-bold text-white">{val === -1 ? 'Unlimited' : val}</span> {q.l}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                        <li className="flex items-center gap-2 text-xs">
                                            <span className="material-symbols-outlined text-[#0D9488] text-sm">check_circle</span>
                                            <span className="text-white/60">
                                                <span className="font-bold text-white">{((plan.quotas?.referralCommission || 0.10) * 100).toFixed(0)}%</span> referral commission
                                            </span>
                                        </li>
                                    </ul>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* All features included note */}
                    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-12 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0D9488]/5 border border-[#0D9488]/10">
                            <span className="material-symbols-outlined text-[#0D9488] text-sm">verified</span>
                            <span className="text-xs text-white/60">Every plan includes <span className="font-bold text-white">100% of all features</span> — dashboards, AI agents, integrations, reports, share links, and more</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FAQs - structured for AEO/featured snippets */}
            <section className="py-24 bg-[#0d0d12] border-y border-white/5" aria-labelledby="pricing-faq-heading">
                <div className="max-w-3xl mx-auto px-6">
                    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
                        <h2 id="pricing-faq-heading" className="text-3xl font-bold text-white">Frequently Asked Questions About Pricing</h2>
                        <p className="text-white/40 mt-3 text-sm">Common questions about Collaborative Intelligence plans, features, and billing.</p>
                    </motion.div>
                    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-6" itemScope itemType="https://schema.org/FAQPage">
                        {FAQS.map((faq) => (
                            <motion.div key={faq.q} variants={fadeInUp} className="p-6 rounded-xl glass-card" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                                <h3 className="font-semibold text-white mb-2" itemProp="name">{faq.q}</h3>
                                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                                    <p className="text-sm text-white/40" itemProp="text">{faq.a}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <PublicFooter />
            <ChatbotWidget />
        </div>
    );
}
