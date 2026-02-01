'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Package,
  ShoppingBag,
  HomeIcon,
  ShoppingCartIcon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useUserStore } from '@/stores/userStore';
import { useSidebar } from './sidebar-context';

const navItems = [
  { label: 'Home', href: '/dashboard', icon: HomeIcon },
  { label: 'Cart', href: '/dashboard/cart', icon: ShoppingCartIcon },
  { label: 'Orders', href: '/dashboard/my-orders', icon: ShoppingBag },
  { label: 'Profile', href: '/dashboard/profile', icon: UserCircle },
];

export default function Sidebar() {
  const { collapsed, setCollapsed } = useSidebar();
  const pathname = usePathname();
  const { user, isLoading, fetchUser, logout } = useUserStore();

  // Fetch user on mount if not loaded
  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user, fetchUser]);

  const userInitial = user?.fullname?.charAt(0)?.toUpperCase() || 'U';
  const userFullname = user?.fullname || 'User';

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex fixed top-0 left-0 h-screen shadow ${
          collapsed ? 'w-20' : 'w-64'
        } bg-[var(--txt-clr)] text-[var(--pry-clr)] flex-col z-40 transition-all duration-300`}
      >
        {/* Logo and Toggle */}
        <div className="p-4 border-b border-gray-700 pry-ff flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Image
              src="/brand-logo.png"
              alt="Swiftly Logo"
              width={40}
              height={40}
              className="w-10 h-10 object-cover"
            />
            {!collapsed && <span className="text-xl font-bold">Swiftly</span>}
          </Link>
          <button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-6 sec-ff">
          <ul className="space-y-2">
            {navItems.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex items-center ${
                      collapsed ? 'justify-center' : 'space-x-3'
                    } px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActive
                      ? 'bg-[var(--prof-clr)] text-[var(--txt-clr)]'
                        : 'text-[var(--pry-clr)] hover:bg-[var(--acc-clr)] hover:text-[var(--txt-clr)]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {!collapsed && <span>{label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-700 sec-ff">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-400 flex items-center justify-center font-semibold text-[var(--sec-clr)]">
              {user?.photo ? (
                <Image
                  width={40}
                  height={40}
                  src={user.photo || '/default-user.png'}
                  alt={user.fullname || 'User'}
                  className="w-10 h-10 object-cover"
                />
              ) : (
                userInitial
              )}
            </div>

            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--pry-clr)] truncate">
                  {isLoading ? 'Loading...' : userFullname}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={logout}
            className={`flex items-center ${
              collapsed ? 'justify-center' : 'space-x-3'
            } w-full px-4 py-2 text-[var(--pry-clr)] hover:bg-gray-800 hover:text-[var(--sec-clr)] rounded-lg transition-colors duration-200 cursor-pointer`}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--txt-clr)] text-[var(--pry-clr)] border rounded-tr-3 z-50">
        <div className="flex justify-around items-center py-2">
          {navItems.slice(0, 4).map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center py-2 px-3 min-w-0 rounded-md transition-colors duration-200 ${
                  isActive
                    ? 'bg-[var(--prof-clr)] text-[var(--txt-clr)]'
                    : 'text-[var(--pry-clr)] hover:text-[var(--acc-clr)]'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs truncate">{label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Top Bar */}
      {/* <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-900 text-[var(--sec-clr)] px-4 py-3 flex items-center justify-between z-50">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/swiftly.png"
            alt="Swiftly Logo"
            width={32}
            height={32}
            className="w-8 h-8 object-cover"
          />
          <span className="text-lg font-bold pry-ff">Swiftly</span>
        </Link>

        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-400 flex items-center justify-center font-semibold text-[var(--bg-clr)]">
            {user?.photo ? (
              <Image
                width={32}
                height={32}
                src={user.photo}
                alt={user.fullname}
                className="w-8 h-8 object-cover"
              />
            ) : (
              userInitial
            )}
          </div>
          <span className="text-sm sec-ff">{isLoading ? 'Loading...' : userFullname}</span>
        </div>
      </div> */}

      {/* Mobile Spacers */}
      <div className="md:hidden h-16"></div> {/* Top spacer */}
      <div className="md:hidden h-16"></div> {/* Bottom spacer */}
    </>
  );
}