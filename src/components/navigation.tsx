'use client';

import { useState, useEffect } from "react";
import { Search, Menu, X, ShoppingCart } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";
import toast from 'react-hot-toast';
import useUserStore from "@/stores/useUserStore";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Leaderboard", href: "/leaderboard" },
];

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, setUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    const api_url = process.env.NEXT_PUBLIC_API_URL;
    if (user || isLoading || !api_url) return;

    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${api_url}/api/v1/user/me`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await res.json();

        if (res.ok && data.status === 'success') {
          setUser(data.data.user);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to load user profile.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

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
              className="w-auto object-cover"
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-6 text-[var(--txt-clr)] uppercase text-sm items-center">
          {NAV_ITEMS.map((item) => (
            <li key={item.label} className="hover:text-[var(--acc-clr)] transition-colors">
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
          <li>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-md ring-inset focus-within:ring-2 ring-[var(--acc-clr)]">
              <input
                type="search"
                placeholder="Search..."
                className="bg-transparent outline-none text-sm text-[var(--txt-clr)] placeholder:text-[var(--txt-clr)] w-48"
              />
              <Search className="w-4 h-4 text-[var(--txt-clr)]" />
            </div>
          </li>
        </ul>

        {/* Desktop Right Icons */}
        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="hidden md:inline-block text-[var(--txt-clr)] hover:text-[var(--acc-clr)] transition"
          >
            <ShoppingCart className="w-5 h-5" />
          </Link>

          {user ? (
            <Link
              href='/dashboard'
              className="hidden md:inline-block text-[var(--txt-clr)] font-medium capitalize hover:text-[var(--acc-clr)] transition"
            >Hi, {user.fullname}</Link>
          ) : (
            <Link
              href="/signup"
              className="hidden md:inline-block text-[var(--bg-clr)] bg-[var(--acc-clr)] px-4 py-1 rounded hover:bg-opacity-90 transition font-semibold capitalize"
            >
              Sign up
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden cursor-pointer text-[var(--txt-clr)] focus:outline-none"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <div
        className={`md:hidden fixed top-14 left-0 w-full bg-black/90 backdrop-blur-md shadow-lg transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ul className="flex flex-col items-center py-6 space-y-6 text-[var(--txt-clr)] uppercase text-sm">
          {NAV_ITEMS.map((item) => (
            <li key={item.label} onClick={toggleMobileMenu}>
              <Link href={item.href} className="hover:text-[var(--acc-clr)] transition-colors">
                {item.label}
              </Link>
            </li>
          ))}

          <li>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-md focus-within:ring-2 ring-[var(--acc-clr)]">
              <input
                type="search"
                placeholder="Search..."
                className="bg-transparent outline-none text-sm text-[var(--txt-clr)] placeholder:text-[var(--txt-clr)] w-36"
              />
              <Search className="w-4 h-4 text-[var(--txt-clr)]" />
            </div>
          </li>

          <li>
            <Link
              href="/cart"
              onClick={toggleMobileMenu}
              className="flex items-center gap-2 text-[var(--txt-clr)] hover:text-[var(--acc-clr)] transition"
            >
              <ShoppingCart className="w-4 h-4" />
              Cart
            </Link>
          </li>

          <li>
            {user ? (
              <Link href='/dashboard' className="text-[var(--acc-clr)] font-medium capitalize">
                Hi, {user.fullname}
              </Link>
            ) : (
              <Link
                href="/signup"
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