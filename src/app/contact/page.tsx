import type { Metadata } from 'next';
import { ContactPage } from './ContactPage';

export const metadata: Metadata = {
    title: 'Contact Us — Get in Touch',
    description: 'Contact the Collaborative Intelligence team. Book a demo, request a quote, or get support for enterprise media intelligence and campaign analytics.',
    keywords: ['contact collaborative intelligence', 'media intelligence demo', 'campaign analytics support', 'enterprise media platform contact'],
    openGraph: {
        title: 'Contact Collaborative Intelligence',
        description: 'Book a demo or get in touch with our team.',
        url: 'https://collaborativeintelligence.com/contact',
    },
};

export default function Page() {
    return <ContactPage />;
}
