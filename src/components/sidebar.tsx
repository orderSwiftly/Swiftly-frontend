'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
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
  { label: 'Home', href: '/dashboard', icon: HomeIcon, exact: true },
  { label: 'Cart', href: '/dashboard/cart', icon: ShoppingCartIcon },
  { label: 'Orders', href: '/dashboard/my-orders', icon: ShoppingBag },
  { label: 'Profile', href: '/dashboard/profile', icon: UserCircle },
];

export default function Sidebar() {
  const { collapsed, setCollapsed } = useSidebar();
  const pathname = usePathname();
  const { user, isLoading, fetchUser, logout } = useUserStore();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (token && !user && !isLoading) {
      fetchUser();
    }
  }, []);

  const userInitial =
    user?.fullname?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    'U';

  const displayName = user?.fullname || 'User';

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex fixed top-0 left-0 h-screen ${collapsed ? 'w-20' : 'w-64'
          } bg-[var(--txt-clr)] text-[var(--pry-clr)] flex-col z-40 transition-all duration-300 border-r border-[var(--sec-clr)]`}
      >
        {/* Logo + Toggle */}
        <div
          className={`flex items-center ${collapsed ? 'justify-center px-4' : 'justify-between px-5'
            } py-5 border-b border-[var(--sec-clr)]`}
        >
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2 pry-ff">
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
                {!collapsed && <span className="text-sm font-medium">{label}</span>}
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
        <div className="p-3 border-t border-[var(--sec-clr)] pry-ff">
          <div
            className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-2'
              } py-2 mb-1`}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--acc-clr)] flex items-center justify-center font-bold text-[var(--pry-clr)] shrink-0">
              {user?.photo ? (
                <Image
                  width={40}
                  height={40}
                  src={user.photo}
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
                <p className="text-xs text-[var(--sec-clr)] truncate">{user?.email || ''}</p>
              </div>
            )}
          </div>

          <button
            onClick={logout}
            className={`flex items-center ${collapsed ? 'justify-center px-0' : 'gap-3 px-4'
              } w-full py-2.5 rounded-xl text-[var(--pry-clr)] hover:bg-red-100 hover:text-red-600 transition-all duration-200 cursor-pointer`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="text-sm font-medium sec-ff">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--txt-clr)] border-t border-[var(--sec-clr)]">
        <div className="flex justify-around items-center py-2 px-4">
          {navItems.map(({ label, href, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 ${isActive
                    ? 'text-[var(--txt-clr)] bg-[var(--prof-clr)]'
                    : 'text-[var(--pry-clr)] hover:text-[var(--pry-clr)]'
                  }`}
              >
                <div className="p-1.5 rounded-lg transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium sec-ff">{label.split(' ')[0]}</span>
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