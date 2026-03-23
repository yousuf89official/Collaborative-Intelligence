'use client';

import { useState, useEffect, use } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, Eye, EyeOff } from 'lucide-react';

interface PortalConfig {
    brandName: string;
    logo: string | null;
    primaryColor: string;
    accentColor: string;
    loginMessage: string | null;
    customCss: string | null;
}

export default function ClientPortalPage({ params }: { params: Promise<{ domain: string }> }) {
    const { domain } = use(params);
    const router = useRouter();
    const [config, setConfig] = useState<PortalConfig | null>(null);
    const [loadingConfig, setLoadingConfig] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`/api/whitelabel/lookup?domain=${encodeURIComponent(domain)}`)
            .then(r => {
                if (!r.ok) { setNotFound(true); setLoadingConfig(false); return null; }
                return r.json();
            })
            .then(data => { if (data) { setConfig(data); setLoadingConfig(false); } })
            .catch(() => { setNotFound(true); setLoadingConfig(false); });
    }, [domain]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', { email, password, redirect: false });
            if (result?.error) {
                const msg = result.error;
                if (msg.includes('pending')) setError('Your account is pending approval');
                else if (msg.includes('suspended')) setError('Your account has been suspended');
                else if (msg.includes('inactive')) setError('Your account is inactive');
                else setError('Invalid email or password');
            } else {
                router.push('/dashboard');
            }
        } catch {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (loadingConfig) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0C1222]">
                <Loader2 className="h-8 w-8 animate-spin text-white/20" />
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0C1222] px-4">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-2">404</h1>
                    <p className="text-white/40">This portal does not exist</p>
                </div>
            </div>
        );
    }

    const primary = config?.primaryColor || '#0D9488';
    const accent = config?.accentColor || '#0EA5E9';

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0C1222] px-4 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, ${primary}15 0%, transparent 70%)` }} />

            {/* Custom CSS injection */}
            {config?.customCss && <style dangerouslySetInnerHTML={{ __html: config.customCss }} />}

            <div className="w-full max-w-sm relative z-10">
                {/* Logo / Brand */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    {config?.logo ? (
                        <img src={config.logo} alt={config.brandName} className="h-10 w-auto" />
                    ) : (
                        <div className="h-10 w-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}>
                            <span className="text-white font-bold text-lg">{config?.brandName?.charAt(0) || 'C'}</span>
                        </div>
                    )}
                    <span className="font-bold text-lg text-white tracking-tight">{config?.brandName || 'Client Portal'}</span>
                </div>

                {/* Login Card */}
                <div className="rounded-2xl border border-white/[0.08] bg-[rgba(22,32,50,0.6)] backdrop-blur-xl p-6 shadow-2xl shadow-black/30">
                    <div className="mb-6">
                        <h1 className="text-xl font-bold text-white mb-1">Welcome back</h1>
                        <p className="text-sm text-white/40">{config?.loginMessage || 'Sign in to access your dashboard'}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-white/50 block">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@company.com"
                                className="flex h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-white shadow-sm transition-colors placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:border-transparent hover:bg-white/[0.06]"
                                style={{ '--tw-ring-color': `${primary}60` } as any}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-white/50 block">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="flex h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 pr-10 py-1 text-sm text-white shadow-sm transition-colors placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:border-transparent hover:bg-white/[0.06]"
                                    style={{ '--tw-ring-color': `${primary}60` } as any}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                                <p className="text-xs text-red-400">{error}</p>
                            </div>
                        )}

                        <button type="submit" disabled={loading}
                            className="w-full h-11 rounded-xl text-white text-sm font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            style={{ background: primary, boxShadow: `0 10px 25px ${primary}30` }}>
                            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</> : 'Sign In'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-white/15 mt-6">
                    Powered by Collaborative Intelligence
                </p>
            </div>
        </div>
    );
}
