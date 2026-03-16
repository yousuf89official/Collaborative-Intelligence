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
    description: 'Enterprise-grade campaign analytics, full-funnel performance tracking, and AI-powered media intelligence for global brands and agencies.',
    metadataBase: new URL('https://collaborativeintelligence.com'),
};

import { Toaster } from '@/components/ui/toaster';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
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
