'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Users, Plus, Shield, Check, X, Copy, Link2, Loader2, UserCheck, UserX, Clock, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import { FEATURE_SECTIONS, parsePermissions, ALL_FEATURES } from '@/lib/features';

const ROLES = [
    { id: 'super_admin', label: 'Super Admin', color: '#ef4444', desc: 'Full system access including billing, data deletion, and audit logs' },
    { id: 'MasterAdmin', label: 'Master Admin', color: '#ef4444', desc: 'Full system access — cannot be modified' },
    { id: 'admin', label: 'Admin', color: '#0D9488', desc: 'Organization-wide management: users, integrations, settings' },
    { id: 'manager', label: 'Manager', color: '#4F46E5', desc: 'Team management, campaign approval, report generation' },
    { id: 'analyst', label: 'Analyst', color: '#22c55e', desc: 'Create/edit reports and dashboards, run queries, export data' },
    { id: 'editor', label: 'Editor', color: '#f59e0b', desc: 'Create and update campaigns/content within assigned projects' },
    { id: 'viewer', label: 'Viewer', color: '#94a3b8', desc: 'Read-only access to dashboards, reports, and assigned content' },
    { id: 'client', label: 'Client', color: '#0EA5E9', desc: 'View branded reports/dashboards for their organization only' },
];

const PERMISSIONS_MATRIX = [
    { feature: 'View Dashboards', super_admin: true, MasterAdmin: true, admin: true, manager: true, analyst: true, editor: true, viewer: true, client: true },
    { feature: 'Create/Edit Reports', super_admin: true, MasterAdmin: true, admin: true, manager: true, analyst: true, editor: false, viewer: false, client: false },
    { feature: 'Manage Campaigns', super_admin: true, MasterAdmin: true, admin: true, manager: true, analyst: false, editor: true, viewer: false, client: false },
    { feature: 'Create/Edit Brands', super_admin: true, MasterAdmin: true, admin: true, manager: true, analyst: false, editor: false, viewer: false, client: false },
    { feature: 'User Management', super_admin: true, MasterAdmin: true, admin: true, manager: false, analyst: false, editor: false, viewer: false, client: false },
    { feature: 'Platform Settings', super_admin: true, MasterAdmin: true, admin: true, manager: false, analyst: false, editor: false, viewer: false, client: false },
    { feature: 'Integrations Setup', super_admin: true, MasterAdmin: true, admin: true, manager: false, analyst: false, editor: false, viewer: false, client: false },
    { feature: 'Billing & Subscriptions', super_admin: true, MasterAdmin: true, admin: false, manager: false, analyst: false, editor: false, viewer: false, client: false },
    { feature: 'Data Deletion', super_admin: true, MasterAdmin: true, admin: false, manager: false, analyst: false, editor: false, viewer: false, client: false },
    { feature: 'Audit Logs', super_admin: true, MasterAdmin: true, admin: true, manager: false, analyst: false, editor: false, viewer: false, client: false },
    { feature: 'API Key Management', super_admin: true, MasterAdmin: true, admin: true, manager: false, analyst: false, editor: false, viewer: false, client: false },
    { feature: 'Whitelabel Config', super_admin: true, MasterAdmin: true, admin: false, manager: false, analyst: false, editor: false, viewer: false, client: false },
    { feature: 'Export Data', super_admin: true, MasterAdmin: true, admin: true, manager: true, analyst: true, editor: false, viewer: false, client: false },
    { feature: 'CMS Management', super_admin: true, MasterAdmin: true, admin: true, manager: true, analyst: false, editor: true, viewer: false, client: false },
];

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
    Active: { color: 'text-green-400', bg: 'bg-green-500/10', label: 'Active' },
    Pending: { color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Pending' },
    Suspended: { color: 'text-red-400', bg: 'bg-red-500/10', label: 'Suspended' },
    Inactive: { color: 'text-white/40', bg: 'bg-white/[0.04]', label: 'Inactive' },
};

interface UserData {
    id: string;
    name: string | null;
    email: string;
    role: string;
    workRole: string | null;
    status: string;
    permissions: string | null;
    createdAt: string;
    updatedAt: string;
}

