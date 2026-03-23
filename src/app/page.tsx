import type { Metadata } from 'next';
import { HomePage } from '@/components/public/HomePage';

export const metadata: Metadata = {
    title: 'Collaborative Intelligence | Unified Campaign Intelligence for Data-Driven Brands',
    description: 'Unify brands, agencies, and channels on one platform. Enterprise campaign analytics, full-funnel tracking, and AI-powered media intelligence. Start your free trial today.',
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
        'unified campaign intelligence',
        'media buying platform',
    ],
    openGraph: {
        title: 'Collaborative Intelligence | Unified Campaign Intelligence',
        description: 'Enterprise-grade campaign analytics and AI-powered insights for global brands and agencies. Unify all channels on one intelligent platform.',
        url: 'https://integratedmediahub.com',
        siteName: 'Collaborative Intelligence',
        type: 'website',
        locale: 'en_US',
        images: [
            {
                url: 'https://integratedmediahub.com/opengraph-image',
                width: 1200,
                height: 630,
                alt: 'Collaborative Intelligence - Unified Campaign Intelligence Platform Dashboard',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Collaborative Intelligence | Unified Campaign Intelligence',
        description: 'Enterprise-grade campaign analytics and AI-powered insights for global brands and agencies.',
        images: ['https://integratedmediahub.com/opengraph-image'],
        creator: '@collab_intel',
    },
    alternates: {
        canonical: 'https://integratedmediahub.com',
    },
    robots: {
        index: true,
        follow: true,
    },
};

// JSON-LD: SoftwareApplication schema for the homepage
const softwareAppJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Collaborative Intelligence',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: 'Enterprise-grade campaign analytics platform with full-funnel performance tracking, AI-powered insights, and cross-channel media intelligence.',
    url: 'https://integratedmediahub.com',
    offers: {
        '@type': 'AggregateOffer',
        lowPrice: '0',
        highPrice: '499',
        priceCurrency: 'USD',
        offerCount: '5',
    },
    featureList: [
        'Full-funnel campaign analytics',
        'AI-powered media intelligence',
        'Cross-channel performance tracking',
        'Advertising Value Equivalency (AVE) calculator',
        'Share of Voice (SOV) analytics',
        'Real-time dashboards',
        'White-label branded reporting',
        'Enterprise role-based access control',
        'Platform integrations (Google Ads, Meta, TikTok, LinkedIn)',
        'Predictive analytics engine',
    ],
    aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '500',
        bestRating: '5',
    },
};

// JSON-LD: BreadcrumbList for homepage
const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://integratedmediahub.com',
        },
    ],
};

export default function LandingPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <HomePage />
        </>
    );
}
