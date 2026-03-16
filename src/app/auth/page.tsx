'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Login error detail:', err);
      setError('An error occurred: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0C1222] px-4 relative overflow-hidden">
      {/* Background effects */}
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

        {/* Login Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-[rgba(22,32,50,0.6)] backdrop-blur-xl p-6 shadow-2xl shadow-black/30">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-white mb-1">Welcome back</h1>
            <p className="text-sm text-white/40">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium text-white/50">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-medium text-white/50">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
              />
            </div>
            {error && (
              <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-white/20 mt-6">
          Collaborative Intelligence &middot; Enterprise Analytics Platform
        </p>
      </div>
    </div>
  );
}
