'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import PulseLoader from '@/components/pulse-loader';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  productImg: string[];
  stock: number;
  location: string;
  productStatus: string;
  averageRating?: number; // ✅ newly added
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const api_url = process.env.NEXT_PUBLIC_API_URL;
      try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const res = await fetch(`${api_url}/api/v1/product/my-products`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.status === 'success') {
        setProducts(data.data.enrichedProducts ?? []);
      } else {
        setError(data.message ?? 'Failed to fetch products');
      }
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

  let content: React.ReactNode;

  if (loading) {
    content = (
      <div className="flex items-center justify-center h-64">
        <PulseLoader />
      </div>
    );
  } else if (error) {
    content = <p className="text-gray-400 sec-ff text-center">{error}</p>;
  } else if (products.length === 0) {
    content = (
      <div className="flex flex-col justify-center items-center py-12">
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
        <p className="text-gray-500 sec-ff">You haven’t added any products yet.</p>
      </div>
    );
  } else {
    content = (
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <li
            key={product._id}
            className={`relative bg-white dark:bg-[var(--bg-clr)] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700 ${
              product.stock === 0 ? 'opacity-50' : ''
            }`}
          >
            {/* Sold Out Badge */}
            {product.stock === 0 && (
              <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded z-10">
                Sold Out
              </span>
            )}

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
            <div className="p-4 flex flex-col justify-between h-full space-y-2 sec-ff">
              <div>
                {/* Title & Rating */}
                <div className="mb-1">
                  <h4 className="text-lg font-semibold text-[var(--txt-clr)] pry-ff">
                    {product.title}
                  </h4>
                  {typeof product.averageRating === 'number' && (
                    <div className="text-yellow-500 text-sm mt-1 flex items-center gap-1">
                      <span className="font-medium">{product.averageRating.toFixed(1)}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">/5</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 sec-ff mb-2">
                  {product.description}
                </p>

                {/* Price */}
                <p className="text-xl font-bold text-[var(--txt-clr)] mt-auto sec-ff mb-2">
                  ₦{product.price.toLocaleString()}
                </p>

                {/* Info Tags */}
                <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-300 mb-3">
                  <span className="bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-md">
                    Stock: {product.stock}
                  </span>
                  <span className="bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-md">
                    {product.location}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-md text-[var(--txt-clr)] capitalize ${
                      product.productStatus === 'approved'
                        ? 'bg-green-500'
                        : product.productStatus === 'pending'
                        ? 'bg-yellow-600'
                        : 'bg-red-500'
                    }`}
                  >
                    {product.productStatus}
                  </span>

                  {/* View Details */}
                  <button className="bg-transparent border-none p-0 m-0">
                    <Link
                      href={`/dashboard/my-products/${product._id}`}
                      className="group flex items-center gap-2 sec-ff font-normal text-[var(--acc-clr)]"
                    >
                      <span>View Details</span>
                      <ArrowRight
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </Link>
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <main className="p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-[var(--txt-clr)] pry-ff">
        Your Products
      </h2>
      {content}
    </main>
  );
}