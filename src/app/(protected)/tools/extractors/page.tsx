'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Link2, Copy, Check, Trash2, RefreshCw, Instagram } from 'lucide-react';

// ─── Shared types & helpers ───

interface IgResult {
    shortcode: string;
    mediaId: string | null;
    postType: string;
    postTypeLabel: string;
    originalUrl: string;
}

interface TtResult {
    videoId: string | null;
    shortCode?: string;
    username: string | null;
    postType: string;
    postTypeLabel: string;
    originalUrl: string;
    isShortUrl: boolean;
}

interface HistoryItem {
    id: string;
    shortcode?: string;
    mediaId?: string;
    videoId?: string | null;
    shortCode?: string | null;
    username?: string | null;
    postType: string;
    originalUrl: string;
    isShortUrl?: boolean;
    createdAt: string;
}

const IG_TYPE_COLORS: Record<string, string> = {
    post: 'bg-sky-100 text-sky-700',
    reel: 'bg-amber-100 text-amber-700',
    tv: 'bg-purple-100 text-purple-700',
    story: 'bg-green-100 text-green-700',
};

const TT_TYPE_COLORS: Record<string, string> = {
    video: 'bg-cyan-100 text-cyan-700',
    photo: 'bg-amber-100 text-amber-700',
    embed: 'bg-purple-100 text-purple-700',
    share: 'bg-green-100 text-green-700',
    short: 'bg-pink-100 text-pink-700',
    trending: 'bg-rose-100 text-rose-700',
};

const IG_EXAMPLES = [
    { type: 'Post', url: 'https://www.instagram.com/p/C8W9X7ys1aR/' },
    { type: 'Reel', url: 'https://www.instagram.com/reel/DAhK2L_ySzJ/' },
    { type: 'IGTV', url: 'https://www.instagram.com/tv/CWtB3xYJhFm/' },
    { type: 'Story', url: 'https://www.instagram.com/stories/instagram/3456789012345678901/' },
];

const TT_EXAMPLES = [
    { type: 'Video', url: 'https://www.tiktok.com/@charlidamelio/video/7067695578729221378' },
    { type: 'Photo', url: 'https://www.tiktok.com/@username/photo/7234567890123456789' },
    { type: 'Short', url: 'https://vm.tiktok.com/ZMF6rgvXY/' },
    { type: 'Mobile', url: 'https://m.tiktok.com/v/6749869095467945218.html' },
];

// ─── Copy button ───

function CopyButton({ text, label }: { text: string; label: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <button
            onClick={handleCopy}
            title={`Copy ${label}`}
            className="p-1 rounded hover:bg-white/[0.06] text-white/40 hover:text-white/50 transition-colors"
        >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
        </button>
    );
}

// ─── Type badge ───

