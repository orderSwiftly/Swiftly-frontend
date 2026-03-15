'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import PulseLoader from '@/components/pulse-loader';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowRight, ShoppingCart, Star, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Category = {
  _id: string;
  name: string;
};

type Product = {
  _id: string;
  seller?: {
    _id: string;
    businessName: string;
    logo: string;
    institutionId: string;
  };
  title: string;
  description: string;
  price: number;
  productImg: string[];
  stock: number;
  location: string;
  averageRating?: number;
  category?: Category;
};

type ExplorePageProps = {
  searchTerm?: string;
  categoryName?: string;
};

export default function ExplorePage({ searchTerm = '', categoryName = '' }: ExplorePageProps) {
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
      setLoading(true);
      setError('');
      try {
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${api_url}/api/v1/product/explore`, { method: "GET", headers });
        const data = await res.json();

        if (!res.ok || data.status !== "success" || !Array.isArray(data.products)) {
          setError(data?.message ?? "Failed to fetch products");
          return;
        }
        setProducts((data.products ?? []).filter((p: Product) => p.stock > 0));
      } catch (err) {
        setError("An error occurred while fetching products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [token, searchTerm, categoryName]);

  // Fetch by search query or categoryName
  useEffect(() => {
    if (!searchTerm.trim() && !categoryName.trim()) return;
    const fetchSearch = async () => {
      const api_url = process.env.NEXT_PUBLIC_API_URL;
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (searchTerm.trim()) params.set('query', searchTerm);
        if (categoryName.trim()) params.set('categoryName', categoryName);

        const res = await fetch(`${api_url}/api/v1/product/search?${params.toString()}`);
        const data = await res.json();
        if (res.ok && data.status === "success") setProducts((data.products ?? []).filter((p: Product) => p.stock > 0));
        else setError(data?.message ?? "No matching products found.");
      } catch (err) {
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

  let content: React.ReactNode;

  if (loading) {
    content = <div className="flex items-center justify-center h-64"><PulseLoader /></div>;
  } else if (error || products.length === 0) {
    content = (
      <div className="text-center py-12">
        <Image src="/no-product.jpg" alt="No products" width={200} height={200} className="mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[var(--txt-clr)]">
          {error || 'No Products Available'}
        </h3>
      </div>
    );
  } else {
    content = (
      <ul className="grid gap-x-6 gap-y-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <li
            key={product._id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col group"
          >
            <div className="relative w-full h-44 overflow-hidden">
              <Image
                src={product.productImg?.[0] || '/fallback.jpg'}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h4 className="text-xl font-bold text-gray-900 tracking-tight leading-tight truncate">
                  {product.title}
                </h4>
                <div className="flex items-center gap-1">
                  <Star size={18} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-base font-medium text-gray-700">
                    {product.averageRating ? product.averageRating.toFixed(1) : '0.0'}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-lg font-bold text-gray-900">
                  ₦{product.price.toLocaleString()}
                </p>
                <p className="text-lg text-gray-900">
                  ({product.stock})
                </p>
              </div>

              <div className="flex flex-col gap-2 max-w-full">
                {product.category?.name && (
                  <span className="inline-flex max-w-fit text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-md sec-ff truncate">
                    {product.category.name}
                  </span>
                )}

                {product.seller?.businessName && (
                  <Link href={`/explore/seller/${product.seller._id}`} className="flex items-center">
                    <Store size={16} className="text-gray-500" />
                    <span
                      className="inline-flex max-w-[140px] text-xs font-medium text-[var(--bg-clr)] px-2 py-1 rounded-md sec-ff truncate"
                      title={product.seller.businessName}
                    >
                      {product.seller.businessName}
                    </span>
                  </Link>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-gray-50">
                <Link
                  href={`/explore/product/${product._id}`}
                  className="text-sm font-medium text-green-600 flex items-center gap-1"
                >
                  Details <ArrowRight size={14} />
                </Link>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-colors cursor-pointer"
                >
                  <ShoppingCart size={18} />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="w-full pb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {categoryName
            ? `Category: ${categoryName}`
            : searchTerm
              ? `Results for "${searchTerm}"`
              : 'Explore Products'}
        </h2>
      </div>
      {content}
    </div>
  );
}