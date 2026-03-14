'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft, Shield, Truck, Users, BookOpen, AlertTriangle, Globe,
    CreditCard, Store, Ban, Lock, Scale, RefreshCw, UserX, Gavel, Mail, FileText,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────
   TERMS & CONDITIONS  (word for word from the document)
───────────────────────────────────────────────────────────────── */
const termsSections = [
    {
        icon: BookOpen,
        title: 'Introduction',
        content: [
            '1.1 Welcome to Swiftly, operated by Swiftly Digital Innovations Ltd, a company duly registered under the laws of the Federal Republic of Nigeria, with its principal place of business at Ilishan Remo, Ogun State, Nigeria.',
            '1.2 These Terms and Conditions ("Terms") govern your access to and use of the Swiftly platform, including its mobile applications, website, and related services (collectively, the "Service").',
            '1.3 By accessing or using Swiftly, you agree to be bound by these Terms. If you do not agree, discontinue use immediately.',
        ],
    },
    {
        icon: FileText,
        title: 'Definitions',
        content: [
            '2.1 "Swiftly" refers to Swiftly Digital Innovations Ltd and its digital platform.',
            '2.2 "User" refers to any individual or entity using the platform, including students, staff, parents, vendors, riders, and administrators.',
            '2.3 "Vendor" refers to any merchant or service provider offering goods or services through Swiftly.',
            '2.4 "Customer" refers to any user placing an order.',
            '2.5 "Rider" refers to delivery personnel operating under Swiftly logistics.',
            '2.6 "Institution" refers to any university or tertiary institution where Swiftly operates.',
        ],
    },
    {
        icon: Users,
        title: 'Eligibility',
        content: [
            '3.1 Users must be at least 15 years of age to access or use Swiftly.',
            '3.2 Users must provide accurate, current, and complete information during registration.',
            '3.3 Swiftly reserves the right to suspend or terminate accounts that provide false or misleading information.',
        ],
    },
    {
        icon: Shield,
        title: 'Account Registration & Security',
        content: [
            '4.1 Users are responsible for maintaining the confidentiality of their login credentials.',
            '4.2 All activities conducted through a user\'s account are the user\'s responsibility.',
            '4.3 Swiftly shall not be liable for losses arising from unauthorized access caused by user negligence.',
        ],
    },
    {
        icon: Globe,
        title: 'Platform Role & Scope of Service',
        content: [
            '5.1 Swiftly is a digital commerce and delivery platform designed for the university environment.',
            '5.2 Swiftly connects Customers, Vendors, and Swiftly-operated logistics services.',
            '5.3 Swiftly does not manufacture, package, or directly sell goods listed by vendors.',
            '5.4 Vendors are solely responsible for product quality, product descriptions, pricing, and compliance with institutional and national regulations.',
            '5.5 Swiftly\'s responsibility is limited primarily to logistics and platform facilitation, except where explicitly stated otherwise.',
        ],
    },
    {
        icon: CreditCard,
        title: 'Orders & Payments',
        content: [
            '6.1 All payments are processed via third-party payment gateways, including Paystack, supporting cards, transfers, USSD, and wallets.',
            '6.2 Swiftly does not store or retain customer funds beyond what is required for payment processing.',
            '6.3 Swiftly may collect platform service fees and logistics charges.',
            '6.4 Swiftly shall not be responsible for failures, delays, or errors caused by third-party payment service providers.',
            '6.5 Once payment is confirmed, orders are considered final, subject to refund rules stated below.',
        ],
    },
    {
        icon: RefreshCw,
        title: 'Refund & Cancellation Policy',
        content: [
            '7.1 Food Items: No refunds once the vendor has accepted the order.',
            '7.2 Non-Food Items: Refund requests must be made within 6 hours of delivery and are subject to investigation and approval.',
            '7.3 Vendors bear refund responsibility for product-related issues.',
            '7.4 Swiftly bears refund responsibility only for items delivered in unsealed nylon packaging where tampering is reasonably suspected.',
            '7.5 Swiftly reserves full discretion in determining refund eligibility.',
        ],
    },
    {
        icon: Truck,
        title: 'Delivery & Logistics',
        content: [
            '8.1 Swiftly operates and manages its own delivery logistics.',
            '8.2 Swiftly is responsible for timely order pickup, order transit, and final delivery.',
            '8.3 Swiftly shall not be liable for delivery delays caused by vendor preparation delays, force majeure events, institutional access restrictions, weather conditions, or security concerns.',
        ],
    },
    {
        icon: Store,
        title: 'Vendor Obligations',
        content: [
            '9.1 Vendors must be approved and legalized by their institution.',
            '9.2 Vendors must provide accurate product listings.',
            '9.3 Vendors must maintain proper hygiene and quality standards.',
            '9.4 Vendors must fulfill orders promptly.',
            '9.5 Swiftly reserves the right to suspend vendors, remove listings, or terminate vendor accounts, with or without prior warning, depending on severity.',
        ],
    },
    {
        icon: Ban,
        title: 'Prohibited Activities',
        content: [
            '10.1 Users may not commit fraud.',
            '10.2 Users may not exploit platform vulnerabilities.',
            '10.3 Users may not harass riders or vendors.',
            '10.4 Users may not manipulate pricing or transactions.',
            '10.5 Users may not attempt unauthorized system access.',
            '10.6 Users may not misuse promotional campaigns.',
            '10.7 Violation may result in immediate suspension or permanent ban, without notice.',
        ],
    },
    {
        icon: Lock,
        title: 'Intellectual Property',
        content: [
            '11.1 All platform content, software, designs, logos, algorithms, data models, and systems are the exclusive property of Swiftly Digital Innovations Ltd.',
            '11.2 Users may not copy, modify, distribute, reverse engineer, or commercially exploit any part of the platform.',
        ],
    },
    {
        icon: Shield,
        title: 'Data & Privacy',
        content: [
            '12.1 Swiftly collects name, phone number, email address, gender information and payment information.',
            '12.2 This data is used solely for platform operations, order fulfillment, communication, and service improvement.',
            '12.3 Swiftly does not sell user data to third parties.',
            '12.4 Future AI-based recommendation systems may utilize anonymized user behavior data strictly for platform optimization.',
        ],
    },
    {
        icon: AlertTriangle,
        title: 'Limitation of Liability',
        content: [
            '13.1 To the maximum extent permitted by law, Swiftly shall not be liable for vendor product quality, vendor pricing disputes, vendor operational failures, or indirect or consequential losses.',
            '13.2 Swiftly\'s total liability shall not exceed the value of the transaction in dispute.',
        ],
    },
    {
        icon: UserX,
        title: 'Suspension & Termination',
        content: [
            '14.1 Swiftly reserves the absolute right to suspend, restrict, or terminate any account at its sole discretion, with or without warning.',
            '14.2 This includes cases of fraud, abuse, system exploitation, or policy violations.',
        ],
    },
    {
        icon: Gavel,
        title: 'Dispute Resolution & Governing Law',
        content: [
            '15.1 Disputes shall be resolved through internal resolution mechanisms for minor disputes and arbitration or Nigerian courts for major disputes.',
            '15.2 These Terms shall be governed by and interpreted in accordance with the laws of the Federal Republic of Nigeria.',
        ],
    },
    {
        icon: FileText,
        title: 'Amendments',
        content: [
            '16.1 Swiftly reserves the right to modify these Terms at any time.',
            '16.2 Continued use of the platform constitutes acceptance of updated terms.',
        ],
    },
    {
        icon: Scale,
        title: 'Indemnification',
        content: [
            '17.1 Users agree to indemnify, defend, and hold harmless Swiftly Digital Innovations Ltd, its directors, officers, employees, and partners from and against any claims, damages, losses, liabilities, costs, and expenses arising from their use of the platform, violation of these Terms, violation of applicable laws, or interactions with other users, vendors, or riders.',
        ],
    },
    {
        icon: AlertTriangle,
        title: 'Force Majeure',
        content: [
            '18.1 Swiftly shall not be liable for failure or delay in performance caused by events beyond its reasonable control, including natural disasters, acts of government, pandemics, strikes, network failures, power outages, and security emergencies.',
        ],
    },
    {
        icon: FileText,
        title: 'Severability',
        content: [
            '19.1 If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.',
        ],
    },
    {
        icon: Mail,
        title: 'Contact Information',
        content: [
            '20.1 For questions, complaints, or legal notices, contact:',
            'Swiftly Digital Innovations Ltd, Ilishan Remo, Ogun State, Nigeria',
            'Email: hello@orderswiftly.com',
        ],
    },
];

