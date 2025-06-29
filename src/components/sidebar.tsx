'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Package,
  ShoppingBag,
  Bell,
  Wallet2,
  Settings,
  LayoutDashboard,
  Menu,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Products', href: '/dashboard/my-products', icon: Package },
  { label: 'My Orders', href: '/dashboard/my-orders', icon: ShoppingBag },
  { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { label: 'Wallet', href: '/dashboard/wallet', icon: Wallet2 },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col ${
          open ? 'w-64' : 'w-20'
        } transition-all duration-300 bg-[var(--bg-clr)] text-[var(--txt-clr)] shadow-md sec-ff p-4`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          className="self-end mb-4 text-white/70 hover:text-white"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Logo */}
        <div className="mb-6 text-xl font-bold">
          <Link href="/">
            <Image
              src="/tredia-logo.png"
              alt="Tredia Logo"
              width={40}
              height={40}
              className="w-auto object-cover"
            />
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="space-y-4">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 hover:bg-white/10 ${
                  isActive ? 'bg-white/10 font-semibold' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
                {open && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Profile Circle at the bottom */}
        <div className="mt-auto pt-4 flex justify-start">
          <span className="py-2.5 px-4 rounded-full bg-gray-400 text-black text-sm font-bold">
            N
          </span>
        </div>
      </aside>

      {/* Top Logo & Profile for Mobile */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-[var(--bg-clr)] flex items-center justify-between px-4 py-3 z-50">
        <Link href="/">
          <Image
            src="/tredia-logo.png"
            alt="Tredia Logo"
            width={40}
            height={40}
            className="w-auto object-cover"
          />
        </Link>
        <span className="py-2.5 px-4 rounded-full bg-gray-400 text-black text-sm font-bold">
          N
        </span>
      </div>

      {/* Bottom Nav for Mobile */}
      <nav className="fixed md:hidden bottom-0 left-0 w-full bg-[var(--bg-clr)] text-[var(--txt-clr)] shadow-inner flex justify-around py-3 z-50">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center text-xs ${
                isActive ? 'text-[var(--acc-clr)]' : 'text-white/70'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}