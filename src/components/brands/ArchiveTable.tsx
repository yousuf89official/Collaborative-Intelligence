
import React from 'react';
import { RefreshCcw, Trash2 } from 'lucide-react';
import { BrandAvatar } from './BrandAvatar';
import { Badge, Button } from './BrandPrimitives';
import { EnrichedBrand } from '@/lib/brands-data';

export const ArchiveTable = ({ brands, onRestore, onDelete, onUpdateStatus }: {
    brands: EnrichedBrand[],
    onRestore: (id: string, name: string) => void,
    onDelete: (id: string, name: string, permanent?: boolean) => void,
    onUpdateStatus: (id: string, status: string) => void
}) => {
    return (
        <div className="bg-white/[0.04] rounded-2xl shadow-sm border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-white/[0.03] border-b border-white/10">
                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-white/50">Brand Entity</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-white/50">Sector</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-white/50">Archived Date</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-white/50">Status</th>
                            <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-white/50">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                        {brands.map((brand) => (
                            <tr key={brand.id} className="hover:bg-white/[0.06] transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <BrandAvatar
                                            logo_url={brand.logo}
                                            name={brand.name}
                                            brand_color={brand.brandColor || undefined}
                                            size="sm"
                                        />
                                        <div>
                                            <div className="font-bold text-white text-sm">{brand.name}</div>
                                            <div className="text-[10px] text-white/40 font-mono">{brand.slug}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-white/70">{brand.industry}</span>
                                        <span className="text-[10px] text-white/40">{brand.sub_category}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs font-medium text-white/50">
                                        {new Date(brand.updatedAt).toLocaleDateString()}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant="inactive">ARCHIVED</Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => onRestore(brand.id, brand.name)}
                                            className="h-8 w-8 p-0"
                                            title="Restore to Active"
                                        >
                                            <RefreshCcw className="h-4 w-4 text-emerald-400" />
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => onDelete(brand.id, brand.name, true)}
                                            className="h-8 w-8 p-0 hover:border-red-500/20 hover:bg-red-500/10"
                                            title="Delete Permanently"
                                        >
                                            <Trash2 className="h-4 w-4 text-red-400" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