/* ─────────────────────────────────────────────────────────────────
   PRIVACY POLICY  (word for word from the document)
───────────────────────────────────────────────────────────────── */
const privacySections = [
    {
        icon: BookOpen,
        title: 'Introduction',
        content: [
            '1.1 Swiftly Digital Innovations Ltd ("Swiftly", "we", "our", or "us") values your privacy and is committed to protecting your personal data.',
            '1.2 This Privacy Policy ("Policy") explains how we collect, use, store, and share your personal data when you access or use the Swiftly platform, including its mobile applications, website, and related services (collectively, the "Service").',
            '1.3 By using Swiftly, you consent to the collection and use of your data as described in this Policy.',
        ],
    },
    {
        icon: Scale,
        title: 'Lawful Basis for Processing',
        content: [
            '2.1 Swiftly processes personal data to fulfill orders, provide the Service, and prevent fraud.',
            '2.2 Processing is performed in accordance with applicable Nigerian law and for legitimate business purposes necessary to operate the platform.',
        ],
    },
    {
        icon: FileText,
        title: 'Information We Collect',
        content: [
            '3.1 Personal Data Provided by Users. We collect personal information when you register or use our services, including name, email address, phone number, gender, and payment information.',
            '3.2 Usage Data. We collect information about your interactions with the platform, including pages viewed, app features used, and purchase and transaction history.',
            '3.3 Payment Data. Payment information is processed via third-party providers such as Paystack. This includes the number of transactions per day, vendor payment information, and customer payment details.',
            '3.4 Sensitive Data. We do not collect sensitive personal data such as health information or biometric data.',
            '3.5 Cookies and Tracking. We may use cookies, SDKs, and other tracking technologies for encryption, analytics, and improving platform functionality.',
        ],
    },
    {
        icon: Globe,
        title: 'How We Use Your Information',
        content: [
            '4.1 Order Processing. Your data is used to process and fulfill orders accurately.',
            '4.2 Analytics. We analyze platform usage to improve Swiftly\'s services and performance.',
            '4.3 Marketing and Notifications. Your data may be used for marketing purposes. Users can opt-in or opt-out at any time.',
            '4.4 Future AI and Recommendations. User data may be used in the future to provide AI-powered recommendations and personalized experiences.',
        ],
    },
    {
        icon: Users,
        title: 'Sharing and Disclosure of Information',
        content: [
            '5.1 Vendors. Swiftly shares necessary user information with vendors to process orders and payments.',
            '5.2 Payment Providers. Payment information is shared with third-party providers such as Paystack to facilitate transactions.',
            '5.3 Legal and Compliance. Swiftly may disclose information to comply with applicable laws, government requests, or legal proceedings.',
            '5.4 Third-Party Links. The platform may contain links to external websites or services that are not under Swiftly\'s control. Users are encouraged to review the privacy policies of these third parties.',
            '5.5 No Sale of Data. Swiftly does not sell user data to third parties.',
        ],
    },
    {
        icon: Lock,
        title: 'Data Security',
        content: [
            '6.1 Swiftly employs reasonable technical and organizational measures, including encryption, to protect user data against unauthorized access, disclosure, or loss.',
            '6.2 Access to personal data is restricted to authorized personnel who require it for legitimate business purposes.',
        ],
    },
    {
        icon: RefreshCw,
        title: 'Data Retention',
        content: [
            '7.1 User data is retained until the user deletes their account.',
            '7.2 Deletions are soft; data is fully removed after 30 days.',
            '7.3 Certain transactional data may be retained for legal or regulatory compliance as required by Nigerian law.',
        ],
    },
    {
        icon: Shield,
        title: 'User Rights',
        content: [
            '8.1 Users may access their personal data, correct inaccurate or incomplete information, and delete their account and associated personal data.',
            '8.2 Users may opt-out of marketing communications and notifications at any time through the platform settings or by contacting Swiftly support.',
        ],
    },
    {
        icon: Users,
        title: 'Children',
        content: [
            '9.1 Swiftly is not intended for children under the age of 15.',
            '9.2 We do not knowingly collect personal information from children under 15.',
            '9.3 If we discover that we have collected data from a child under 15, we will take steps to delete it promptly.',
        ],
    },
    {
        icon: AlertTriangle,
        title: 'Data Breach Notification',
        content: [
            '10.1 In the event of a data breach affecting your personal information, Swiftly will notify affected users promptly and take appropriate measures to mitigate risks.',
        ],
    },
    {
        icon: Gavel,
        title: 'Force Majeure and Legal Compliance',
        content: [
            '11.1 Swiftly may be required to disclose user data in response to lawful requests from government authorities, courts, or regulatory bodies.',
            '11.2 We will comply with applicable Nigerian laws regarding data disclosure while seeking to protect user privacy to the extent possible.',
        ],
    },
    {
        icon: Globe,
        title: 'International Data Transfer',
        content: [
            '12.1 User data is stored within Nigeria.',
            '12.2 Swiftly does not transfer personal data outside Nigeria at this time.',
        ],
    },
    {
        icon: FileText,
        title: 'Amendments to This Policy',
        content: [
            '13.1 Swiftly reserves the right to update or modify this Privacy Policy at any time.',
            '13.2 Continued use of the platform constitutes acceptance of the updated Privacy Policy.',
            '13.3 Users will be notified of significant changes via the platform or email where applicable.',
        ],
    },
    {
        icon: Mail,
        title: 'Contact Information',
        content: [
            '14.1 For questions, complaints, or requests regarding this Privacy Policy, users may contact:',
            'Swiftly Digital Innovations Ltd, Ilishan Remo, Ogun State, Nigeria',
            'Email: hello@orderswiftly.com',
        ],
    },
];

