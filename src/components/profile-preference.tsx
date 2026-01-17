'use client';

import {
    Bell,
    HelpCircle,
    LinkIcon,
    ChevronRight,
    LogOutIcon
} from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import Link from 'next/link';


const actions = [
    {
        link: '/dashboard/profile/notifications',
        label: 'Push Notifications',
        icon: Bell,
    },
    {
        link: '/dashboard/profile/support',
        label: 'Help & Support',
        icon: HelpCircle,
    },
    {
        label: 'Copy referral code',
        icon: LinkIcon,
    },
    {
        label: 'Logout',
        icon: LogOutIcon,
    }
];

export default function ProfilePreference() {
    const { logout } = useUserStore();
    
    return (
        <section className="px-4 mt-4 w-full">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Preferences
            </h3>

            <div className="bg-white rounded-xl border border-gray-200 divide-y">
                {actions.map(({ label, icon: Icon, link }) => (
                    <Link
                        onClick={label === 'Logout' ? logout : undefined}
                        href={link || '#'}
                        key={label}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center">
                                <Icon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-800">
                                {label}
                            </span>
                        </div>

                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                ))}
            </div>
        </section>
    );
}
