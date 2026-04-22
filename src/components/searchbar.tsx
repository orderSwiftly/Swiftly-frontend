// src/components/search-bar.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type SuggestedProduct = {
  _id: string;
  title: string;
  price: number;
  productImg: string[];
  seller?: { businessName: string };
};

type Props = {
  onSearch?: (term: string) => void; // called when user submits
  placeholder?: string;
};

export default function SearchBar({ onSearch, placeholder = 'Search products...' }: Props) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestedProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Fetch suggestions on keystroke
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const api_url = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${api_url}/api/v1/product/search?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (res.ok && data.status === 'success' && Array.isArray(data.products)) {
          setSuggestions(data.products.filter((p: SuggestedProduct & { stock?: number }) => (p.stock ?? 1) > 0).slice(0, 6));
          setOpen(true);
        } else {
          setSuggestions([]);
        }
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    onSearch?.(query);
  };

  const handleSuggestionClick = (product: SuggestedProduct) => {
    setOpen(false);
    setQuery('');
    router.push(`/explore/product/${product._id}`);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setOpen(false);
    onSearch?.('');
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-7xl">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-(--txt-clr) border border-gray-200 rounded-xl px-3 py-2 shadow-sm focus-within:border-green-400 transition-colors">
        <Search size={18} className="text-gray-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 text-sm text-gray-800 outline-none placeholder:text-gray-400 bg-transparent sec-ff"
        />
        {query && (
          <button type="button" onClick={handleClear} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        )}
      </form>

      {/* Suggestions dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-(--txt-clr) border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
          {loading ? (
            <div className="px-4 py-3 text-sm text-gray-400 sec-ff">Searching...</div>
          ) : suggestions.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-400 sec-ff">No results found</div>
          ) : (
            <ul>
              {suggestions.map((product) => (
                <li key={product._id}>
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick(product)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      <Image
                        src={product.productImg?.[0] || '/fallback.jpg'}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
                      {product.seller?.businessName && (
                        <p className="text-xs text-gray-400 sec-ff truncate">{product.seller.businessName}</p>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-green-600 shrink-0">
                      ₦{product.price.toLocaleString()}
                    </span>
                  </button>
                </li>
              ))}

              {/* View all results */}
              <li className="border-t border-gray-50">
                <button
                  type="button"
                  onClick={handleSubmit as unknown as React.MouseEventHandler}
                  className="w-full px-4 py-2.5 text-sm text-green-600 font-medium hover:bg-green-50 transition-colors text-center sec-ff"
                >
                  See all results for &apos;{query}&apos;
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}