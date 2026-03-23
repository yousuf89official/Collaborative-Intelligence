'use client';

import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Shield,
    Briefcase,
    Calendar,
    CreditCard,
    Link2,
    Copy,
    Check,
    Lock,
    Eye,
    EyeOff,
    Loader2,
    Activity
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { PageHeader } from '@/components/layout/PageHeader';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const [subscription, setSubscription] = useState<any>(null);
    const [referral, setReferral] = useState<any>(null);
    const [loadingSub, setLoadingSub] = useState(true);
    const [loadingRef, setLoadingRef] = useState(true);
    const [userDetails, setUserDetails] = useState<any>(null);

    // Password change state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [changingPassword, setChangingPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Referral link copy state
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchSubscription();
            fetchReferral();
            fetchUserDetails();
        }
    }, [status]);

    const fetchSubscription = async () => {
        try {
            const res = await fetch('/api/subscriptions');
            if (res.ok) {
                const data = await res.json();
                setSubscription(data);
            }
        } catch {
            // Silently fail
        } finally {
            setLoadingSub(false);
        }
    };

    const fetchReferral = async () => {
        try {
            const res = await fetch('/api/referrals');
            if (res.ok) {
                const data = await res.json();
                setReferral(data);
            }
        } catch {
            // Silently fail
        } finally {
            setLoadingRef(false);
        }
    };

    const fetchUserDetails = async () => {
        try {
            const res = await fetch('/api/users?self=true');
            if (res.ok) {
                const data = await res.json();
                setUserDetails(data);
            }
        } catch {
            // Silently fail
        }
    };

    const handlePasswordChange = async () => {
        if (!currentPassword) {
            toast.error('Please enter your current password');
            return;
        }
        if (!newPassword) {
            toast.error('Please enter a new password');
            return;
        }
        if (newPassword.length < 8) {
            toast.error('New password must be at least 8 characters');
            return;
        }
        if (!/^[a-zA-Z0-9]+$/.test(newPassword)) {
            toast.error('Password must contain only letters and numbers');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        setChangingPassword(true);
        try {
            const res = await fetch('/api/users/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Password updated successfully');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                toast.error(data.error || 'Failed to change password');
            }
        } catch {
            toast.error('Network error while changing password');
        } finally {
            setChangingPassword(false);
        }
    };

    const copyReferralLink = () => {
        if (!referral?.code) return;
        const link = `${window.location.origin}/register?ref=${referral.code}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        toast.success('Referral link copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
    };

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-[#0D9488]" />
            </div>
        );
    }

    const user = session?.user;
    const role = (user as any)?.role || 'user';
    const memberSince = userDetails?.createdAt
        ? new Date(userDetails.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : 'N/A';
    const workRole = userDetails?.workRole || 'Not set';
    const accountStatus = userDetails?.status || 'Active';

    return (
        <div className="p-6 space-y-8 max-w-4xl mx-auto">
            <PageHeader
                icon={User}
                category="Account"
                title="Profile"
                description="View your account details and manage your password."
            />

            {/* Account Information */}
            <div className="rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.6)] backdrop-blur-xl p-6 space-y-6">
                <h2 className="text-sm font-black uppercase tracking-widest text-white/50">Account Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                            <User className="h-3.5 w-3.5" /> Full Name
                        </label>
                        <div className="h-11 flex items-center px-4 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-medium">
                            {user?.name || 'N/A'}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                            <Mail className="h-3.5 w-3.5" /> Email Address
                        </label>
                        <div className="h-11 flex items-center px-4 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-medium">
                            {user?.email || 'N/A'}
                        </div>
                    </div>

                    {/* Role */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                            <Shield className="h-3.5 w-3.5" /> System Role
                        </label>
                        <div className="h-11 flex items-center px-4 rounded-xl bg-white/[0.04] border border-white/10 text-sm font-medium">
                            <span className={cn(
                                "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                                role === 'admin' || role === 'super_admin' || role === 'masteradmin'
                                    ? "bg-[#0D9488]/20 text-[#0D9488]"
                                    : "bg-white/10 text-white/70"
                            )}>
                                {role}
                            </span>
                        </div>
                    </div>

                    {/* Work Role */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                            <Briefcase className="h-3.5 w-3.5" /> Work Role
                        </label>
                        <div className="h-11 flex items-center px-4 rounded-xl bg-white/[0.04] border border-white/10 text-white/60 text-sm font-medium">
                            {workRole}
                        </div>
                    </div>

                    {/* Account Status */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                            <Activity className="h-3.5 w-3.5" /> Account Status
                        </label>
                        <div className="h-11 flex items-center px-4 rounded-xl bg-white/[0.04] border border-white/10 text-sm font-medium">
                            <span className={cn(
                                "flex items-center gap-2",
                                accountStatus === 'Active' ? "text-emerald-400" : "text-amber-400"
                            )}>
                                <span className={cn(
                                    "h-2 w-2 rounded-full",
                                    accountStatus === 'Active' ? "bg-emerald-400" : "bg-amber-400"
                                )} />
                                {accountStatus}
                            </span>
                        </div>
                    </div>

                    {/* Member Since */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                            <Calendar className="h-3.5 w-3.5" /> Member Since
                        </label>
                        <div className="h-11 flex items-center px-4 rounded-xl bg-white/[0.04] border border-white/10 text-white/60 text-sm font-medium">
                            {memberSince}
                        </div>
                    </div>
                </div>
            </div>

            {/* Subscription Plan */}
            <div className="rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.6)] backdrop-blur-xl p-6 space-y-4">
                <h2 className="text-sm font-black uppercase tracking-widest text-white/50">Subscription Plan</h2>

                {loadingSub ? (
                    <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-5 w-5 animate-spin text-[#0D9488]" />
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-[#0D9488]/10 text-[#0D9488]">
                            <CreditCard className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-bold text-sm">
                                {subscription?.plan?.name || 'Free Plan'}
                            </p>
                            <p className="text-[10px] text-white/40 font-medium">
                                {subscription?.subscription
                                    ? `${subscription.subscription.billingCycle} billing - ${subscription.subscription.status}`
                                    : 'No active subscription'}
                            </p>
                        </div>
                        {subscription?.subscription?.currentPeriodEnd && (
                            <div className="text-right">
                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Renews</p>
                                <p className="text-xs text-white/60 font-medium">
                                    {new Date(subscription.subscription.currentPeriodEnd).toLocaleDateString()}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Referral */}
            <div className="rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.6)] backdrop-blur-xl p-6 space-y-4">
                <h2 className="text-sm font-black uppercase tracking-widest text-white/50">Referral Program</h2>

                {loadingRef ? (
                    <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-5 w-5 animate-spin text-[#0D9488]" />
                    </div>
                ) : referral ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-[#0D9488]/10 text-[#0D9488]">
                                <Link2 className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Your Referral Code</p>
                                <p className="text-white font-bold text-sm font-mono">{referral.code}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-11 flex items-center px-4 rounded-xl bg-white/[0.04] border border-white/10 text-white/60 text-xs font-mono truncate">
                                {typeof window !== 'undefined'
                                    ? `${window.location.origin}/register?ref=${referral.code}`
                                    : `/register?ref=${referral.code}`}
                            </div>
                            <button
                                onClick={copyReferralLink}
                                className="h-11 w-11 flex items-center justify-center rounded-xl bg-[#0D9488]/10 text-[#0D9488] hover:bg-[#0D9488]/20 border border-[#0D9488]/20 transition-all"
                                title="Copy referral link"
                            >
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                                <p className="text-lg font-black text-white">{referral.stats?.totalReferrals || 0}</p>
                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Total</p>
                            </div>
                            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                                <p className="text-lg font-black text-emerald-400">{referral.stats?.activeReferrals || 0}</p>
                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Active</p>
                            </div>
                            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                                <p className="text-lg font-black text-[#0D9488]">
                                    {((referral.stats?.effectiveRate || 0.1) * 100).toFixed(0)}%
                                </p>
                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Rate</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-white/40">Referral program not available.</p>
                )}
            </div>

            {/* Change Password */}
            <div className="rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.6)] backdrop-blur-xl p-6 space-y-6">
                <h2 className="text-sm font-black uppercase tracking-widest text-white/50">Change Password</h2>

                <div className="space-y-4 max-w-md">
                    {/* Current Password */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                            <Lock className="h-3.5 w-3.5" /> Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                                className="w-full h-11 px-4 pr-11 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-medium placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#0D9488]/40 focus:border-transparent transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                            >
                                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                            <Lock className="h-3.5 w-3.5" /> New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Min 8 characters, letters & numbers only"
                                className="w-full h-11 px-4 pr-11 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-medium placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#0D9488]/40 focus:border-transparent transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                            >
                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {newPassword && newPassword.length < 8 && (
                            <p className="text-[10px] text-red-400 font-medium">Password must be at least 8 characters</p>
                        )}
                        {newPassword && newPassword.length >= 8 && !/^[a-zA-Z0-9]+$/.test(newPassword) && (
                            <p className="text-[10px] text-red-400 font-medium">Only letters and numbers are allowed</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                            <Lock className="h-3.5 w-3.5" /> Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter new password"
                                className="w-full h-11 px-4 pr-11 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-medium placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#0D9488]/40 focus:border-transparent transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {confirmPassword && newPassword !== confirmPassword && (
                            <p className="text-[10px] text-red-400 font-medium">Passwords do not match</p>
                        )}
                    </div>

                    <button
                        onClick={handlePasswordChange}
                        disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
                        className={cn(
                            "h-11 px-6 rounded-xl text-sm font-bold uppercase tracking-wider transition-all",
                            "bg-[#0D9488] hover:bg-[#0F766E] text-white shadow-lg shadow-teal-500/20",
                            "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#0D9488]",
                            "flex items-center gap-2"
                        )}
                    >
                        {changingPassword ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            'Update Password'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
