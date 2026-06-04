// src/app/(buyer)/explore/exploreComp.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import PulseLoader from '@/components/pulse-loader';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowRight, ShoppingCart, Star, Store, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import GetStores from '@/components/get-stores';

type Category = {
  _id: string;
  name: string;
};

type Seller = {
  _id: string;
  businessName: string;
  logo: string;
  institutionId: string;
};

type Product = {
  _id: string;
  seller?: Seller;
  title: string;
  description: string;
  price: number;
  productImg: string[];
  stock: number;
  location: string;
  average_rating?: number;
  category?: Category;
};

type ExplorePageProps = {
  searchTerm?: string;
  categoryName?: string;
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

export default function ExplorePage({ searchTerm = '', categoryName = '' }: Readonly<ExplorePageProps>) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Fetch all products when no filter
  useEffect(() => {
    if (searchTerm.trim() || categoryName.trim()) return;
    const fetchProducts = async () => {
      const api_url = process.env.NEXT_PUBLIC_API_URL;
      const institutionEnum = getInstitutionEnum();
      setLoading(true);
      setError('');
      try {
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${api_url}/api/v1/product/explore/${institutionEnum}`,
          {
            method: "GET",
            headers
          });
        const data = await res.json();

        if (!res.ok || data.status !== "success" || !Array.isArray(data.products)) {
          setError(data?.message ?? "Failed to fetch products");
          return;
        }
        setProducts((data.products ?? []).filter((p: Product) => p.stock > 0));
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [token, searchTerm, categoryName]);

  // Fetch by search query or categoryName - FIXED ENDPOINT
  useEffect(() => {
    if (!searchTerm.trim() && !categoryName.trim()) return;
    const fetchSearch = async () => {
      const api_url = process.env.NEXT_PUBLIC_API_URL;
      const institutionEnum = getInstitutionEnum();
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (searchTerm.trim()) params.set('query', searchTerm);
        if (categoryName.trim()) params.set('categoryName', categoryName);

        // FIXED: Changed from '/api/v1/products/search/' to '/api/v1/product/search/'
        const res = await fetch(`${api_url}/api/v1/product/search/${institutionEnum}?${params.toString()}`);
        const data = await res.json();
        
        // console.log('Search response:', data); // Debug log
        
        if (res.ok && data.status === "success") {
          setProducts((data.products ?? []).filter((p: Product) => p.stock > 0));
        } else {
          setError(data?.message ?? "No matching products found.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    const debounce = setTimeout(fetchSearch, 400);
    return () => clearTimeout(debounce);
  }, [searchTerm, categoryName]);

  const handleAddToCart = async (product: Product) => {
    try {
      const api_url = process.env.NEXT_PUBLIC_API_URL;
      if (!token) {
        toast.error('Please sign up or log in to add items to cart');
        router.push('/signup');
        return;
      }

      const res = await fetch(`${api_url}/api/v1/cart/add/${product._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: 1 }),
      });

      const data = await res.json();

      if (res.ok && data.status === 'success') {
        toast.success(`${product.title} added to cart`);
      } else {
        toast.error(data?.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <PulseLoader />
      </div>
    );
  }

  return (
    <div className="w-full pb-12 space-y-8">
      {/* Popular Stores Section - Only show when no search or category filter */}
      {!searchTerm && !categoryName && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Popular Stores</h2>
            <button className="text-sm text-(--prof-clr) font-medium hover:text-(--wave-clr)">
              View All &gt;
            </button>
          </div>
          <GetStores showAsGrid limit={10} />
        </div>
      )}

      {/* Products Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">
          {categoryName
            ? `Category: ${categoryName}`
            : searchTerm
              ? `Results for "${searchTerm}"`
              : 'Popular Items Nearby'}
        </h2>
        
        {error || products.length === 0 ? (
          <div className="text-center py-12">
            <Image src="/no_addresses.png" alt="No products" width={200} height={200} className="mx-auto mb-4" />
            <span className='text-gray-500'>We don&apos;t have any products available at the moment.</span>
          </div>
        ) : (
          <ul className="grid gap-x-6 gap-y-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => {
              // Log product ID when rendering each product
              // console.log('Product ID:', product._id, 'Product Title:', product.title);
              return (
              <li
                key={product._id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 flex flex-col group hover:shadow-xl transition-shadow"
              >
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src={product.productImg?.[0] || '/fallback.jpg'}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                    {product.stock} left
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-bold text-gray-900 tracking-tight leading-tight line-clamp-1">
                      {product.title}
                    </h4>
                    <p className="text-lg font-bold text-(--prof-clr)">
                      ₦{product.price.toLocaleString()}
                    </p>
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className="flex items-center gap-1">
                      <Star size={16} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {product.average_rating ? product.average_rating.toFixed(1) : '0.0'}
                      </span>
                    </div>

                    {product.category?.name && (
                      <span className="inline-flex text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                        {product.category.name}
                      </span>
                    )}
                  </div>

                  {product.seller?.businessName && (
                    <Link 
                      href={`/explore/seller/${product.seller._id}`}
                      className="group/seller flex items-center justify-between p-2 -mx-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-(--prof-clr) rounded-full flex items-center justify-center">
                          <Store size={12} className="text-(--txt-clr)" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-400">Store</span>
                          <span className="text-sm font-medium text-gray-700 group-hover/seller:text-(--prof-clr) transition-colors">
                            {product.seller.businessName}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-gray-300 group-hover/seller:text-(--prof-clr) transition-colors" />
                    </Link>
                  )}

                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-100 mt-1">
                    <Link
                      href={`/explore/product/${product._id}`}
                      className="flex-1 text-center text-sm font-medium text-(--prof-clr) hover:text-(--wave-clr) flex items-center justify-center gap-1 transition-colors"
                      onClick={() => console.log('Navigating to product:', product._id)} // Log when clicked
                    >
                      View Details <ArrowRight size={14} />
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="p-2 bg-(--prof-clr) text-(--txt-clr) rounded-full hover:bg-(--wave-clr) transition-colors cursor-pointer"
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </li>
            )})}
          </ul>
        )}
      </div>
    </div>
  );
}