import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, ServiceType, Objective, SubCampaignType } from '@/services/api';
import { toast } from 'sonner';

interface CreateSubCampaignDialogProps {
    brandId: string;
    parentId: string;
    parentName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export const CreateSubCampaignDialog = ({ brandId, parentId, parentName, open, onOpenChange, onSuccess }: CreateSubCampaignDialogProps) => {
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState<ServiceType[]>([]);
    const [subCampaignTypes, setSubCampaignTypes] = useState<SubCampaignType[]>([]);
    const [objectives, setObjectives] = useState<Objective[]>([]);

    const [formData, setFormData] = useState({
        serviceTypeId: '',
        subCampaignTypeId: '',
        objectiveId: '',
        budgetPlanned: 0
    });

    useEffect(() => {
        if (open) {
            fetchOptions();
        }
    }, [open]);

    // Fetch dependent sub-types when service changes
    useEffect(() => {
        const fetchSubTypes = async () => {
            if (formData.serviceTypeId) {
                try {
                    const types = await api.subCampaignTypes.getAll(formData.serviceTypeId);
                    setSubCampaignTypes(types);
                } catch (e) {
                    console.error("Failed to fetch sub types", e);
                }
            } else {
                setSubCampaignTypes([]);
            }
        };
        fetchSubTypes();
    }, [formData.serviceTypeId]);

    const fetchOptions = async () => {
        try {
            const [svcData, objData] = await Promise.all([
                api.serviceTypes.getAll(),
                api.objectives.getAll()
            ]);
            setServices(svcData);
            setObjectives(objData);
        } catch (error) {
            console.error("Failed to fetch options", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const selectedService = services.find(s => s.id === formData.serviceTypeId);
            const selectedSubType = subCampaignTypes.find(t => t.id === formData.subCampaignTypeId);

            // Generate Name: "Umbrella - Service (Sub-Service)"
            // Example: "Ninja CREAMi - Influencer Marketing (Seeding)"
            const serviceName = selectedService ? selectedService.name : 'Service';
            const subName = selectedSubType ? ` (${selectedSubType.name})` : '';

            const campaignName = `${parentName} - ${serviceName}${subName}`;
            const slug = campaignName.replace(/[^a-zA-Z0-9]/g, ' ').trim().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');

            await api.campaigns.createSubCampaign({
                name: campaignName,
                slug,
                campaignId: parentId,
                status: 'active',
                serviceTypeId: formData.serviceTypeId,
                subCampaignTypeId: formData.subCampaignTypeId,
                objectiveId: formData.objectiveId,
                budgetPlanned: formData.budgetPlanned,
            });

            toast.success("Service added successfully");
            onSuccess();
            onOpenChange(false);
            setFormData({ serviceTypeId: '', subCampaignTypeId: '', objectiveId: '', budgetPlanned: 0 });
        } catch (error) {
            console.error(error);
            toast.error("Failed to add service");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-[#0a0a0a] border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>Add Service</DialogTitle>
                    <DialogDescription>
                        Add a service execution to <strong>{parentName}</strong>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="service" className="text-right text-gray-400">Service</Label>
                            <Select
                                value={formData.serviceTypeId}
                                onValueChange={val => setFormData({ ...formData, serviceTypeId: val })}
                            >
                                <SelectTrigger className="col-span-3 bg-white/5 border-white/10 text-white">
                                    <SelectValue placeholder="Select Service" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1a1a1a] border-white/10 text-white h-[200px]">
                                    {services.map(svc => (
                                        <SelectItem key={svc.id} value={svc.id}>
                                            {svc.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="obj" className="text-right text-gray-400">Objective</Label>
                            <Select
                                value={formData.objectiveId}
                                onValueChange={val => setFormData({ ...formData, objectiveId: val })}
                            >
                                <SelectTrigger className="col-span-3 bg-white/5 border-white/10 text-white">
                                    <SelectValue placeholder="Select Objective" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                                    {objectives.map(obj => (
                                        <SelectItem key={obj.id} value={obj.id}>
                                            {obj.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="budget" className="text-right text-gray-400">Budget</Label>
                            <Input
                                id="budget"
                                type="number"
                                value={formData.budgetPlanned}
                                onChange={e => setFormData({ ...formData, budgetPlanned: Number(e.target.value) })}
                                className="col-span-3 bg-white/5 border-white/10 text-white"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-gray-400 hover:text-white">Cancel</Button>
                        <Button type="submit" disabled={loading} className="bg-[#0D9488] hover:bg-[#0F766E]">
                            {loading ? 'Adding...' : 'Add Service'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
