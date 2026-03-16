'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_LINKS = [
    { label: 'About', href: '/about' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
];

export function PublicNav() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 glass-nav-dark">
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
                    {NAV_LINKS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`text-sm font-medium transition-colors relative group ${
                                pathname === item.href ? 'text-white' : 'text-white/60 hover:text-white'
                            }`}
                        >
                            {item.label}
                            <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#0D9488] transition-all duration-300 ${
                                pathname === item.href ? 'w-full' : 'w-0 group-hover:w-full'
                            }`} />
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <Link href="/auth" className="hidden sm:block px-5 py-2 text-sm font-medium text-white/80 border border-white/10 rounded-lg hover:border-[#0D9488]/50 hover:text-white transition-all">
                        Log In
                    </Link>
                    <Link href="/auth" className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#0D9488] to-[#0D9488]/90 rounded-lg shadow-lg shadow-[#0D9488]/20 hover:shadow-[#0D9488]/40 hover:scale-[1.02] active:scale-95 transition-all">
                        Get Started
                    </Link>
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden text-white/60 hover:text-white"
                    >
                        <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/5 px-6 py-4 space-y-3">
                    {NAV_LINKS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`block py-2 text-sm font-medium ${
                                pathname === item.href ? 'text-[#0D9488]' : 'text-white/60'
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
}
