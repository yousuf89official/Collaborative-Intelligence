'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
    id: number;
    role: 'bot' | 'user';
    text: string;
    timestamp: Date;
}

const QUICK_REPLIES = [
    'What does Collaborative Intelligence do?',
    'Show me pricing plans',
    'I want a demo',
    'How does whitelabeling work?',
];

const BOT_RESPONSES: Record<string, string> = {
    'what does collaborative intelligence do': 'Collaborative Intelligence is an enterprise campaign intelligence platform that unifies all your media data — from Google Ads, Meta, TikTok, and more — into a single real-time dashboard. We help brands and agencies track performance, measure ROI, and optimize campaigns across every channel.',
    'show me pricing': 'We offer three plans:\n\n• **Starter** — Free for up to 3 campaigns\n• **Professional** — $199/mo (or $159/mo yearly) with unlimited campaigns, AI insights, and API access\n• **Enterprise** — Custom pricing with whitelabel, SSO, dedicated support, and SLA guarantees\n\nWould you like me to help you choose the right plan?',
    'demo': 'We\'d love to show you a live demo! You can book a personalized walkthrough with our team. Just share your email and we\'ll set up a time that works for you. Or visit our Contact page to schedule directly.',
    'whitelabel': 'Our whitelabel system lets agencies rebrand the entire platform as their own — custom domain, logo, colors, and client portal. Plans start at $799/mo (Professional WL) with 40-60% margin potential. Enterprise WL at $2,499/mo offers 60-80% margins with unlimited clients. Want to learn more?',
    'pricing': 'We offer three plans:\n\n• **Starter** — Free for up to 3 campaigns\n• **Professional** — $199/mo (or $159/mo yearly) with unlimited campaigns, AI insights, and API access\n• **Enterprise** — Custom pricing with whitelabel, SSO, dedicated support, and SLA guarantees\n\nWould you like me to help you choose the right plan?',
    'hello': 'Hello! Welcome to Collaborative Intelligence. I\'m here to help you learn about our platform, pricing, or anything else. What would you like to know?',
    'hi': 'Hi there! How can I help you today? Feel free to ask about our platform features, pricing, or request a demo.',
};

function getBotResponse(input: string): string {
    const lower = input.toLowerCase().trim();
    for (const [key, response] of Object.entries(BOT_RESPONSES)) {
        if (lower.includes(key)) return response;
    }
    return 'Thanks for your question! Our team would be happy to help with that. You can reach us at hello@collaborativeintelligence.com or visit our Contact page for a quick response. Is there anything else I can help with?';
}

export function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, role: 'bot', text: 'Hi! I\'m the IMH assistant. How can I help you today?', timestamp: new Date() },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [hasOpened, setHasOpened] = useState(false);
    const [showPulse, setShowPulse] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Auto-open after 15 seconds on first visit
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!hasOpened) setShowPulse(true);
        }, 15000);
        return () => clearTimeout(timer);
    }, [hasOpened]);

    const sendMessage = (text: string) => {
        if (!text.trim()) return;

        const userMsg: Message = { id: Date.now(), role: 'user', text: text.trim(), timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const botResponse = getBotResponse(text);
            const botMsg: Message = { id: Date.now() + 1, role: 'bot', text: botResponse, timestamp: new Date() };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 800 + Math.random() * 700);
    };

    const handleOpen = () => {
        setIsOpen(true);
        setHasOpened(true);
        setShowPulse(false);
    };

    return (
        <>
            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-[100] w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10 flex flex-col bg-[#0f0f18] animate-in slide-in-from-bottom-4 fade-in duration-300">
                    {/* Header */}
                    <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-[#0D9488] to-[#6929C4] shrink-0">
                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-lg">smart_toy</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-white">IMH Assistant</p>
                            <p className="text-[10px] text-white/70">Typically replies instantly</p>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-xl">close</span>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                    msg.role === 'user'
                                        ? 'bg-[#0D9488] text-white rounded-br-md'
                                        : 'bg-white/[0.06] text-white/80 border border-white/5 rounded-bl-md'
                                }`}>
                                    {msg.text.split('\n').map((line, i) => (
                                        <span key={i}>
                                            {line.replace(/\*\*(.*?)\*\*/g, '$1')}
                                            {i < msg.text.split('\n').length - 1 && <br />}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white/[0.06] border border-white/5 px-4 py-3 rounded-2xl rounded-bl-md flex gap-1.5">
                                    <span className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Replies */}
                    {messages.length <= 2 && (
                        <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
                            {QUICK_REPLIES.map(q => (
                                <button key={q} onClick={() => sendMessage(q)} className="px-3 py-1.5 text-[11px] font-medium bg-white/5 border border-white/10 text-white/60 rounded-full hover:bg-[#0D9488]/10 hover:border-[#0D9488]/30 hover:text-white transition-all">
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div className="px-4 py-3 border-t border-white/5 shrink-0">
                        <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#0D9488]/50 transition-all"
                            />
                            <button type="submit" disabled={!input.trim()} className="px-3 py-2.5 bg-[#0D9488] text-white rounded-xl hover:bg-[#0043CE] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                                <span className="material-symbols-outlined text-lg">send</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => isOpen ? setIsOpen(false) : handleOpen()}
                className="fixed bottom-6 right-6 z-[100] w-14 h-14 bg-gradient-to-br from-[#0D9488] to-[#6929C4] rounded-full shadow-lg shadow-[#0D9488]/30 hover:shadow-[#0D9488]/50 hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
            >
                {showPulse && !isOpen && (
                    <span className="absolute inset-0 rounded-full bg-[#0D9488] animate-ping opacity-30" />
                )}
                <span className="material-symbols-outlined text-white text-2xl">
                    {isOpen ? 'close' : 'chat'}
                </span>
            </button>
        </>
    );
}
