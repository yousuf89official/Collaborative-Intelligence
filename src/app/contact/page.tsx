import type { Metadata } from 'next';
import { ContactPage } from './ContactPage';

export const metadata: Metadata = {
    title: 'Contact Us | Book a Demo or Get Support',
    description: 'Contact Collaborative Intelligence to book a demo, request custom pricing, or get enterprise support. Reach us by email, phone, or visit our Jakarta office.',
    keywords: [
        'contact collaborative intelligence',
        'media intelligence demo',
        'campaign analytics support',
        'enterprise media platform contact',
        'book a demo',
        'collaborative intelligence support',
    ],
    openGraph: {
        title: 'Contact Us | Collaborative Intelligence',
        description: 'Book a demo, request a quote, or get in touch with the Collaborative Intelligence team for enterprise media intelligence.',
        url: 'https://integratedmediahub.com/contact',
        siteName: 'Collaborative Intelligence',
        type: 'website',
        images: [
            {
                url: 'https://integratedmediahub.com/og-contact.png',
                width: 1200,
                height: 630,
                alt: 'Contact Collaborative Intelligence - Book a Demo',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Contact Us | Collaborative Intelligence',
        description: 'Book a demo or get in touch with our team for enterprise media intelligence.',
        images: ['https://integratedmediahub.com/og-contact.png'],
    },
    alternates: {
        canonical: 'https://integratedmediahub.com/contact',
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
            name: 'Contact',
            item: 'https://integratedmediahub.com/contact',
        },
    ],
};

// JSON-LD: ContactPage structured data
const contactPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Collaborative Intelligence',
    description: 'Book a demo, request a quote, or get support for the Collaborative Intelligence enterprise media platform.',
    url: 'https://integratedmediahub.com/contact',
    mainEntity: {
        '@type': 'Organization',
        name: 'Collaborative Intelligence',
        url: 'https://integratedmediahub.com',
        email: 'hello@collaborativeintelligence.com',
        telephone: '+1-555-123-4567',
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Jakarta',
            addressCountry: 'ID',
        },
        contactPoint: [
            {
                '@type': 'ContactPoint',
                contactType: 'sales',
                email: 'hello@collaborativeintelligence.com',
                telephone: '+1-555-123-4567',
                availableLanguage: ['English'],
            },
            {
                '@type': 'ContactPoint',
                contactType: 'technical support',
                email: 'hello@collaborativeintelligence.com',
                availableLanguage: ['English'],
            },
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
                dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }}
            />
            <ContactPage />
        </>
    );
}
