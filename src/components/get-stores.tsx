// components/get-stores.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AlertCircle, Loader2, Store, Clock } from 'lucide-react';

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

  useEffect(() => {
    const fetchStores = async () => {
      const api_url = process.env.NEXT_PUBLIC_API_URL;
      const institutionEnum = getInstitutionEnum();
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      try {
        setLoading(true);
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${api_url}/api/v1/institution/${institutionEnum}/stores`, { 
          method: "GET", 
          headers 
        });
        const data = await res.json();

        if (res.ok && data.status === "success" && Array.isArray(data.stores)) {
          const storesMap = new Map<string, Store>();
          data.stores.forEach((store: Store) => {
            storesMap.set(store._id, store);
          });
          setStores(storesMap);
          setError(null);
        } else {
          setError(data?.message || "Failed to fetch stores");
        }
      } catch (err) {
        console.error("Failed to fetch stores:", err);
        setError("Failed to fetch stores");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  return { stores, loading, error };
}

// Store card component with link
function StoreCard({ store }: Readonly<{ store: Store }>) {
  return (
    <Link href={`/explore/seller/${store._id}`} className="block group">
      <div className="bg-(txt-clr) rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
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
            <Store size={48} className="text-green-400" />
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

export default function GetStores({ onStoresLoaded, children, fallback, showAsGrid = false, limit }: Readonly<GetStoresProps>) {
  const { stores, loading, error } = useStores();

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