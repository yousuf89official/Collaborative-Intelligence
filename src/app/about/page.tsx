import type { Metadata } from 'next';
import { AboutPage } from './AboutPage';

export const metadata: Metadata = {
    title: 'About Us — Unified Campaign Intelligence Platform',
    description: 'Learn about Collaborative Intelligence, the enterprise campaign intelligence platform that unifies brands, agencies, and channels with AI-powered analytics.',
    keywords: ['about collaborative intelligence', 'media intelligence company', 'campaign analytics platform', 'enterprise media technology'],
    openGraph: {
        title: 'About Collaborative Intelligence',
        description: 'The enterprise platform unifying brands, agencies, and channels with AI-powered media intelligence.',
        url: 'https://collaborativeintelligence.com/about',
    },
};

export default function Page() {
    return <AboutPage />;
}
