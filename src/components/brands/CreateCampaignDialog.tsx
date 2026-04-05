import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, CampaignMarket } from '@/services/api';
import { toast } from 'sonner';

interface CreateCampaignDialogProps {
    brandId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export const CreateCampaignDialog = ({ brandId, open, onOpenChange, onSuccess }: CreateCampaignDialogProps) => {
    const [loading, setLoading] = useState(false);
    const [markets, setMarkets] = useState<CampaignMarket[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        marketId: '',
        startDate: '',
        endDate: '',
        description: ''
    });

    useEffect(() => {
        if (open) {
            fetchMarkets();
        }
    }, [open]);

    const fetchMarkets = async () => {
        try {
            const data = await api.campaignMarkets.getAll();
            setMarkets(data);
        } catch (error) {
            console.error("Failed to fetch markets", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Create Umbrella Campaign
            await api.campaigns.create({
                ...formData,
                brandId,
                status: 'active', // Default to active
                parentId: null,   // Explicitly null for Umbrella
                budgetPlanned: 0,  // 0 for Umbrella, sum of subs usually
                slug: '' // Backend generates slug
            });
            toast.success("Umbrella campaign created successfully");
            onSuccess();
            onOpenChange(false);
            setFormData({ name: '', marketId: '', startDate: '', endDate: '', description: '' });
        } catch (error) {
            console.error(error);
            toast.error("Failed to create umbrella campaign");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-white/[0.04] border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>New Umbrella Campaign</DialogTitle>
                    <DialogDescription className="text-white/50">
                        Create a high-level campaign to group your marketing activities.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right text-white/60">Campaign Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Ninja CREAMi Launch"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="col-span-3 bg-white/[0.04] border-white/10 text-white focus-visible:ring-[#0D9488]"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="market" className="text-right text-white/60">Market</Label>
                            <Select
                                value={formData.marketId}
                                onValueChange={val => setFormData({ ...formData, marketId: val })}
                            >
                                <SelectTrigger className="col-span-3 bg-white/[0.04] border-white/10 text-white">
                                    <SelectValue placeholder="Select Market" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0a0f1a] border-white/10">
                                    {markets.map(market => (
                                        <SelectItem key={market.id} value={market.id} className="text-white/70 focus:bg-white/[0.08] focus:text-white">
                                            {market.name} ({market.code})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="startDate" className="text-right text-white/60">Dates</Label>
                            <div className="col-span-3 flex gap-2">
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                    className="bg-white/[0.04] border-white/10 text-white"
                                    placeholder="Start"
                                />
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                    className="bg-white/[0.04] border-white/10 text-white"
                                    placeholder="End"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="desc" className="text-right text-white/60">Description</Label>
                            <Input
                                id="desc"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="col-span-3 bg-white/[0.04] border-white/10 text-white"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-white/50 hover:text-white hover:bg-white/[0.06]">Cancel</Button>
                        <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-[#0F766E] text-white">
                            {loading ? 'Creating...' : 'Create Campaign'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
