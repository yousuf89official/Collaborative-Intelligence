'use client';

import { useState, useEffect, useRef } from 'react';

// ─── Animated Counter ────────────────────────────────────────────────────────

function useCounter(target: number, duration = 1400, delay = 0) {
    const [value, setValue] = useState(0);
    const mounted = useRef(false);
    useEffect(() => {
        mounted.current = true;
        const timeout = setTimeout(() => {
            const start = performance.now();
            const tick = (now: number) => {
                if (!mounted.current) return;
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                setValue(Math.round(eased * target));
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        }, delay);
        return () => { mounted.current = false; clearTimeout(timeout); };
    }, [target, duration, delay]);
    return value;
}

// ─── Donut Chart ─────────────────────────────────────────────────────────────

function DonutChart({ score, size = 64 }: { score: number; size?: number }) {
    const [progress, setProgress] = useState(0);
    const r = (size - 10) / 2;
    const circ = 2 * Math.PI * r;
    useEffect(() => {
        const t = setTimeout(() => setProgress(score), 600);
        return () => clearTimeout(t);
    }, [score]);
    const offset = circ - (progress / 100) * circ;
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
            <circle
                cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke="url(#donutGrad)" strokeWidth={8}
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.34,1.56,0.64,1)' }}
            />
            <defs>
                <linearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0D9488" />
                    <stop offset="100%" stopColor="#6929C4" />
                </linearGradient>
            </defs>
        </svg>
    );
}

// ─── Animated Bar ────────────────────────────────────────────────────────────

function AnimatedBar({ width, color, delay }: { width: number; color: string; delay: number }) {
    const [w, setW] = useState(0);
    useEffect(() => {
        const t = setTimeout(() => setW(width), delay);
        return () => clearTimeout(t);
    }, [width, delay]);
    return (
        <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
            <div
                className="h-full rounded-full"
                style={{
                    width: `${w}%`,
                    background: color,
                    transition: 'width 1.2s cubic-bezier(0.34,1.56,0.64,1)',
                }}
            />
        </div>
    );
}

// ─── Sparkline ───────────────────────────────────────────────────────────────

function Sparkline({ data, color }: { data: number[]; color: string }) {
    const w = 48; const h = 20;
    const max = Math.max(...data); const min = Math.min(...data);
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / (max - min + 1)) * h;
        return `${x},${y}`;
    }).join(' ');
    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
            <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// ─── Bar Chart ───────────────────────────────────────────────────────────────

const CHART_DATA = [
    { label: 'Oct', v: 42 }, { label: 'Nov', v: 58 }, { label: 'Dec', v: 38 },
    { label: 'Jan', v: 74 }, { label: 'Feb', v: 55 }, { label: 'Mar', v: 68 },
    { label: 'Apr', v: 48 }, { label: 'May', v: 91 }, { label: 'Jun', v: 65 },
    { label: 'Jul', v: 77 }, { label: 'Aug', v: 52 }, { label: 'Sep', v: 83 },
];

function BarChart() {
    const [heights, setHeights] = useState(CHART_DATA.map(() => 0));
    const [active, setActive] = useState(7);
    useEffect(() => {
        const t = setTimeout(() => {
            setHeights(CHART_DATA.map(d => d.v));
        }, 500);
        // Cycle active bar
        const cycle = setInterval(() => {
            setActive(a => (a + 1) % CHART_DATA.length);
        }, 2000);
        return () => { clearTimeout(t); clearInterval(cycle); };
    }, []);

    return (
        <div className="flex items-end gap-[3px] h-full">
            {CHART_DATA.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <div
                        className="w-full rounded-t-[2px] transition-all duration-75 relative"
                        style={{
                            height: `${heights[i]}%`,
                            background: i === active
                                ? 'linear-gradient(to top, #0D9488, #0ea5e9)'
                                : 'rgba(255,255,255,0.07)',
                            transition: heights[i] === 0 ? 'none' : 'height 1s cubic-bezier(0.34,1.56,0.64,1), background 0.4s ease',
                            transitionDelay: `${i * 50}ms`,
                            boxShadow: i === active ? '0 0 8px rgba(13,148,136,0.4)' : 'none',
                        }}
                    />
                </div>
            ))}
        </div>
    );
}

// ─── Live Feed Item ───────────────────────────────────────────────────────────

const FEED_ITEMS = [
    { icon: 'G', color: '#4285F4', msg: 'Google Ads synced', time: '2s ago', type: 'sync' },
    { icon: 'f', color: '#1877F2', msg: 'Meta campaign updated', time: '18s ago', type: 'update' },
    { icon: '♦', color: '#FF0050', msg: 'TikTok Ads report ready', time: '1m ago', type: 'report' },
];

// ─── Platform Stats Data ─────────────────────────────────────────────────────

