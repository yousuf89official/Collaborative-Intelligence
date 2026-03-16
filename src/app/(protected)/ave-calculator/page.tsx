'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Calculator } from 'lucide-react';
import { MediaAnalyzer } from '@/components/ave/MediaAnalyzer';

export default function AveCalculatorPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                icon={Calculator}
                category="Media Tools"
                title="Media Analyzer"
                description="Calculate Share of Voice, Advertising Value Equivalency, and campaign efficiency metrics with AI-powered analysis."
            />
            <MediaAnalyzer />
        </div>
    );
}
