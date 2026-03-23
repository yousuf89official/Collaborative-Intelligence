'use client';

import React, { useState, useEffect } from 'react';
import {
    ImageIcon,
    Plus,
    UserPlus,
    Settings,
    ChevronDown,
    Globe,
    Mail,
    Check,
    User,
    Shield,
    CreditCard,
    Key,
    Trash2,
    Edit,
    Save,
    Loader2
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const SettingsView = () => {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState('general_profile');
    const [activeColor, setActiveColor] = useState('indigo');
    const [users, setUsers] = useState<any[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        role: ''
    });

    useEffect(() => {
        if (session?.user) {
            setProfileData({
                name: session.user.name || '',
                email: session.user.email || '',
                role: (session.user as any).role || 'User'
            });
        }
    }, [session]);

    useEffect(() => {
        if (activeTab === 'users_permissions') {
            fetchUsers();
        }
    }, [activeTab]);

    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const res = await fetch('/api/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            } else {
                toast.error('Failed to load agency users');
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast.error('Network error while loading users');
        } finally {
            setLoadingUsers(false);
        }
    };

    const navItems = [
        { id: 'general_profile', label: 'General Profile', icon: User },
        { id: 'white_label', label: 'White Label', icon: Globe },
        { id: 'users_permissions', label: 'Users & Permissions', icon: Shield },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'api_keys', label: 'API Keys', icon: Key }
    ];

    const colors = [
        { name: 'indigo', class: 'bg-[#0D9488]' },
        { name: 'blue', class: 'bg-blue-600' },
        { name: 'green', class: 'bg-green-600' },
        { name: 'red', class: 'bg-red-600' },
        { name: 'gray', class: 'bg-gray-900' },
    ];

    const renderGeneralProfile = () => (
        <div className="bg-white/[0.04] rounded-2xl shadow-sm border border-white/10 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="p-6 border-b border-white/[0.06] bg-white/[0.03]">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">General Profile</h3>
                <p className="text-sm text-white/50 font-medium mt-1">Manage your personal account information and preferences.</p>
            </div>
            <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-xs font-black uppercase tracking-widest text-white/50">Full Name</label>
                        <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            className="block w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-white placeholder:text-white/30 focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all shadow-sm hover:bg-white/[0.06]"
                            placeholder="Your Name"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-black uppercase tracking-widest text-white/50">Email Address</label>
                        <input
                            type="email"
                            value={profileData.email}
                            disabled
                            className="block w-full px-4 py-3 rounded-xl border border-white/10 text-sm font-semibold text-white/40 bg-white/[0.03] cursor-not-allowed shadow-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-black uppercase tracking-widest text-white/50">Account Role</label>
                        <div className="px-4 py-3 rounded-xl border border-white/10 text-sm font-bold text-[#0D9488] bg-[#0D9488]/10 shadow-sm inline-block">
                            {profileData.role}
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-8 py-5 bg-white/[0.03] border-t border-white/[0.06] flex justify-end">
                <button className="bg-[#0D9488] text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#0F766E] transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2">
                    <Save className="h-4 w-4" /> Save Profile
                </button>
            </div>
        </div>
    );

    const renderWhiteLabel = () => (
        <div className="bg-white/[0.04] rounded-2xl shadow-sm border border-white/10 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="p-6 border-b border-white/[0.06] bg-white/[0.03]">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">White Label Branding</h3>
                <p className="text-sm text-white/50 font-medium mt-1">Customize the platform with your agency's branding.</p>
            </div>

            <div className="p-8 space-y-8">
                {/* Logo Upload */}
                <div className="space-y-3">
                    <label className="block text-xs font-black uppercase tracking-widest text-white/50">Agency Logo</label>
                    <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 bg-white/[0.03] rounded-2xl flex items-center justify-center border-2 border-dashed border-white/10 group hover:border-[#0D9488]/30 transition-colors">
                            <ImageIcon className="w-8 h-8 text-white/40 group-hover:text-[#0D9488] transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <button className="px-6 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-sm font-bold text-white/70 hover:bg-white/[0.06] transition-all shadow-sm">
                                Upload Logo
                            </button>
                            <p className="text-[10px] text-white/40 font-medium">Recommended: 400x400px PNG or SVG</p>
                        </div>
                    </div>
                </div>

                {/* Color Scheme Picker */}
                <div className="space-y-3">
                    <label className="block text-xs font-black uppercase tracking-widest text-white/50">Brand Color Scheme</label>
                    <div className="flex items-center space-x-4">
                        {colors.map((color) => (
                            <button
                                key={color.name}
                                onClick={() => setActiveColor(color.name)}
                                className={`w-10 h-10 rounded-full ${color.class} cursor-pointer transition-all duration-300 transform hover:scale-110 flex items-center justify-center relative ${activeColor === color.name
                                    ? 'ring-4 ring-offset-2 ring-[#0D9488] shadow-lg'
                                    : 'hover:ring-2 hover:ring-offset-2 hover:ring-white/20'
                                    }`}
                            >
                                {activeColor === color.name && <Check className="w-5 h-5 text-white" />}
                            </button>
                        ))}
                        <button className="w-10 h-10 rounded-full bg-white/[0.03] flex items-center justify-center text-white/40 hover:text-[#0D9488] border-2 border-dashed border-white/10 transition-all hover:border-[#0D9488]/30 hover:bg-[#0D9488]/10">
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Domain & Email Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="block text-xs font-black uppercase tracking-widest text-white/50">Login Domain</label>
                        <div className="flex rounded-xl shadow-sm border border-white/10 overflow-hidden focus-within:ring-2 focus-within:ring-[#0D9488] focus-within:border-transparent transition-all">
                            <span className="inline-flex items-center px-4 bg-white/[0.03] text-white/40 text-sm font-bold border-r border-white/10">
                                <Globe className="w-4 h-4 mr-2" /> https://
                            </span>
                            <input
                                type="text"
                                className="flex-1 min-w-0 block w-full px-4 py-3 text-sm font-semibold text-white bg-white/[0.04] placeholder:text-white/30 focus:outline-none hover:bg-white/[0.06]"
                                placeholder="app.youragency.com"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-black uppercase tracking-widest text-white/50">Email Sender Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 text-white/40" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-white placeholder:text-white/30 focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all shadow-sm hover:bg-white/[0.06]"
                                placeholder="Agency Reports"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-8 py-5 bg-white/[0.03] border-t border-white/[0.06] flex justify-end">
                <button className="bg-[#0D9488] text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#0F766E] transition-all shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 active:scale-95">
                    Save Changes
                </button>
            </div>
        </div>
    );

    const renderUsersPermissions = () => (
        <div className="bg-white/[0.04] rounded-2xl shadow-sm border border-white/10 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="p-6 border-b border-white/[0.06] bg-white/[0.03] flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Users & Permissions</h3>
                    <p className="text-sm text-white/50 font-medium mt-1">Manage staff access and permissions.</p>
                </div>
                <button className="flex items-center px-6 py-2 bg-[#0D9488] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#0F766E] transition-all shadow-lg shadow-teal-500/10">
                    <UserPlus className="w-4 h-4 mr-2" /> Add User
                </button>
            </div>
            <div className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/[0.03] border-b border-white/[0.06]">
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/50">User</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/50">Role</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/50">Status</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/50 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.06]">
                            {loadingUsers ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-white/40">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-[#0D9488]" />
                                        <p className="font-bold text-xs uppercase">Loading agency users...</p>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-white/40 italic">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/[0.06] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-[#0D9488]/10 flex items-center justify-center text-[#0D9488] font-bold">
                                                    {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white">{user.name || 'No name'}</p>
                                                    <p className="text-[11px] text-white/50 font-medium">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-[#0D9488]/10 text-[#0D9488] rounded-full text-[10px] font-black uppercase">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "flex items-center gap-1.5 text-xs font-bold",
                                                user.status === 'Active' ? "text-emerald-400" :
                                                    user.status === 'Archive' ? "text-white/40" : "text-amber-600"
                                            )}>
                                                <div className={cn(
                                                    "h-1.5 w-1.5 rounded-full shadow-[0_0_8px]",
                                                    user.status === 'Active' ? "bg-emerald-500 shadow-emerald-500/50" :
                                                        user.status === 'Archive' ? "bg-white/30 shadow-white/20" : "bg-amber-500 shadow-amber-500/50"
                                                )} />
                                                {user.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 text-white/40 hover:text-[#0D9488] hover:bg-[#0D9488]/10 rounded-lg transition-all">
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderPlaceholder = (title: string) => (
        <div className="bg-white/[0.04] rounded-2xl shadow-sm border border-white/10 p-12 text-center space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="h-16 w-16 bg-white/[0.03] rounded-2xl flex items-center justify-center text-white/30 mx-auto">
                <Settings className="h-8 w-8" />
            </div>
            <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">{title}</h3>
                <p className="text-sm text-white/50 font-medium max-w-xs mx-auto">This section is currently under development. Please check back later.</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                icon={Settings}
                category="Agency Control"
                title="Agency Settings"
                description="Manage your agency profile, white labeling, and users."
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Settings Navigation Sidebar */}
                <div className="lg:col-span-1">
                    <nav className="space-y-1 bg-white/[0.04] backdrop-blur-sm p-2 rounded-2xl border border-white/10 shadow-sm sticky top-8">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full text-left px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 flex items-center gap-3 ${activeTab === item.id
                                        ? 'bg-[#0D9488] text-white shadow-lg shadow-teal-500/20'
                                        : 'text-white/60 hover:bg-white/[0.06] hover:text-white'
                                        }`}
                                >
                                    <Icon className={`h-4 w-4 ${activeTab === item.id ? 'text-white' : 'text-white/40'}`} />
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Main Settings Content Area */}
                <div className="lg:col-span-3">
                    {activeTab === 'general_profile' && renderGeneralProfile()}
                    {activeTab === 'white_label' && renderWhiteLabel()}
                    {activeTab === 'users_permissions' && renderUsersPermissions()}
                    {activeTab === 'billing' && renderPlaceholder('Billing & Subscriptions')}
                    {activeTab === 'api_keys' && renderPlaceholder('API & Integrations')}
                </div>
            </div>
        </div>
    );
};

export default SettingsView;