/* ─────────────────────────────────────────────────────────────────
   SECTION CARD
───────────────────────────────────────────────────────────────── */
function SectionCard({
    icon: Icon,
    title,
    content,
    index,
}: {
    icon: React.ElementType;
    title: string;
    content: string[];
    index: number;
}) {
    return (
        <div
            className="rounded-2xl p-6"
            style={{ background: 'var(--txt-clr)', color: 'var(--pry-clr)' }}
        >
            <div className="flex items-start gap-4">
                <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'var(--sec-clr)' }}
                >
                    <Icon size={18} style={{ color: 'var(--prof-clr)' }} />
                </div>
                <div className="flex-1">
                    <h2 className="text-base font-semibold mb-3 pry-ff" style={{ color: 'var(--pry-clr)' }}>
                        {index}. {title}
                    </h2>
                    <div className="flex flex-col gap-2">
                        {content.map((para, j) => (
                            <p
                                key={j}
                                className="text-sm sec-ff leading-relaxed"
                                style={{ color: 'var(--pry-clr)', opacity: 0.8 }}
                            >
                                {para}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────── */
export default function TermsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');

    const sections = activeTab === 'terms' ? termsSections : privacySections;

    return (
        <main
            className="min-h-screen px-4 py-10"
            style={{ background: 'var(--sec-clr)', color: 'var(--pry-clr)' }}
        >
            {/* Back button */}
            <div className="max-w-3xl mx-auto mb-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 transition cursor-pointer"
                    style={{ color: 'var(--pry-clr)' }}
                >
                    <ArrowLeft size={16} />
                    Back
                </button>
            </div>

            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div
                    className="rounded-2xl p-8 mb-6 border border-dashed"
                    style={{ background: 'var(--txt-clr)', borderColor: 'var(--acc-clr)' }}
                >
                    <div
                        className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-4 px-3 py-1 rounded-full"
                        style={{ background: 'var(--sec-clr)', color: 'var(--prof-clr)' }}
                    >
                        <Shield size={12} />
                        Legal
                    </div>
                    <h1 className="text-4xl font-bold mb-2 pry-ff" style={{ color: 'var(--pry-clr)' }}>
                        Terms &amp; Privacy Policy
                    </h1>
                    <p className="text-sm sec-ff opacity-60" style={{ color: 'var(--pry-clr)' }}>
                        Last updated: February 27, 2026 &nbsp;·&nbsp; Swiftly Digital Innovations Ltd
                    </p>
                    <div
                        className="mt-6 p-4 rounded-xl text-sm sec-ff leading-relaxed"
                        style={{ background: 'var(--sec-clr)', color: 'var(--pry-clr)' }}
                    >
                        Welcome to Swiftly — a campus-first commerce and logistics platform built for university communities.
                        By creating an account or using our services, you agree to the terms outlined below.
                        Please read them carefully before proceeding.
                    </div>
                </div>

                {/* Tabs */}
                <div
                    className="flex gap-1 p-1 rounded-2xl mb-6"
                    style={{ background: 'var(--txt-clr)' }}
                >
                    {(['terms', 'privacy'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className="flex-1 py-2.5 text-sm font-semibold rounded-xl transition cursor-pointer pry-ff"
                            style={{
                                background: activeTab === tab ? 'var(--acc-clr)' : 'transparent',
                                color: activeTab === tab ? 'var(--txt-clr)' : 'var(--pry-clr)',
                                opacity: activeTab === tab ? 1 : 0.45,
                            }}
                        >
                            {tab === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
                        </button>
                    ))}
                </div>

                {/* Sections */}
                <div className="flex flex-col gap-4">
                    {sections.map(({ icon, title, content }, i) => (
                        <SectionCard
                            key={`${activeTab}-${i}`}
                            icon={icon}
                            title={title}
                            content={content}
                            index={i + 1}
                        />
                    ))}
                </div>

                {/* Changes notice */}
                <div
                    className="mt-4 rounded-2xl p-6 border border-dashed"
                    style={{ background: 'var(--txt-clr)', borderColor: 'var(--acc-clr)', color: 'var(--pry-clr)' }}
                >
                    <h2 className="text-base font-semibold mb-2 pry-ff" style={{ color: 'var(--pry-clr)' }}>
                        Changes to These Terms
                    </h2>
                    <p className="text-sm sec-ff leading-relaxed" style={{ color: 'var(--pry-clr)', opacity: 0.8 }}>
                        Swiftly reserves the right to update these Terms &amp; Privacy Policy at any time. Continued use of
                        the platform following any changes constitutes acceptance of the revised terms. We encourage users
                        to review this page periodically.
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-8 mb-4 text-center">
                    <p className="text-xs sec-ff opacity-40 font-bold" style={{ color: 'var(--pry-clr)' }}>
                        &copy; {new Date().getFullYear()} Swiftly · Campus Commerce &amp; Logistics Platform
                    </p>
                </div>

            </div>
        </main>
    );
}