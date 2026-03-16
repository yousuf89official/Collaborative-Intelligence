'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Users, Plus, Shield, Edit3, Trash2, Check, X } from 'lucide-react';

const ROLES = [
    { id: 'super_admin', label: 'Super Admin', color: '#ef4444', desc: 'Full system access including billing, data deletion, and audit logs', count: 1 },
    { id: 'admin', label: 'Admin', color: '#0D9488', desc: 'Organization-wide management: users, integrations, settings', count: 2 },
    { id: 'manager', label: 'Manager', color: '#4F46E5', desc: 'Team management, campaign approval, report generation', count: 4 },
    { id: 'analyst', label: 'Analyst', color: '#22c55e', desc: 'Create/edit reports and dashboards, run queries, export data', count: 8 },
    { id: 'editor', label: 'Editor', color: '#f59e0b', desc: 'Create and update campaigns/content within assigned projects', count: 6 },
    { id: 'viewer', label: 'Viewer', color: '#94a3b8', desc: 'Read-only access to dashboards, reports, and assigned content', count: 12 },
    { id: 'client', label: 'Client', color: '#0EA5E9', desc: 'View branded reports/dashboards for their organization only', count: 14 },
];

const PERMISSIONS_MATRIX = [
    { feature: 'View Dashboards', super_admin: true, admin: true, manager: true, analyst: true, editor: true, viewer: true, client: true },
    { feature: 'Create/Edit Reports', super_admin: true, admin: true, manager: true, analyst: true, editor: false, viewer: false, client: false },
    { feature: 'Manage Campaigns', super_admin: true, admin: true, manager: true, analyst: false, editor: true, viewer: false, client: false },
    { feature: 'Create/Edit Brands', super_admin: true, admin: true, manager: true, analyst: false, editor: false, viewer: false, client: false },
    { feature: 'User Management', super_admin: true, admin: true, manager: false, analyst: false, editor: false, viewer: false, client: false },
    { feature: 'Platform Settings', super_admin: true, admin: true, manager: false, analyst: false, editor: false, viewer: false, client: false },
    { feature: 'Integrations Setup', super_admin: true, admin: true, manager: false, analyst: false, editor: false, viewer: false, client: false },
    { feature: 'Billing & Subscriptions', super_admin: true, admin: false, manager: false, analyst: false, editor: false, viewer: false, client: false },
    { feature: 'Data Deletion', super_admin: true, admin: false, manager: false, analyst: false, editor: false, viewer: false, client: false },
    { feature: 'Audit Logs', super_admin: true, admin: true, manager: false, analyst: false, editor: false, viewer: false, client: false },
    { feature: 'API Key Management', super_admin: true, admin: true, manager: false, analyst: false, editor: false, viewer: false, client: false },
    { feature: 'Whitelabel Config', super_admin: true, admin: false, manager: false, analyst: false, editor: false, viewer: false, client: false },
    { feature: 'Export Data', super_admin: true, admin: true, manager: true, analyst: true, editor: false, viewer: false, client: false },
    { feature: 'CMS Management', super_admin: true, admin: true, manager: true, analyst: false, editor: true, viewer: false, client: false },
];

const ALL_USERS = [
    { id: 1, name: 'System Admin', email: 'admin@collaborativeintelligence.io', role: 'super_admin', status: 'Active', lastActive: '2 min ago', brands: 'All' },
    { id: 2, name: 'Sarah Chen', email: 'sarah.chen@acmecorp.com', role: 'admin', status: 'Active', lastActive: '15 min ago', brands: 'All' },
    { id: 3, name: 'James Wilson', email: 'james.wilson@globalbrands.com', role: 'manager', status: 'Active', lastActive: '1 hour ago', brands: 'Nexus, FreshWave' },
    { id: 4, name: 'Maria Rodriguez', email: 'maria@pinnacleagency.com', role: 'analyst', status: 'Active', lastActive: '3 hours ago', brands: 'Velocity Motors' },
    { id: 5, name: 'David Kim', email: 'david.kim@asiadigital.co', role: 'editor', status: 'Active', lastActive: '1 day ago', brands: 'Pinnacle Bank' },
    { id: 6, name: 'Lisa Chen', email: 'lisa@globalbrands.com', role: 'viewer', status: 'Active', lastActive: '2 days ago', brands: 'Nexus' },
    { id: 7, name: 'Acme Corp Client', email: 'reports@acmecorp.com', role: 'client', status: 'Active', lastActive: '5 days ago', brands: 'Nexus Technologies' },
];

