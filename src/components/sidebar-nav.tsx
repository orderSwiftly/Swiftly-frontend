'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { Bell } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import Link from 'next/link';

export default function SidebarNav() {
    const { user, isLoading, fetchUser } = useUserStore();

    useEffect(() => {
        if (!user) fetchUser();
    }, [user, fetchUser]);

    const userInitial = user?.fullname?.charAt(0)?.toUpperCase() || 'U';

    return (
        <header className="flex items-center justify-between px-4 pt-4 bg-white">
            {/* Logo */}
            <div className="flex items-center gap-2">
                <Image
                    src="/swiftly.png"
                    alt="Swiftly Logo"
                    width={32}
                    height={32}
                />
            </div>


            {/* Right actions */}
            <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-700" />

                {/* USER PHOTO */}
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-400 flex items-center justify-center font-semibold text-white">
                    <Link href="/dashboard/profile">
                        {user?.photo ? (
                            <Image
                                src={user.photo}           // Make sure this is a valid URL
                                alt={user.fullname || 'User'}
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                                priority
                            />
                        ) : (
                            <span>{isLoading ? '' : userInitial}</span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
}
