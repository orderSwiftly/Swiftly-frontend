'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AlertCircle, Loader2, Store, Clock, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Store = {
  _id: string;
  name: string;
  logo: string | null;
  is_open: boolean;
};

type GetStoresProps = {
  onStoresLoaded?: (stores: Map<string, Store>) => void;
  children?: (stores: Map<string, Store>, loading: boolean) => React.ReactNode;
  fallback?: React.ReactNode;
  showAsGrid?: boolean;
  limit?: number;
};

function getInstitutionEnum(): string {
  if (typeof window === 'undefined') return '';
  try {
    const raw = localStorage.getItem('selected-campus');
    if (!raw) return '';
    const parsed = JSON.parse(raw);
    return parsed?.institutionEnum ?? '';
  } catch {
    return '';
  }
}

export function useStores() {
  const [stores, setStores] = useState<Map<string, Store>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);

  useEffect(() => {
    const fetchStores = async () => {
      const api_url = process.env.NEXT_PUBLIC_API_URL;
      const institutionEnum = getInstitutionEnum();
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      // Check if user is logged in
      if (!token) {
        setNeedsLogin(true);
        setLoading(false);
        return;
      }
      
      // Check if institution is selected
      if (!institutionEnum) {
        setError("Please select a campus first");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${api_url}/api/v1/institution/${institutionEnum}/stores`, { 
          method: "GET", 
          headers 
        });
        
        // Handle 404 or other errors
        if (res.status === 404) {
          setNeedsLogin(true);
          setError(null);
          setLoading(false);
          return;
        }
        
        const data = await res.json();

        if (res.ok && data.status === "success" && Array.isArray(data.stores)) {
          const storesMap = new Map<string, Store>();
          data.stores.forEach((store: Store) => {
            storesMap.set(store._id, store);
          });
          setStores(storesMap);
          setError(null);
          setNeedsLogin(false);
        } else {
          // If the error message indicates authentication issue
          if (data?.message?.toLowerCase().includes('token') || 
              data?.message?.toLowerCase().includes('auth') ||
              res.status === 401) {
            setNeedsLogin(true);
          } else {
            setError(data?.message || "Failed to fetch stores");
          }
        }
      } catch (err) {
        console.error("Failed to fetch stores:", err);
        // If it's a network error that might be due to auth
        setNeedsLogin(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  return { stores, loading, error, needsLogin };
}

// Store card component with link
function StoreCard({ store }: Readonly<{ store: Store }>) {
  return (
    <Link href={`/explore/seller/${store._id}`} className="block group">
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative w-full aspect-square bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
          {store.logo ? (
            <Image
              src={store.logo}
              alt={store.name}
              width={120}
              height={120}
              className="object-contain"
            />
          ) : (
            <Store size={48} className="text-[var(--prof-clr)]" />
          )}
        </div>
        
        <div className="p-3 space-y-2">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
            {store.name}
          </h3>
          
          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
            store.is_open 
              ? 'text-green-600 bg-green-50' 
              : 'text-red-600 bg-red-50'
          }`}>
            <Clock size={10} />
            {store.is_open ? 'Open Now' : 'Closed Now'}
          </div>
        </div>
      </div>
    </Link>
  );
}

// Login prompt component
function LoginPrompt() {
  const router = useRouter();
  
  return (
    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl border border-blue-100 p-6 text-center sec-ff">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-200 rounded-full mb-3">
        <LogIn size={16} className="text-blue-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign in to view stores</h3>
      <p className="text-gray-600 text-sm mb-4">
        Create an account or log in to see popular stores near you
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => router.push('/login')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Log In
        </button>
        <button
          onClick={() => router.push('/signup')}
          className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors cursor-pointer"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default function GetStores({ onStoresLoaded, children, fallback, showAsGrid = false, limit }: Readonly<GetStoresProps>) {
  const { stores, loading, error, needsLogin } = useStores();

  useEffect(() => {
    if (!loading && onStoresLoaded) {
      onStoresLoaded(stores);
    }
  }, [stores, loading, onStoresLoaded]);

  if (loading) {
    if (fallback) return <>{fallback}</>;
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 size={18} className="animate-spin text-gray-400" />
      </div>
    );
  }

  // Show login prompt if needed
  if (needsLogin) {
    if (showAsGrid) {
      return (
        <div className="col-span-full">
          <LoginPrompt />
        </div>
      );
    }
    return <LoginPrompt />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
        <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
        <p className="text-red-700 text-sm">{error}</p>
      </div>
    );
  }

  // If showAsGrid is true, render stores as a grid
  if (showAsGrid) {
    const storesArray = Array.from(stores.values());
    const displayStores = limit ? storesArray.slice(0, limit) : storesArray;
    
    if (displayStores.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No stores available in your area
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {displayStores.map((store) => (
          <StoreCard key={store._id} store={store} />
        ))}
      </div>
    );
  }

  if (children) {
    return <>{children(stores, loading)}</>;
  }

  return null;
}