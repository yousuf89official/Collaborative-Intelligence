import type { Metadata } from 'next';
import { HomePage } from '@/components/public/HomePage';

export const metadata: Metadata = {
    title: 'Collaborative Intelligence | Unified Campaign Intelligence for Data-Driven Brands',
    description: 'Enterprise-grade campaign analytics, full-funnel performance tracking, and AI-powered media intelligence. Unify brands, agencies, and channels on one platform.',
    keywords: [
        'media intelligence platform',
        'campaign analytics',
        'advertising value equivalency',
        'share of voice analytics',
        'enterprise media buying',
        'cross-channel analytics',
        'media performance tracking',
        'brand campaign management',
        'AI media optimization',
        'collaborative intelligence',
    ],
    openGraph: {
        title: 'Collaborative Intelligence | Unified Campaign Intelligence',
        description: 'Enterprise-grade campaign analytics and AI-powered insights for global brands and agencies.',
        url: 'https://collaborativeintelligence.com',
        siteName: 'Collaborative Intelligence',
        type: 'website',
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Collaborative Intelligence | Unified Campaign Intelligence',
        description: 'Enterprise-grade campaign analytics and AI-powered insights for global brands and agencies.',
    },
    alternates: {
        canonical: 'https://collaborativeintelligence.com',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function LandingPage() {
    return <HomePage />;
}
