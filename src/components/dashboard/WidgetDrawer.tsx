'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, GripVertical, Plus } from 'lucide-react';
import { BrandIcons } from '../icons/BrandIcons';

interface WidgetDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const WIDGET_CATEGORIES = [
    {
        id: 'social', name: 'Social Media', items: [
            { name: 'Instagram', icon: BrandIcons.Instagram },
            { name: 'Facebook', icon: BrandIcons.Facebook },
            { name: 'TikTok', icon: BrandIcons.TikTok },
            { name: 'YouTube', icon: BrandIcons.Youtube },
            { name: 'Twitter', icon: BrandIcons.Twitter },
            { name: 'LinkedIn', icon: BrandIcons.Linkedin },
        ]
    },
    {
        id: 'charts', name: 'Charts & Data', items: [
            { name: 'Revenue', icon: BrandIcons.Google }, // Placeholder icon
            { name: 'Growth', icon: BrandIcons.Google },
            { name: 'Engagement', icon: BrandIcons.Google },
        ]
    },
    {
        id: 'media', name: 'Media Assets', items: [
            { name: 'Logo Pack', icon: BrandIcons.Google },
            { name: 'Brand Colors', icon: BrandIcons.Google },
        ]
    }
];

export const WidgetDrawer: React.FC<WidgetDrawerProps> = ({ isOpen, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('social');

    // Filter logic would go here

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black z-40 backdrop-blur-sm"
                    />

                    {/* Drawer Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-[400px] bg-white/[0.04] bg-gray-900 border-l border-gray-200 border-gray-800 shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 border-gray-800 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold">Add Widget</h2>
                                <p className="text-sm text-muted-foreground">Drag and drop to dashboard</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 hover:bg-gray-800 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="p-4 border-b border-gray-100 border-gray-800">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search widgets..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 bg-gray-800 border-none outline-none focus:ring-2 focus:ring-[#0D9488]/50"
                                />
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="flex gap-2 p-4 overflow-x-auto scrollbar-hide border-b border-gray-100 border-gray-800">
                            {WIDGET_CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${selectedCategory === cat.id
                                            ? 'bg-black text-white bg-white/[0.04] text-black'
                                            : 'bg-gray-100 text-gray-600 bg-gray-800 text-gray-400 hover:bg-gray-200'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Grid Items */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="grid grid-cols-2 gap-4">
                                {WIDGET_CATEGORIES.find(c => c.id === selectedCategory)?.items.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="group relative bg-white/[0.04] bg-gray-800/50 border border-gray-200 border-gray-700 rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-[#0D9488] hover:shadow-md transition-all"
                                        draggable
                                        onDragStart={(e) => {
                                            e.dataTransfer.setData('widgetType', item.name);
                                            e.dataTransfer.effectAllowed = 'copy';
                                        }}
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-50 bg-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <item.icon width={24} height={24} />
                                            </div>
                                            <span className="text-xs font-bold text-center">{item.name}</span>
                                        </div>

                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">
                                            <GripVertical size={14} />
                                        </div>

                                        <button className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 group-hover:bottom-2 transition-all shadow-lg flex items-center gap-1">
                                            <Plus size={10} /> Add
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-100 border-gray-800 bg-gray-50 bg-gray-900/50 text-center">
                            <p className="text-xs text-muted-foreground">
                                Use the <span className="font-bold">Upload</span> tab to add custom assets.
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
