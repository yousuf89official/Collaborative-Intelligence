import { Card, CardContent } from '@/components/ui/card';
import { Eye, Users, DollarSign, Zap, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BrandWidgets } from '@/services/api';

export const DashboardWidgets = ({ data }: { data: BrandWidgets }) => {
    const widgets = [
        {
            label: 'Total Impressions',
            value: data.impressions.value.toLocaleString(),
            trend: `${data.impressions.trend > 0 ? '+' : ''}${data.impressions.trend}% from last period`,
            icon: Eye,
            trendColor: data.impressions.trend > 0 ? 'text-green-500' : 'text-red-500'
        },
        {
            label: 'Total Reach',
            value: data.reach.value.toLocaleString(),
            trend: `${data.reach.trend > 0 ? '+' : ''}${data.reach.trend}% from last period`,
            icon: Users,
            trendColor: data.reach.trend > 0 ? 'text-green-500' : 'text-red-500'
        },
        {
            label: 'Total Spend',
            value: `IDR ${data.spend.value.toLocaleString('id-ID')}`,
            trend: `${data.spend.trend > 0 ? '+' : ''}${data.spend.trend}% from last period`,
            icon: DollarSign,
            trendColor: data.spend.trend > 0 ? 'text-green-500' : 'text-red-500'
        },
        {
            label: 'Engagement Rate',
            value: `${data.engagementRate.value}%`,
            trend: `${data.engagementRate.trend > 0 ? '+' : ''}${data.engagementRate.trend}% from last period`,
            icon: Zap,
            trendColor: data.engagementRate.trend > 0 ? 'text-green-500' : 'text-red-500'
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Dashboard Widgets</h3>
                <Button variant="outline" size="sm" className="gap-2 h-8">
                    <Edit2 size={14} /> Edit
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {widgets.map((item, idx) => (
                    <Card key={idx} className="bg-card/50 backdrop-blur-sm border-white/5">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white/5 rounded-lg text-muted-foreground">
                                    <item.icon size={20} />
                                </div>
                                <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                            </div>
                            <h2 className="text-3xl font-bold mb-2 break-all">{item.value}</h2>
                            <p className={`text-xs font-medium ${item.trendColor}`}>{item.trend}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
