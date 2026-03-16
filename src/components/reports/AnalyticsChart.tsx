'use client';

import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';

interface AnalyticsChartProps {
    data: any[];
    type: 'area' | 'bar';
    dataKey: string;
    color?: string;
    height?: number;
    showGrid?: boolean;
}

export const AnalyticsChart = ({
    data,
    type,
    dataKey,
    color = '#0D9488',
    height = 300,
    showGrid = true
}: AnalyticsChartProps) => {
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#161616]/95 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-xl">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">{label}</p>
                    <p className="text-sm font-black text-white">
                        {payload[0].value.toLocaleString()}
                        <span className="text-white/40 font-bold ml-1 uppercase">{dataKey}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <ResponsiveContainer>
                {type === 'area' ? (
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />}
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fontWeight: 700, fill: 'rgba(255,255,255,0.4)' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fontWeight: 700, fill: 'rgba(255,255,255,0.4)' }}
                            tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey={dataKey}
                            stroke={color}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                        />
                    </AreaChart>
                ) : (
                    <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />}
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fontWeight: 700, fill: 'rgba(255,255,255,0.4)' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fontWeight: 700, fill: 'rgba(255,255,255,0.4)' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? color : `${color}88`} />
                            ))}
                        </Bar>
                    </BarChart>
                )}
            </ResponsiveContainer>
        </div>
    );
};
