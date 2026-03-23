'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Briefcase,
    Megaphone,
    FileBarChart,
    Settings,
    Users,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Grid,
    Database,
    Calculator,
    User,
    FileText,
    Link2,
    Layers,
    Search,
    Palette,
    BarChart3,
    Building2,
    CreditCard,
    Shield,
    Key,
    Plug,
    Activity,
    Bot,
    ChevronDown,
    Menu,
    X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { ALL_FEATURES, hasFeatureAccess } from '@/lib/features';

interface NavItem {
    label: string;
    icon: any;
    href: string;
}

interface NavSection {
    title: string;
    items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
    {
        title: 'Overview',
        items: [
            { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
            { label: 'Widgets & Cards', icon: Grid, href: '/dashboard/widgets' },
        ],
    },
    {
        title: 'Operations',
        items: [
            { label: 'Brands', icon: Briefcase, href: '/brands' },
            { label: 'Media Analyzer', icon: Calculator, href: '/ave-calculator' },
            { label: 'Campaigns', icon: Megaphone, href: '/admin/brand-campaign-settings' },
            { label: 'Reports', icon: FileBarChart, href: '/reports' },
        ],
    },
    {
        title: 'Public Site',
        items: [
            { label: 'CMS Manager', icon: Layers, href: '/admin/cms' },
            { label: 'SEO / AEO Manager', icon: Search, href: '/admin/seo-manager' },
            { label: 'Brand Identity', icon: Palette, href: '/admin/brand-identity' },
            { label: 'AI Chatbot', icon: Bot, href: '/admin/chatbot' },
        ],
    },
    {
        title: 'Growth & Revenue',
        items: [
            { label: 'Analytics & Tracking', icon: BarChart3, href: '/admin/analytics' },
            { label: 'Whitelabel System', icon: Building2, href: '/admin/whitelabel' },
            { label: 'Billing & Referrals', icon: CreditCard, href: '/admin/billing' },
        ],
    },
    {
        title: 'Platform',
        items: [
            { label: 'Integrations', icon: Plug, href: '/admin/integrations' },
            { label: 'API Keys', icon: Key, href: '/admin/api-keys' },
            { label: 'Users & Roles', icon: Users, href: '/admin/users' },
            { label: 'Security', icon: Shield, href: '/admin/security' },
            { label: 'Activity Logs', icon: Activity, href: '/admin/activity-logs' },
        ],
    },
    {
        title: 'Tools',
        items: [
            { label: 'Database', icon: Database, href: '/admin/database' },
            { label: 'Create Invoice', icon: FileText, href: '/tools/invoice' },
            { label: 'Post ID Extractors', icon: Link2, href: '/tools/extractors' },
            { label: 'Settings', icon: Settings, href: '/admin/settings' },
        ],
    },
];

export const Sidebar = () => {
    const pathname = usePathname();
    const { logout, user } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

    const toggleSection = (title: string) => {
        setCollapsedSections(prev => ({ ...prev, [title]: !prev[title] }));
    };

    // Close mobile drawer on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    // Lock body scroll when mobile drawer is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const sidebarContent = (isMobile: boolean) => (
        <>
            {/* Logo Section */}
            <div className="h-16 flex items-center justify-between px-5 border-b border-white/[0.06]">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="h-9 w-9 bg-gradient-to-br from-[#0D9488] to-[#0EA5E9] rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-teal-500/20">
                        <span className="material-symbols-outlined text-white text-base">hub</span>
                    </div>
                    <AnimatePresence>
                        {(isMobile || !collapsed) && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="font-bold text-sm tracking-tight whitespace-nowrap text-white"
                            >
                                Collaborative Intelligence
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
                {isMobile && (
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Toggle Button — desktop only */}
            {!isMobile && (
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-20 bg-[#0D9488] text-white p-1 rounded-full shadow-lg shadow-teal-500/30 hover:bg-[#0F766E] transition-colors border-2 border-[#0C1222] z-10"
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            )}

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
                {NAV_SECTIONS.map((section) => {
                    // Filter items by user permissions
                    const visibleItems = section.items.filter(item => {
                        const feature = ALL_FEATURES.find(f => f.href === item.href);
                        if (!feature) return true;
                        return hasFeatureAccess(user?.role || '', (user as any)?.permissions, feature.key);
                    });
                    if (visibleItems.length === 0) return null;

                    return (
                    <div key={section.title} className="mb-2">
                        {/* Section Header */}
                        {(isMobile || !collapsed) ? (
                            <button
                                onClick={() => toggleSection(section.title)}
                                className="w-full flex items-center justify-between px-3 py-1.5 mb-1 group"
                            >
                                <span className="text-[10px] font-bold text-white/25 uppercase tracking-[0.15em] group-hover:text-white/40 transition-colors">
                                    {section.title}
                                </span>
                                <ChevronDown
                                    size={12}
                                    className={cn(
                                        "text-white/15 transition-transform group-hover:text-white/30",
                                        collapsedSections[section.title] && "-rotate-90"
                                    )}
                                />
                            </button>
                        ) : (
                            <div className="h-px bg-white/[0.04] my-2 mx-2" />
                        )}

                        {/* Section Items */}
                        {!collapsedSections[section.title] && visibleItems.map((item) => {
                            const isActive = (pathname || '').startsWith(item.href);
                            const isExactMatch = item.href === '/dashboard' && pathname === '/dashboard';
                            const isHighlighted = item.href === '/dashboard' ? isExactMatch : isActive;

                            return (
                                <Link key={item.href} href={item.href}>
                                    <div className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group relative",
                                        isHighlighted
                                            ? "bg-[#0D9488]/10 text-white font-medium"
                                            : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                                    )}>
                                        {isHighlighted && (
                                            <motion.div
                                                layoutId="activeNav"
                                                className="absolute left-0 w-1 h-5 bg-gradient-to-b from-[#0D9488] to-[#0EA5E9] rounded-r-full"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            />
                                        )}
                                        <item.icon size={18} className={cn("shrink-0", isHighlighted && "text-[#0D9488]")} />
                                        {(isMobile || !collapsed) && (
                                            <span className="text-xs">{item.label}</span>
                                        )}

                                        {!isMobile && collapsed && (
                                            <div className="absolute left-14 bg-[#162032] text-white px-3 py-1.5 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl border border-white/10">
                                                {item.label}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                    );
                })}
            </nav>

            {/* Footer / User */}
            <div
                className="p-3 border-t border-white/[0.06] relative"
                onMouseEnter={() => setShowProfileMenu(true)}
                onMouseLeave={() => setShowProfileMenu(false)}
            >
                <AnimatePresence>
                    {showProfileMenu && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className={cn(
                                "absolute bottom-full left-3 mb-2 glass rounded-xl shadow-2xl overflow-hidden z-[100]",
                                (isMobile || !collapsed) ? "w-[214px]" : "w-[160px]"
                            )}
                        >
                            <div className="p-3 border-b border-white/[0.06] bg-white/[0.03]">
                                <p className="text-xs font-bold text-white truncate">{user?.name || 'Guest User'}</p>
                                <p className="text-[10px] text-white/40 truncate">{user?.email || 'N/A'}</p>
                            </div>
                            <div className="p-1.5">
                                <Link href="/profile">
                                    <button className="flex items-center gap-3 w-full px-3 py-2 text-xs text-white/60 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors">
                                        <User size={14} /> Profile
                                    </button>
                                </Link>
                                <Link href="/admin/settings">
                                    <button className="flex items-center gap-3 w-full px-3 py-2 text-xs text-white/60 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors">
                                        <Settings size={14} /> Settings
                                    </button>
                                </Link>
                                <div className="h-px bg-white/[0.06] my-1 mx-2" />
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-3 w-full px-3 py-2 text-xs text-red-300/70 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <LogOut size={14} /> Sign Out
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 cursor-pointer",
                    showProfileMenu ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                )}>
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#0D9488] to-[#0EA5E9] flex items-center justify-center text-white shrink-0 shadow-lg shadow-teal-500/20 border border-white/10">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
                        ) : (
                            <span className="font-bold text-xs">{(user?.name || 'G').charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    {(isMobile || !collapsed) && (
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate text-white/90">{user?.name || 'Guest'}</p>
                            <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold truncate">{user?.role || 'Guest'}</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile hamburger button */}
            <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl glass text-white/70 hover:text-white transition-colors"
                aria-label="Open menu"
            >
                <Menu size={22} />
            </button>

            {/* Mobile overlay drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                            onClick={() => setMobileOpen(false)}
                        />
                        {/* Drawer */}
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                            className="lg:hidden fixed left-0 top-0 bottom-0 w-[280px] glass-sidebar flex flex-col z-50 text-white shadow-2xl"
                        >
                            {sidebarContent(true)}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop sidebar */}
            <motion.aside
                initial={{ width: 240 }}
                animate={{ width: collapsed ? 80 : 240 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="hidden lg:flex h-screen glass-sidebar flex-col relative z-40 text-white"
            >
                {sidebarContent(false)}
            </motion.aside>
        </>
    );
};
