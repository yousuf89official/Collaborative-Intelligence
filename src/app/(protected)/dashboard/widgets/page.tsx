'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { WidgetGrid } from '@/components/dashboard/WidgetGrid';
import { WidgetDrawer } from '@/components/dashboard/WidgetDrawer';
import {
    WIDGET_REGISTRY,
    PRESET_LAYOUTS,
    LAYOUT_STORAGE_KEY,
    getWidgetById,
    type WidgetLayoutItem,
} from '@/lib/widget-registry';
import {
    LayoutGrid,
    Pencil,
    Check,
    Save,
    Plus,
    PackageOpen,
    ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// ─── Helpers ───────────────────────────────────────────────────────────────

function findNextPosition(layout: WidgetLayoutItem[], w: number, h: number, cols = 4): { x: number; y: number } {
    if (layout.length === 0) return { x: 0, y: 0 };

    const maxY = layout.reduce((max, item) => Math.max(max, item.y + item.h), 0);
    const grid: boolean[][] = Array.from({ length: maxY + h + 1 }, () => Array(cols).fill(false));

    for (const item of layout) {
        for (let row = item.y; row < item.y + item.h; row++) {
            for (let col = item.x; col < item.x + item.w; col++) {
                if (grid[row]) grid[row][col] = true;
            }
        }
    }

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col <= cols - w; col++) {
            let fits = true;
            for (let dr = 0; dr < h && fits; dr++) {
                for (let dc = 0; dc < w && fits; dc++) {
                    if (grid[row + dr]?.[col + dc]) fits = false;
                }
            }
            if (fits) return { x: col, y: row };
        }
    }

    return { x: 0, y: maxY };
}

// ─── Page Component ────────────────────────────────────────────────────────

