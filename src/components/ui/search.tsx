'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';

export default function SearchComp({
  onSearch,
  className = '',
}: Readonly<{
  onSearch: (value: string) => void;
  className?: string;
}>) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(input.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center w-full bg-white/10 backdrop-blur-lg rounded-lg px-4 py-2 shadow-md focus-within:ring-2 focus-within:ring-[var(--acc-clr)] transition-all ${className}`}
    >
      <Search size={18} className="text-[var(--txt-clr)] mr-2" />
      <input
        type="search"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search products..."
        className="flex-1 bg-transparent outline-none text-sm text-[var(--txt-clr)] placeholder:text-white/60"
      />
    </form>
  );
}
