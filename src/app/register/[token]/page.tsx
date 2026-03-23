'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Eye, EyeOff, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';

export default function RegisterPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = use(params);
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [roleAtWork, setRoleAtWork] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Password validation
    const hasMinLength = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const isPasswordValid = hasMinLength && hasLetter && hasNumber;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isPasswordValid) return;
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, name, email, password, roleAtWork }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Registration failed');
            } else {
                setSuccess(true);
                setTimeout(() => router.push('/auth'), 3000);
            }
        } catch {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0C1222] px-4 relative overflow-hidden">
                <div className="absolute inset-0 hero-glow pointer-events-none" />
                <div className="absolute inset-0 dark-grid-bg pointer-events-none opacity-50" />
                <div className="w-full max-w-sm relative z-10 text-center">
                    <div className="rounded-2xl border border-white/[0.08] bg-[rgba(22,32,50,0.6)] backdrop-blur-xl p-8 shadow-2xl shadow-black/30">
                        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="h-8 w-8 text-green-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Registration Successful!</h2>
                        <p className="text-sm text-white/40 mb-1">Your account is pending admin approval.</p>
                        <p className="text-xs text-white/30">Redirecting to login page...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0C1222] px-4 py-8 relative overflow-hidden">
            <div className="absolute inset-0 hero-glow pointer-events-none" />
            <div className="absolute inset-0 dark-grid-bg pointer-events-none opacity-50" />

            <div className="w-full max-w-sm relative z-10">
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="h-10 w-10 bg-gradient-to-br from-[#0D9488] to-[#0EA5E9] rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                        <span className="material-symbols-outlined text-white text-lg">hub</span>
                    </div>
                    <span className="font-bold text-lg text-white tracking-tight">Collaborative Intelligence</span>
                </div>

                {/* Registration Card */}
                <div className="rounded-2xl border border-white/[0.08] bg-[rgba(22,32,50,0.6)] backdrop-blur-xl p-6 shadow-2xl shadow-black/30">
                    <div className="mb-6">
                        <h1 className="text-xl font-bold text-white mb-1">Create your account</h1>
                        <p className="text-sm text-white/40">You&apos;ve been invited to join the platform</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-white/50 block">Full Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your full name"
                                className="flex h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-white shadow-sm transition-colors placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]/40 focus-visible:border-[#0D9488]/40 hover:bg-white/[0.06]"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-white/50 block">Email (Login)</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@company.com"
                                className="flex h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-white shadow-sm transition-colors placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]/40 focus-visible:border-[#0D9488]/40 hover:bg-white/[0.06]"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-white/50 block">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min 8 characters, letters & numbers"
                                    className="flex h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 pr-10 py-1 text-sm text-white shadow-sm transition-colors placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]/40 focus-visible:border-[#0D9488]/40 hover:bg-white/[0.06]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {/* Password requirements */}
                            {password.length > 0 && (
                                <div className="space-y-1 mt-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${hasMinLength ? 'bg-green-400' : 'bg-white/20'}`} />
                                        <span className={`text-[11px] ${hasMinLength ? 'text-green-400' : 'text-white/30'}`}>At least 8 characters</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${hasLetter ? 'bg-green-400' : 'bg-white/20'}`} />
                                        <span className={`text-[11px] ${hasLetter ? 'text-green-400' : 'text-white/30'}`}>Contains letters</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${hasNumber ? 'bg-green-400' : 'bg-white/20'}`} />
                                        <span className={`text-[11px] ${hasNumber ? 'text-green-400' : 'text-white/30'}`}>Contains numbers</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Role at Work */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-white/50 block">Role at Work</label>
                            <input
                                type="text"
                                required
                                value={roleAtWork}
                                onChange={(e) => setRoleAtWork(e.target.value)}
                                placeholder="e.g. Marketing Manager, Analyst"
                                className="flex h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-white shadow-sm transition-colors placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]/40 focus-visible:border-[#0D9488]/40 hover:bg-white/[0.06]"
                            />
                        </div>

                        {error && (
                            <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                                <p className="text-xs text-red-400">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !isPasswordValid}
                            className="w-full h-11 rounded-xl bg-[#0D9488] text-white text-sm font-bold shadow-lg shadow-teal-500/20 hover:bg-[#0F766E] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="h-4 w-4" />
                                    Create Account
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-4 pt-4 border-t border-white/[0.06] text-center">
                        <p className="text-[11px] text-white/20">
                            Already have an account?{' '}
                            <a href="/auth" className="text-[#0D9488] hover:text-[#0D9488]/80 transition-colors">Sign in</a>
                        </p>
                    </div>
                </div>

                <p className="text-center text-xs text-white/20 mt-6">
                    Collaborative Intelligence &middot; Enterprise Analytics Platform
                </p>
            </div>
        </div>
    );
}