export default function WidgetsPage() {
    const [layout, setLayout] = useState<WidgetLayoutItem[]>([]);
    const [editMode, setEditMode] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState<string>('default');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [mounted, setMounted] = useState(false);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Load layout from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(LAYOUT_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setLayout(parsed);
                    setSelectedPreset('custom');
                    setMounted(true);
                    return;
                }
            }
        } catch {
            // ignore parse errors
        }
        // Fallback to default preset
        setLayout(PRESET_LAYOUTS.default.widgets);
        setMounted(true);
    }, []);

    // Persist layout to localStorage + attempt API save
    const persistLayout = useCallback((newLayout: WidgetLayoutItem[]) => {
        try {
            localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(newLayout));
        } catch {
            // localStorage full or unavailable
        }

        // Debounced API save
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        setSaveStatus('saving');
        saveTimeoutRef.current = setTimeout(async () => {
            try {
                await fetch('/api/dashboard-layouts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ layout: newLayout }),
                });
                setSaveStatus('saved');
                setTimeout(() => setSaveStatus('idle'), 2000);
            } catch {
                // API save is best-effort
                setSaveStatus('idle');
            }
        }, 1000);
    }, []);

    // Handle layout changes from grid (reorder, resize)
    const handleLayoutChange = useCallback((newLayout: WidgetLayoutItem[]) => {
        setLayout(newLayout);
        setSelectedPreset('custom');
        persistLayout(newLayout);
    }, [persistLayout]);

    // Remove a widget
    const handleRemoveWidget = useCallback((widgetId: string) => {
        setLayout((prev) => {
            const next = prev.filter((item) => item.widgetId !== widgetId);
            persistLayout(next);
            setSelectedPreset('custom');
            return next;
        });
        const def = getWidgetById(widgetId);
        toast.success(`Removed "${def?.name ?? widgetId}"`);
    }, [persistLayout]);

    // Add a widget from the drawer
    const handleAddWidget = useCallback((widgetId: string) => {
        // Prevent duplicates
        if (layout.some((item) => item.widgetId === widgetId)) {
            toast.info('Widget already on dashboard');
            return;
        }

        const def = getWidgetById(widgetId);
        if (!def) return;

        const { x, y } = findNextPosition(layout, def.defaultSize.w, def.defaultSize.h);
        const newItem: WidgetLayoutItem = {
            widgetId,
            x,
            y,
            w: def.defaultSize.w,
            h: def.defaultSize.h,
        };

        const newLayout = [...layout, newItem];
        setLayout(newLayout);
        setSelectedPreset('custom');
        persistLayout(newLayout);
        toast.success(`Added "${def.name}"`);
    }, [layout, persistLayout]);

    // Preset selection
    const handlePresetChange = useCallback((presetKey: string) => {
        if (presetKey === 'custom') return;
        const preset = PRESET_LAYOUTS[presetKey];
        if (!preset) return;

        setSelectedPreset(presetKey);
        setLayout(preset.widgets);
        persistLayout(preset.widgets);
        toast.success(`Applied "${preset.name}" layout`);
    }, [persistLayout]);

    // Manual save
    const handleSave = useCallback(() => {
        persistLayout(layout);
        toast.success('Layout saved');
    }, [layout, persistLayout]);

    // Active widget IDs for the drawer
    const activeWidgetIds = layout.map((item) => item.widgetId);

    if (!mounted) {
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <PageHeader
                    icon={LayoutGrid}
                    category="Dashboard"
                    title="Widgets & Cards"
                    description="Customize your dashboard with drag-and-drop widgets."
                />
                <div className="flex items-center justify-center py-24">
                    <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                icon={LayoutGrid}
                category="Dashboard"
                title="Widgets & Cards"
                description="Customize your dashboard with drag-and-drop widgets."
                actions={
                    <div className="flex items-center gap-3">
                        {/* Save status indicator */}
                        {saveStatus === 'saving' && (
                            <span className="text-xs text-white/30 font-medium animate-pulse">Saving...</span>
                        )}
                        {saveStatus === 'saved' && (
                            <span className="text-xs text-green-400 font-medium flex items-center gap-1">
                                <Check className="h-3 w-3" /> Saved
                            </span>
                        )}

                        {/* Preset selector */}
                        <Select value={selectedPreset} onValueChange={handlePresetChange}>
                            <SelectTrigger className="w-[160px] h-9 bg-[rgba(22,32,50,0.6)] border-white/[0.06] text-white/70 text-xs font-bold rounded-xl">
                                <SelectValue placeholder="Select preset" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0f1729] border-white/[0.06]">
                                {Object.entries(PRESET_LAYOUTS).map(([key, preset]) => (
                                    <SelectItem key={key} value={key} className="text-xs font-medium text-white/70">
                                        {preset.name}
                                    </SelectItem>
                                ))}
                                {selectedPreset === 'custom' && (
                                    <SelectItem value="custom" className="text-xs font-medium text-white/40" disabled>
                                        Custom
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>

                        {/* Edit mode toggle */}
                        <button
                            onClick={() => {
                                setEditMode((prev) => {
                                    if (prev) {
                                        // Exiting edit mode — save
                                        persistLayout(layout);
                                    }
                                    return !prev;
                                });
                            }}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-sm",
                                editMode
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                    : "bg-[rgba(22,32,50,0.6)] border border-white/[0.06] text-white/50 hover:bg-white/[0.03]"
                            )}
                        >
                            {editMode ? (
                                <>
                                    <Check className="h-4 w-4" /> DONE
                                </>
                            ) : (
                                <>
                                    <Pencil className="h-4 w-4" /> EDIT
                                </>
                            )}
                        </button>

                        {/* Save button */}
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-4 py-2 bg-[rgba(22,32,50,0.6)] border border-white/[0.06] text-white/50 rounded-xl font-bold text-xs hover:bg-white/[0.03] transition-all shadow-sm"
                        >
                            <Save className="h-4 w-4" /> SAVE
                        </button>
                    </div>
                }
            />

            {/* Add Widget button (edit mode only) */}
            {editMode && (
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setDrawerOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-xl font-bold text-xs hover:bg-primary/20 transition-all"
                    >
                        <Plus className="h-4 w-4" /> Add Widget
                    </button>
                    <span className="text-xs text-white/30">
                        {layout.length} widget{layout.length !== 1 ? 's' : ''} on dashboard
                    </span>
                </div>
            )}

            {/* Widget Grid or Empty State */}
            {layout.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4 bg-[rgba(22,32,50,0.3)] rounded-2xl border border-dashed border-white/[0.06]">
                    <PackageOpen className="h-12 w-12 text-white/20" />
                    <p className="text-sm text-white/40 font-medium text-center max-w-md">
                        No widgets yet. Click <strong className="text-white/60">Edit</strong> to add widgets or select a preset.
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                        <button
                            onClick={() => {
                                setEditMode(true);
                                setDrawerOpen(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-xl font-bold text-xs hover:bg-primary/20 transition-all"
                        >
                            <Plus className="h-4 w-4" /> Add Widget
                        </button>
                        <button
                            onClick={() => handlePresetChange('default')}
                            className="flex items-center gap-2 px-4 py-2 bg-[rgba(22,32,50,0.6)] border border-white/[0.06] text-white/50 rounded-xl font-bold text-xs hover:bg-white/[0.03] transition-all"
                        >
                            Load Default Preset
                        </button>
                    </div>
                </div>
            ) : (
                <WidgetGrid
                    layout={layout}
                    editMode={editMode}
                    onLayoutChange={handleLayoutChange}
                    onRemoveWidget={handleRemoveWidget}
                />
            )}

            {/* Widget Drawer */}
            <WidgetDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                onAddWidget={handleAddWidget}
                activeWidgetIds={activeWidgetIds}
            />
        </div>
    );
}
