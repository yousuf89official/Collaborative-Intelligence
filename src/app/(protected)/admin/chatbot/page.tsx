'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Bot, Save, MessageSquare, Users, TrendingUp, Settings } from 'lucide-react';

const CHATBOT_STATS = [
    { label: 'Conversations Today', value: '47', change: '+12%' },
    { label: 'Avg. Response Time', value: '1.2s', change: '-0.3s' },
    { label: 'Lead Captures', value: '8', change: '+3' },
    { label: 'Satisfaction', value: '94%', change: '+2%' },
];

const CONVERSATION_HISTORY = [
    { id: 1, visitor: 'Visitor #2847', country: 'Indonesia', pages: ['/', '/pricing'], messages: 6, duration: '4m 12s', outcome: 'lead_captured', timestamp: '14:28' },
    { id: 2, visitor: 'Visitor #2846', country: 'United States', pages: ['/', '/about'], messages: 3, duration: '1m 45s', outcome: 'browsing', timestamp: '14:15' },
    { id: 3, visitor: 'Visitor #2845', country: 'Singapore', pages: ['/pricing', '/contact'], messages: 8, duration: '6m 30s', outcome: 'demo_booked', timestamp: '13:52' },
    { id: 4, visitor: 'Visitor #2844', country: 'India', pages: ['/blog'], messages: 2, duration: '0m 45s', outcome: 'browsing', timestamp: '13:30' },
    { id: 5, visitor: 'Visitor #2843', country: 'Malaysia', pages: ['/', '/pricing', '/contact'], messages: 12, duration: '8m 15s', outcome: 'lead_captured', timestamp: '12:45' },
];

const TRIGGER_RULES = [
    { id: 1, trigger: 'Time on page > 30s', action: 'Show welcome message', page: 'All pages', enabled: true },
    { id: 2, trigger: 'Scroll depth > 50%', action: 'Offer product demo', page: 'Home page', enabled: true },
    { id: 3, trigger: 'Visited pricing page', action: 'Ask about budget/needs', page: 'Pricing', enabled: true },
    { id: 4, trigger: 'Return visitor', action: 'Personalized welcome back', page: 'All pages', enabled: true },
    { id: 5, trigger: 'About to exit (exit intent)', action: 'Show special offer', page: 'Pricing', enabled: false },
    { id: 6, trigger: 'Visited 3+ pages', action: 'Suggest booking a demo', page: 'All pages', enabled: true },
    { id: 7, trigger: 'Idle for 60s on contact page', action: 'Offer to help with form', page: 'Contact', enabled: true },
];

