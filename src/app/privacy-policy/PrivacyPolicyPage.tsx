'use client';

import { PublicNav } from '@/components/public/PublicNav';
import { PublicFooter } from '@/components/public/PublicFooter';

const SECTIONS = [
    {
        id: 'introduction',
        title: '1. Introduction',
        content: `Collaborative Intelligence ("we", "our", or "us") is a product of PT Stimulate Global Media, operated under Integrated Media Marketing. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at integratedmediahub.com or use our platform services.

By accessing or using our Service, you agree to the collection and use of information in accordance with this policy. If you do not agree with the terms of this policy, please do not access the Service.`,
    },
    {
        id: 'information-collected',
        title: '2. Information We Collect',
        subsections: [
            {
                subtitle: 'a. Information You Provide',
                text: `We collect information that you voluntarily provide when you:
• Register for an account (name, email address, company name, job role)
• Subscribe to a plan (billing information processed via our payment gateway)
• Submit forms or contact us (support requests, inquiries)
• Invite team members or collaborators to your workspace`,
            },
            {
                subtitle: 'b. Automatically Collected Information',
                text: `When you access our Service, we automatically collect:
• Device and browser information (type, operating system, browser version)
• IP address and approximate geographic location
• Pages visited, features used, and time spent on the platform
• Referral URLs and UTM parameters from advertising campaigns
• Session identifiers and interaction events (clicks, scrolls, form interactions)`,
            },
            {
                subtitle: 'c. Third-Party Platform Data',
                text: `When you connect advertising accounts to our platform, we receive data from:
• Google Ads: campaign performance metrics, impression data, click data, spend
• Meta Ads (Facebook/Instagram): campaign reach, engagement, spend, audience data
• TikTok Ads: campaign metrics, video views, engagement statistics
• Google Analytics: website traffic, user behavior, conversion data

This data is collected pursuant to your explicit authorization via OAuth and is used solely to provide our analytics and reporting services.`,
            },
        ],
    },
    {
        id: 'how-we-use',
        title: '3. How We Use Your Information',
        content: `We use the information we collect to:
• Provide, operate, and maintain the Collaborative Intelligence platform
• Aggregate and display campaign metrics across connected advertising platforms
• Generate analytics reports, dashboards, and performance insights
• Send transactional emails (account registration, plan renewals, scheduled reports)
• Improve and personalize the user experience
• Monitor platform usage patterns to detect and prevent fraud or abuse
• Comply with legal obligations and enforce our Terms of Service
• Respond to customer support requests`,
    },
    {
        id: 'advertising',
        title: '4. Advertising and Analytics Partners',
        content: `Our platform integrates with third-party advertising and analytics services. These integrations operate under their respective privacy policies:

Google Ads & Google Analytics
We use Google's advertising and analytics services. Google may collect data about your use of our platform via cookies and similar technologies. You can opt out of Google Analytics by installing the Google Analytics Opt-out Browser Add-on. Google's Privacy Policy is available at https://policies.google.com/privacy.

Meta (Facebook) Pixel
We may use the Meta Pixel to measure the effectiveness of our advertising, understand actions taken on our website, and deliver targeted ads. Meta's Data Policy is available at https://www.facebook.com/policy.

Our advertising is displayed through Google Ads. All ads comply with Google's advertising policies and are clearly identified as advertising content. We do not use advertising data for purposes beyond those disclosed in this policy.`,
    },
    {
        id: 'cookies',
        title: '5. Cookies and Tracking Technologies',
        content: `We use cookies and similar tracking technologies to enhance your experience:

Essential Cookies: Required for the platform to function. These include authentication session tokens and security cookies. These cannot be disabled.

Analytics Cookies: Help us understand how users interact with our platform (e.g., Google Analytics). These track page visits, session duration, and feature usage.

Preference Cookies: Remember your settings and preferences, such as UI theme and dashboard layout.

You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, disabling essential cookies may prevent certain features from functioning correctly.`,
    },
    {
        id: 'sharing',
        title: '6. Data Sharing and Disclosure',
        content: `We do not sell, trade, or rent your personal information to third parties. We may share information in the following limited circumstances:

• Service Providers: Trusted vendors who assist in operating our platform (hosting, database, email delivery) and are bound by confidentiality obligations
• Business Transfers: In the event of a merger, acquisition, or sale of assets, user data may be transferred as part of that transaction
• Legal Requirements: When required by applicable law, regulation, court order, or governmental authority
• Protection of Rights: To protect the rights, property, or safety of Collaborative Intelligence, our users, or the public

All data sharing is governed by contractual agreements that ensure the same level of data protection as described in this policy.`,
    },
    {
        id: 'security',
        title: '7. Data Security',
        content: `We implement industry-standard security measures to protect your information:

• All data is transmitted over HTTPS/TLS encryption
• Passwords are stored using bcrypt hashing (minimum 12 rounds)
• Database connections use SSL/TLS with certificate verification
• OAuth tokens for connected advertising accounts are encrypted at rest
• Access to production systems is restricted to authorized personnel
• Regular security audits and vulnerability assessments are conducted

While we implement reasonable safeguards, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.`,
    },
    {
        id: 'retention',
        title: '8. Data Retention',
        content: `We retain your personal data for as long as your account is active or as needed to provide services. Specifically:

• Account data: Retained until account deletion is requested
• Campaign metrics and analytics: Retained for the duration of your subscription plus 90 days
• Activity logs: Retained for 12 months for security and audit purposes
• Billing information: Retained as required by Indonesian tax and financial regulations

Upon account deletion, we will delete or anonymize your personal data within 30 days, except where retention is required by law.`,
    },
    {
        id: 'rights',
        title: '9. Your Rights',
        content: `Depending on your jurisdiction, you may have the following rights regarding your personal data:

• Right to Access: Request a copy of the personal data we hold about you
• Right to Rectification: Request correction of inaccurate or incomplete data
• Right to Erasure: Request deletion of your personal data ("right to be forgotten")
• Right to Restriction: Request that we limit how we process your data
• Right to Portability: Receive your data in a structured, machine-readable format
• Right to Object: Object to processing based on legitimate interests

For users in the European Economic Area, these rights are provided under the General Data Protection Regulation (GDPR). For users in Indonesia, these rights are provided under Government Regulation No. 71 of 2019 on Electronic Systems and Transactions (PP 71/2019).

To exercise any of these rights, contact us at privacy@integratedmediahub.com.`,
    },
    {
        id: 'children',
        title: '10. Children\'s Privacy',
        content: `Our Service is not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal information, please contact us. If we become aware that we have collected personal information from a child without parental consent, we will take steps to delete that information.`,
    },
    {
        id: 'international',
        title: '11. International Data Transfers',
        content: `Collaborative Intelligence operates servers in the Asia Pacific region (Singapore/Indonesia). If you access our Service from outside this region, your data may be transferred to and processed in a country with different data protection laws.

By using our Service, you consent to the transfer of your information to our facilities and the third parties with whom we share it as described in this policy.`,
    },
    {
        id: 'changes',
        title: '12. Changes to This Privacy Policy',
        content: `We may update this Privacy Policy from time to time. We will notify you of any material changes by:
• Posting the new Privacy Policy on this page with an updated "Last Modified" date
• Sending an email notification to your registered email address
• Displaying a prominent notice on the platform

Your continued use of the Service after any changes constitutes your acceptance of the new Privacy Policy. We recommend reviewing this policy periodically.`,
    },
    {
        id: 'contact',
        title: '13. Contact Us',
        content: `If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:

Company: PT Stimulate Global Media
Product: Integrated Media Marketing — Collaborative Intelligence
Email: privacy@integratedmediahub.com
Website: https://integratedmediahub.com

For data protection inquiries or to exercise your privacy rights, please use the subject line "Privacy Request" in your email so we can route your inquiry to the appropriate team.`,
    },
];

