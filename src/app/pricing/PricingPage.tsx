'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { PublicNav } from '@/components/public/PublicNav';
import { PublicFooter } from '@/components/public/PublicFooter';
import { ChatbotWidget } from '@/components/public/ChatbotWidget';

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as any } },
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
};

const PLANS = [
    {
        name: 'Starter',
        desc: 'Perfect for small teams getting started with media analytics.',
        monthlyPrice: 0,
        yearlyPrice: 0,
        cta: 'Start Free',
        highlighted: false,
        features: [
            'Up to 3 brands',
            '5 campaigns per brand',
            'Basic analytics dashboard',
            'AVE & SOV calculator',
            'Email support',
            '7-day data retention',
        ],
    },
    {
        name: 'Professional',
        desc: 'For growing agencies managing multiple brand campaigns.',
        monthlyPrice: 199,
        yearlyPrice: 159,
        cta: 'Start 14-Day Trial',
        highlighted: true,
        features: [
            'Up to 15 brands',
            'Unlimited campaigns',
            'Advanced analytics & AI insights',
            'Platform integrations (Google, Meta)',
            'Branded report exports',
            'Priority support',
            '90-day data retention',
            'Team collaboration (5 seats)',
        ],
    },
    {
        name: 'Enterprise',
        desc: 'For large organizations with complex multi-market needs.',
        monthlyPrice: null,
        yearlyPrice: null,
        cta: 'Contact Sales',
        highlighted: false,
        features: [
            'Unlimited brands & campaigns',
            'All platform integrations (20+)',
            'Predictive analytics & AI',
            'Custom dashboards & KPIs',
            'White-label reports',
            'Dedicated account manager',
            'SSO & advanced security',
            'Unlimited data retention',
            'API access & webhooks',
            'Custom SLA',
        ],
    },
];

const FAQS = [
    { q: 'Can I switch plans at any time?', a: 'Yes. You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.' },
    { q: 'Is there a free trial for paid plans?', a: 'Absolutely. All paid plans include a 14-day free trial with full access to all features. No credit card required.' },
    { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, wire transfers for enterprise clients, and support annual invoicing.' },
    { q: 'Can I get a custom quote?', a: 'Yes. Enterprise plans are fully customizable. Contact our sales team to discuss your specific requirements.' },
];

export function PricingPage() {
    const [yearly, setYearly] = useState(true);

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
                        Simple, <span className="gradient-text">Transparent</span> Pricing
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg text-white/50 max-w-2xl mx-auto mb-10"
                    >
                        Start free and scale as you grow. No hidden fees, no surprises. Enterprise-grade features at every tier.
                    </motion.p>

                    {/* Toggle */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center justify-center gap-4">
                        <span className={`text-sm font-medium ${!yearly ? 'text-white' : 'text-white/40'}`}>Monthly</span>
                        <button
                            onClick={() => setYearly(!yearly)}
                            className={`relative w-14 h-7 rounded-full transition-colors ${yearly ? 'bg-[#0D9488]' : 'bg-white/20'}`}
                        >
                            <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${yearly ? 'translate-x-7' : 'translate-x-0.5'}`} />
                        </button>
                        <span className={`text-sm font-medium ${yearly ? 'text-white' : 'text-white/40'}`}>
                            Yearly <span className="text-[#0D9488] text-xs font-bold ml-1">Save 20%</span>
                        </span>
                    </motion.div>
                </div>
            </section>

            {/* Plans */}
            <section className="py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-6">
                        {PLANS.map((plan) => (
                            <motion.div
                                key={plan.name}
                                variants={fadeInUp}
                                className={`relative p-8 rounded-2xl ${
                                    plan.highlighted
                                        ? 'bg-gradient-to-b from-[#0D9488]/10 to-[#6929C4]/5 border-2 border-[#0D9488]/30 shadow-lg shadow-[#0D9488]/10'
                                        : 'glass-card'
                                }`}
                            >
                                {plan.highlighted && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#0D9488] to-[#6929C4] rounded-full text-xs font-bold text-white">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                                <p className="text-sm text-white/40 mb-6">{plan.desc}</p>
                                <div className="mb-8">
                                    {plan.monthlyPrice !== null ? (
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-5xl font-bold text-white">${yearly ? plan.yearlyPrice : plan.monthlyPrice}</span>
                                            <span className="text-white/40">/month</span>
                                        </div>
                                    ) : (
                                        <div className="text-3xl font-bold text-white">Custom</div>
                                    )}
                                </div>
                                <Link
                                    href={plan.name === 'Enterprise' ? '/contact' : '/auth'}
                                    className={`block w-full py-3 rounded-xl font-bold text-sm text-center transition-all ${
                                        plan.highlighted
                                            ? 'bg-gradient-to-r from-[#0D9488] to-[#0D9488]/90 text-white shadow-lg shadow-[#0D9488]/20 hover:shadow-[#0D9488]/40'
                                            : 'border border-white/10 text-white hover:bg-white/5 hover:border-white/20'
                                    }`}
                                >
                                    {plan.cta}
                                </Link>
                                <ul className="mt-8 space-y-3">
                                    {plan.features.map((f) => (
                                        <li key={f} className="flex items-start gap-3 text-sm">
                                            <span className="material-symbols-outlined text-[#0D9488] text-base mt-0.5">check_circle</span>
                                            <span className="text-white/60">{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* FAQs */}
            <section className="py-24 bg-[#0d0d12] border-y border-white/5">
                <div className="max-w-3xl mx-auto px-6">
                    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
                    </motion.div>
                    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-6">
                        {FAQS.map((faq) => (
                            <motion.div key={faq.q} variants={fadeInUp} className="p-6 rounded-xl glass-card">
                                <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                                <p className="text-sm text-white/40">{faq.a}</p>
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
