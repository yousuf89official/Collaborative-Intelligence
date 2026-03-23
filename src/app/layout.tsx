import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import '../index.css';
import Providers from './providers';

const poppins = Poppins({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    variable: '--font-poppins',
});

export const metadata: Metadata = {
    title: {
        default: 'Collaborative Intelligence | Unified Campaign Intelligence',
        template: '%s | Collaborative Intelligence',
    } as any,
    description: 'Enterprise-grade campaign analytics, full-funnel performance tracking, and AI-powered media intelligence for global brands and agencies. Unify all channels on one platform.',
    metadataBase: new URL('https://integratedmediahub.com'),
    keywords: [
        'campaign intelligence platform',
        'media intelligence software',
        'campaign analytics',
        'advertising value equivalency',
        'share of voice analytics',
        'cross-channel analytics',
        'enterprise media buying',
        'AI media optimization',
        'collaborative intelligence',
        'unified campaign intelligence',
    ],
    authors: [{ name: 'Collaborative Intelligence', url: 'https://integratedmediahub.com' }],
    creator: 'Collaborative Intelligence',
    publisher: 'Collaborative Intelligence',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large' as const,
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://integratedmediahub.com',
        siteName: 'Collaborative Intelligence',
        title: 'Collaborative Intelligence | Unified Campaign Intelligence',
        description: 'Enterprise-grade campaign analytics and AI-powered insights for global brands and agencies.',
        images: [
            {
                url: 'https://integratedmediahub.com/opengraph-image',
                width: 1200,
                height: 630,
                alt: 'Collaborative Intelligence - Unified Campaign Intelligence Platform',
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
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
    category: 'technology',
};

import { Toaster } from '@/components/ui/toaster';

// JSON-LD Structured Data for Organization and WebSite (global)
const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Collaborative Intelligence',
    url: 'https://integratedmediahub.com',
    logo: 'https://integratedmediahub.com/logo.png',
    description: 'Enterprise-grade campaign analytics, full-funnel performance tracking, and AI-powered media intelligence for global brands and agencies.',
    foundingDate: '2023',
    sameAs: [
        'https://twitter.com/collab_intel',
        'https://linkedin.com/company/collaborative-intelligence',
    ],
    contactPoint: {
        '@type': 'ContactPoint',
        email: 'hello@collaborativeintelligence.com',
        contactType: 'sales',
        availableLanguage: ['English'],
    },
    address: {
        '@type': 'PostalAddress',
        addressLocality: 'Jakarta',
        addressCountry: 'ID',
    },
};

const webSiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Collaborative Intelligence',
    url: 'https://integratedmediahub.com',
    description: 'Unified Campaign Intelligence for Data-Driven Brands',
    publisher: {
        '@type': 'Organization',
        name: 'Collaborative Intelligence',
    },
    potentialAction: {
        '@type': 'SearchAction',
        target: 'https://integratedmediahub.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" dir="ltr">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
                />
            </head>
            <body className={`${poppins.className} bg-background-light font-display text-white selection:bg-primary/30`}>
                <Providers>
                    {children}
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
}