export function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-[#0C1222]">
            <PublicNav />

            {/* Hero */}
            <div className="relative pt-32 pb-16 px-6 text-center overflow-hidden">
                <div className="absolute inset-0 hero-glow pointer-events-none" />
                <div className="absolute inset-0 dark-grid-bg pointer-events-none opacity-30" />
                <div className="relative z-10 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#0D9488]/30 bg-[#0D9488]/10 text-[#0D9488] text-xs font-medium mb-6">
                        <span className="material-symbols-outlined text-sm">security</span>
                        Legal &amp; Privacy
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-white/50 text-base mb-3">
                        Last modified: March 24, 2026
                    </p>
                    <p className="text-white/40 text-sm">
                        PT Stimulate Global Media &middot; Integrated Media Marketing &middot; Collaborative Intelligence
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 pb-24">
                {/* Table of Contents */}
                <div className="rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.5)] backdrop-blur-md p-6 mb-10">
                    <h2 className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-4">Table of Contents</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {SECTIONS.map((section) => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className="text-sm text-white/40 hover:text-[#0D9488] transition-colors py-0.5"
                            >
                                {section.title}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Sections */}
                <div className="space-y-10">
                    {SECTIONS.map((section) => (
                        <div
                            key={section.id}
                            id={section.id}
                            className="rounded-2xl border border-white/[0.06] bg-[rgba(22,32,50,0.3)] p-8 scroll-mt-24"
                        >
                            <h2 className="text-lg font-bold text-white mb-4">{section.title}</h2>

                            {'subsections' in section && section.subsections ? (
                                <div className="space-y-5">
                                    {section.subsections.map((sub) => (
                                        <div key={sub.subtitle}>
                                            <h3 className="text-sm font-semibold text-[#0D9488] mb-2">{sub.subtitle}</h3>
                                            <p className="text-sm text-white/50 leading-relaxed whitespace-pre-line">{sub.text}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-white/50 leading-relaxed whitespace-pre-line">{section.content}</p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer note */}
                <div className="mt-10 text-center">
                    <p className="text-xs text-white/20">
                        This policy applies to all services operated under integratedmediahub.com &middot; Effective March 24, 2026
                    </p>
                </div>
            </div>

            <PublicFooter />
        </div>
    );
}
