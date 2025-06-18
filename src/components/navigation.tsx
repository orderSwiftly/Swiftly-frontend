'use client';

import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-white/5 backdrop-blur-md shadow-sm pry-ff">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-[var(--txt-clr)] text-xl font-extrabold tracking-wide">Tredia</h1>

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

        {/* Sign In - Desktop */}
        <Link
          href="/auth/login"
          className="hidden md:inline-block text-[var(--bg-clr)] bg-[var(--txt-clr)] border border-[var(--txt-clr)] px-4 py-1 rounded hover:bg-opacity-90 transition font-semibold"
        >
          Sign In
        </Link>

        {/* Mobile Menu Toggle */}
        <button onClick={toggleMobileMenu} className="md:hidden cursor-pointer text-[var(--txt-clr)] focus:outline-none">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <div
        className={`md:hidden fixed top-14 left-0 w-full bg-black/90 backdrop-blur-md shadow-lg transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ul className="flex flex-col items-center py-6 space-y-6 text-white uppercase text-sm">
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
              href="/auth/login"
              onClick={toggleMobileMenu}
              className="text-[var(--bg-clr)] bg-[var(--txt-clr)] border border-[var(--txt-clr)] px-4 py-1 rounded hover:bg-opacity-90 transition font-semibold"
            >
              Sign In
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}