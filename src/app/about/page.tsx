import type { Metadata } from 'next';
import { AboutPage } from './AboutPage';

export const metadata: Metadata = {
    title: 'About Us | Enterprise Campaign Intelligence Platform',
    description: 'Learn about Collaborative Intelligence, the enterprise campaign intelligence platform unifying brands, agencies, and channels. Founded in 2023, serving 500+ clients in 30+ countries.',
    keywords: [
        'about collaborative intelligence',
        'media intelligence company',
        'campaign analytics platform',
        'enterprise media technology',
        'media intelligence team',
        'unified campaign intelligence company',
    ],
    openGraph: {
        title: 'About Collaborative Intelligence | Our Mission & Team',
        description: 'The enterprise platform unifying brands, agencies, and channels with AI-powered media intelligence. 500+ clients, 30+ countries, 99.9% uptime.',
        url: 'https://integratedmediahub.com/about',
        siteName: 'Collaborative Intelligence',
        type: 'website',
        images: [
            {
                url: 'https://integratedmediahub.com/og-about.png',
                width: 1200,
                height: 630,
                alt: 'About Collaborative Intelligence - Enterprise Campaign Intelligence Platform',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'About Collaborative Intelligence',
        description: 'The enterprise platform unifying brands, agencies, and channels with AI-powered media intelligence.',
        images: ['https://integratedmediahub.com/og-about.png'],
    },
    alternates: {
        canonical: 'https://integratedmediahub.com/about',
    },
    robots: {
        index: true,
        follow: true,
    },
};

// JSON-LD: BreadcrumbList
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
        {
            '@type': 'ListItem',
            position: 2,
            name: 'About',
            item: 'https://integratedmediahub.com/about',
        },
    ],
};

// JSON-LD: AboutPage structured data
const aboutPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Collaborative Intelligence',
    description: 'Learn about the enterprise campaign intelligence platform unifying brands, agencies, and channels with AI-powered analytics.',
    url: 'https://integratedmediahub.com/about',
    mainEntity: {
        '@type': 'Organization',
        name: 'Collaborative Intelligence',
        foundingDate: '2023',
        numberOfEmployees: {
            '@type': 'QuantitativeValue',
            minValue: 50,
        },
        areaServed: {
            '@type': 'GeoShape',
            name: '30+ countries worldwide',
        },
        knowsAbout: [
            'Campaign Analytics',
            'Media Intelligence',
            'Advertising Value Equivalency',
            'Share of Voice Analytics',
            'Cross-Channel Attribution',
            'AI-Powered Media Optimization',
        ],
    },
};

export default function Page() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd) }}
            />
            <AboutPage />
        </>
    );
}
