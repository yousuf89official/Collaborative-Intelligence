
import React, { useState } from 'react';
import { Loader2, X, Image as ImageIcon } from 'lucide-react';
import { Button, Input, Label, SelectWrapper } from '@/components/brands/BrandPrimitives';

export const CreateBrandModal = ({ isOpen, onClose, onCreate, industries }: any) => {
    const [formData, setFormData] = useState({
        name: '',
        industryId: '',
        industrySubTypeId: '',
        website: '',
        logo_url: '',
        brandColor: '#4F46E5',
        brandFontColor: '#000000',
        defaultCurrency: 'USD'
    });
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const convertToSVG = (base64: string) => {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
            <image href="${base64}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />
        </svg>`;
        return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
    };

    const extractColor = async (dataUrl: string) => {
        return new Promise<string>((resolve) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return resolve('#4F46E5');

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                let r = 0, g = 0, b = 0, count = 0;

                for (let i = 0; i < imageData.length; i += 40) {
                    if (imageData[i + 3] > 128) {
                        r += imageData[i];
                        g += imageData[i + 1];
                        b += imageData[i + 2];
                        count++;
                    }
                }

                if (count === 0) return resolve('#4F46E5');

                r = Math.floor(r / count);
                g = Math.floor(g / count);
                b = Math.floor(b / count);

                const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
                resolve(hex);
            };
            img.src = dataUrl;
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result as string;
            setPreview(base64);
            const extracted = await extractColor(base64);
            const svgLogo = convertToSVG(base64);
            setFormData(prev => ({ ...prev, logo_url: svgLogo, brandColor: extracted }));
        };
        reader.readAsDataURL(file);
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onCreate(formData);
            onClose();
            setFormData({ name: '', industryId: '', industrySubTypeId: '', website: '', logo_url: '', brandColor: '#4F46E5', brandFontColor: '#000000', defaultCurrency: 'USD' });
            setPreview(null);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const selectedIndustry = industries.find((i: any) => i.id === formData.industryId);
    const availableSubTypes = selectedIndustry?.subTypes || [];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white/[0.04] rounded-[32px] shadow-2xl max-w-lg w-full overflow-hidden border border-white/[0.06] transform scale-100">
                <div className="p-8 border-b border-white/[0.06] bg-white/[0.03]/50 flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight">New Brand Entity</h3>
                        <p className="text-sm text-white/50 font-medium">Initialize a new global portfolio asset with visual ID.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/[0.06] rounded-full transition-colors">
                        <X className="h-6 w-6 text-white/40" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 flex items-center gap-6 p-4 bg-white/[0.03] rounded-2xl border border-white/[0.06]">
                            <div
                                className="h-20 w-20 rounded-xl flex items-center justify-center border-2 border-dashed border-white/10 relative overflow-hidden group hover:border-[#0D9488] transition-all cursor-pointer bg-white/[0.04]"
                            >
                                {preview ? (
                                    <img src={preview} alt="Preview" className="h-full w-full object-contain p-2" />
                                ) : (
                                    <ImageIcon className="h-8 w-8 text-white/30 group-hover:text-[#0D9488]/60" />
                                )
                                }
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="flex-1 space-y-3">
                                <Label className="text-xs">Visual Identity</Label>
                                <p className="text-[10px] text-white/40 font-medium">Upload logo for auto-color extraction or set manually.</p>
                                <div className="flex gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-white/50 uppercase">Card Color</label>
                                        <div className="flex items-center gap-2">
                                            <div className="relative h-8 w-12 rounded-lg border border-white/10 overflow-hidden shadow-sm">
                                                <input
                                                    type="color"
                                                    value={formData.brandColor}
                                                    onChange={(e) => setFormData({ ...formData, brandColor: e.target.value })}
                                                    className="absolute inset-0 h-[150%] w-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-none"
                                                />
                                            </div>
                                            <span className="text-[10px] font-mono text-white/50">{formData.brandColor}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-white/50 uppercase">Font Color</label>
                                        <div className="flex items-center gap-2">
                                            <div className="relative h-8 w-12 rounded-lg border border-white/10 overflow-hidden shadow-sm">
                                                <input
                                                    type="color"
                                                    value={formData.brandFontColor}
                                                    onChange={(e) => setFormData({ ...formData, brandFontColor: e.target.value })}
                                                    className="absolute inset-0 h-[150%] w-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-none"
                                                />
                                            </div>
                                            <span className="text-[10px] font-mono text-white/50">{formData.brandFontColor}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2 space-y-2">
                            <Label>Brand Name</Label>
                            <Input
                                required
                                placeholder="e.g. SharkNinja Global"
                                value={formData.name}
                                onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Industry Sector</Label>
                            <SelectWrapper
                                required
                                value={formData.industryId}
                                onChange={(e: any) => {
                                    setFormData({ ...formData, industryId: e.target.value, industrySubTypeId: '' });
                                }}
                            >
                                <option value="" className="bg-[#0a0f1a] text-white">Select Sector</option>
                                {industries.map((ind: any) => (
                                    <option key={ind.id} value={ind.id} className="bg-[#0a0f1a] text-white">{ind.name}</option>
                                ))}
                            </SelectWrapper>
                        </div>
                        <div className="space-y-2">
                            <Label>Sub-Category</Label>
                            <SelectWrapper
                                required
                                disabled={!formData.industryId}
                                value={formData.industrySubTypeId}
                                onChange={(e: any) => setFormData({ ...formData, industrySubTypeId: e.target.value })}
                            >
                                <option value="" className="bg-[#0a0f1a] text-white">Select Sub-Type</option>
                                {availableSubTypes.map((sub: any) => (
                                    <option key={sub.id} value={sub.id} className="bg-[#0a0f1a] text-white">{sub.name}</option>
                                ))}
                            </SelectWrapper>
                        </div>
                        <div className="col-span-1 space-y-2">
                            <Label>Default Currency</Label>
                            <SelectWrapper
                                value={formData.defaultCurrency}
                                onChange={(e: any) => setFormData({ ...formData, defaultCurrency: e.target.value })}
                            >
                                <option value="USD" className="bg-[#0a0f1a] text-white">USD - US Dollar</option>
                                <option value="IDR" className="bg-[#0a0f1a] text-white">IDR - Rupiah</option>
                                <option value="SGD" className="bg-[#0a0f1a] text-white">SGD - Singapore Dollar</option>
                                <option value="MYR" className="bg-[#0a0f1a] text-white">MYR - Ringgit</option>
                            </SelectWrapper>
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label>Official Website</Label>
                            <Input
                                placeholder="https://brand.com"
                                value={formData.website}
                                onChange={(e: any) => setFormData({ ...formData, website: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="pt-4 flex gap-4">
                        <Button
                            type="button"
                            variant="secondary"
                            className="flex-1 h-12"
                            onClick={onClose}
                        >
                            CANCEL
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 h-12"
                            disabled={loading || !formData.logo_url}
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'INITIALIZE BRAND'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