export default function UsersPage() {
    const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'permissions'>('users');

    return (
        <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                icon={Users}
                category="Platform"
                title="Users & Role Management"
                description="Manage users, define roles with granular permissions, and control access across the platform."
                actions={
                    <button className="flex items-center gap-2 px-5 py-2 bg-[#0D9488] text-white rounded-xl font-bold text-xs hover:bg-[#0F766E] transition-all shadow-lg shadow-teal-500/20">
                        <Plus className="h-4 w-4" /> INVITE USER
                    </button>
                }
            />

            {/* Role Summary — horizontal scroll on mobile */}
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
                {ROLES.map(r => (
                    <div key={r.id} className="shrink-0 px-4 py-3 rounded-xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl flex items-center gap-3 min-w-[150px]">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                        <div>
                            <p className="text-xs font-bold text-white">{r.label}</p>
                            <p className="text-[10px] text-white/30">{r.count} users</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 overflow-x-auto border-b border-white/[0.06]">
                {[{ id: 'users', label: 'All Users' }, { id: 'roles', label: 'Role Definitions' }, { id: 'permissions', label: 'Permissions Matrix' }].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-[#0D9488] text-[#0D9488]' : 'border-transparent text-white/40 hover:text-white/60'}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'users' && (
                <>
                    {/* Desktop Table */}
                    <div className="hidden md:block rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="text-[10px] text-white/30 uppercase tracking-wider border-b border-white/[0.06]">
                                    <th className="text-left py-3 px-4">User</th>
                                    <th className="text-left py-3 px-4">Role</th>
                                    <th className="text-left py-3 px-4">Brands Access</th>
                                    <th className="text-left py-3 px-4">Last Active</th>
                                    <th className="text-center py-3 px-4">Status</th>
                                    <th className="text-right py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ALL_USERS.map(u => {
                                    const role = ROLES.find(r => r.id === u.role);
                                    return (
                                        <tr key={u.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0D9488] to-[#0EA5E9] flex items-center justify-center text-white text-xs font-bold shrink-0">{u.name.charAt(0)}</div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white">{u.name}</p>
                                                        <p className="text-[10px] text-white/30">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full" style={{ backgroundColor: `${role?.color}15`, color: role?.color }}>{role?.label}</span>
                                            </td>
                                            <td className="py-3 px-4 text-xs text-white/60">{u.brands}</td>
                                            <td className="py-3 px-4 text-xs text-white/40">{u.lastActive}</td>
                                            <td className="text-center py-3 px-4"><span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">{u.status}</span></td>
                                            <td className="text-right py-3 px-4">
                                                <div className="flex justify-end gap-1">
                                                    <button className="p-1.5 rounded-lg hover:bg-white/[0.04] text-white/30 hover:text-white transition-colors"><Edit3 className="h-3.5 w-3.5" /></button>
                                                    <button className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3">
                        {ALL_USERS.map(u => {
                            const role = ROLES.find(r => r.id === u.role);
                            return (
                                <div key={u.id} className="p-4 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0D9488] to-[#0EA5E9] flex items-center justify-center text-white text-sm font-bold shrink-0">{u.name.charAt(0)}</div>
                                            <div>
                                                <p className="text-sm font-semibold text-white">{u.name}</p>
                                                <p className="text-[11px] text-white/30">{u.email}</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: `${role?.color}15`, color: role?.color }}>{role?.label}</span>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-[11px] text-white/40">
                                            <span>{u.brands}</span>
                                            <span>{u.lastActive}</span>
                                        </div>
                                        <div className="flex gap-1">
                                            <button className="p-1.5 rounded-lg hover:bg-white/[0.04] text-white/30 hover:text-white transition-colors"><Edit3 className="h-3.5 w-3.5" /></button>
                                            <button className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {activeTab === 'roles' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ROLES.map(r => (
                        <div key={r.id} className="p-5 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl hover:border-white/[0.1] transition-all">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: r.color }} />
                                <h3 className="font-bold text-white">{r.label}</h3>
                                <span className="text-[10px] text-white/30 ml-auto">{r.count} users</span>
                            </div>
                            <p className="text-xs text-white/40 leading-relaxed">{r.desc}</p>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'permissions' && (
                <div className="rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead>
                            <tr className="text-[10px] text-white/30 uppercase tracking-wider border-b border-white/[0.06]">
                                <th className="text-left py-3 px-3">Feature</th>
                                {ROLES.map(r => (
                                    <th key={r.id} className="text-center py-3 px-2">
                                        <span className="inline-block w-2 h-2 rounded-full mr-1 align-middle" style={{ backgroundColor: r.color }} />
                                        {r.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {PERMISSIONS_MATRIX.map(p => (
                                <tr key={p.feature} className="border-b border-white/[0.04]">
                                    <td className="py-2.5 px-3 text-xs text-white/70">{p.feature}</td>
                                    {ROLES.map(r => (
                                        <td key={r.id} className="text-center py-2.5 px-2">
                                            {(p as any)[r.id] ? <Check className="h-4 w-4 text-[#0D9488] mx-auto" /> : <X className="h-4 w-4 text-white/10 mx-auto" />}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