export default function UsersPage() {
    const [activeTab, setActiveTab] = useState<'users' | 'invitations' | 'roles' | 'permissions'>('users');
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [invites, setInvites] = useState<any[]>([]);
    const [invitesLoading, setInvitesLoading] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('viewer');
    const [inviting, setInviting] = useState(false);
    const [inviteLink, setInviteLink] = useState('');
    const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
    // Permissions editor
    const [editingUser, setEditingUser] = useState<UserData | null>(null);
    const [editPerms, setEditPerms] = useState<string[]>([]);
    const [editRole, setEditRole] = useState('');
    const [savingPerms, setSavingPerms] = useState(false);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const fetchInvites = async () => {
        setInvitesLoading(true);
        try {
            const res = await fetch('/api/users/invite');
            if (res.ok) {
                const data = await res.json();
                setInvites(data);
            }
        } catch {
            toast.error('Failed to load invitations');
        } finally {
            setInvitesLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);
    useEffect(() => { if (activeTab === 'invitations') fetchInvites(); }, [activeTab]);

    const handleInvite = async () => {
        setInviting(true);
        setInviteLink('');
        try {
            const res = await fetch('/api/users/invite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: inviteEmail || undefined, role: inviteRole }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error || 'Failed to create invite');
            } else {
                setInviteLink(data.url);
                toast.success('Invite link generated!');
            }
        } catch {
            toast.error('Failed to create invite');
        } finally {
            setInviting(false);
        }
    };

    const updateUserStatus = async (userId: string, status: string) => {
        setStatusUpdating(userId);
        try {
            const res = await fetch(`/api/users/${userId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                const updated = await res.json();
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: updated.status } : u));
                toast.success(`User ${status === 'Active' ? 'activated' : status.toLowerCase()}`);
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to update status');
            }
        } catch {
            toast.error('Failed to update status');
        } finally {
            setStatusUpdating(null);
        }
    };

    const openPermEditor = (u: UserData) => {
        setEditingUser(u);
        setEditRole(u.role);
        const existing = parsePermissions(u.permissions);
        setEditPerms(existing || ALL_FEATURES.map(f => f.key)); // null = all features enabled
    };

    const togglePerm = (key: string) => {
        setEditPerms(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
    };

    const selectAllPerms = () => setEditPerms(ALL_FEATURES.map(f => f.key));
    const clearAllPerms = () => setEditPerms([]);

    const savePermissions = async () => {
        if (!editingUser) return;
        setSavingPerms(true);
        try {
            const res = await fetch(`/api/users/${editingUser.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: editRole, permissions: editPerms }),
            });
            if (res.ok) {
                const updated = await res.json();
                setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, role: updated.role, permissions: updated.permissions } : u));
                setEditingUser(null);
                toast.success('Permissions updated');
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to update permissions');
            }
        } catch {
            toast.error('Failed to update');
        } finally {
            setSavingPerms(false);
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(inviteLink);
        toast.success('Link copied to clipboard');
    };

    const roleCounts = ROLES.map(r => ({
        ...r,
        count: users.filter(u => u.role === r.id).length,
    })).filter(r => r.count > 0 || !['MasterAdmin'].includes(r.id));

    const getRoleInfo = (roleId: string) => ROLES.find(r => r.id === roleId) || { label: roleId, color: '#94a3b8' };

    return (
        <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                icon={Users}
                category="Platform"
                title="Users & Role Management"
                description="Manage users, define roles with granular permissions, and control access across the platform."
                actions={
                    <button
                        onClick={() => { setShowInviteModal(true); setInviteLink(''); setInviteEmail(''); setInviteRole('viewer'); }}
                        className="flex items-center gap-2 px-5 py-2 bg-[#0D9488] text-white rounded-xl font-bold text-xs hover:bg-[#0F766E] transition-all shadow-lg shadow-teal-500/20"
                    >
                        <Plus className="h-4 w-4" /> INVITE USER
                    </button>
                }
            />

            {/* Role Summary */}
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
                {roleCounts.map(r => (
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
                {[{ id: 'users', label: 'All Users' }, { id: 'invitations', label: 'Invitations' }, { id: 'roles', label: 'Role Definitions' }, { id: 'permissions', label: 'Permissions Matrix' }].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-[#0D9488] text-[#0D9488]' : 'border-transparent text-white/40 hover:text-white/60'}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'users' && (
                <>
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-6 w-6 animate-spin text-white/30" />
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-20">
                            <Users className="h-12 w-12 text-white/10 mx-auto mb-3" />
                            <p className="text-sm text-white/40">No users found</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden md:block rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl overflow-hidden">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-[10px] text-white/30 uppercase tracking-wider border-b border-white/[0.06]">
                                            <th className="text-left py-3 px-4">User</th>
                                            <th className="text-left py-3 px-4">System Role</th>
                                            <th className="text-left py-3 px-4">Work Role</th>
                                            <th className="text-left py-3 px-4">Joined</th>
                                            <th className="text-center py-3 px-4">Status</th>
                                            <th className="text-right py-3 px-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(u => {
                                            const role = getRoleInfo(u.role);
                                            const st = STATUS_CONFIG[u.status] || STATUS_CONFIG.Active;
                                            const permCount = parsePermissions(u.permissions);
                                            const isSuperAdmin = u.role === 'super_admin' || u.role === 'MasterAdmin';
                                            return (
                                                <tr key={u.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0D9488] to-[#0EA5E9] flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                                {(u.name || u.email).charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-white">{u.name || 'Unnamed'}</p>
                                                                <p className="text-[10px] text-white/30">{u.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full" style={{ backgroundColor: `${role.color}15`, color: role.color }}>
                                                            {role.label}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-xs text-white/50">
                                                        {u.workRole || <span className="text-white/20">—</span>}
                                                    </td>
                                                    <td className="py-3 px-4 text-xs text-white/40">
                                                        {new Date(u.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="text-center py-3 px-4">
                                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}>
                                                            {st.label}
                                                        </span>
                                                    </td>
                                                    <td className="text-right py-3 px-4">
                                                        {!isSuperAdmin && (
                                                            <div className="flex justify-end gap-1">
                                                                {statusUpdating === u.id ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin text-white/30" />
                                                                ) : (
                                                                    <>
                                                                        {/* Permissions button */}
                                                                        <button
                                                                            onClick={() => openPermEditor(u)}
                                                                            className="p-1.5 rounded-lg hover:bg-[#0D9488]/10 text-white/30 hover:text-[#0D9488] transition-colors"
                                                                            title="Manage permissions"
                                                                        >
                                                                            <Settings2 className="h-3.5 w-3.5" />
                                                                        </button>
                                                                        {u.status === 'Pending' && (
                                                                            <button onClick={() => updateUserStatus(u.id, 'Active')} className="p-1.5 rounded-lg hover:bg-green-500/10 text-white/30 hover:text-green-400 transition-colors" title="Approve user">
                                                                                <UserCheck className="h-3.5 w-3.5" />
                                                                            </button>
                                                                        )}
                                                                        {u.status === 'Active' && (
                                                                            <button onClick={() => updateUserStatus(u.id, 'Suspended')} className="p-1.5 rounded-lg hover:bg-amber-500/10 text-white/30 hover:text-amber-400 transition-colors" title="Suspend">
                                                                                <UserX className="h-3.5 w-3.5" />
                                                                            </button>
                                                                        )}
                                                                        {(u.status === 'Suspended' || u.status === 'Inactive') && (
                                                                            <button onClick={() => updateUserStatus(u.id, 'Active')} className="p-1.5 rounded-lg hover:bg-green-500/10 text-white/30 hover:text-green-400 transition-colors" title="Reactivate">
                                                                                <UserCheck className="h-3.5 w-3.5" />
                                                                            </button>
                                                                        )}
                                                                        {u.status === 'Active' && (
                                                                            <button onClick={() => updateUserStatus(u.id, 'Inactive')} className="p-1.5 rounded-lg hover:bg-white/[0.04] text-white/30 hover:text-white/60 transition-colors" title="Set inactive">
                                                                                <Clock className="h-3.5 w-3.5" />
                                                                            </button>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden space-y-3">
                                {users.map(u => {
                                    const role = getRoleInfo(u.role);
                                    const st = STATUS_CONFIG[u.status] || STATUS_CONFIG.Active;
                                    const isSuperAdmin = u.role === 'super_admin' || u.role === 'MasterAdmin';
                                    return (
                                        <div key={u.id} className="p-4 rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0D9488] to-[#0EA5E9] flex items-center justify-center text-white text-sm font-bold shrink-0">
                                                        {(u.name || u.email).charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-white">{u.name || 'Unnamed'}</p>
                                                        <p className="text-[11px] text-white/30">{u.email}</p>
                                                        {u.workRole && <p className="text-[10px] text-white/20 mt-0.5">{u.workRole}</p>}
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: `${role.color}15`, color: role.color }}>
                                                    {role.label}
                                                </span>
                                            </div>
                                            <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}>{st.label}</span>
                                                    <span className="text-[11px] text-white/30">{new Date(u.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                {!isSuperAdmin && (
                                                    <div className="flex gap-1">
                                                        <button onClick={() => openPermEditor(u)} className="p-1.5 rounded-lg hover:bg-[#0D9488]/10 text-white/30 hover:text-[#0D9488] transition-colors" title="Permissions">
                                                            <Settings2 className="h-3.5 w-3.5" />
                                                        </button>
                                                        {(u.status === 'Pending' || u.status === 'Suspended' || u.status === 'Inactive') && (
                                                            <button onClick={() => updateUserStatus(u.id, 'Active')} className="p-1.5 rounded-lg hover:bg-green-500/10 text-white/30 hover:text-green-400 transition-colors">
                                                                <UserCheck className="h-3.5 w-3.5" />
                                                            </button>
                                                        )}
                                                        {u.status === 'Active' && (
                                                            <button onClick={() => updateUserStatus(u.id, 'Suspended')} className="p-1.5 rounded-lg hover:bg-amber-500/10 text-white/30 hover:text-amber-400 transition-colors">
                                                                <UserX className="h-3.5 w-3.5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </>
            )}

            {activeTab === 'invitations' && (
                <>
                    {invitesLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-6 w-6 animate-spin text-white/30" />
                        </div>
                    ) : invites.length === 0 ? (
                        <div className="text-center py-20">
                            <Link2 className="h-12 w-12 text-white/10 mx-auto mb-3" />
                            <p className="text-sm text-white/40">No invitations generated yet</p>
                            <p className="text-xs text-white/20 mt-1">Click "Invite User" to create a registration link</p>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-xl overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-[10px] text-white/30 uppercase tracking-wider border-b border-white/[0.06]">
                                        <th className="text-left py-3 px-4">Email</th>
                                        <th className="text-left py-3 px-4">Role</th>
                                        <th className="text-left py-3 px-4">Created</th>
                                        <th className="text-left py-3 px-4">Expires</th>
                                        <th className="text-center py-3 px-4">Status</th>
                                        <th className="text-right py-3 px-4">Link</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invites.map(inv => {
                                        const isUsed = !!inv.usedAt;
                                        const isExpired = !isUsed && new Date(inv.expiresAt) < new Date();
                                        const isPending = !isUsed && !isExpired;
                                        const role = getRoleInfo(inv.role);
                                        const invUrl = `${window.location.origin}/register/${inv.token}`;

                                        return (
                                            <tr key={inv.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                                <td className="py-3 px-4 text-sm text-white">
                                                    {inv.email || <span className="text-white/20 italic">Any email</span>}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full" style={{ backgroundColor: `${role.color}15`, color: role.color }}>
                                                        {role.label}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-xs text-white/40">
                                                    {new Date(inv.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="py-3 px-4 text-xs text-white/40">
                                                    {new Date(inv.expiresAt).toLocaleDateString()}
                                                </td>
                                                <td className="text-center py-3 px-4">
                                                    {isUsed && (
                                                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">
                                                            Registered
                                                        </span>
                                                    )}
                                                    {isExpired && (
                                                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">
                                                            Expired
                                                        </span>
                                                    )}
                                                    {isPending && (
                                                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">
                                                            Pending
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="text-right py-3 px-4">
                                                    {isPending && (
                                                        <button
                                                            onClick={() => { navigator.clipboard.writeText(invUrl); toast.success('Link copied'); }}
                                                            className="p-1.5 rounded-lg hover:bg-[#0D9488]/10 text-white/30 hover:text-[#0D9488] transition-colors"
                                                            title="Copy invite link"
                                                        >
                                                            <Copy className="h-3.5 w-3.5" />
                                                        </button>
                                                    )}
                                                    {isUsed && (
                                                        <span className="text-[10px] text-white/20">
                                                            {new Date(inv.usedAt).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {activeTab === 'roles' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {roleCounts.map(r => (
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

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setShowInviteModal(false)}>
                    <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[rgba(22,32,50,0.95)] backdrop-blur-xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-[#0D9488]/10 flex items-center justify-center">
                                <Link2 className="h-5 w-5 text-[#0D9488]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Generate Invite Link</h3>
                                <p className="text-xs text-white/40">Create a unique registration link for a new user</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-white/50 block">Email (optional)</label>
                                <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="user@company.com"
                                    className="flex h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-white shadow-sm transition-colors placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]/40 hover:bg-white/[0.06]" />
                                <p className="text-[10px] text-white/20">If set, only this email can use the link</p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-white/50 block">Assign System Role</label>
                                <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}
                                    className="flex h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]/40 hover:bg-white/[0.06] appearance-none">
                                    {ROLES.filter(r => !['super_admin', 'MasterAdmin'].includes(r.id)).map(r => (
                                        <option key={r.id} value={r.id} className="bg-[#0C1222] text-white">{r.label}</option>
                                    ))}
                                </select>
                            </div>

                            {inviteLink && (
                                <div className="p-3 rounded-xl bg-[#0D9488]/5 border border-[#0D9488]/20">
                                    <p className="text-[10px] text-[#0D9488] font-bold uppercase tracking-wider mb-2">Invite Link Generated</p>
                                    <div className="flex items-center gap-2">
                                        <input readOnly value={inviteLink} className="flex-1 h-9 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-xs text-white/70 truncate" />
                                        <button onClick={copyLink} className="h-9 px-3 rounded-lg bg-[#0D9488] text-white text-xs font-bold hover:bg-[#0F766E] transition-colors flex items-center gap-1.5">
                                            <Copy className="h-3.5 w-3.5" /> Copy
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-white/20 mt-2">Link expires in 7 days</p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setShowInviteModal(false)} className="flex-1 h-10 rounded-xl border border-white/10 text-white/60 text-sm font-bold hover:bg-white/[0.04] transition-colors">Close</button>
                                <button onClick={handleInvite} disabled={inviting} className="flex-1 h-10 rounded-xl bg-[#0D9488] text-white text-sm font-bold shadow-lg shadow-teal-500/20 hover:bg-[#0F766E] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                    {inviting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
                                    {inviting ? 'Generating...' : 'Generate Link'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Permissions Editor Modal */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setEditingUser(null)}>
                    <div className="w-full max-w-lg max-h-[85vh] rounded-2xl border border-white/[0.08] bg-[rgba(22,32,50,0.95)] backdrop-blur-xl shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className="p-6 border-b border-white/[0.06] shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0D9488] to-[#0EA5E9] flex items-center justify-center text-white text-sm font-bold shrink-0">
                                    {(editingUser.name || editingUser.email).charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{editingUser.name || 'Unnamed'}</h3>
                                    <p className="text-xs text-white/40">{editingUser.email}{editingUser.workRole ? ` · ${editingUser.workRole}` : ''}</p>
                                </div>
                            </div>

                            {/* Role selector */}
                            <div className="mt-4 space-y-1.5">
                                <label className="text-xs font-medium text-white/50 block">System Role</label>
                                <select value={editRole} onChange={e => setEditRole(e.target.value)}
                                    className="h-9 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]/40 appearance-none">
                                    {ROLES.filter(r => !['super_admin', 'MasterAdmin'].includes(r.id)).map(r => (
                                        <option key={r.id} value={r.id} className="bg-[#0C1222] text-white">{r.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Feature toggles */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-5">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-white/50 uppercase tracking-wider">Menu Access</p>
                                <div className="flex gap-2">
                                    <button onClick={selectAllPerms} className="text-[10px] text-[#0D9488] hover:text-[#0D9488]/80 font-bold">Select All</button>
                                    <span className="text-white/10">|</span>
                                    <button onClick={clearAllPerms} className="text-[10px] text-white/30 hover:text-white/50 font-bold">Clear All</button>
                                </div>
                            </div>

                            {FEATURE_SECTIONS.map(({ section, features }) => (
                                <div key={section}>
                                    <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-2">{section}</p>
                                    <div className="space-y-1">
                                        {features.map(f => (
                                            <button
                                                key={f.key}
                                                onClick={() => togglePerm(f.key)}
                                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${editPerms.includes(f.key) ? 'bg-[#0D9488]/10 text-white' : 'bg-white/[0.02] text-white/30 hover:bg-white/[0.04]'}`}
                                            >
                                                <span>{f.label}</span>
                                                <div className={`w-8 h-4.5 rounded-full transition-colors relative ${editPerms.includes(f.key) ? 'bg-[#0D9488]' : 'bg-white/10'}`}>
                                                    <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-all ${editPerms.includes(f.key) ? 'left-[calc(100%-1rem)]' : 'left-0.5'}`} />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-white/[0.06] flex gap-3 shrink-0">
                            <button onClick={() => setEditingUser(null)} className="flex-1 h-10 rounded-xl border border-white/10 text-white/60 text-sm font-bold hover:bg-white/[0.04] transition-colors">Cancel</button>
                            <button onClick={savePermissions} disabled={savingPerms} className="flex-1 h-10 rounded-xl bg-[#0D9488] text-white text-sm font-bold shadow-lg shadow-teal-500/20 hover:bg-[#0F766E] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                {savingPerms ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                                {savingPerms ? 'Saving...' : 'Save Permissions'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
