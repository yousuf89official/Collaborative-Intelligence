import type { Metadata } from 'next';
import { PrivacyPolicyPage } from './PrivacyPolicyPage';

export const metadata: Metadata = {
    title: 'Privacy Policy | Collaborative Intelligence',
    description: 'Privacy Policy for Collaborative Intelligence — enterprise campaign analytics platform by PT Stimulate Global Media and Integrated Media Marketing. Learn how we collect, use, and protect your data.',
    keywords: [
        'privacy policy',
        'collaborative intelligence privacy',
        'data protection',
        'GDPR',
        'personal data',
        'PT Stimulate Global Media',
        'Integrated Media Marketing',
    ],
    openGraph: {
        title: 'Privacy Policy | Collaborative Intelligence',
        description: 'How Collaborative Intelligence collects, uses, and protects your personal data.',
        url: 'https://integratedmediahub.com/privacy-policy',
        siteName: 'Collaborative Intelligence',
        type: 'website',
    },
    alternates: {
        canonical: 'https://integratedmediahub.com/privacy-policy',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function Page() {
    return <PrivacyPolicyPage />;
}
