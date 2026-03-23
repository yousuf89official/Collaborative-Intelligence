'use client';

import React, { useEffect, useState } from 'react';
import { X, AlertTriangle, RefreshCcw, Copy, Check } from 'lucide-react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Log the error to an error reporting service
        console.error('CRITICAL APP ERROR:', error);
    }, [error]);

    const copyError = () => {
        const text = `${error.name}: ${error.message}\n\nStack Trace:\n${error.stack}\n\nDigest: ${error.digest || 'N/A'}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(22,32,50,0.9)] backdrop-blur-md p-4 animate-in fade-in duration-500">
            <div className="bg-white rounded-[40px] shadow-2xl max-w-2xl w-full overflow-hidden border border-white/20 transform animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
                {/* Header Section */}
                <div className="p-10 text-center pb-6">
                    <div className="h-20 w-20 rounded-3xl bg-rose-50 flex items-center justify-center mx-auto mb-8 shadow-sm">
                        <AlertTriangle className="h-10 w-10 text-rose-500 animate-pulse" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">System Critical Failure</h2>
                    <p className="text-white/50 font-medium max-w-md mx-auto">
                        The core engine encountered an unhandled exception. Your progress has been cached, but a reboot is recommended.
                    </p>
                </div>

                {/* Error Details Section */}
                <div className="px-10 space-y-4">
                    <div className="relative group">
                        <div className="absolute -top-3 left-4 px-2 bg-white text-[10px] font-black text-rose-500 uppercase tracking-widest border border-rose-100 rounded-full">
                            Technical Exception
                        </div>
                        <div className="bg-[rgba(22,32,50,0.8)] rounded-[28px] p-6 border border-white/[0.06] overflow-hidden relative">
                            <pre className="text-rose-400 font-mono text-xs overflow-x-auto max-h-48 custom-scrollbar leading-relaxed">
                                {error.stack || `${error.name}: ${error.message}`}
                            </pre>
                            <button
                                onClick={copyError}
                                className="absolute top-4 right-4 p-2 bg-white/[0.06] hover:bg-white/[0.1] rounded-xl text-white/40 transition-all border border-white/[0.06] flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                            >
                                {copied ? (
                                    <>
                                        <Check className="h-3 w-3 text-emerald-400" />
                                        <span>Copied</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-3 w-3" />
                                        <span>Copy Stack</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-4 py-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                        <X className="h-4 w-4 text-amber-400 shrink-0" />
                        <p className="text-[11px] text-amber-400 font-bold leading-tight">
                            Providing this technical log to our engineering department will significantly speed up the resolution process.
                        </p>
                    </div>
                </div>

                {/* Action Section */}
                <div className="p-10 pt-6">
                    <div className="flex gap-4">
                        <button
                            onClick={() => reset()}
                            className="flex-1 py-5 bg-[#0D9488] text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-[#0F766E] transition-all active:scale-95 shadow-xl shadow-[#0D9488]/10 flex items-center justify-center gap-3 group"
                        >
                            <RefreshCcw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                            Initialize System Reboot
                        </button>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="px-8 py-5 bg-white/[0.03] text-white/50 border border-white/[0.06] rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-white/[0.06] transition-all active:scale-95"
                        >
                            Back to Core
                        </button>
                    </div>
                </div>
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10 opacity-30">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-500/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#0D9488]/20 blur-[120px] rounded-full" />
            </div>
        </div>
    );
}
