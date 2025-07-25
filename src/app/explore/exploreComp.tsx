'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import PulseLoader from '@/components/pulse-loader';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SearchComp from '@/components/ui/search'; // Adjust the import path as necessary

type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  productImg: string[];
  stock: number;
  location: string;
  productStatus: 'approve' | 'decline' | 'pending';
  averageRating?: number; // Optional field for average rating
};

export default function ExplorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    const fetchProducts = async () => {
      const api_url = process.env.NEXT_PUBLIC_API_URL;
      try {
        const res = await fetch(`${api_url}/api/v1/product/explore`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await res.json();

        if (!res.ok || data.status !== 'success' || !Array.isArray(data.products)) {
          const message = data?.message ?? 'Failed to fetch products';
          setError(message);
          toast.error(message);
          return;
        }

        setProducts(data.products ?? []);
      } catch (err) {
        setError('An error occurred while fetching products');
        toast.error('An error occurred while fetching products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) return; // ✅ prevent empty search
    const fetchProducts = async () => {
      const api_url = process.env.NEXT_PUBLIC_API_URL;
      setLoading(true);
      setError('');
      
      try {
        const res = await fetch(
          `${api_url}/api/v1/product/search?query=${encodeURIComponent(searchTerm)}&inStock=true`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );
  
        const data = await res.json();
  
        if (!res.ok || data.status !== 'success') {
          throw new Error(data.message ?? 'Failed to fetch products');
        }
  
        setProducts(data.data.products ?? []);
      } catch (err) {
        setError('Failed to load products.');
        toast.error('Failed to load products.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, [searchTerm]);
  
  const handleAddToCart = async (product: Product) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/cart/add/${product._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ quantity: 1 }),
      });

      if (res.status === 401) {
        toast.error('Please sign up or log in to add items to cart');
        router.push('/signup'); // or '/login'
        return;
      }

      const data = await res.json();

      if (!res.ok || data.status !== 'success') {
        throw new Error(data.message ?? 'Failed to add to cart');
      }

      toast.success(data.message ?? `${product.title} added to cart`);
    } catch (error: unknown) {
      console.error(error);
      const message =
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message?: string }).message
          : 'Something went wrong!';
      toast.error(message ?? 'Something went wrong!');
    }
  };
  

  let content: React.ReactNode;

  if (loading) {
    content = (
      <div className="flex items-center justify-center h-64">
        <PulseLoader />
      </div>
    );
  } else if (error) {
    content = <p className="text-red-500 text-center">{error}</p>;
  } else if (products.length === 0) {
    content = (
      <div className="text-center py-12">
        <Image
          src="/no-product.jpg"
          alt="No products found"
          width={200}
          height={200}
          className="mx-auto mb-4"
        />
        <h3 className="text-lg font-semibold text-[var(--txt-clr)] sec-ff">
          No Products Available
        </h3>
        <p className="text-gray-500 sec-ff">No products available to explore at this time.</p>
      </div>
    );
  } else {
    content = (
      <section>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <li
              key={product._id}
              className="bg-white dark:bg-[var(--bg-clr)] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700 flex flex-col"
            >
              {/* Product Image */}
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src={product.productImg?.[0] || '/fallback.jpg'}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Details */}
              <div className="p-4 flex flex-col gap-2 flex-grow sec-ff">
                <h4 className="text-lg font-semibold text-[var(--txt-clr)] pry-ff">
                  {product.title}
                </h4>

                {typeof product.averageRating === 'number' && (
  <div className="text-yellow-500 text-sm mt-1 flex items-center gap-1">
    <span className="font-medium">{product.averageRating.toFixed(1)}</span>
    <span className="text-xs text-gray-500 dark:text-gray-400">/5</span>
  </div>
)}


                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {product.description}
                </p>

                <p className="text-xl font-bold text-[var(--txt-clr)]">
                  ₦{product.price.toLocaleString()}
                </p>

                {/* Stock & Location */}
                <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <span className="bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-md">
                    Stock: {product.stock}
                  </span>
                  <span className="bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-md">
                    {product.location}
                  </span>
                </div>

                {/* Buttons */}
                <div className="mt-4 flex items-center justify-between">
                  <Link
                    href={`/explore/product/${product._id}`}
                    className="group flex items-center gap-2 sec-ff font-normal text-[var(--acc-clr)]"
                  >
                    <span>View Details</span>
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex items-center gap-1 text-sm bg-[var(--acc-clr)]/80 text-white px-3 py-1.5 cursor-pointer font-semibold rounded-lg hover:bg-opacity-90 transition"
                  >
                    <ShoppingCart size={16} />
                    <span>Add</span>
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
    <div className="w-full min-h-full bg-[var(--light-bg)] pb-12">
      <main className="p-4 sm:p-6 pt-24">
        <section className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 w-full max-w-7xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-[var(--txt-clr)] pry-ff text-center md:text-right">
            Explore Products
          </h2>

          <SearchComp onSearch={setSearchTerm} className="w-full max-w-md" />
        </section>

        {content}
      </main>
    </div>
  );
}