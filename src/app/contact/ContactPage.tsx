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

const CONTACT_OPTIONS = [
    { icon: 'mail', title: 'Email Us', desc: 'hello@collaborativeintelligence.com', sub: 'Typically reply within 24 hours', href: 'mailto:hello@collaborativeintelligence.com' },
    { icon: 'call', title: 'Call Us', desc: '+1 (555) 123-4567', sub: 'Mon-Fri, 9am-6pm EST', href: 'tel:+15551234567' },
    { icon: 'location_on', title: 'Visit Us', desc: 'Jakarta, Indonesia', sub: 'Schedule an office visit', href: undefined },
];

export function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', company: '', role: '', message: '', interest: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="public-site min-h-screen">
            <PublicNav />

            {/* Hero */}
            <section className="pt-32 pb-16 relative overflow-hidden">
                <div className="absolute inset-0 dark-grid-bg opacity-30" />
                <div className="absolute inset-0 hero-glow" />
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#0D9488] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
                        Contact Us
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold text-white mb-6"
                    >
                        Let&apos;s <span className="gradient-text">Connect</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg text-white/50 max-w-2xl mx-auto"
                    >
                        Ready to transform your media intelligence? Book a demo, request a quote, or just say hello.
                    </motion.p>
                </div>
            </section>

            {/* Contact Options */}
            <section className="py-12" aria-label="Contact methods">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-6">
                        {CONTACT_OPTIONS.map((opt, idx) => (
                            <motion.div
                                key={opt.title}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + idx * 0.1 }}
                                className="p-6 rounded-xl glass-card glass-card-hover text-center"
                            >
                                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[#0D9488]/10 text-[#0D9488] flex items-center justify-center">
                                    <span className="material-symbols-outlined text-xl" aria-hidden="true">{opt.icon}</span>
                                </div>
                                <h3 className="font-bold text-white mb-1">{opt.title}</h3>
                                <p className="text-sm text-white/60 mb-1">
                                    {opt.href ? (
                                        <a href={opt.href} className="hover:text-[#0D9488] transition-colors" title={`${opt.title} - ${opt.desc}`}>{opt.desc}</a>
                                    ) : (
                                        opt.desc
                                    )}
                                </p>
                                <p className="text-xs text-white/30">{opt.sub}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Form */}
            <section className="py-24 bg-[#0d0d12] border-y border-white/5" aria-labelledby="contact-form-heading">
                <div className="max-w-3xl mx-auto px-6">
                    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        {submitted ? (
                            <div className="text-center p-12 rounded-2xl glass-card">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#0D9488]/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[#0D9488] text-4xl">check_circle</span>
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-3">Thank You!</h2>
                                <p className="text-white/50">We&apos;ve received your message and will get back to you within 24 hours.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-8 md:p-12 rounded-2xl glass-card space-y-6">
                                <div className="text-center mb-8">
                                    <h2 id="contact-form-heading" className="text-3xl font-bold text-white mb-2">Send Us a Message</h2>
                                    <p className="text-white/40 text-sm">Fill out the form below and our team will get back to you shortly.</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm text-white/60 mb-2 font-medium">Full Name *</label>
                                        <input
                                            required
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#0D9488]/50 focus:ring-1 focus:ring-[#0D9488]/30 transition-all"
                                            placeholder="John Smith"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/60 mb-2 font-medium">Work Email *</label>
                                        <input
                                            required
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#0D9488]/50 focus:ring-1 focus:ring-[#0D9488]/30 transition-all"
                                            placeholder="john@company.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/60 mb-2 font-medium">Company</label>
                                        <input
                                            value={form.company}
                                            onChange={(e) => setForm({ ...form, company: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#0D9488]/50 focus:ring-1 focus:ring-[#0D9488]/30 transition-all"
                                            placeholder="Acme Corp"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/60 mb-2 font-medium">I&apos;m Interested In</label>
                                        <select
                                            value={form.interest}
                                            onChange={(e) => setForm({ ...form, interest: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#0D9488]/50 focus:ring-1 focus:ring-[#0D9488]/30 transition-all"
                                        >
                                            <option value="" className="bg-[#0a0f1a] text-white">Select an option</option>
                                            <option value="demo" className="bg-[#0a0f1a] text-white">Book a Demo</option>
                                            <option value="pricing" className="bg-[#0a0f1a] text-white">Custom Pricing</option>
                                            <option value="partnership" className="bg-[#0a0f1a] text-white">Partnership</option>
                                            <option value="support" className="bg-[#0a0f1a] text-white">Technical Support</option>
                                            <option value="other" className="bg-[#0a0f1a] text-white">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-white/60 mb-2 font-medium">Message *</label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#0D9488]/50 focus:ring-1 focus:ring-[#0D9488]/30 transition-all resize-none"
                                        placeholder="Tell us about your needs..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-[#0D9488] to-[#6929C4] text-white font-bold rounded-xl shadow-lg shadow-[#0D9488]/20 hover:shadow-[#0D9488]/40 hover:scale-[1.01] active:scale-[0.99] transition-all"
                                >
                                    Send Message
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </section>

            <PublicFooter />
            <ChatbotWidget />
        </div>
    );
}
