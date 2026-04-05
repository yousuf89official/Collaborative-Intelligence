'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { api } from '@/services/api';
import { toast } from 'sonner';
import {
    Zap, Plus, RefreshCw, Pencil, Trash2, History,
    Clock, Activity, AlertTriangle, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

// ── Types ──────────────────────────────────────────────────────────────────────

interface Brand { id: string; name: string; }
interface Campaign { id: string; name: string; brandId?: string; brand?: { name: string }; }

interface CampaignRule {
    id: string;
    campaignId: string;
    campaign?: { name: string };
    name: string;
    description?: string;
    isActive: boolean;
    condition: string;
    action: string;
    frequency: string;
    consecutiveHits: number;
    currentHits: number;
    lastTriggeredAt: string | null;
    lastEvaluatedAt: string | null;
    createdAt: string;
}

interface RuleExecution {
    id: string;
    matched: boolean;
    metricVal: number | null;
    actionTaken: string | null;
    error: string | null;
    createdAt: string;
}

type Metric = 'spend' | 'cpa' | 'ctr' | 'roas' | 'impressions' | 'clicks';
type Operator = 'gt' | 'lt' | 'gte' | 'lte' | 'eq';
type Window = '1d' | '3d' | '7d' | '14d' | '30d';
type ActionType = 'pause_campaign' | 'activate_campaign' | 'send_alert' | 'adjust_budget';

const METRIC_LABELS: Record<Metric, string> = {
    spend: 'Spend', cpa: 'CPA', ctr: 'CTR', roas: 'ROAS',
    impressions: 'Impressions', clicks: 'Clicks',
};
const OPERATOR_LABELS: Record<Operator, string> = {
    gt: '>', lt: '<', gte: '>=', lte: '<=', eq: '=',
};
const WINDOW_LABELS: Record<Window, string> = {
    '1d': '1 day', '3d': '3 days', '7d': '7 days', '14d': '14 days', '30d': '30 days',
};
const ACTION_LABELS: Record<ActionType, string> = {
    pause_campaign: 'Pause Campaign', activate_campaign: 'Activate Campaign',
    send_alert: 'Send Alert', adjust_budget: 'Adjust Budget',
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function humanCondition(condJson: string): string {
    try {
        const c = JSON.parse(condJson);
        const metricLabel = METRIC_LABELS[c.metric as Metric] || c.metric;
        const opLabel = OPERATOR_LABELS[c.operator as Operator] || c.operator;
        const valStr = ['spend', 'cpa'].includes(c.metric) ? `$${c.value}` : `${c.value}`;
        const winLabel = WINDOW_LABELS[c.window as Window] || c.window;
        return `${metricLabel} ${opLabel} ${valStr} over ${winLabel}`;
    } catch { return condJson; }
}

function humanAction(actJson: string): string {
    try {
        const a = JSON.parse(actJson);
        return ACTION_LABELS[a.type as ActionType] || a.type;
    } catch { return actJson; }
}

function relativeTime(dateStr: string | null): string {
    if (!dateStr) return 'Never';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function CampaignRulesPage() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [rules, setRules] = useState<CampaignRule[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filterCampaignId, setFilterCampaignId] = useState<string>('all');

    // Create dialog
    const [createOpen, setCreateOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // Edit dialog (reuses create form)
    const [editRule, setEditRule] = useState<CampaignRule | null>(null);

    // History panel
    const [historyRule, setHistoryRule] = useState<CampaignRule | null>(null);
    const [executions, setExecutions] = useState<RuleExecution[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    // Form state
    const [formCampaignId, setFormCampaignId] = useState('');
    const [formName, setFormName] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formMetric, setFormMetric] = useState<Metric>('cpa');
    const [formOperator, setFormOperator] = useState<Operator>('gt');
    const [formValue, setFormValue] = useState('');
    const [formWindow, setFormWindow] = useState<Window>('7d');
    const [formActionType, setFormActionType] = useState<ActionType>('pause_campaign');
    const [formAlertEmail, setFormAlertEmail] = useState('');
    const [formBudgetChange, setFormBudgetChange] = useState('');
    const [formBudgetMode, setFormBudgetMode] = useState<'percent' | 'absolute'>('percent');
    const [formFrequency, setFormFrequency] = useState<'hourly' | 'daily'>('daily');
    const [formConsecutiveHits, setFormConsecutiveHits] = useState('1');

    // ── Fetchers ───────────────────────────────────────────────────────────────

    const fetchBrands = useCallback(async () => {
        try { setBrands(await api.brands.getAll()); } catch { /* silent */ }
    }, []);

    const fetchCampaigns = useCallback(async () => {
        try { setCampaigns(await api.campaigns.getAll({})); } catch { /* silent */ }
    }, []);

    const fetchRules = useCallback(async () => {
        try {
            const cid = filterCampaignId === 'all' ? undefined : filterCampaignId;
            setRules(await api.campaignRules.getAll(cid));
        } catch { toast.error('Failed to load rules'); }
    }, [filterCampaignId]);

    useEffect(() => { fetchBrands(); fetchCampaigns(); }, [fetchBrands, fetchCampaigns]);

    useEffect(() => {
        setLoading(true);
        fetchRules().finally(() => setLoading(false));
    }, [fetchRules]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchRules();
        setRefreshing(false);
    };

    // ── Form helpers ───────────────────────────────────────────────────────────

    function resetForm() {
        setFormCampaignId('');
        setFormName('');
        setFormDescription('');
        setFormMetric('cpa');
        setFormOperator('gt');
        setFormValue('');
        setFormWindow('7d');
        setFormActionType('pause_campaign');
        setFormAlertEmail('');
        setFormBudgetChange('');
        setFormBudgetMode('percent');
        setFormFrequency('daily');
        setFormConsecutiveHits('1');
    }

    function loadRuleIntoForm(rule: CampaignRule) {
        setFormCampaignId(rule.campaignId);
        setFormName(rule.name);
        setFormDescription(rule.description || '');
        setFormFrequency(rule.frequency as 'hourly' | 'daily');
        setFormConsecutiveHits(String(rule.consecutiveHits));
        try {
            const c = JSON.parse(rule.condition);
            setFormMetric(c.metric);
            setFormOperator(c.operator);
            setFormValue(String(c.value));
            setFormWindow(c.window);
        } catch { /* keep defaults */ }
        try {
            const a = JSON.parse(rule.action);
            setFormActionType(a.type);
            if (a.type === 'send_alert') setFormAlertEmail(a.params?.email || '');
            if (a.type === 'adjust_budget') {
                setFormBudgetChange(String(a.params?.change || ''));
                setFormBudgetMode(a.params?.mode || 'percent');
            }
        } catch { /* keep defaults */ }
    }

    function buildPayload() {
        const condition = JSON.stringify({
            metric: formMetric,
            operator: formOperator,
            value: Number(formValue),
            window: formWindow,
        });
        const params: Record<string, any> = {};
        if (formActionType === 'send_alert') params.email = formAlertEmail;
        if (formActionType === 'adjust_budget') {
            params.change = Number(formBudgetChange);
            params.mode = formBudgetMode;
        }
        const action = JSON.stringify({ type: formActionType, params });
        return {
            campaignId: formCampaignId,
            name: formName,
            description: formDescription || undefined,
            condition,
            action,
            frequency: formFrequency,
            consecutiveHits: Number(formConsecutiveHits) || 1,
        };
    }

    // ── CRUD ───────────────────────────────────────────────────────────────────

    const handleCreate = async () => {
        if (!formCampaignId || !formName || !formValue) {
            toast.error('Please fill in all required fields');
            return;
        }
        setSaving(true);
        try {
            await api.campaignRules.create(buildPayload());
            toast.success('Rule created');
            setCreateOpen(false);
            resetForm();
            await fetchRules();
        } catch (err: any) {
            toast.error(err.message || 'Failed to create rule');
        } finally { setSaving(false); }
    };

    const handleUpdate = async () => {
        if (!editRule) return;
        if (!formName || !formValue) {
            toast.error('Please fill in all required fields');
            return;
        }
        setSaving(true);
        try {
            await api.campaignRules.update(editRule.id, buildPayload());
            toast.success('Rule updated');
            setEditRule(null);
            resetForm();
            await fetchRules();
        } catch (err: any) {
            toast.error(err.message || 'Failed to update rule');
        } finally { setSaving(false); }
    };

    const handleDelete = async (rule: CampaignRule) => {
        if (!confirm(`Delete rule "${rule.name}"?`)) return;
        try {
            await api.campaignRules.delete(rule.id);
            toast.success('Rule deleted');
            await fetchRules();
        } catch { toast.error('Failed to delete rule'); }
    };

    const handleToggleActive = async (rule: CampaignRule) => {
        try {
            await api.campaignRules.update(rule.id, { isActive: !rule.isActive });
            toast.success(rule.isActive ? 'Rule deactivated' : 'Rule activated');
            await fetchRules();
        } catch { toast.error('Failed to toggle rule'); }
    };

    const handleViewHistory = async (rule: CampaignRule) => {
        setHistoryRule(rule);
        setHistoryLoading(true);
        try {
            const detail = await api.campaignRules.getById(rule.id);
            setExecutions(detail.executions || []);
        } catch { toast.error('Failed to load execution history'); }
        finally { setHistoryLoading(false); }
    };

    // ── Stats ──────────────────────────────────────────────────────────────────

    const activeCount = rules.filter(r => r.isActive).length;
    const inactiveCount = rules.filter(r => !r.isActive).length;
    const triggeredToday = rules.filter(r => {
        if (!r.lastTriggeredAt) return false;
        const d = new Date(r.lastTriggeredAt);
        const now = new Date();
        return d.toDateString() === now.toDateString();
    }).length;

    // ── Rule Form Dialog ───────────────────────────────────────────────────────

    const isEditing = !!editRule;
    const dialogOpen = createOpen || isEditing;

    const RuleFormDialog = (
        <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
                if (!open) {
                    setCreateOpen(false);
                    setEditRule(null);
                    resetForm();
                }
            }}
        >
            <DialogContent className="bg-[#0f1a2b] border-white/10 text-white max-w-lg max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        {isEditing ? 'Edit Rule' : 'Create Rule'}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Campaign */}
                    <div>
                        <label className="text-xs text-white/50 mb-1 block">Campaign *</label>
                        <Select value={formCampaignId} onValueChange={setFormCampaignId} disabled={isEditing}>
                            <SelectTrigger className="bg-white/[0.04] border-white/10 text-white">
                                <SelectValue placeholder="Select campaign" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#162032] border-white/10">
                                {campaigns.map(c => (
                                    <SelectItem key={c.id} value={c.id} className="text-white/70">
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="text-xs text-white/50 mb-1 block">Rule Name *</label>
                        <Input
                            value={formName}
                            onChange={e => setFormName(e.target.value)}
                            placeholder="e.g. High CPA Alert"
                            className="bg-white/[0.04] border-white/10 text-white"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-xs text-white/50 mb-1 block">Description</label>
                        <Textarea
                            value={formDescription}
                            onChange={e => setFormDescription(e.target.value)}
                            placeholder="Optional description..."
                            rows={2}
                            className="bg-white/[0.04] border-white/10 text-white resize-none"
                        />
                    </div>

                    {/* Condition Builder */}
                    <div>
                        <label className="text-xs text-white/50 mb-1 block">Condition</label>
                        <div className="grid grid-cols-4 gap-2">
                            <Select value={formMetric} onValueChange={v => setFormMetric(v as Metric)}>
                                <SelectTrigger className="bg-white/[0.04] border-white/10 text-white text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#162032] border-white/10">
                                    {(Object.keys(METRIC_LABELS) as Metric[]).map(m => (
                                        <SelectItem key={m} value={m} className="text-white/70 text-xs">{METRIC_LABELS[m]}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={formOperator} onValueChange={v => setFormOperator(v as Operator)}>
                                <SelectTrigger className="bg-white/[0.04] border-white/10 text-white text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#162032] border-white/10">
                                    {(Object.keys(OPERATOR_LABELS) as Operator[]).map(o => (
                                        <SelectItem key={o} value={o} className="text-white/70 text-xs">{OPERATOR_LABELS[o]}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input
                                type="number"
                                value={formValue}
                                onChange={e => setFormValue(e.target.value)}
                                placeholder="Value"
                                className="bg-white/[0.04] border-white/10 text-white text-xs"
                            />
                            <Select value={formWindow} onValueChange={v => setFormWindow(v as Window)}>
                                <SelectTrigger className="bg-white/[0.04] border-white/10 text-white text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#162032] border-white/10">
                                    {(Object.keys(WINDOW_LABELS) as Window[]).map(w => (
                                        <SelectItem key={w} value={w} className="text-white/70 text-xs">{WINDOW_LABELS[w]}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Action Builder */}
                    <div>
                        <label className="text-xs text-white/50 mb-1 block">Action</label>
                        <Select value={formActionType} onValueChange={v => setFormActionType(v as ActionType)}>
                            <SelectTrigger className="bg-white/[0.04] border-white/10 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#162032] border-white/10">
                                {(Object.keys(ACTION_LABELS) as ActionType[]).map(a => (
                                    <SelectItem key={a} value={a} className="text-white/70">{ACTION_LABELS[a]}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {formActionType === 'send_alert' && (
                            <Input
                                value={formAlertEmail}
                                onChange={e => setFormAlertEmail(e.target.value)}
                                placeholder="Alert email address"
                                className="mt-2 bg-white/[0.04] border-white/10 text-white"
                            />
                        )}

                        {formActionType === 'adjust_budget' && (
                            <div className="flex gap-2 mt-2">
                                <Input
                                    type="number"
                                    value={formBudgetChange}
                                    onChange={e => setFormBudgetChange(e.target.value)}
                                    placeholder="Change amount"
                                    className="flex-1 bg-white/[0.04] border-white/10 text-white"
                                />
                                <Select value={formBudgetMode} onValueChange={v => setFormBudgetMode(v as 'percent' | 'absolute')}>
                                    <SelectTrigger className="w-[120px] bg-white/[0.04] border-white/10 text-white text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#162032] border-white/10">
                                        <SelectItem value="percent" className="text-white/70 text-xs">Percent</SelectItem>
                                        <SelectItem value="absolute" className="text-white/70 text-xs">Absolute</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    {/* Frequency */}
                    <div>
                        <label className="text-xs text-white/50 mb-1 block">Frequency</label>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant={formFrequency === 'hourly' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFormFrequency('hourly')}
                                className={formFrequency === 'hourly'
                                    ? 'bg-[#0D9488] hover:bg-[#0D9488]/80 text-white border-0'
                                    : 'border-white/10 text-white/70 hover:bg-white/[0.06]'}
                            >
                                <Clock className="w-3 h-3 mr-1" /> Hourly
                            </Button>
                            <Button
                                type="button"
                                variant={formFrequency === 'daily' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFormFrequency('daily')}
                                className={formFrequency === 'daily'
                                    ? 'bg-[#0D9488] hover:bg-[#0D9488]/80 text-white border-0'
                                    : 'border-white/10 text-white/70 hover:bg-white/[0.06]'}
                            >
                                <Activity className="w-3 h-3 mr-1" /> Daily
                            </Button>
                        </div>
                    </div>

                    {/* Consecutive Hits */}
                    <div>
                        <label className="text-xs text-white/50 mb-1 block">Consecutive hits before action</label>
                        <Input
                            type="number"
                            min={1}
                            value={formConsecutiveHits}
                            onChange={e => setFormConsecutiveHits(e.target.value)}
                            className="w-24 bg-white/[0.04] border-white/10 text-white"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setCreateOpen(false); setEditRule(null); resetForm(); }}
                        className="border-white/10 text-white/70 hover:bg-white/[0.06]"
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        onClick={isEditing ? handleUpdate : handleCreate}
                        disabled={saving}
                        className="bg-[#0D9488] hover:bg-[#0D9488]/80 text-white border-0"
                    >
                        {saving ? 'Saving...' : isEditing ? 'Update Rule' : 'Create Rule'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

    // ── History Panel ──────────────────────────────────────────────────────────

    const HistoryPanel = historyRule && (
        <Dialog open={!!historyRule} onOpenChange={(open) => { if (!open) setHistoryRule(null); }}>
            <DialogContent className="bg-[#0f1a2b] border-white/10 text-white max-w-xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                        <History className="w-4 h-4 text-[#0D9488]" />
                        Execution History: {historyRule.name}
                    </DialogTitle>
                </DialogHeader>

                {historyLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <div className="w-6 h-6 border-2 border-white/10 border-t-[#0D9488] rounded-full animate-spin" />
                    </div>
                ) : executions.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-white/30 text-sm">No executions yet.</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/[0.06] hover:bg-transparent">
                                <TableHead className="text-white/50">Timestamp</TableHead>
                                <TableHead className="text-white/50">Matched</TableHead>
                                <TableHead className="text-white/50">Metric Value</TableHead>
                                <TableHead className="text-white/50">Action Taken</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {executions.map(ex => (
                                <TableRow key={ex.id} className="border-white/[0.06]">
                                    <TableCell className="text-white/70 text-xs">
                                        {new Date(ex.createdAt).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={ex.matched
                                                ? 'border-green-500/30 bg-green-500/10 text-green-400'
                                                : 'border-white/10 bg-white/[0.04] text-white/40'}
                                        >
                                            {ex.matched ? 'Yes' : 'No'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-white/70 text-xs font-mono">
                                        {ex.metricVal != null ? ex.metricVal.toFixed(2) : '-'}
                                    </TableCell>
                                    <TableCell className="text-white/70 text-xs">
                                        {ex.actionTaken || (ex.error ? (
                                            <span className="text-red-400">{ex.error}</span>
                                        ) : '-')}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </DialogContent>
        </Dialog>
    );

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <div className="space-y-6">
            <PageHeader
                icon={Zap}
                category="Automation"
                title="Campaign Rules"
                description="Define automated rules to monitor campaign metrics and trigger actions when conditions are met."
                actions={
                    <div className="flex items-center gap-3">
                        <Select value={filterCampaignId} onValueChange={setFilterCampaignId}>
                            <SelectTrigger className="w-[200px] bg-white/[0.04] border-white/10 text-white">
                                <SelectValue placeholder="All Campaigns" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#162032] border-white/10">
                                <SelectItem value="all" className="text-white/70">All Campaigns</SelectItem>
                                {campaigns.map(c => (
                                    <SelectItem key={c.id} value={c.id} className="text-white/70">{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="border-white/10 text-white/70 hover:bg-white/[0.06]"
                        >
                            <RefreshCw className={`w-4 h-4 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => { resetForm(); setCreateOpen(true); }}
                            className="bg-[#0D9488] hover:bg-[#0D9488]/80 text-white border-0"
                        >
                            <Plus className="w-4 h-4 mr-1.5" />
                            Create Rule
                        </Button>
                    </div>
                }
            />

            {/* Quick Stats */}
            <div className="flex gap-3 flex-wrap">
                {[
                    { label: 'Total', count: rules.length, color: '#8888aa' },
                    { label: 'Active', count: activeCount, color: '#10b981' },
                    { label: 'Inactive', count: inactiveCount, color: '#f97316' },
                    { label: 'Triggered Today', count: triggeredToday, color: '#0D9488' },
                ].map(s => (
                    <div key={s.label} className="bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                        <span className="text-xs text-white/50">{s.label}</span>
                        <span className="text-sm font-bold text-white">{s.count}</span>
                    </div>
                ))}
            </div>

            {/* Rules Table */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-white/10 border-t-[#0D9488] rounded-full animate-spin" />
                </div>
            ) : rules.length === 0 ? (
                <div className="text-center py-20">
                    <AlertTriangle className="w-8 h-8 text-white/20 mx-auto mb-3" />
                    <p className="text-white/30 text-sm">No rules found. Create your first automation rule.</p>
                </div>
            ) : (
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/[0.06] hover:bg-transparent">
                                <TableHead className="text-white/50">Rule Name</TableHead>
                                <TableHead className="text-white/50">Campaign</TableHead>
                                <TableHead className="text-white/50">Condition</TableHead>
                                <TableHead className="text-white/50">Action</TableHead>
                                <TableHead className="text-white/50">Frequency</TableHead>
                                <TableHead className="text-white/50">Status</TableHead>
                                <TableHead className="text-white/50">Last Triggered</TableHead>
                                <TableHead className="text-white/50 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rules.map(rule => (
                                <TableRow key={rule.id} className="border-white/[0.06]">
                                    <TableCell className="text-white font-medium text-sm">
                                        {rule.name}
                                        {rule.description && (
                                            <p className="text-white/30 text-xs mt-0.5 truncate max-w-[200px]">{rule.description}</p>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-white/70 text-sm">
                                        {rule.campaign?.name || '-'}
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs font-mono text-white/60 bg-white/[0.04] px-2 py-1 rounded">
                                            {humanCondition(rule.condition)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="border-[#0D9488]/30 bg-[#0D9488]/10 text-[#0D9488]">
                                            {humanAction(rule.action)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={rule.frequency === 'hourly'
                                                ? 'border-blue-500/30 bg-blue-500/10 text-blue-400'
                                                : 'border-purple-500/30 bg-purple-500/10 text-purple-400'}
                                        >
                                            {rule.frequency === 'hourly' ? 'Hourly' : 'Daily'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <button
                                            onClick={() => handleToggleActive(rule)}
                                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                                rule.isActive ? 'bg-[#0D9488]' : 'bg-white/10'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                                                    rule.isActive ? 'translate-x-[18px]' : 'translate-x-[3px]'
                                                }`}
                                            />
                                        </button>
                                    </TableCell>
                                    <TableCell className="text-white/50 text-xs">
                                        {relativeTime(rule.lastTriggeredAt)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => { loadRuleIntoForm(rule); setEditRule(rule); }}
                                                className="h-7 w-7 p-0 text-white/40 hover:text-white hover:bg-white/[0.06]"
                                                title="Edit"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleViewHistory(rule)}
                                                className="h-7 w-7 p-0 text-white/40 hover:text-white hover:bg-white/[0.06]"
                                                title="View History"
                                            >
                                                <History className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(rule)}
                                                className="h-7 w-7 p-0 text-white/40 hover:text-red-400 hover:bg-red-500/10"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {RuleFormDialog}
            {HistoryPanel}
        </div>
    );
}
