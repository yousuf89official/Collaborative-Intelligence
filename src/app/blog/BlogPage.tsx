'use client';

import { useState } from 'react';
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
    visible: { transition: { staggerChildren: 0.1 } },
};

const CATEGORIES = ['All', 'Industry Insights', 'Analytics', 'Best Practices', 'Product Updates', 'Case Studies'];

const ARTICLES = [
    {
        title: 'The Future of Media Intelligence: AI-Driven Campaign Optimization',
        category: 'Industry Insights',
        excerpt: 'How artificial intelligence is reshaping the way brands and agencies approach multi-channel campaign management and performance tracking across the entire marketing funnel.',
        date: '2026-03-05',
        readTime: '5 min',
        featured: true,
    },
    {
        title: 'Understanding Share of Voice in the Digital Age',
        category: 'Analytics',
        excerpt: 'A comprehensive guide to measuring and improving your brand\'s share of voice across digital, social, and traditional media channels.',
        date: '2026-02-28',
        readTime: '7 min',
        featured: false,
    },
    {
        title: 'Enterprise Media Buying: Integration Best Practices',
        category: 'Best Practices',
        excerpt: 'Learn how leading enterprises are consolidating their media buying operations for better efficiency and ROI across global markets.',
        date: '2026-02-20',
        readTime: '6 min',
        featured: false,
    },
    {
        title: 'New: Predictive Analytics Engine Now Available',
        category: 'Product Updates',
        excerpt: 'Our new AI-powered predictive analytics engine is now live for all Professional and Enterprise users, offering campaign outcome forecasting.',
        date: '2026-02-15',
        readTime: '3 min',
        featured: false,
    },
    {
        title: 'How FreshWave Increased ROI by 45% with Unified Analytics',
        category: 'Case Studies',
        excerpt: 'Discover how FreshWave Consumer consolidated their fragmented media data into a single platform and dramatically improved campaign performance.',
        date: '2026-02-10',
        readTime: '8 min',
        featured: false,
    },
    {
        title: 'Advertising Value Equivalency: The Complete Guide',
        category: 'Analytics',
        excerpt: 'Everything you need to know about calculating AVE for digital media, including impression-based, engagement-based, and video view methods.',
        date: '2026-02-05',
        readTime: '10 min',
        featured: false,
    },
    {
        title: 'Cross-Channel Attribution in 2026: What Has Changed',
        category: 'Industry Insights',
        excerpt: 'With cookie deprecation and new privacy regulations, cross-channel attribution is evolving rapidly. Here is what marketers need to know.',
        date: '2026-01-28',
        readTime: '6 min',
        featured: false,
    },
    {
        title: 'Building a Media Intelligence Tech Stack',
        category: 'Best Practices',
        excerpt: 'A practical guide to assembling the right tools for enterprise media intelligence, from data collection to insight delivery.',
        date: '2026-01-20',
        readTime: '7 min',
        featured: false,
    },
    {
        title: 'Global Brands Inc.: From Spreadsheets to Real-Time Intelligence',
        category: 'Case Studies',
        excerpt: 'How a Fortune 500 brand replaced manual reporting with automated, real-time campaign intelligence across 15 markets.',
        date: '2026-01-15',
        readTime: '9 min',
        featured: false,
    },
];

export function BlogPage() {
    const [activeCategory, setActiveCategory] = useState('All');

    const filtered = activeCategory === 'All'
        ? ARTICLES
        : ARTICLES.filter(a => a.category === activeCategory);

    const featured = ARTICLES.find(a => a.featured);
    const rest = filtered.filter(a => !a.featured || activeCategory !== 'All');

    return (
        <div className="public-site min-h-screen">
            <PublicNav />

            {/* Hero */}
            <section className="pt-32 pb-16 relative overflow-hidden">
                <div className="absolute inset-0 dark-grid-bg opacity-30" />
                <div className="absolute inset-0 hero-glow" />
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#0D9488] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
                        Blog & Insights
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold text-white mb-6"
                    >
                        Media Intelligence <span className="gradient-text">Insights</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg text-white/50 max-w-2xl mx-auto"
                    >
                        Expert articles, industry trends, and product updates from the Collaborative Intelligence team.
                    </motion.p>
                </div>
            </section>

            {/* Featured Article */}
            {featured && activeCategory === 'All' && (
                <section className="py-8">
                    <div className="max-w-6xl mx-auto px-6">
                        <motion.article
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="grid md:grid-cols-2 gap-8 p-8 rounded-2xl bg-gradient-to-r from-[#0D9488]/5 to-[#6929C4]/5 border border-white/10 hover:border-[#0D9488]/30 transition-all cursor-pointer"
                        >
                            <div className="h-64 md:h-auto bg-gradient-to-br from-[#0D9488]/10 to-[#6929C4]/10 rounded-xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-7xl text-white/10">auto_stories</span>
                            </div>
                            <div className="flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-[10px] font-bold tracking-wider uppercase text-[#0D9488] bg-[#0D9488]/10 px-3 py-1 rounded-full">Featured</span>
                                    <span className="text-[10px] font-bold tracking-wider uppercase text-[#6929C4] bg-[#6929C4]/10 px-3 py-1 rounded-full">{featured.category}</span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-snug">{featured.title}</h2>
                                <p className="text-white/40 leading-relaxed mb-4">{featured.excerpt}</p>
                                <div className="flex items-center gap-4 text-sm text-white/30">
                                    <span>{new Date(featured.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                    <span>&middot;</span>
                                    <span>{featured.readTime} read</span>
                                </div>
                            </div>
                        </motion.article>
                    </div>
                </section>
            )}

            {/* Category Filters */}
            <section className="py-8">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    activeCategory === cat
                                        ? 'bg-[#0D9488] text-white'
                                        : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Articles Grid */}
            <section className="py-12 pb-32" aria-label="Blog articles">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {rest.map((article) => (
                            <motion.article
                                key={article.title}
                                variants={fadeInUp}
                                className="group rounded-2xl glass-card glass-card-hover overflow-hidden cursor-pointer"
                                itemScope
                                itemType="https://schema.org/BlogPosting"
                            >
                                <div className="h-44 bg-gradient-to-br from-[#0D9488]/5 to-[#6929C4]/5 flex items-center justify-center" role="img" aria-label={`Illustration for ${article.title}`}>
                                    <span className="material-symbols-outlined text-5xl text-white/10 group-hover:text-[#0D9488]/20 transition-colors" aria-hidden="true">article</span>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-[10px] font-bold tracking-wider uppercase text-[#0D9488] bg-[#0D9488]/10 px-2.5 py-1 rounded-full">{article.category}</span>
                                        <span className="text-xs text-white/30">{article.readTime}</span>
                                    </div>
                                    <h3 className="font-bold text-white mb-2 group-hover:text-[#0D9488] transition-colors leading-snug" itemProp="headline">{article.title}</h3>
                                    <p className="text-sm text-white/40 leading-relaxed line-clamp-3" itemProp="description">{article.excerpt}</p>
                                    <p className="mt-3 text-xs text-white/30">
                                        <time dateTime={article.date} itemProp="datePublished">
                                            {new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </time>
                                    </p>
                                </div>
                            </motion.article>
                        ))}
                    </motion.div>

                    {rest.length === 0 && (
                        <div className="text-center py-16">
                            <span className="material-symbols-outlined text-4xl text-white/20 mb-4 block">search_off</span>
                            <p className="text-white/40">No articles found in this category yet.</p>
                        </div>
                    )}
                </div>
            </section>

            <PublicFooter />
            <ChatbotWidget />
        </div>
    );
}
