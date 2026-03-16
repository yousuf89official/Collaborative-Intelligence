
import React from 'react';
import { ChevronDown } from 'lucide-react';

export const Button = ({ children, variant = 'primary', size = 'default', className = '', ...props }: any) => {
    const base = "inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] disabled:pointer-events-none disabled:opacity-50 active:scale-95";
    const sizes: any = {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-10 rounded-xl px-8",
        icon: "h-9 w-9",
    };
    const variants: any = {
        primary: "bg-[#0D9488] text-white shadow-lg shadow-teal-500/20 hover:bg-[#0F766E] border border-transparent",
        secondary: "bg-white/[0.06] text-white/70 border border-white/10 hover:bg-white/[0.1] hover:text-white shadow-sm",
        outline: "border border-[#0D9488]/30 bg-[#0D9488]/10 text-[#0D9488] hover:bg-[#0D9488]/20",
        ghost: "hover:bg-white/[0.06] hover:text-white text-white/50",
        destructive: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20",
        ai: "bg-gradient-to-r from-[#4F46E5] to-[#0D9488] text-white hover:from-[#4338CA] hover:to-[#0F766E] shadow-md border-transparent",
    };
    return <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

export const Badge = ({ children, variant = 'default', className = '' }: any) => {
    const variants: any = {
        default: "bg-[#0D9488]/10 text-[#0D9488] border border-[#0D9488]/20",
        secondary: "bg-white/[0.06] text-white/60 border border-white/10",
        outline: "text-white/60 border border-white/10",
        success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        inactive: "bg-white/[0.04] text-white/30 border border-white/[0.06]",
        ai: "bg-gradient-to-r from-[#4F46E5]/10 to-[#0D9488]/10 text-[#0D9488] border border-[#0D9488]/20",
    };
    return <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide transition-colors ${variants[variant]} ${className}`}>{children}</div>;
};

export const Card = ({ children, className = '' }: any) => (
    <div className={`rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.6)] backdrop-blur-xl text-white shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>{children}</div>
);

export const Input = (props: any) => (
    <input className="flex h-9 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]/40 focus-visible:border-[#0D9488]/40 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-white/[0.06]" {...props} />
);

export const Label = ({ children, className = '' }: any) => (
    <label className={`text-[10px] uppercase tracking-wider font-bold text-white/40 leading-none ${className}`}>{children}</label>
);

export const SelectWrapper = ({ children, className = "", ...props }: any) => (
    <div className="relative">
        <select
            className={`flex h-9 w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-2 py-1 text-xs text-white shadow-sm ring-offset-transparent placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#0D9488]/40 disabled:cursor-not-allowed disabled:opacity-50 appearance-none hover:bg-white/[0.06] transition-colors ${className}`}
            {...props}
        >
            {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/40">
            <ChevronDown className="h-3 w-3" />
        </div>
    </div>
);

