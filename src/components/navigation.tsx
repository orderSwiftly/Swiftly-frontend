'use client';

import { useEffect, useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";
import { useUserStore } from '@/stores/userStore';

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Leaderboard", href: "/leaderboard" },
];

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isLoading, fetchUser, isAuthenticated } = useUserStore();

  useEffect(() => {
    if (!user) fetchUser();
  }, [user, fetchUser]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const userInitial = user?.fullname?.charAt(0)?.toUpperCase() || 'U';

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-[var(--bg-clr)]/90 backdrop-blur-md shadow-sm pry-ff">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2">
            <Image
              src="/tredia-logo.png"
              alt="Tredia Logo"
              width={40}
              height={40}
              className="w-10 h-10 object-cover"
            />
            <span className="text-xl font-bold text-[var(--sec-clr)]">Tredia</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-8 text-[var(--sec-clr)] font-medium items-center">
          {NAV_ITEMS.map((item) => (
            <li key={item.label} className="hover:text-[var(--acc-clr)] transition-colors">
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>

        {/* Desktop Right Section */}
        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="hidden md:inline-flex items-center justify-center p-2 rounded-full bg-[var(--acc-clr)] text-[var(--bg-clr)]"
          >
            <ShoppingCart className="w-5 h-5" />
          </Link>

          {isLoading ? (
            <div className="hidden md:flex items-center gap-2 animate-pulse">
              <div className="bg-gray-200 w-8 h-8 rounded-full"></div>
              <div className="bg-gray-200 w-20 h-4 rounded"></div>
            </div>
          ) : isAuthenticated && user ? (
            <Link
              href="/dashboard"
              className="hidden md:flex items-center gap-2 font-medium text-[var(--acc-clr)] transition-colors"
            >
              {user.photo ? (
                <Image
                  width={32}
                  height={32}
                  src={user.photo}
                  alt={user.fullname}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-semibold">
                  {userInitial}
                </div>
              )}
              <span>Hi, {user.fullname}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden md:inline-block text-[var(--bg-clr)] px-4 py-2 rounded-lg bg-[var(--acc-clr)] transition-colors font-medium"
            >
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-[var(--sec-clr)] cursor-pointer rounded-md p-1"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <div
        className={`md:hidden fixed top-14 left-0 w-full bg-[var(--bg-clr)]/90 backdrop-blur-md shadow-lg transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <ul className="flex flex-col items-center py-6 space-y-6 text-[var(--sec-clr)] uppercase text-sm">
          {NAV_ITEMS.map((item) => (
            <li key={item.label} onClick={toggleMobileMenu}>
              <Link href={item.href} className="hover:text-[var(--acc-clr)] transition-colors">
                {item.label}
              </Link>
            </li>
          ))}

          <li>
            <Link
              href="/cart"
              onClick={toggleMobileMenu}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--acc-clr)] text-[var(--bg-clr)] hover:bg-opacity-90 transition"
            >
              <ShoppingCart className="w-4 h-4" />
              Cart
            </Link>
          </li>

          <li>
            {isLoading ? (
              <div className="flex items-center gap-2 animate-pulse">
                <div className="bg-gray-200 w-8 h-8 rounded-full"></div>
                <div className="bg-gray-200 w-24 h-4 rounded"></div>
              </div>
            ) : isAuthenticated && user ? (
              <Link
                href="/dashboard"
                onClick={toggleMobileMenu}
                className="flex items-center gap-2 text-[var(--acc-clr)] font-medium capitalize"
              >
                {user.photo ? (
                  <Image
                    width={32}
                    height={32}
                    src={user.photo}
                    alt={user.fullname}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-semibold">
                    {userInitial}
                  </div>
                )}
                <span>Hi, {user.fullname}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={toggleMobileMenu}
                className="text-[var(--bg-clr)] bg-[var(--acc-clr)] px-4 py-1 rounded hover:bg-opacity-90 transition font-semibold capitalize"
              >
                Sign up
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}