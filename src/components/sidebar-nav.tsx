'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Bell } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import Link from 'next/link';
import { fetchCurrentInstitution } from '@/lib/campus'; // <-- import your function

interface Institution {
    _id: string;
    name: string;
    logo: string;
    address: {
        city: string;
        state: string;
        country: string;
    };
}

export default function SidebarNav() {
    const { user, isLoading, fetchUser } = useUserStore();
    const [institution, setInstitution] = useState<Institution | null>(null);

    const userInitial = user?.fullname?.charAt(0)?.toUpperCase() || 'U';

    useEffect(() => {
        if (!user) fetchUser();
    }, [user, fetchUser]);

    // Fetch current institution logo
    useEffect(() => {
        const getInstitution = async () => {
            const inst = await fetchCurrentInstitution();
            if (inst) setInstitution(inst);
        };

        getInstitution();
    }, []);

    return (
        <header className="flex items-center justify-between md:px-12 pt-4 px-4 bg-white">
            {/* Current institution logo */}
            <div className="flex items-center gap-2">
                {institution?.logo ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                        <Image
                            src={institution.logo}
                            alt={institution.name}
                            width={20}   // can match or exceed container
                            height={20}
                            className="w-full h-full object-cover"
                            priority
                        />
                    </div>
                ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                        Logo
                    </div>
                )}
            </div>


            {/* Right actions */}
            <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-700" />

                {/* USER PHOTO */}
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-400 flex items-center justify-center font-semibold text-white">
                    <Link href="/dashboard/profile">
                        {user?.photo ? (
                            <Image
                                src={user.photo}
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