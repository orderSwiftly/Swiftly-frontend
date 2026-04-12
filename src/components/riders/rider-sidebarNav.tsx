'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useUserStore } from '../../stores/userStore';
import { useUIStore } from '../../stores/campusStore';
import { fetchCurrentInstitution } from '../../lib/campus';
import { fetchRiderDetails } from '@/lib/rider';

interface Institution {
    _id: string;
    name: string;
    logo: string;
    address?: {
        city: string;
        state: string;
        country: string;
    };
}

interface RiderDetails {
    user_data: {
        name: string;
        email: string;
        photo?: string;
        institution: {
            id: string;
            name: string;
        };
    };
    rider_data: {
        status: string;
        active_order_ids: string[];
    };
}

export default function SidebarNav() {
    const { user, isLoading, fetchUser } = useUserStore();
    const { openCampus } = useUIStore();
    const [institution, setInstitution] = useState<Institution | null>(null);
    const [riderPhoto, setRiderPhoto] = useState<string | null>(null);

    const userInitial =
        user?.fullname?.charAt(0)?.toUpperCase() ||
        user?.email?.charAt(0)?.toUpperCase() ||
        'U';

    const userAvatar = riderPhoto || user?.photo || null;

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const token = localStorage.getItem('token');
        if (token && !user && !isLoading) {
            fetchUser();
        }
        if (token) {
            fetchRiderDetails()
                .then((data: RiderDetails) => {
                    if (data?.user_data?.photo) setRiderPhoto(data.user_data.photo);
                })
                .catch(() => {});
        }
    }, []);

    useEffect(() => {
        const loadInstitution = async () => {
            try {
                const inst = await fetchCurrentInstitution();
                if (inst) setInstitution(inst);
            } catch (err) {
                console.error('Failed to load institution', err);
            }
        };
        loadInstitution();
    }, []);

    return (
        <header className="flex items-center justify-between bg-(--txt-clr) px-4 md:px-12 p-5 pry-ff">
            {/* LEFT — Current campus logo only */}
            <div
                className="flex items-center cursor-pointer"
                onClick={openCampus}
                title="Change campus"
            >
                {institution?.logo ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                        <Image
                            src={institution.logo}
                            alt={institution.name}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                            priority
                        />
                    </div>
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                        C
                    </div>
                )}
            </div>

            {/* RIGHT — Notifications + User */}
            <div className="flex items-center gap-3">
                <Link href="/rider/dashboard/profile">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-400 flex items-center justify-center font-semibold text-white">
                        {isLoading ? (
                            <span className="text-xs animate-pulse">...</span>
                        ) : userAvatar ? (
                            <Image
                                src={userAvatar}
                                alt={user?.fullname || 'User'}
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span>{userInitial}</span>
                        )}
                    </div>
                </Link>
            </div>
        </header>
    );
}