function TypeBadge({ type, colorMap }: { type: string; colorMap: Record<string, string> }) {
    const cls = colorMap[type] || 'bg-white/[0.04] text-white/50';
    return (
        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${cls}`}>
            {type?.toUpperCase()}
        </span>
    );
}

// ─── Result row ───

function ResultRow({ label, value }: { label: string; value: string | null }) {
    if (!value) return null;
    return (
        <div className="flex items-center justify-between py-2.5 border-b border-white/[0.06] last:border-0">
            <span className="text-xs font-medium text-white/50 uppercase tracking-wide">{label}</span>
            <div className="flex items-center gap-2">
                <code className="text-sm font-mono text-white max-w-[300px] truncate">{value}</code>
                <CopyButton text={value} label={label} />
            </div>
        </div>
    );
}

// ═══════════════════════════════════════
// Instagram Extractor Tab
// ═══════════════════════════════════════

function IgExtractorTab() {
    const [inputUrl, setInputUrl] = useState('');
    const [result, setResult] = useState<IgResult | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const fetchHistory = useCallback(async () => {
        setHistoryLoading(true);
        try {
            const res = await fetch('/api/ig-extract/history?limit=20');
            const json = await res.json();
            if (json.success) setHistory(json.data || []);
        } catch { /* non-critical */ } finally {
            setHistoryLoading(false);
        }
    }, []);

    useEffect(() => { fetchHistory(); }, [fetchHistory]);

    const handleExtract = useCallback(async (url?: string) => {
        const target = url || inputUrl;
        if (!target.trim()) { setError('Please enter an Instagram URL'); return; }

        setError(''); setLoading(true); setResult(null);
        try {
            const res = await fetch('/api/ig-extract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: target.trim() }),
            });
            const json = await res.json();
            if (!json.success) { setError(json.error || 'Extraction failed'); return; }
            setResult(json.data);
            if (json.saved) fetchHistory();
        } catch { setError('Network error — could not reach the server.'); }
        finally { setLoading(false); }
    }, [inputUrl, fetchHistory]);

    const handleDelete = useCallback(async (id: string) => {
        try {
            const res = await fetch(`/api/ig-extract/${id}`, { method: 'DELETE' });
            const json = await res.json();
            if (json.success) setHistory(prev => prev.filter(item => item.id !== id));
        } catch { /* silent */ }
    }, []);

    const handleClear = () => { setInputUrl(''); setResult(null); setError(''); inputRef.current?.focus(); };

    return (
        <div className="space-y-6">
            {/* Input */}
            <div className="bg-[rgba(22,32,50,0.6)] rounded-xl border border-white/[0.06] p-6 shadow-sm">
                <label htmlFor="ig-url" className="block text-sm font-medium text-white/70 mb-2">Instagram URL</label>
                <div className="flex gap-2">
                    <input
                        ref={inputRef}
                        id="ig-url"
                        type="url"
                        className={`flex-1 rounded-lg border px-4 py-2.5 text-sm text-white bg-white/[0.04] placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent ${error ? 'border-red-400/50 bg-red-500/10' : 'border-white/[0.06]'}`}
                        placeholder="Paste Instagram URL here..."
                        value={inputUrl}
                        onChange={e => { setInputUrl(e.target.value); if (error) setError(''); }}
                        onKeyDown={e => e.key === 'Enter' && handleExtract()}
                        autoComplete="off"
                        spellCheck={false}
                    />
                    <button
                        className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                        onClick={() => handleExtract()}
                        disabled={loading}
                    >
                        {loading ? 'Extracting...' : 'Extract'}
                    </button>
                </div>
                {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
                {result && <button className="mt-2 text-xs text-white/50 hover:text-white/70 underline" onClick={handleClear}>Clear</button>}
            </div>

            {/* Results */}
            {result && (
                <div className="bg-[rgba(22,32,50,0.6)] rounded-xl border border-white/[0.06] p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-white">Extraction Results</h3>
                        <TypeBadge type={result.postType} colorMap={IG_TYPE_COLORS} />
                    </div>
                    <ResultRow label="Shortcode" value={result.shortcode} />
                    <ResultRow label="Media ID" value={result.mediaId} />
                    <ResultRow label="Post Type" value={result.postType.toUpperCase()} />
                    <ResultRow label="Clean URL" value={result.originalUrl} />
                </div>
            )}

            {/* Empty state */}
            {!result && !error && (
                <div className="bg-[rgba(22,32,50,0.6)] rounded-xl border border-dashed border-white/20 p-8 text-center text-white/40">
                    Paste an Instagram URL above to extract the post shortcode and numeric media ID.
                </div>
            )}

            {/* Examples */}
            <div className="space-y-2">
                <span className="text-xs font-medium text-white/50 uppercase tracking-wide">Try an example</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {IG_EXAMPLES.map(ex => (
                        <button
                            key={ex.type}
                            className="text-left p-3 rounded-lg border border-white/[0.06] hover:border-[#0D9488]/30 hover:bg-[#0D9488]/10 transition-colors"
                            onClick={() => { setInputUrl(ex.url); handleExtract(ex.url); }}
                        >
                            <span className="block text-xs font-semibold text-[#0D9488]">{ex.type}</span>
                            <code className="block text-[11px] text-white/50 truncate mt-0.5">{ex.url.replace('https://www.', '')}</code>
                        </button>
                    ))}
                </div>
            </div>

            {/* History */}
            {history.length > 0 && (
                <div className="bg-[rgba(22,32,50,0.6)] rounded-xl border border-white/[0.06] shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                        <h3 className="font-semibold text-white">Recent Extractions</h3>
                        <button onClick={fetchHistory} disabled={historyLoading} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white/50 transition-colors">
                            <RefreshCw size={14} className={historyLoading ? 'animate-spin' : ''} />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs text-white/50 uppercase tracking-wide border-b border-white/[0.06]">
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3">Shortcode</th>
                                    <th className="px-6 py-3">Media ID</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3 w-10"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map(item => (
                                    <tr key={item.id} className="border-b border-white/[0.03] hover:bg-white/[0.03]">
                                        <td className="px-6 py-3"><TypeBadge type={item.postType} colorMap={IG_TYPE_COLORS} /></td>
                                        <td className="px-6 py-3"><code className="text-xs">{item.shortcode}</code></td>
                                        <td className="px-6 py-3"><code className="text-xs text-white/50 max-w-[150px] truncate block">{item.mediaId}</code></td>
                                        <td className="px-6 py-3 text-xs text-white/50">{new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                        <td className="px-6 py-3">
                                            <button onClick={() => handleDelete(item.id)} className="p-1 rounded hover:bg-red-500/10 text-white/30 hover:text-red-500 transition-colors" title="Delete">
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════
// TikTok Extractor Tab
// ═══════════════════════════════════════

function TtExtractorTab() {
    const [inputUrl, setInputUrl] = useState('');
    const [result, setResult] = useState<TtResult | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const fetchHistory = useCallback(async () => {
        setHistoryLoading(true);
        try {
            const res = await fetch('/api/tt-extract/history?limit=20');
            const json = await res.json();
            if (json.success) setHistory(json.data || []);
        } catch { /* non-critical */ } finally {
            setHistoryLoading(false);
        }
    }, []);

    useEffect(() => { fetchHistory(); }, [fetchHistory]);

    const handleExtract = useCallback(async (url?: string) => {
        const target = url || inputUrl;
        if (!target.trim()) { setError('Please enter a TikTok URL'); return; }

        setError(''); setLoading(true); setResult(null);
        try {
            const res = await fetch('/api/tt-extract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: target.trim() }),
            });
            const json = await res.json();
            if (!json.success) { setError(json.error || 'Extraction failed'); return; }
            setResult(json.data);
            if (json.saved) fetchHistory();
        } catch { setError('Network error — could not reach the server.'); }
        finally { setLoading(false); }
    }, [inputUrl, fetchHistory]);

    const handleDelete = useCallback(async (id: string) => {
        try {
            const res = await fetch(`/api/tt-extract/${id}`, { method: 'DELETE' });
            const json = await res.json();
            if (json.success) setHistory(prev => prev.filter(item => item.id !== id));
        } catch { /* silent */ }
    }, []);

    const handleClear = () => { setInputUrl(''); setResult(null); setError(''); inputRef.current?.focus(); };

    return (
        <div className="space-y-6">
            {/* Input */}
            <div className="bg-[rgba(22,32,50,0.6)] rounded-xl border border-white/[0.06] p-6 shadow-sm">
                <label htmlFor="tt-url" className="block text-sm font-medium text-white/70 mb-2">TikTok URL</label>
                <div className="flex gap-2">
                    <input
                        ref={inputRef}
                        id="tt-url"
                        type="url"
                        className={`flex-1 rounded-lg border px-4 py-2.5 text-sm text-white bg-white/[0.04] placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent ${error ? 'border-red-400/50 bg-red-500/10' : 'border-white/[0.06]'}`}
                        placeholder="Paste TikTok URL here..."
                        value={inputUrl}
                        onChange={e => { setInputUrl(e.target.value); if (error) setError(''); }}
                        onKeyDown={e => e.key === 'Enter' && handleExtract()}
                        autoComplete="off"
                        spellCheck={false}
                    />
                    <button
                        className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#25f4ee] to-[#fe2c55] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                        onClick={() => handleExtract()}
                        disabled={loading}
                    >
                        {loading ? 'Extracting...' : 'Extract'}
                    </button>
                </div>
                {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
                {result && <button className="mt-2 text-xs text-white/50 hover:text-white/70 underline" onClick={handleClear}>Clear</button>}
            </div>

            {/* Results */}
            {result && (
                <div className="bg-[rgba(22,32,50,0.6)] rounded-xl border border-white/[0.06] p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-white">Extraction Results</h3>
                        <TypeBadge type={result.postType} colorMap={TT_TYPE_COLORS} />
                    </div>
                    {result.videoId && <ResultRow label="Video ID" value={result.videoId} />}
                    {result.shortCode && !result.videoId && <ResultRow label="Short Code" value={result.shortCode} />}
                    {result.username && <ResultRow label="Username" value={`@${result.username}`} />}
                    <ResultRow label="Post Type" value={result.postType.toUpperCase()} />
                    <ResultRow label="Clean URL" value={result.originalUrl} />
                    {result.isShortUrl && (
                        <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400">
                            Short URLs (vm.tiktok.com) cannot be fully resolved client-side. The video ID requires server-side redirect follow.
                        </div>
                    )}
                </div>
            )}

            {/* Empty state */}
            {!result && !error && (
                <div className="bg-[rgba(22,32,50,0.6)] rounded-xl border border-dashed border-white/20 p-8 text-center text-white/40">
                    Paste a TikTok URL above to extract the video ID, username, and post metadata.
                </div>
            )}

            {/* Examples */}
            <div className="space-y-2">
                <span className="text-xs font-medium text-white/50 uppercase tracking-wide">Try an example</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {TT_EXAMPLES.map(ex => (
                        <button
                            key={ex.type}
                            className="text-left p-3 rounded-lg border border-white/[0.06] hover:border-[#0D9488]/30 hover:bg-[#0D9488]/10 transition-colors"
                            onClick={() => { setInputUrl(ex.url); handleExtract(ex.url); }}
                        >
                            <span className="block text-xs font-semibold text-[#0D9488]">{ex.type}</span>
                            <code className="block text-[11px] text-white/50 truncate mt-0.5">{ex.url.replace('https://www.', '').replace('https://', '')}</code>
                        </button>
                    ))}
                </div>
            </div>

            {/* History */}
            {history.length > 0 && (
                <div className="bg-[rgba(22,32,50,0.6)] rounded-xl border border-white/[0.06] shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                        <h3 className="font-semibold text-white">Recent Extractions</h3>
                        <button onClick={fetchHistory} disabled={historyLoading} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white/50 transition-colors">
                            <RefreshCw size={14} className={historyLoading ? 'animate-spin' : ''} />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs text-white/50 uppercase tracking-wide border-b border-white/[0.06]">
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3">Video ID</th>
                                    <th className="px-6 py-3">Username</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3 w-10"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map(item => (
                                    <tr key={item.id} className="border-b border-white/[0.03] hover:bg-white/[0.03]">
                                        <td className="px-6 py-3"><TypeBadge type={item.postType} colorMap={TT_TYPE_COLORS} /></td>
                                        <td className="px-6 py-3"><code className="text-xs text-white/50 max-w-[180px] truncate block">{item.videoId || item.shortCode || '—'}</code></td>
                                        <td className="px-6 py-3">{item.username ? <code className="text-xs">@{item.username}</code> : <span className="text-white/30">—</span>}</td>
                                        <td className="px-6 py-3 text-xs text-white/50">{new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                        <td className="px-6 py-3">
                                            <button onClick={() => handleDelete(item.id)} className="p-1 rounded hover:bg-red-500/10 text-white/30 hover:text-red-500 transition-colors" title="Delete">
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════
// Main Page
// ═══════════════════════════════════════

export default function ExtractorsPage() {
    return (
        <div className="p-6 space-y-6 max-w-5xl">
            <PageHeader
                icon={Link2}
                category="Tools"
                title="Post ID Extractors"
                description="Extract post IDs and metadata from Instagram and TikTok URLs"
            />

            <Tabs defaultValue="instagram" className="w-full">
                <TabsList className="bg-white/[0.04] p-1 rounded-xl">
                    <TabsTrigger value="instagram" className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-[rgba(22,32,50,0.8)] data-[state=active]:shadow-sm">
                        <Instagram size={14} className="mr-2" />
                        Instagram
                    </TabsTrigger>
                    <TabsTrigger value="tiktok" className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-[rgba(22,32,50,0.8)] data-[state=active]:shadow-sm">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.11a8.16 8.16 0 003.76.92V6.69z" />
                        </svg>
                        TikTok
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="instagram">
                    <IgExtractorTab />
                </TabsContent>

                <TabsContent value="tiktok">
                    <TtExtractorTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}
