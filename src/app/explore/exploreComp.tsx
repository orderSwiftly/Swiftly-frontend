'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import PulseLoader from '@/components/pulse-loader';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowRight, ShoppingCart, Star } from 'lucide-react'; // Added Star
import { useRouter } from 'next/navigation';

type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  productImg: string[];
  stock: number;
  location: string;
  productStatus: 'approve' | 'decline' | 'pending';
  averageRating?: number;
};

export default function ExplorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const fetchProducts = async () => {
      const api_url = process.env.NEXT_PUBLIC_API_URL;
      try {
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${api_url}/api/v1/product/explore`, {
          method: "GET",
          headers,
        });

        const data = await res.json();

        if (!res.ok || data.status !== "success" || !Array.isArray(data.products)) {
          setError(data?.message ?? "Failed to fetch products");
          return;
        }

        setProducts(data.products ?? []);
      } catch (err) {
        setError("An error occurred while fetching products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [token]);

  // 🔍 Search effect logic remains same...
  // useEffect(() => {
  //   if (!searchTerm.trim()) return;
  //   const fetchSearch = async () => {
  //     const api_url = process.env.NEXT_PUBLIC_API_URL;
  //     setLoading(true);
  //     try {
  //       const res = await fetch(`${api_url}/api/v1/product/search?query=${encodeURIComponent(searchTerm)}&inStock=true`);
  //       const data = await res.json();
  //       if (res.ok && data.status === "success") setProducts(data.data.products ?? []);
  //     } catch (err) {
  //       setError("Failed to load products.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchSearch();
  // }, [searchTerm]);

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
      if (res.ok && data.status === 'success') toast.success(`${product.title} added to cart`);
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  let content: React.ReactNode;

  if (loading) {
    content = <div className="flex items-center justify-center h-64"><PulseLoader /></div>;
  } else if (error) {
    content = <p className="text-red-500 text-center">{error}</p>;
  } else if (products.length === 0) {
    content = (
      <div className="text-center py-12">
        <Image src="/no-product.jpg" alt="No products" width={200} height={200} className="mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[var(--txt-clr)]">No Products Available</h3>
      </div>
    );
  } else {
    content = (
      <section className="max-w-7xl mx-auto">
        <ul className="grid gap-x-6 gap-y-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <li
              key={product._id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col group"
            >
              {/* Product Image */}
              <div className="relative w-full h-44 overflow-hidden">
                <Image
                  src={product.productImg?.[0] || '/fallback.jpg'}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Product Details - Matching Screenshot */}
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
                </div>

                {/* Action Buttons (Keeping your original functionality) */}
                <div className="mt-2 flex items-center justify-between pt-2 border-t border-gray-50">
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
      </section>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#fcfcfc] pb-12">
      <main className="p-4 sm:p-6 pt-24">
        <div className="max-w-7xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Explore Products</h2>
        </div>
        {content}
      </main>
    </div>
  );
}