import type { Metadata } from 'next';
import { PricingPage } from './PricingPage';

export const metadata: Metadata = {
    title: 'Pricing — Enterprise Media Intelligence Plans',
    description: 'Flexible pricing for teams of all sizes. Start free, scale to enterprise. Campaign analytics, AVE calculators, and AI insights included.',
    keywords: ['media intelligence pricing', 'campaign analytics cost', 'enterprise media platform pricing', 'advertising analytics plans'],
    openGraph: {
        title: 'Pricing — Collaborative Intelligence',
        description: 'Flexible pricing for teams of all sizes. Start free, scale to enterprise.',
        url: 'https://collaborativeintelligence.com/pricing',
    },
};

export default function Page() {
    return <PricingPage />;
}
