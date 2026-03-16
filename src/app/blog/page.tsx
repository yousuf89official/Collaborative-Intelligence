import type { Metadata } from 'next';
import { BlogPage } from './BlogPage';

export const metadata: Metadata = {
    title: 'Blog — Media Intelligence Insights & Articles',
    description: 'Expert insights on media intelligence, campaign analytics, share of voice, advertising value equivalency, and enterprise media buying best practices.',
    keywords: ['media intelligence blog', 'campaign analytics articles', 'SOV insights', 'AVE calculator guide', 'media buying trends'],
    openGraph: {
        title: 'Blog — Collaborative Intelligence',
        description: 'Expert insights on media intelligence, campaign analytics, and enterprise media buying.',
        url: 'https://collaborativeintelligence.com/blog',
    },
};

export default function Page() {
    return <BlogPage />;
}
