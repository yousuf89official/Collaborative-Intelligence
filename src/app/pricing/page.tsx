import type { Metadata } from 'next';
import { PricingPage } from './PricingPage';

export const metadata: Metadata = {
    title: 'Pricing Plans | Flexible Enterprise Media Intelligence',
    description: 'Flexible pricing for teams of all sizes. Every plan includes 100% of features. Start free, scale to enterprise. Campaign analytics, AVE calculators, and AI insights included.',
    keywords: [
        'media intelligence pricing',
        'campaign analytics cost',
        'enterprise media platform pricing',
        'advertising analytics plans',
        'collaborative intelligence pricing',
        'media buying software cost',
    ],
    openGraph: {
        title: 'Pricing Plans | Collaborative Intelligence',
        description: 'Every plan includes 100% of features. Start free, scale to enterprise with flexible campaign analytics pricing.',
        url: 'https://integratedmediahub.com/pricing',
        siteName: 'Collaborative Intelligence',
        type: 'website',
        images: [
            {
                url: 'https://integratedmediahub.com/og-pricing.png',
                width: 1200,
                height: 630,
                alt: 'Collaborative Intelligence Pricing Plans - Free, Starter, Growth, Professional, Enterprise',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Pricing Plans | Collaborative Intelligence',
        description: 'Every plan includes 100% of features. Start free, scale to enterprise.',
        images: ['https://integratedmediahub.com/og-pricing.png'],
    },
    alternates: {
        canonical: 'https://integratedmediahub.com/pricing',
    },
    robots: {
        index: true,
        follow: true,
    },
};

// JSON-LD: FAQPage schema for AEO
const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'Do all Collaborative Intelligence plans have access to every feature?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes! Every plan -- including Free -- has 100% access to every feature in the platform. The only difference is quota limits. Higher plans give you more brands, campaigns, team members, API calls, and storage.',
            },
        },
        {
            '@type': 'Question',
            name: 'Can I switch plans at any time?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Absolutely. You can upgrade or downgrade at any time. Upgrades take effect immediately, downgrades apply at the end of your current billing cycle.',
            },
        },
        {
            '@type': 'Question',
            name: 'Is there a free trial for paid plans?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. All paid plans include a 14-day free trial with full access. No credit card required to start.',
            },
        },
        {
            '@type': 'Question',
            name: 'How does the Collaborative Intelligence referral program work?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Every user gets a unique referral link. When someone signs up through your link and subscribes, you earn a recurring commission (10-30% depending on your plan) for as long as they remain subscribed. Hit milestones to unlock bonus rewards and permanent commission boosts.',
            },
        },
        {
            '@type': 'Question',
            name: 'Why is pricing different in my country?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'We use purchasing power parity (PPP) pricing so our platform is accessible globally. Prices are localized to your region and currency so you always get a fair deal.',
            },
        },
    ],
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
            name: 'Pricing',
            item: 'https://integratedmediahub.com/pricing',
        },
    ],
};

export default function Page() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <PricingPage />
        </>
    );
}
