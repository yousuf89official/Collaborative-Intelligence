'use client';

import { motion } from 'framer-motion';
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

const VALUES = [
    { icon: 'visibility', title: 'Transparency', desc: 'We believe in complete data transparency. Every metric, every insight, fully auditable and explainable.' },
    { icon: 'speed', title: 'Speed', desc: 'Real-time data processing and instant insights. Because in media, timing is everything.' },
    { icon: 'handshake', title: 'Collaboration', desc: 'Built for teams. Every feature is designed to bring brands and agencies closer together.' },
    { icon: 'security', title: 'Trust', desc: 'Enterprise-grade security and compliance. Your data is protected by industry-leading standards.' },
];

const TEAM = [
    { name: 'Alex Rivera', role: 'CEO & Co-Founder', desc: 'Former VP at a leading media intelligence firm. 15+ years in adtech and analytics.' },
    { name: 'Priya Sharma', role: 'CTO & Co-Founder', desc: 'Ex-Google engineering lead. Expert in real-time data pipelines and AI/ML systems.' },
    { name: 'David Kim', role: 'VP of Product', desc: '10 years building enterprise SaaS products for Fortune 500 marketing teams.' },
    { name: 'Lisa Chen', role: 'VP of Customer Success', desc: 'Passionate about helping enterprise clients unlock the full potential of their data.' },
];

const MILESTONES = [
    { year: '2023', title: 'Founded', desc: 'Collaborative Intelligence was founded with the mission to unify fragmented media data.' },
    { year: '2024', title: 'Product Launch', desc: 'Launched our enterprise platform with 50+ beta clients across APAC and North America.' },
    { year: '2025', title: 'AI Integration', desc: 'Introduced AI-powered insights, predictive analytics, and automated recommendation engine.' },
    { year: '2026', title: 'Global Expansion', desc: 'Expanded to 30+ countries with support for multi-currency and multi-language campaigns.' },
];

export function AboutPage() {
    return (
        <div className="public-site min-h-screen">
            <PublicNav />

            {/* Hero */}
            <section className="pt-32 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 dark-grid-bg opacity-30" />
                <div className="absolute inset-0 hero-glow" />
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[#0D9488] text-xs font-bold tracking-[0.2em] uppercase mb-4 block"
                    >
                        About Us
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold text-white mb-6"
                    >
                        We&apos;re Building the Future of <span className="gradient-text">Media Intelligence</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg text-white/50 max-w-2xl mx-auto"
                    >
                        Collaborative Intelligence was founded to solve the fragmentation problem in media analytics. We unify data, teams, and insights into one powerful platform.
                    </motion.p>
                </div>
            </section>

            {/* Mission */}
            <section className="py-24 bg-[#0d0d12] border-y border-white/5" aria-labelledby="mission-heading">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                            <span className="text-[#6929C4] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Our Mission</span>
                            <h2 id="mission-heading" className="text-4xl font-bold text-white mb-6">Unify Media Data. Empower Decisions.</h2>
                            <p className="text-white/50 leading-relaxed mb-4">
                                The media landscape is more fragmented than ever. Brands manage campaigns across dozens of platforms, agencies juggle multiple clients, and data lives in silos. Collaborative Intelligence solves this fragmentation problem.
                            </p>
                            <p className="text-white/50 leading-relaxed">
                                We built Collaborative Intelligence to bring it all together — one platform where every impression, click, and conversion is tracked, analyzed, and turned into actionable intelligence for data-driven decisions.
                            </p>
                        </motion.div>
                        <motion.div
                            variants={fadeInUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="absolute -inset-6 bg-gradient-to-r from-[#0D9488]/10 to-[#6929C4]/10 rounded-3xl blur-2xl" />
                            <div className="relative p-8 rounded-2xl glass-card">
                                <div className="grid grid-cols-2 gap-6">
                                    {[
                                        { num: '500+', label: 'Enterprise Clients' },
                                        { num: '30+', label: 'Countries' },
                                        { num: '2B+', label: 'Impressions/Month' },
                                        { num: '99.9%', label: 'Uptime SLA' },
                                    ].map((s) => (
                                        <div key={s.label} className="text-center p-4">
                                            <div className="text-3xl font-bold gradient-text mb-1">{s.num}</div>
                                            <div className="text-sm text-white/40">{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24" aria-labelledby="values-heading">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
                        <span className="text-[#0D9488] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Our Values</span>
                        <h2 id="values-heading" className="text-4xl font-bold text-white">What Drives Us</h2>
                    </motion.div>
                    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {VALUES.map((v) => (
                            <motion.div key={v.title} variants={fadeInUp} className="p-8 rounded-2xl glass-card glass-card-hover text-center">
                                <div className="w-14 h-14 mx-auto rounded-xl bg-[#0D9488]/10 text-[#0D9488] flex items-center justify-center mb-5">
                                    <span className="material-symbols-outlined text-2xl">{v.icon}</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{v.title}</h3>
                                <p className="text-sm text-white/40">{v.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-24 bg-[#0d0d12] border-y border-white/5">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
                        <span className="text-[#6929C4] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Our Journey</span>
                        <h2 className="text-4xl font-bold text-white">Key Milestones</h2>
                    </motion.div>
                    <div className="space-y-8">
                        {MILESTONES.map((m, idx) => (
                            <motion.div
                                key={m.year}
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="flex gap-6 items-start"
                            >
                                <div className="shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-[#0D9488] to-[#6929C4] flex items-center justify-center text-white font-bold text-sm">
                                    {m.year}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">{m.title}</h3>
                                    <p className="text-sm text-white/40">{m.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
                        <span className="text-[#0D9488] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Leadership</span>
                        <h2 className="text-4xl font-bold text-white">Meet the Team</h2>
                    </motion.div>
                    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {TEAM.map((t) => (
                            <motion.div key={t.name} variants={fadeInUp} className="p-6 rounded-2xl glass-card glass-card-hover text-center">
                                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#0D9488] to-[#6929C4] flex items-center justify-center text-white font-bold text-xl">
                                    {t.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <h3 className="font-bold text-white mb-1">{t.name}</h3>
                                <p className="text-xs text-[#0D9488] font-medium mb-3">{t.role}</p>
                                <p className="text-xs text-white/40">{t.desc}</p>
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
