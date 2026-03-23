'use client';

import Link from 'next/link';

const FOOTER_LINKS = {
    Platform: [
        { label: 'Dashboard', href: '/auth' },
        { label: 'Analytics', href: '/auth' },
        { label: 'Media Analyzer', href: '/auth' },
        { label: 'Reports', href: '/auth' },
    ],
    Company: [
        { label: 'About Us', href: '/about' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contact', href: '/contact' },
    ],
    Resources: [
        { label: 'Help Center', href: '#' },
        { label: 'API Docs', href: '#' },
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms of Service', href: '#' },
    ],
};

export function PublicFooter() {
    return (
        <footer className="border-t border-white/5 bg-[#080810] pt-20 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#0D9488] to-[#6929C4] rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-base">hub</span>
                            </div>
                            <span className="font-bold text-white">
                                Collaborative<span className="text-[#0D9488]"> Intelligence</span>
                            </span>
                        </div>
                        <p className="text-sm text-white/40 leading-relaxed mb-6">
                            Enterprise campaign intelligence platform powering data-driven decisions for global brands and agencies.
                        </p>
                        <p className="text-sm font-medium text-yellow-400/90 leading-snug">
                            Product by Integrated Media Marketing
                        </p>
                        <p className="text-sm font-semibold text-yellow-400 mt-0.5">
                            PT STIMULATE GLOBAL MEDIA
                        </p>
                    </div>

                    {Object.entries(FOOTER_LINKS).map(([category, links]) => (
                        <div key={category}>
                            <h5 className="text-white text-sm font-bold mb-5">{category}</h5>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-sm text-white/40 hover:text-[#0D9488] transition-colors">
                                            {link.label}
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
    );
}
