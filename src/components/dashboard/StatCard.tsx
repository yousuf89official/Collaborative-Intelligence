import { ArrowUpRight, ArrowDownRight, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
    label: string;
    value: string | number;
    trend?: number;
    icon: LucideIcon;
    subValue?: string;
    className?: string;
}

export function StatCard({ label, value, trend, icon: Icon, subValue, className }: StatCardProps) {
    const isPositive = trend && trend > 0;

    return (
        <Card className={cn("bg-card/50 backdrop-blur-sm border-white/5", className)}>
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <p className="text-sm font-medium text-muted-foreground">{label}</p>
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Icon size={18} />
                    </div>
                </div>

                <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold">{value}</h3>
                    {trend !== undefined && (
                        <span className={cn(
                            "flex items-center text-xs font-medium px-2 py-0.5 rounded-full",
                            isPositive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        )}>
                            {isPositive ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                            {Math.abs(trend)}%
                        </span>
                    )}
                </div>

                {subValue && (
                    <p className="text-xs text-muted-foreground mt-1">{subValue}</p>
                )}
            </CardContent>
        </Card>
    );
}