export default function ChatbotPage() {
    const [activeTab, setActiveTab] = useState<'overview' | 'conversations' | 'triggers' | 'config'>('overview');
    const [saving, setSaving] = useState(false);

    const [config, setConfig] = useState({
        enabled: true,
        name: 'IMH Assistant',
        greeting: 'Hi there! 👋 I\'m the Collaborative Intelligence assistant. How can I help you today?',
        personality: 'professional',
        responseStyle: 'concise',
        leadCapture: true,
        showOnPages: 'all',
        position: 'bottom-right',
        primaryColor: '#0D9488',
        autoOpen: false,
        autoOpenDelay: 30,
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                icon={Bot}
                category="Public Site"
                title="AI Chatbot"
                description="Configure the AI chatbot that engages visitors on the public site. Responds based on behavioral data and historical activity."
                actions={
                    <button onClick={() => { setSaving(true); setTimeout(() => setSaving(false), 1500); }} className="flex items-center gap-2 px-6 py-2 bg-[#0D9488] text-white rounded-xl font-bold text-xs hover:bg-[#0F766E] transition-all shadow-lg shadow-teal-500/20">
                        <Save className="h-4 w-4" /> {saving ? 'SAVING...' : 'SAVE SETTINGS'}
                    </button>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {CHATBOT_STATS.map(s => (
                    <div key={s.label} className="p-5 rounded-xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{s.label}</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-bold text-white">{s.value}</p>
                            <span className="text-[10px] text-green-400 font-bold">{s.change}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-2 border-b border-white/10">
                {[{ id: 'overview', label: 'Overview' }, { id: 'conversations', label: 'Conversations' }, { id: 'triggers', label: 'Behavior Triggers' }, { id: 'config', label: 'Configuration' }].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === tab.id ? 'border-[#0D9488] text-[#0D9488]' : 'border-transparent text-white/40'}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'overview' && (
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 lg:col-span-7 p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                        <h3 className="font-bold text-white mb-4">How the AI Chatbot Works</h3>
                        <div className="space-y-4">
                            {[
                                { step: '1', title: 'Behavior Detection', desc: 'Monitors visitor page views, scroll depth, time on page, click patterns, and exit intent signals.' },
                                { step: '2', title: 'Context Building', desc: 'Combines current session data with historical visit patterns to understand visitor intent and interests.' },
                                { step: '3', title: 'Intelligent Engagement', desc: 'Triggers contextual messages based on behavior rules. AI generates personalized responses using visitor context.' },
                                { step: '4', title: 'Lead Qualification', desc: 'Captures visitor information through natural conversation. Qualifies leads based on responses and routes to sales.' },
                            ].map(s => (
                                <div key={s.step} className="flex gap-3">
                                    <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-[#0D9488] to-[#4F46E5] flex items-center justify-center text-white text-xs font-bold">{s.step}</div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">{s.title}</h4>
                                        <p className="text-xs text-white/40">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-span-12 lg:col-span-5 p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                        <h3 className="font-bold text-white mb-4">Chatbot Preview</h3>
                        <div className="rounded-xl border border-white/10 bg-[#0d0d12] overflow-hidden">
                            <div className="p-3 bg-[#0D9488] flex items-center gap-2">
                                <Bot className="h-4 w-4 text-white" />
                                <span className="text-xs font-bold text-white">{config.name}</span>
                                <span className="relative flex h-2 w-2 ml-auto">
                                    <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75" />
                                    <span className="relative rounded-full h-2 w-2 bg-green-400" />
                                </span>
                            </div>
                            <div className="p-4 space-y-3 min-h-[200px]">
                                <div className="flex gap-2">
                                    <div className="w-6 h-6 rounded-full bg-[#0D9488] flex items-center justify-center shrink-0">
                                        <Bot className="h-3 w-3 text-white" />
                                    </div>
                                    <div className="p-2.5 rounded-lg rounded-tl-none bg-white/5 max-w-[80%]">
                                        <p className="text-xs text-white/70">{config.greeting}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <div className="p-2.5 rounded-lg rounded-tr-none bg-[#0D9488]/20 max-w-[80%]">
                                        <p className="text-xs text-white/70">I want to learn about pricing</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-6 h-6 rounded-full bg-[#0D9488] flex items-center justify-center shrink-0">
                                        <Bot className="h-3 w-3 text-white" />
                                    </div>
                                    <div className="p-2.5 rounded-lg rounded-tl-none bg-white/5 max-w-[80%]">
                                        <p className="text-xs text-white/70">Great question! We offer three plans starting from Free. Would you like me to walk you through the options, or would you prefer to schedule a quick demo with our team?</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 border-t border-white/5">
                                <div className="flex gap-2">
                                    <input placeholder="Type a message..." className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-xs text-white/50 border-none outline-none" disabled />
                                    <button className="px-3 py-2 bg-[#0D9488] rounded-lg"><MessageSquare className="h-3.5 w-3.5 text-white" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'conversations' && (
                <div className="p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                    <table className="w-full">
                        <thead>
                            <tr className="text-[10px] text-white/30 uppercase tracking-wider border-b border-white/5">
                                <th className="text-left py-3 px-4">Visitor</th>
                                <th className="text-left py-3 px-4">Country</th>
                                <th className="text-left py-3 px-4">Pages Visited</th>
                                <th className="text-center py-3 px-4">Messages</th>
                                <th className="text-center py-3 px-4">Duration</th>
                                <th className="text-center py-3 px-4">Outcome</th>
                                <th className="text-right py-3 px-4">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {CONVERSATION_HISTORY.map(c => (
                                <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer">
                                    <td className="py-3 px-4 text-sm text-white font-medium">{c.visitor}</td>
                                    <td className="py-3 px-4 text-xs text-white/60">{c.country}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-1">{c.pages.map(p => <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40 font-mono">{p}</span>)}</div>
                                    </td>
                                    <td className="text-center py-3 px-4 text-xs text-white/60">{c.messages}</td>
                                    <td className="text-center py-3 px-4 text-xs text-white/60">{c.duration}</td>
                                    <td className="text-center py-3 px-4">
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${c.outcome === 'lead_captured' ? 'bg-green-500/10 text-green-400' : c.outcome === 'demo_booked' ? 'bg-[#0D9488]/10 text-[#0D9488]' : 'bg-white/5 text-white/30'}`}>
                                            {c.outcome.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="text-right py-3 px-4 text-xs text-white/40">{c.timestamp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'triggers' && (
                <div className="p-6 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                    <h3 className="font-bold text-white mb-4">Behavioral Trigger Rules</h3>
                    <div className="space-y-3">
                        {TRIGGER_RULES.map(t => (
                            <div key={t.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                                <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${t.enabled ? 'bg-[#0D9488]' : 'bg-white/20'}`}>
                                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${t.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-white font-medium">{t.trigger}</p>
                                    <p className="text-[10px] text-white/40">Action: {t.action}</p>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/30">{t.page}</span>
                            </div>
                        ))}
                        <button className="w-full py-3 border border-dashed border-white/10 text-white/30 rounded-xl text-xs hover:border-[#0D9488]/30 hover:text-[#0D9488] transition-all">
                            + Add New Trigger Rule
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'config' && (
                <div className="space-y-6 max-w-2xl">
                    {[
                        { label: 'Chatbot Enabled', key: 'enabled', type: 'toggle' },
                        { label: 'Chatbot Name', key: 'name', type: 'text' },
                        { label: 'Greeting Message', key: 'greeting', type: 'textarea' },
                        { label: 'Personality', key: 'personality', type: 'select', options: ['professional', 'friendly', 'casual', 'formal'] },
                        { label: 'Response Style', key: 'responseStyle', type: 'select', options: ['concise', 'detailed', 'balanced'] },
                        { label: 'Lead Capture Enabled', key: 'leadCapture', type: 'toggle' },
                        { label: 'Position', key: 'position', type: 'select', options: ['bottom-right', 'bottom-left'] },
                        { label: 'Auto-Open on Idle', key: 'autoOpen', type: 'toggle' },
                        { label: 'Auto-Open Delay (seconds)', key: 'autoOpenDelay', type: 'number' },
                    ].map(field => (
                        <div key={field.key} className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                            <span className="text-sm text-white">{field.label}</span>
                            {field.type === 'toggle' && (
                                <div onClick={() => setConfig(prev => ({ ...prev, [field.key]: !(prev as any)[field.key] }))}
                                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${(config as any)[field.key] ? 'bg-[#0D9488]' : 'bg-white/20'}`}>
                                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${(config as any)[field.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                </div>
                            )}
                            {field.type === 'text' && (
                                <input value={(config as any)[field.key]} onChange={(e) => setConfig(prev => ({ ...prev, [field.key]: e.target.value }))} className="w-64 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0D9488]/50 transition-all" />
                            )}
                            {field.type === 'textarea' && (
                                <textarea value={(config as any)[field.key]} onChange={(e) => setConfig(prev => ({ ...prev, [field.key]: e.target.value }))} rows={2} className="w-64 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0D9488]/50 transition-all resize-none" />
                            )}
                            {field.type === 'select' && (
                                <select value={(config as any)[field.key]} onChange={(e) => setConfig(prev => ({ ...prev, [field.key]: e.target.value }))} className="w-64 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0D9488]/50 transition-all">
                                    {field.options?.map(o => <option key={o} value={o} className="bg-[#0a0f1a] text-white">{o}</option>)}
                                </select>
                            )}
                            {field.type === 'number' && (
                                <input type="number" value={(config as any)[field.key]} onChange={(e) => setConfig(prev => ({ ...prev, [field.key]: Number(e.target.value) }))} className="w-64 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0D9488]/50 transition-all" />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