const PLATFORMS = [
    { name: 'Google Ads', pct: 45, color: 'linear-gradient(90deg,#4285F4,#34A853)', spark: [30, 42, 38, 55, 48, 62, 45, 58] },
    { name: 'Meta Ads',   pct: 32, color: 'linear-gradient(90deg,#1877F2,#4267B2)', spark: [22, 31, 27, 35, 32, 40, 37, 44] },
    { name: 'TikTok',     pct: 23, color: 'linear-gradient(90deg,#FF0050,#FF4081)', spark: [10, 18, 14, 22, 19, 26, 23, 30] },
];

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({ label, value, suffix, prefix, trend, icon, color, delay }: {
    label: string; value: number; suffix?: string; prefix?: string;
    trend: number; icon: string; color: string; delay: number;
}) {
    const count = useCounter(value, 1400, delay);
    return (
        <div className="bg-white/[0.04] rounded-lg border border-white/[0.06] p-2.5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
                <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest truncate">{label}</span>
                <span className="text-[8px]" style={{ color }}>{icon}</span>
            </div>
            <div className="text-base font-black text-white leading-none">
                {prefix}{count >= 1000 ? (count / 1000).toFixed(count >= 1000000 ? 1 : 0) + (count >= 1000000 ? 'M' : 'K') : count}{suffix}
            </div>
            <div className="flex items-center gap-1">
                <span className="text-[8px] font-bold" style={{ color: trend >= 0 ? '#10B981' : '#EF4444' }}>
                    {trend >= 0 ? '↑' : '↓'}{Math.abs(trend)}%
                </span>
                <span className="text-[8px] text-white/25">vs last month</span>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function HeroDashboardPreview() {
    const [tick, setTick] = useState(0);
    const [liveIndex, setLiveIndex] = useState(0);
    const score = useCounter(78, 1600, 400);

    // Pulse the live index every 3s
    useEffect(() => {
        const t = setInterval(() => {
            setTick(n => n + 1);
            setLiveIndex(i => (i + 1) % FEED_ITEMS.length);
        }, 3000);
        return () => clearInterval(t);
    }, []);

    const STATS = [
        { label: 'Active Campaigns', value: 14, suffix: '', prefix: '', trend: 12, icon: '◉', color: '#0D9488', delay: 200 },
        { label: 'Total Spend',      value: 4200, suffix: 'M', prefix: 'Rp ', trend: 8, icon: '₽', color: '#6929C4', delay: 350 },
        { label: 'Impressions',      value: 28300, suffix: '', prefix: '', trend: 23, icon: '◎', color: '#0ea5e9', delay: 500 },
        { label: 'Avg. ROAS',        value: 48, suffix: 'x', prefix: '', trend: 5, icon: '✦', color: '#10B981', delay: 650 },
    ];

    return (
        <div className="aspect-[16/9] bg-[#0a0f1a] p-3 grid grid-cols-12 gap-2.5 text-white overflow-hidden">

            {/* ── Sidebar ── */}
            <div className="col-span-2 flex flex-col gap-2">
                {/* Logo */}
                <div className="flex items-center gap-1.5 px-1 mb-1">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#0D9488] to-[#6929C4] flex items-center justify-center flex-shrink-0">
                        <span className="text-[8px] font-black text-white">CI</span>
                    </div>
                    <span className="text-[9px] font-black text-white truncate">Collaborative<span className="text-[#0D9488]"> Intel</span></span>
                </div>

                {/* Nav Items */}
                {[
                    { icon: '⊞', label: 'Overview', active: true },
                    { icon: '◎', label: 'Campaigns' },
                    { icon: '↗', label: 'Analytics' },
                    { icon: '⚡', label: 'Integrations' },
                    { icon: '☰', label: 'Reports' },
                ].map(item => (
                    <div key={item.label} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[9px] font-bold transition-colors ${item.active ? 'bg-[#0D9488]/20 text-[#0D9488] border border-[#0D9488]/20' : 'text-white/30 hover:text-white/60'}`}>
                        <span className="text-[10px]">{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                    </div>
                ))}

                {/* Brand pills */}
                <div className="mt-auto space-y-1">
                    <div className="text-[7px] font-black text-white/20 uppercase tracking-widest px-1">Brands</div>
                    {['NovaTech', 'PrimeFuel', 'AeroStyle'].map((b, i) => (
                        <div key={b} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.03]">
                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: ['#0D9488', '#6929C4', '#0ea5e9'][i] }} />
                            <span className="text-[8px] text-white/40 truncate">{b}</span>
                            <div className={`ml-auto w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-emerald-400 animate-pulse' : 'bg-white/10'}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Main Content ── */}
            <div className="col-span-7 flex flex-col gap-2.5">

                {/* Header row */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-[10px] font-black text-white">Campaign Overview</div>
                        <div className="text-[8px] text-white/30">Real-time intelligence · Q4 2025</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span className="text-[8px] font-bold text-emerald-400">LIVE</span>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-4 gap-2">
                    {STATS.map(s => <StatCard key={s.label} {...s} />)}
                </div>

                {/* Chart */}
                <div className="flex-1 bg-white/[0.03] rounded-lg border border-white/[0.05] p-3 flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-black text-white/70">Performance Trend</span>
                        <div className="flex gap-1">
                            {['1W', '1M', '3M', '1Y'].map((t, i) => (
                                <span key={t} className={`text-[7px] px-1.5 py-0.5 rounded font-bold ${i === 2 ? 'bg-[#0D9488]/20 text-[#0D9488]' : 'text-white/25'}`}>{t}</span>
                            ))}
                        </div>
                    </div>

                    {/* Bars */}
                    <div className="flex-1 flex flex-col justify-end gap-1 min-h-0">
                        <div className="flex-1 min-h-0">
                            <BarChart />
                        </div>
                        {/* Month labels */}
                        <div className="flex gap-[3px]">
                            {CHART_DATA.map(d => (
                                <div key={d.label} className="flex-1 text-center text-[6px] text-white/20">{d.label}</div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Live Activity */}
                <div className="bg-white/[0.03] rounded-lg border border-white/[0.05] p-2.5">
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-[8px] font-black text-white/50">Live Activity</span>
                    </div>
                    <div className="flex gap-2">
                        {FEED_ITEMS.map((item, i) => (
                            <div key={i} className={`flex-1 flex items-center gap-1.5 transition-all duration-500 ${i === liveIndex ? 'opacity-100' : 'opacity-30'}`}>
                                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-black" style={{ background: item.color + '22', color: item.color, border: `1px solid ${item.color}33` }}>
                                    {item.icon}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-[8px] font-semibold text-white/70 truncate">{item.msg}</div>
                                    <div className="text-[7px] text-white/25">{item.time}</div>
                                </div>
                                {i === liveIndex && (
                                    <span className="ml-auto flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Right Panel ── */}
            <div className="col-span-3 flex flex-col gap-2.5">

                {/* Score Ring */}
                <div className="bg-white/[0.03] rounded-lg border border-white/[0.05] p-3 flex flex-col items-center gap-1">
                    <div className="text-[8px] font-black text-white/50 self-start">Performance Score</div>
                    <div className="relative flex items-center justify-center my-1">
                        <DonutChart score={score} size={72} />
                        <div className="absolute text-center">
                            <div className="text-lg font-black text-white leading-none">{score}</div>
                            <div className="text-[7px] text-white/30">/ 100</div>
                        </div>
                    </div>
                    <div className="flex gap-2 w-full">
                        {[['Efficiency', '92%', '#0D9488'], ['Quality', '74%', '#6929C4']].map(([l, v, c]) => (
                            <div key={l as string} className="flex-1 text-center">
                                <div className="text-[9px] font-black" style={{ color: c as string }}>{v}</div>
                                <div className="text-[7px] text-white/25">{l}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Platform Breakdown */}
                <div className="bg-white/[0.03] rounded-lg border border-white/[0.05] p-3 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black text-white/50">Platform Breakdown</span>
                        <span className="text-[7px] text-[#0D9488] font-bold">3 Active</span>
                    </div>
                    {PLATFORMS.map((p, i) => (
                        <div key={p.name} className="space-y-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-sm" style={{ background: p.color }} />
                                    <span className="text-[8px] font-semibold text-white/60">{p.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Sparkline data={p.spark} color={['#4285F4', '#1877F2', '#FF0050'][i]} />
                                    <span className="text-[8px] font-black text-white/70">{p.pct}%</span>
                                </div>
                            </div>
                            <AnimatedBar width={p.pct} color={p.color} delay={600 + i * 150} />
                        </div>
                    ))}
                </div>

                {/* Campaign Status Cards */}
                <div className="bg-white/[0.03] rounded-lg border border-white/[0.05] p-3 flex flex-col gap-1.5">
                    <div className="text-[8px] font-black text-white/50 mb-0.5">Active Campaigns</div>
                    {[
                        { name: 'Q4 Brand Awareness', status: 'Running', pct: 72, color: '#10B981' },
                        { name: 'Holiday Sale Push',  status: 'Running', pct: 45, color: '#0D9488' },
                        { name: 'Retargeting Dec',    status: 'Draft',   pct: 12, color: '#6929C4' },
                    ].map(c => (
                        <div key={c.name} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse" style={{ background: c.color }} />
                            <div className="flex-1 min-w-0">
                                <div className="text-[8px] font-semibold text-white/60 truncate">{c.name}</div>
                                <div className="h-1 bg-white/[0.04] rounded-full mt-0.5 overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: c.color, transition: 'width 1.5s ease' }} />
                                </div>
                            </div>
                            <span className="text-[7px] font-bold flex-shrink-0" style={{ color: c.color }}>{c.pct}%</span>
                        </div>
                    ))}
                </div>

                {/* AI Insight chip */}
                <div className="bg-gradient-to-r from-[#0D9488]/10 to-[#6929C4]/10 rounded-lg border border-[#0D9488]/20 p-2.5">
                    <div className="flex items-start gap-1.5">
                        <span className="text-[10px] text-[#0D9488] mt-0.5">✦</span>
                        <div>
                            <div className="text-[8px] font-black text-[#0D9488]">AI Insight</div>
                            <div className="text-[7px] text-white/40 leading-relaxed">Meta CTR up 18% — increase daily budget by Rp 2M for optimal ROAS</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
