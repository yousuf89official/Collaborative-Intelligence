
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Briefcase, Plus, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

import { EnrichedBrand } from '@/lib/brands-data';
import { Badge, Button, Card } from './BrandPrimitives';
import { BrandAvatar } from './BrandAvatar';
import { ArchiveTable } from './ArchiveTable';
import { CreateBrandModal } from './CreateBrandModal';
import { PageHeader } from '@/components/layout/PageHeader';
import { cn } from '@/lib/utils';

interface BrandListGridProps {
    brands: EnrichedBrand[];
    industries: any[]; // Ideally typed from Prisma
}

export default function BrandListGrid({ brands, industries }: BrandListGridProps) {
    const router = useRouter();
    const [statusFilter, setStatusFilter] = useState<'Active' | 'Archive'>('Active');
    const [isCreateBrandModalOpen, setIsCreateBrandModalOpen] = useState(false);

    const filteredBrands = brands.filter(b => {
        const status = (b.status || 'Active').trim();
        if (statusFilter === 'Active') {
            return status === 'Active';
        } else {
            return status !== 'Active';
        }
    });

    const handleCreateBrand = async (brandData: any) => {
        try {
            const res = await fetch('/api/brands', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...brandData,
                    logo: brandData.logo_url
                })
            });

            if (res.ok) {
                toast.success("Brand entity initialized successfully");
                router.refresh(); // Refresh Server Components
            } else {
                const err = await res.json();
                toast.error(err.error || "Failed to create brand");
            }
        } catch (error) {
            toast.error("Unable to reach brand registry service");
        }
    };

    const handleRestoreBrand = async (id: string, name: string) => {
        try {
            const res = await fetch(`/api/brands/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Active' })
            });

            if (res.ok) {
                toast.success(`${name} restored to active portfolio`);
                router.refresh();
            } else {
                toast.error("Criteria for restoration not met");
            }
        } catch (error) {
            toast.error("Unable to reach brand registry service");
        }
    };

    const handleDeleteBrand = async (id: string, name: string, permanent: boolean = false) => {
        if (!confirm(`Are you sure you want to ${permanent ? 'permanently delete' : 'archive'} ${name}?`)) return;

        try {
            const url = `/api/brands/${id}${permanent ? '?permanent=true' : ''}`;
            const res = await fetch(url, {
                method: 'DELETE'
            });
            if (res.ok) {
                toast.success(permanent ? "Brand erased" : "Brand archived");
                router.refresh();
            } else {
                const err = await res.json();
                toast.error(err.error || "Failed to process brand deletion");
            }
        } catch (error) {
            toast.error("Unable to reach brand registry service.");
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/brands/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                toast.success(`Brand status set to ${status}`);
                router.refresh();
            } else {
                toast.error("Registry rejected status change");
            }
        } catch (error) {
            toast.error("Unable to reach brand registry service");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <PageHeader
                icon={Briefcase}
                category="Agency Control"
                title="Brand Portfolio"
                description={statusFilter === 'Active' ? "Manage and monitor performance across all active client accounts." : "Review and manage legacy or inactive brand entities and configurations."}
                actions={
                    <div className="flex items-center gap-4">
                        <div className="flex p-1 bg-white/[0.06] rounded-xl border border-white/10">
                            <button
                                onClick={() => setStatusFilter('Active')}
                                className={cn(
                                    "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                    statusFilter === 'Active'
                                        ? "bg-white/[0.04] text-[#0D9488] shadow-sm ring-1 ring-white/10"
                                        : "text-white/50 hover:text-white"
                                )}
                            >
                                Active Portfolio
                            </button>
                            <button
                                onClick={() => setStatusFilter('Archive')}
                                className={cn(
                                    "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                    statusFilter === 'Archive'
                                        ? "bg-white/[0.04] text-red-400 shadow-sm ring-1 ring-white/10"
                                        : "text-white/50 hover:text-white"
                                )}
                            >
                                Archive
                            </button>
                        </div>
                        <Button
                            onClick={() => setIsCreateBrandModalOpen(true)}
                            className="gap-2 h-11 px-6 shadow-teal-500/20"
                        >
                            <Plus className="h-4 w-4" /> INITIALIZE BRAND
                        </Button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBrands.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-white/[0.04] border border-white/[0.06] rounded-3xl">
                        <div className="h-16 w-16 bg-white/[0.03] rounded-2xl flex items-center justify-center text-white/30 mx-auto mb-4">
                            <Briefcase className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">No {statusFilter} Brands</h3>
                        <p className="text-sm text-white/50 font-medium">There are currently no brand entities in this category.</p>
                    </div>
                )}

                {statusFilter === 'Archive' ? (
                    <div className="col-span-full">
                        <ArchiveTable
                            brands={filteredBrands}
                            onRestore={handleRestoreBrand}
                            onDelete={handleDeleteBrand}
                            onUpdateStatus={handleUpdateStatus}
                        />
                    </div>
                ) : (
                    <>
                        {filteredBrands.map((brand) => (
                            <div
                                key={brand.id}
                                onClick={() => router.push(`/brands/${brand.slug}`)}
                                className="group cursor-pointer perspective-1000 block"
                            >
                                <Card className="p-0 overflow-hidden h-full border-none shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ring-1 ring-white/10 flex flex-col">
                                    {/* TOP HALF: White Background, Centered Logo */}
                                    <div className="h-40 bg-white/[0.04] flex items-center justify-center relative p-2 border-b border-white/[0.06]">
                                        <div className="absolute inset-0 bg-white/[0.03]/30" /> {/* Subtle texture */}
                                        <BrandAvatar
                                            logo_url={brand.logo}
                                            name={brand.name}
                                            brand_color={undefined} // Force no background color inline style
                                            size="custom"
                                            containerClassName="!bg-transparent !shadow-none !rounded-none !border-none w-full h-full group-hover:scale-110 transition-transform duration-500 z-10 flex items-center justify-center p-2"
                                            imageClassName="h-full w-full object-contain max-h-[80%]"
                                        />
                                    </div>

                                    {/* BOTTOM HALF: Brand Color Background, Custom Font Color, Fixed Layout */}
                                    <div
                                        className="h-[280px] p-6 flex flex-col justify-between relative overflow-hidden"
                                        style={{
                                            backgroundColor: brand.brandColor || '#ffffff',
                                            color: brand.brandFontColor || '#000000'
                                        }}
                                    >
                                        {/* Texture Overlay for depth & optional Wallpaper */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/5 pointer-events-none z-10" />
                                        {brand.wallpapers && (
                                            <div
                                                className="absolute inset-0 opacity-10 bg-cover bg-center grayscale mix-blend-overlay pointer-events-none"
                                                style={{ backgroundImage: `url(${JSON.parse(brand.wallpapers)[0]})` }}
                                            />
                                        )}

                                        <div className="relative z-20 flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <Badge
                                                        variant="outline"
                                                        className="mb-2 backdrop-blur-md bg-white/20 border-white/20 transition-colors"
                                                        style={{ color: 'inherit', borderColor: 'currentColor', opacity: 0.8 }}
                                                    >
                                                        {brand.industry}
                                                    </Badge>
                                                    <h3 className="text-2xl font-black leading-tight tracking-tight line-clamp-1" style={{ color: 'inherit' }}>
                                                        {brand.name}
                                                    </h3>
                                                    <p className="text-[10px] uppercase font-bold mt-1 tracking-wider opacity-70 mb-2" style={{ color: 'inherit' }}>
                                                        {brand.sub_category}
                                                    </p>

                                                    {/* Description / Bio */}
                                                    {brand.description && (
                                                        <p className="text-xs font-medium opacity-80 line-clamp-2 leading-relaxed max-w-[90%]" style={{ color: 'inherit' }}>
                                                            {brand.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-end shrink-0">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60" style={{ color: 'inherit' }}>Active Campaigns</span>
                                                    <span className="text-3xl font-black" style={{ color: 'inherit' }}>{brand.campaignCount}</span>
                                                </div>
                                            </div>

                                            <div className="mt-auto">
                                                <div
                                                    className="grid grid-cols-3 gap-2 pt-4 border-t"
                                                    style={{ borderColor: 'currentColor', opacity: 0.9 }}
                                                >
                                                    <div>
                                                        <div className="text-[9px] font-bold uppercase tracking-wider mb-1 opacity-60" style={{ color: 'inherit' }}>Website</div>
                                                        <a
                                                            href={brand.website || '#'}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs font-bold hover:underline truncate block"
                                                            style={{ color: 'inherit' }}
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            {brand.website ? brand.website.replace(/^https?:\/\//, '') : '-'}
                                                        </a>
                                                    </div>
                                                    <div>
                                                        <div className="text-[9px] font-bold uppercase tracking-wider mb-1 opacity-60" style={{ color: 'inherit' }}>Location</div>
                                                        <div className="text-xs font-bold truncate" style={{ color: 'inherit' }}>{brand.location}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-[9px] font-bold uppercase tracking-wider mb-1 opacity-60" style={{ color: 'inherit' }}>Total Spend</div>
                                                        <div className="text-xs font-black" style={{ color: 'inherit' }}>
                                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: brand.defaultCurrency, notation: "compact" }).format(brand.financials.totalMediaSpend)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </>
                )}
            </div>

            <CreateBrandModal
                isOpen={isCreateBrandModalOpen}
                industries={industries}
                onClose={() => setIsCreateBrandModalOpen(false)}
                onCreate={handleCreateBrand}
            />
        </div>
    );
}
