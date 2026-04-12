// src/components/riders/rider-sidebar.tsx

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LogOut,
    ChevronLeft,
    ChevronRight,
    UserCircle,
    Bike,
    HomeIcon,
} from 'lucide-react';
import Image from 'next/image';
import { useUserStore } from '@/stores/userStore';
import { useSidebar } from '../sidebar-context';
import { fetchRiderDetails } from '@/lib/rider';

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

const navItems = [
    { label: 'Home', href: '/rider/dashboard/home', icon: HomeIcon, exact: true },
    { label: 'Deliveries', href: '/rider/dashboard/orders', icon: Bike, exact: false },
    { label: 'Profile', href: '/rider/dashboard/profile', icon: UserCircle, exact: false },
];

export default function Sidebar() {
    const { collapsed, setCollapsed } = useSidebar();
    const pathname = usePathname();
    const { user, isLoading, fetchUser, logout } = useUserStore();
    const [riderPhoto, setRiderPhoto] = useState<string | null>(null);

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

    const userInitial =
        user?.fullname?.charAt(0).toUpperCase() ||
        user?.email?.charAt(0).toUpperCase() ||
        'R';

    const displayName = user?.fullname || 'Rider';
    const userAvatar = riderPhoto || user?.photo || null;

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`hidden md:flex fixed top-0 left-0 h-screen ${collapsed ? 'w-20' : 'w-64'
                    } bg-[var(--txt-clr)] text-[var(--pry-clr)] flex-col z-40 transition-all duration-300 border-r border-[var(--sec-clr)]`}
            >
                {/* Logo + Toggle */}
                <div className={`flex items-center ${collapsed ? 'justify-center px-4' : 'justify-between px-5'} py-5 border-b border-[var(--sec-clr)]`}>
                    {!collapsed && (
                        <Link href="/rider/dashboard/home" className="flex items-center gap-2 pry-ff">
                            <Image
                                src="/brand-logo.png"
                                alt="Swiftly Logo"
                                width={36}
                                height={36}
                                className="w-9 h-9 object-cover rounded-lg"
                            />
                            <span className="text-lg font-bold text-[var(--pry-clr)]">Swiftly</span>
                        </Link>
                    )}
                    {collapsed && (
                        <Image
                            src="/brand-logo.png"
                            alt="Swiftly Logo"
                            width={36}
                            height={36}
                            className="w-9 h-9 object-cover rounded-lg mb-2"
                        />
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-8 h-8 rounded-lg bg-[var(--acc-clr)]/10 hover:bg-[var(--acc-clr)]/20 flex items-center justify-center transition-colors text-[var(--pry-clr)]"
                    >
                        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 px-3 py-6 space-y-1 sec-ff">
                    {navItems.map(({ label, href, icon: Icon, exact }) => {
                        const isActive = exact ? pathname === href : pathname.startsWith(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center ${collapsed ? 'justify-center px-0' : 'gap-3 px-4'
                                    } py-3 rounded-xl transition-all duration-200 group relative ${isActive
                                        ? 'bg-[var(--prof-clr)] text-[var(--txt-clr)]'
                                        : 'text-[var(--pry-clr)] hover:bg-[var(--acc-clr)] hover:text-[var(--pry-clr)]'
                                    }`}
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                {!collapsed && (
                                    <span className="text-sm font-medium">{label}</span>
                                )}
                                {collapsed && (
                                    <div className="absolute left-full ml-3 px-2 py-1 bg-[var(--pry-clr)] text-[var(--txt-clr)] text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                        {label}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="p-3 border-t border-[var(--sec-clr)] sec-ff">
                    <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-2'} py-2 mb-1`}>
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--acc-clr)] flex items-center justify-center font-bold text-[var(--pry-clr)] shrink-0">
                            {userAvatar ? (
                                <Image
                                    width={40}
                                    height={40}
                                    src={userAvatar}
                                    alt={displayName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-sm">{userInitial}</span>
                            )}
                        </div>
                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-[var(--pry-clr)] truncate">
                                    {isLoading ? 'Loading...' : displayName}
                                </p>
                                <p className="text-xs text-[var(--sec-clr)] truncate">
                                    {user?.email || ''}
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={logout}
                        className={`flex items-center ${collapsed ? 'justify-center px-0' : 'gap-3 px-4'
                            } w-full py-2.5 rounded-xl text-[var(--pry-clr)] hover:bg-red-100 hover:text-red-600 transition-all duration-200 cursor-pointer`}
                    >
                        <LogOut className="w-4 h-4 shrink-0" />
                        {!collapsed && <span className="text-sm font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--txt-clr)] border-t border-[var(--sec-clr)] sec-ff">
                <div className="flex justify-around items-center py-2 px-4">
                    {navItems.map(({ label, href, icon: Icon, exact }) => {
                        const isActive = exact ? pathname === href : pathname.startsWith(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-200 hover:bg-[var(--prof-clr)] hover:text-[var(--txt-clr)] ${isActive
                                        ? 'text-[var(--txt-clr)] bg-[var(--prof-clr)]'
                                        : 'text-[var(--pry-clr)] hover:text-[var(--pry-clr)]'
                                    }`}
                            >
                                <div className="p-1.5 rounded-lg transition-all">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-medium">{label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Mobile spacer */}
            <div className="md:hidden h-20" />
        </>
    );
}