'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ChatbotWidget } from './ChatbotWidget';

// ─── Animation Variants ─────────────────────────────────────────────────────

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as any } },
};

const fadeInLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as any } },
};

const fadeInRight = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as any } },
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as any } },
};

// ─── Counter Component ──────────────────────────────────────────────────────

function AnimatedCounter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const duration = 2000;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [isInView, target]);

    return (
        <div ref={ref} className="counter-animate">
            {prefix}{count.toLocaleString()}{suffix}
        </div>
    );
}

// ─── Section Wrapper ────────────────────────────────────────────────────────

function Section({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
    return (
        <section id={id} className={`relative py-24 md:py-32 ${className}`}>
            {children}
        </section>
    );
}

// ─── CMS Content Type ───────────────────────────────────────────────────────

interface CMSContent {
    badge: string;
    heroTitle: string;
    heroHighlight: string;
    heroSubtitle: string;
    trustTitle: string;
    trustLogos: string[];
    features: Array<{ icon: string; title: string; desc: string }>;
    stats: Array<{ value: number; suffix: string; label: string }>;
    platformFeatures: Array<{ icon: string; title: string; desc: string }>;
    howItWorks: Array<{ step: string; title: string; desc: string }>;
    testimonials: Array<{ name: string; role: string; company: string; quote: string }>;
    blogPosts: Array<{ title: string; category: string; excerpt: string; date: string; readTime: string }>;
    footerDescription: string;
    contactEmail: string;
    footerLinks: {
        platform: string[];
        company: string[];
        resources: string[];
    };
}

// ─── Default Content ────────────────────────────────────────────────────────

const DEFAULT_CONTENT: CMSContent = {
    badge: 'Collaborative Intelligence — Now Live',
    heroTitle: 'Unified Campaign Intelligence',
    heroHighlight: 'for Data-Driven Brands',
    heroSubtitle: 'Enterprise-grade campaign analytics, full-funnel performance tracking, and AI-powered insights that unify brands, agencies, and channels on one intelligent platform.',
    trustTitle: 'Trusted by Leading Brands & Agencies Worldwide',
    trustLogos: ['Unilever', 'L\'Oréal', 'Samsung', 'Nestlé', 'P&G', 'Toyota'],
    features: [
        { icon: 'hub', title: 'Collaborative Workflows', desc: 'Unite brands, agencies, and stakeholders on a single platform with role-based access and real-time collaboration across campaigns.' },
        { icon: 'query_stats', title: 'Full-Funnel Analytics', desc: 'Track performance across ATL, BTL, and Digital channels from awareness through conversion and retention in real-time.' },
        { icon: 'shield', title: 'Enterprise Security', desc: 'Row-level security, AES-256 encryption, bcrypt authentication, and RBAC built for enterprise governance and compliance.' },
        { icon: 'dashboard_customize', title: 'Unified Command View', desc: 'Consolidate paid, owned, earned, and social channels into a single intelligence dashboard with live data.' },
        { icon: 'psychology', title: 'AI-Powered Insights', desc: 'Leverage machine learning to surface hidden patterns, predict campaign outcomes, and generate actionable recommendations.' },
        { icon: 'share', title: 'Branded Reporting', desc: 'Generate white-labeled, shareable reports with your brand identity — perfect for client presentations and stakeholder updates.' },
    ],
    stats: [
        { value: 500, suffix: '+', label: 'Campaigns Managed' },
        { value: 98, suffix: '%', label: 'Client Satisfaction' },
        { value: 2, suffix: 'B+', label: 'Impressions Tracked' },
        { value: 45, suffix: '%', label: 'Avg. ROI Increase' },
    ],
    platformFeatures: [
        { icon: 'auto_graph', title: 'Real-Time Dashboards', desc: 'Live KPI tracking with auto-refreshing data pipelines and instant notifications.' },
        { icon: 'calculate', title: 'AVE & SOV Calculator', desc: 'Industry-standard Advertising Value Equivalency and Share of Voice metrics at your fingertips.' },
        { icon: 'cloud_sync', title: 'Platform Integrations', desc: 'Connect Google Ads, Meta, TikTok, LinkedIn, and 20+ other platforms seamlessly.' },
        { icon: 'inventory', title: 'Campaign Manager', desc: 'Plan, execute, and optimize multi-channel campaigns from a single unified interface.' },
        { icon: 'trending_up', title: 'Predictive Analytics', desc: 'AI models that forecast performance trends and recommend budget allocations.' },
        { icon: 'lock', title: 'Role-Based Access', desc: 'Granular permissions from brand-level to sub-campaign, with team collaboration built in.' },
    ],
    howItWorks: [
        { step: '01', title: 'Connect Your Channels', desc: 'Integrate your ad platforms, social media accounts, and media buying tools in minutes.' },
        { step: '02', title: 'Unified Intelligence', desc: 'All your data flows into a single dashboard with real-time cross-channel analytics.' },
        { step: '03', title: 'Actionable Insights', desc: 'AI surfaces opportunities, flags anomalies, and generates optimization recommendations.' },
    ],
    testimonials: [
        { name: 'Sarah Chen', role: 'VP of Marketing', company: 'Global Brands Inc.', quote: 'Collaborative Intelligence transformed how we track campaign performance. We went from spreadsheets to real-time intelligence in weeks.' },
        { name: 'James Wilson', role: 'Media Director', company: 'Pinnacle Agency', quote: 'The unified dashboard alone saved our team 20 hours per week. The AI recommendations are a game-changer for optimization.' },
        { name: 'Maria Rodriguez', role: 'CMO', company: 'FreshWave Consumer', quote: 'Finally, a platform that speaks both the brand and agency language. Collaboration has never been smoother.' },
    ],
    blogPosts: [
        { title: 'The Future of Media Intelligence: AI-Driven Campaign Optimization', category: 'Industry Insights', excerpt: 'How artificial intelligence is reshaping the way brands and agencies approach multi-channel campaign management and performance tracking.', date: '2026-03-05', readTime: '5 min' },
        { title: 'Understanding Share of Voice in the Digital Age', category: 'Analytics', excerpt: 'A comprehensive guide to measuring and improving your brand\'s share of voice across digital, social, and traditional media channels.', date: '2026-02-28', readTime: '7 min' },
        { title: 'Enterprise Media Buying: Integration Best Practices', category: 'Best Practices', excerpt: 'Learn how leading enterprises are consolidating their media buying operations for better efficiency and ROI.', date: '2026-02-20', readTime: '6 min' },
    ],
    footerDescription: 'Collaborative Intelligence is the enterprise campaign intelligence platform powering data-driven decisions for global brands and agencies.',
    contactEmail: 'hello@collaborativeintelligence.com',
    footerLinks: {
        platform: ['Dashboard', 'Analytics', 'Media Analyzer', 'Reports', 'Integrations'],
        company: ['About Us', 'Pricing', 'Careers', 'Contact', 'Blog'],
        resources: ['Help Center', 'API Docs', 'Status', 'Privacy Policy', 'Terms of Service'],
    },
};

// ─── Main Component ─────────────────────────────────────────────────────────

export function HomePage() {
    const [content, setContent] = useState<CMSContent>(DEFAULT_CONTENT);
    const [email, setEmail] = useState('');
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    useEffect(() => {
        fetch('/api/cms/landing-page')
            .then(res => res.json())
            .then((data) => {
                setContent({ ...DEFAULT_CONTENT, ...data });
            })
            .catch(() => {});
    }, []);

    return (
        <div className="public-site min-h-screen overflow-x-hidden" role="main">
            {/* ── Navigation ─────────────────────────────────────────── */}
            <nav className="fixed top-0 w-full z-50 glass-nav-dark" aria-label="Main navigation">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-9 h-9 bg-gradient-to-br from-[#0D9488] to-[#6929C4] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-white text-xl">hub</span>
                        </div>
                        <span className="text-lg font-bold text-white tracking-tight">
                            Collaborative<span className="text-[#0D9488]"> Intelligence</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        {['About', 'Pricing', 'Blog', 'Contact'].map((item) => (
                            <Link
                                key={item}
                                href={`/${item.toLowerCase()}`}
                                className="text-sm font-medium text-white/60 hover:text-white transition-colors relative group"
                            >
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0D9488] group-hover:w-full transition-all duration-300" />
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/auth" className="hidden sm:block px-5 py-2 text-sm font-medium text-white/80 border border-white/10 rounded-lg hover:border-[#0D9488]/50 hover:text-white transition-all">
                            Log In
                        </Link>
                        <Link href="/auth" className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#0D9488] to-[#0D9488]/90 rounded-lg shadow-lg shadow-[#0D9488]/20 hover:shadow-[#0D9488]/40 hover:scale-[1.02] active:scale-95 transition-all">
                            Get Started Free
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ── Hero Section ───────────────────────────────────────── */}
            <div ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 dark-grid-bg opacity-40" />
                <div className="absolute inset-0 hero-glow" />

                {/* Floating orbs */}
                <div className="absolute top-1/4 left-[15%] w-72 h-72 bg-[#0D9488]/10 rounded-full blur-[100px] animate-float" />
                <div className="absolute bottom-1/4 right-[15%] w-96 h-96 bg-[#6929C4]/8 rounded-full blur-[120px] animate-float-delayed" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#0D9488]/5 rounded-full blur-[80px] animate-float-slow" />

                <motion.div
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="relative z-10 max-w-5xl mx-auto px-6 text-center"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#0D9488] text-xs font-bold tracking-widest uppercase mb-8"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0D9488] opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0D9488]" />
                        </span>
                        {content.badge}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 leading-[1.05]"
                    >
                        {content.heroTitle}
                        <br />
                        <span className="gradient-text" aria-label="for Data-Driven Brands">{content.heroHighlight}</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.6 }}
                        className="max-w-2xl mx-auto text-lg md:text-xl text-white/50 font-light leading-relaxed mb-12"
                    >
                        {content.heroSubtitle}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.8 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link href="/contact" className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#0D9488] to-[#0D9488]/90 text-white font-bold rounded-xl shadow-xl shadow-[#0D9488]/25 hover:shadow-[#0D9488]/40 transition-all flex items-center justify-center gap-2" title="Book a demo of Collaborative Intelligence campaign analytics platform">
                            Book a Demo
                            <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform" aria-hidden="true">arrow_forward</span>
                        </Link>
                        <Link href="/auth" className="w-full sm:w-auto px-8 py-4 border border-white/10 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm" title="Log in to your Collaborative Intelligence dashboard">
                            Login to Dashboard
                        </Link>
                    </motion.div>

                    {/* Dashboard Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 60, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 1, delay: 1.1, ease: [0.25, 0.46, 0.45, 0.94] as any }}
                        className="mt-20 relative max-w-5xl mx-auto"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#0D9488]/30 to-[#6929C4]/30 rounded-2xl blur-xl opacity-50" />
                        <div className="relative bg-[#161616] border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-1">
                            <div className="rounded-xl overflow-hidden">
                                {/* Browser Chrome */}
                                <div className="h-10 bg-[#0d0d0d] flex items-center px-4 gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                                    </div>
                                    <div className="flex-1 mx-12">
                                        <div className="h-5 bg-white/5 rounded-md border border-white/5 flex items-center px-3">
                                            <span className="text-[10px] text-white/30">collaborativeintelligence.com/dashboard</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Dashboard Mock */}
                                <div className="aspect-[16/9] bg-[#0d0d12] p-6 grid grid-cols-12 gap-3">
                                    {/* Sidebar */}
                                    <div className="col-span-2 space-y-3">
                                        <div className="h-8 bg-white/5 rounded-lg" />
                                        <div className="space-y-1.5">
                                            {[1,2,3,4,5].map(i => (
                                                <div key={i} className={`h-7 rounded-md ${i === 1 ? 'bg-[#0D9488]/20 border border-[#0D9488]/30' : 'bg-white/3'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    {/* Main content */}
                                    <div className="col-span-7 space-y-3">
                                        <div className="grid grid-cols-4 gap-2">
                                            {[1,2,3,4].map(i => (
                                                <div key={i} className="h-16 bg-white/5 rounded-lg border border-white/5 p-2">
                                                    <div className="h-2 w-8 bg-white/10 rounded mb-1.5" />
                                                    <div className="h-4 w-12 bg-[#0D9488]/20 rounded" />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="h-40 bg-white/5 rounded-lg border border-white/5 p-3">
                                            <div className="h-2 w-20 bg-white/10 rounded mb-3" />
                                            <div className="flex items-end gap-1 h-24">
                                                {[40,60,35,80,55,70,45,90,65,75,50,85].map((h, i) => (
                                                    <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: i === 7 ? '#0D9488' : 'rgba(255,255,255,0.08)' }} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Right panel */}
                                    <div className="col-span-3 space-y-3">
                                        <div className="h-28 bg-white/5 rounded-lg border border-white/5 p-3">
                                            <div className="h-2 w-16 bg-white/10 rounded mb-2" />
                                            <div className="w-16 h-16 mx-auto rounded-full border-4 border-[#0D9488]/30 border-t-[#0D9488]" />
                                        </div>
                                        <div className="h-28 bg-white/5 rounded-lg border border-white/5 p-3">
                                            <div className="h-2 w-16 bg-white/10 rounded mb-3" />
                                            <div className="space-y-2">
                                                {[70,55,40].map((w, i) => (
                                                    <div key={i} className="h-3 bg-white/5 rounded-full overflow-hidden">
                                                        <div className="h-full rounded-full bg-gradient-to-r from-[#0D9488] to-[#6929C4]" style={{ width: `${w}%` }} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* ── Trust Bar ──────────────────────────────────────────── */}
            <Section className="py-16 md:py-20 border-y border-white/5 bg-[#0d0d12]">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.p
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-white/30 text-[10px] font-bold tracking-[0.25em] text-center uppercase mb-10"
                    >
                        {content.trustTitle}
                    </motion.p>
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="flex flex-wrap justify-center items-center gap-12 md:gap-20"
                    >
                        {content.trustLogos.map((logo) => (
                            <motion.div
                                key={logo}
                                variants={fadeInUp}
                                className="text-xl font-bold tracking-tight text-white/20 hover:text-white/40 transition-colors cursor-default"
                            >
                                {logo}
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </Section>

            {/* ── Stats Section ───────────────────────────────────────── */}
            <Section className="section-glow-blue">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        {content.stats.map((stat) => (
                            <motion.div
                                key={stat.label}
                                variants={scaleIn}
                                className="text-center p-8 rounded-2xl glass-card glass-card-hover"
                            >
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                                </div>
                                <p className="text-sm text-white/40 font-medium">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </Section>

            {/* ── Features Grid ──────────────────────────────────────── */}
            <Section id="features">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-[#0D9488] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Why Choose Us</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Everything You Need to <span className="gradient-text">Win in Media</span>
                        </h2>
                        <p className="text-white/40 text-lg max-w-2xl mx-auto">
                            Collaborative Intelligence provides a comprehensive suite of campaign analytics tools designed for enterprise media teams who demand precision, speed, and collaboration.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {content.features.map((feature) => (
                            <motion.div
                                key={feature.title}
                                variants={fadeInUp}
                                className="group p-8 rounded-2xl glass-card glass-card-hover transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[#0D9488]/10 text-[#0D9488] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#0D9488]/20 transition-all">
                                    <span className="material-symbols-outlined">{feature.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#0D9488] transition-colors">{feature.title}</h3>
                                <p className="text-white/40 text-sm leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </Section>

            {/* ── Platform Preview (Parallax) ───────────────────────── */}
            <Section className="bg-[#0d0d12] overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            variants={fadeInLeft}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <span className="text-[#6929C4] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Platform Capabilities</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Built for <span className="gradient-text">Enterprise Scale</span>
                            </h2>
                            <p className="text-white/40 text-lg mb-10">
                                From real-time dashboards to predictive analytics, every feature is designed for teams managing complex multi-channel campaigns.
                            </p>
                            <div className="space-y-6">
                                {content.platformFeatures.slice(0, 4).map((feat, idx) => (
                                    <motion.div
                                        key={feat.title}
                                        variants={fadeInLeft}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex gap-4 group"
                                    >
                                        <div className="w-10 h-10 shrink-0 rounded-lg bg-[#0D9488]/10 text-[#0D9488] flex items-center justify-center group-hover:bg-[#0D9488]/20 transition-colors">
                                            <span className="material-symbols-outlined text-xl">{feat.icon}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-white mb-1">{feat.title}</h4>
                                            <p className="text-sm text-white/40">{feat.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            variants={fadeInRight}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="relative"
                        >
                            {/* Decorative glow */}
                            <div className="absolute -inset-10 bg-gradient-to-r from-[#0D9488]/10 to-[#6929C4]/10 rounded-3xl blur-3xl" />
                            <div className="relative grid grid-cols-2 gap-4">
                                {content.platformFeatures.map((feat, idx) => (
                                    <motion.div
                                        key={feat.title}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.08, duration: 0.5 }}
                                        className={`p-6 rounded-xl glass-card glass-card-hover ${idx === 0 ? 'col-span-2' : ''}`}
                                    >
                                        <span className="material-symbols-outlined text-[#0D9488] text-2xl mb-3 block">{feat.icon}</span>
                                        <h4 className="font-semibold text-white text-sm mb-1">{feat.title}</h4>
                                        <p className="text-xs text-white/40">{feat.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </Section>

            {/* ── How It Works ───────────────────────────────────────── */}
            <Section className="section-glow-purple">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-[#0D9488] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Simple & Powerful</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            How It <span className="gradient-text">Works</span>
                        </h2>
                        <p className="text-white/40 text-lg max-w-2xl mx-auto">
                            Get from zero to insights in three simple steps. No complex setup required.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-3 gap-8 relative"
                    >
                        {/* Connecting line */}
                        <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-px bg-gradient-to-r from-[#0D9488]/30 via-[#6929C4]/30 to-[#0D9488]/30" />

                        {content.howItWorks.map((step, idx) => (
                            <motion.div
                                key={step.step}
                                variants={fadeInUp}
                                className="relative text-center"
                            >
                                <div className="relative z-10 w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#6929C4] flex items-center justify-center shadow-lg shadow-[#0D9488]/20 animate-pulse-glow">
                                    <span className="text-white font-bold text-xl">{step.step}</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                                <p className="text-white/40 text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </Section>

            {/* ── Testimonials ───────────────────────────────────────── */}
            <Section className="bg-[#0d0d12]">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-[#6929C4] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Testimonials</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white">
                            Loved by <span className="gradient-text">Industry Leaders</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {content.testimonials.map((t) => (
                            <motion.div
                                key={t.name}
                                variants={fadeInUp}
                                className="p-8 rounded-2xl glass-card glass-card-hover relative"
                            >
                                <div className="absolute top-6 right-6 text-[#0D9488]/20">
                                    <span className="material-symbols-outlined text-4xl">format_quote</span>
                                </div>
                                <p className="text-white/60 text-sm leading-relaxed mb-6 relative z-10">&ldquo;{t.quote}&rdquo;</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0D9488] to-[#6929C4] flex items-center justify-center text-white font-bold text-sm">
                                        {t.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-sm">{t.name}</p>
                                        <p className="text-white/40 text-xs">{t.role}, {t.company}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </Section>

            {/* ── Blog / Insights ─────────────────────────────────────── */}
            <Section id="blog">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12"
                    >
                        <div>
                            <span className="text-[#0D9488] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Insights & Articles</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-white">
                                Latest from the <span className="gradient-text">Blog</span>
                            </h2>
                        </div>
                        <Link href="/blog" className="mt-4 md:mt-0 text-[#0D9488] text-sm font-medium hover:underline flex items-center gap-1">
                            View All Articles
                            <span className="material-symbols-outlined text-base">arrow_forward</span>
                        </Link>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {content.blogPosts.map((post) => (
                            <motion.article
                                key={post.title}
                                variants={fadeInUp}
                                className="group rounded-2xl glass-card glass-card-hover overflow-hidden"
                            >
                                <div className="h-48 bg-gradient-to-br from-[#0D9488]/10 to-[#6929C4]/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-5xl text-white/10 group-hover:text-[#0D9488]/20 transition-colors">article</span>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-[10px] font-bold tracking-wider uppercase text-[#0D9488] bg-[#0D9488]/10 px-2.5 py-1 rounded-full">{post.category}</span>
                                        <span className="text-xs text-white/30">{post.readTime}</span>
                                    </div>
                                    <h3 className="font-bold text-white mb-2 group-hover:text-[#0D9488] transition-colors leading-snug">{post.title}</h3>
                                    <p className="text-sm text-white/40 leading-relaxed">{post.excerpt}</p>
                                </div>
                            </motion.article>
                        ))}
                    </motion.div>

                    {/* News Ticker */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="mt-12 p-4 rounded-xl glass-card flex items-center gap-4 overflow-hidden"
                    >
                        <span className="shrink-0 text-[10px] font-bold tracking-wider uppercase text-[#0D9488] bg-[#0D9488]/10 px-3 py-1.5 rounded-full">Live News</span>
                        <div className="overflow-hidden whitespace-nowrap">
                            <div className="inline-block animate-[scroll_30s_linear_infinite]">
                                <span className="text-sm text-white/40 mx-8">Digital ad spend projected to reach $740B globally in 2026</span>
                                <span className="text-white/10">|</span>
                                <span className="text-sm text-white/40 mx-8">AI-powered media buying grows 200% year-over-year</span>
                                <span className="text-white/10">|</span>
                                <span className="text-sm text-white/40 mx-8">Connected TV advertising surpasses traditional TV for the first time</span>
                                <span className="text-white/10">|</span>
                                <span className="text-sm text-white/40 mx-8">Retail media networks emerge as third-largest ad channel</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* ── CTA Section ────────────────────────────────────────── */}
            <Section className="bg-[#0d0d12] relative overflow-hidden">
                {/* Glow */}
                <div className="absolute inset-0 hero-glow" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0D9488]/8 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6929C4]/8 rounded-full blur-[150px]" />

                <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Ready to Transform Your <span className="gradient-text">Media Intelligence</span>?
                        </h2>
                        <p className="text-white/40 text-lg mb-10 max-w-xl mx-auto">
                            Join hundreds of enterprise teams already using Collaborative Intelligence to drive smarter campaign decisions.
                        </p>

                        {/* Lead Gen Form */}
                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your work email"
                                className="flex-1 px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#0D9488]/50 focus:ring-1 focus:ring-[#0D9488]/30 transition-all"
                            />
                            <button className="px-8 py-3.5 bg-gradient-to-r from-[#0D9488] to-[#6929C4] text-white font-bold rounded-xl shadow-lg shadow-[#0D9488]/20 hover:shadow-[#0D9488]/40 hover:scale-[1.02] active:scale-95 transition-all whitespace-nowrap">
                                Start Free Trial
                            </button>
                        </div>
                        <p className="text-xs text-white/30">No credit card required. 14-day free trial for enterprise features.</p>
                    </motion.div>
                </div>
            </Section>

            {/* ── Footer ─────────────────────────────────────────────── */}
            <footer className="border-t border-white/5 bg-[#080810] pt-20 pb-8" role="contentinfo">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        {/* Brand */}
                        <div className="md:col-span-1">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-gradient-to-br from-[#0D9488] to-[#6929C4] rounded-lg flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white text-base">hub</span>
                                </div>
                                <span className="font-bold text-white">
                                    Collaborative<span className="text-[#0D9488]"> Intelligence</span>
                                </span>
                            </div>
                            <p className="text-sm text-white/40 leading-relaxed mb-6">{content.footerDescription}</p>
                            <p className="text-sm text-white/40">
                                <a href={`mailto:${content.contactEmail}`} className="hover:text-[#0D9488] transition-colors">
                                    {content.contactEmail}
                                </a>
                            </p>
                        </div>

                        {/* Links */}
                        {Object.entries(content.footerLinks).map(([category, links]) => (
                            <div key={category}>
                                <h5 className="text-white text-sm font-bold mb-5 capitalize">{category}</h5>
                                <ul className="space-y-3">
                                    {(links as string[]).map((link) => (
                                        <li key={link}>
                                            <Link href="#" className="text-sm text-white/40 hover:text-[#0D9488] transition-colors">
                                                {link}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-white/20 text-xs">&copy; {new Date().getFullYear()} Collaborative Intelligence. All rights reserved.</p>
                        <div className="flex gap-6 text-white/20">
                            {['share', 'mail', 'public'].map((icon) => (
                                <Link key={icon} href="#" className="hover:text-[#0D9488] transition-colors">
                                    <span className="material-symbols-outlined text-xl">{icon}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>

            <ChatbotWidget />
        </div>
    );
}
