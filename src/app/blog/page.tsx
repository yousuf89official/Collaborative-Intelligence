import type { Metadata } from 'next';
import { BlogPage } from './BlogPage';

export const metadata: Metadata = {
    title: 'Blog | Media Intelligence Insights & Industry Articles',
    description: 'Expert insights on media intelligence, campaign analytics, share of voice, AVE calculators, and enterprise media buying best practices from the Collaborative Intelligence team.',
    keywords: [
        'media intelligence blog',
        'campaign analytics articles',
        'share of voice insights',
        'AVE calculator guide',
        'media buying trends',
        'cross-channel attribution',
        'enterprise media intelligence articles',
    ],
    openGraph: {
        title: 'Blog | Collaborative Intelligence',
        description: 'Expert insights on media intelligence, campaign analytics, and enterprise media buying best practices.',
        url: 'https://integratedmediahub.com/blog',
        siteName: 'Collaborative Intelligence',
        type: 'website',
        images: [
            {
                url: 'https://integratedmediahub.com/og-blog.png',
                width: 1200,
                height: 630,
                alt: 'Collaborative Intelligence Blog - Media Intelligence Insights',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Blog | Collaborative Intelligence',
        description: 'Expert insights on media intelligence, campaign analytics, and enterprise media buying.',
        images: ['https://integratedmediahub.com/og-blog.png'],
    },
    alternates: {
        canonical: 'https://integratedmediahub.com/blog',
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
            name: 'Blog',
            item: 'https://integratedmediahub.com/blog',
        },
    ],
};

// JSON-LD: Blog structured data
const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Collaborative Intelligence Blog',
    description: 'Expert insights on media intelligence, campaign analytics, and enterprise media buying best practices.',
    url: 'https://integratedmediahub.com/blog',
    publisher: {
        '@type': 'Organization',
        name: 'Collaborative Intelligence',
        url: 'https://integratedmediahub.com',
        logo: {
            '@type': 'ImageObject',
            url: 'https://integratedmediahub.com/logo.png',
        },
    },
    blogPost: [
        {
            '@type': 'BlogPosting',
            headline: 'The Future of Media Intelligence: AI-Driven Campaign Optimization',
            datePublished: '2026-03-05',
            description: 'How artificial intelligence is reshaping the way brands and agencies approach multi-channel campaign management and performance tracking across the entire marketing funnel.',
            author: { '@type': 'Organization', name: 'Collaborative Intelligence' },
        },
        {
            '@type': 'BlogPosting',
            headline: 'Understanding Share of Voice in the Digital Age',
            datePublished: '2026-02-28',
            description: 'A comprehensive guide to measuring and improving your brand\'s share of voice across digital, social, and traditional media channels.',
            author: { '@type': 'Organization', name: 'Collaborative Intelligence' },
        },
        {
            '@type': 'BlogPosting',
            headline: 'Enterprise Media Buying: Integration Best Practices',
            datePublished: '2026-02-20',
            description: 'Learn how leading enterprises are consolidating their media buying operations for better efficiency and ROI across global markets.',
            author: { '@type': 'Organization', name: 'Collaborative Intelligence' },
        },
    ],
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
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
            />
            <BlogPage />
        </>
    );
}
