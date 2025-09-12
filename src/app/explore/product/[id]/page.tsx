'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import Link from 'next/link';
import PulseLoader from '@/components/pulse-loader';
import ExploreReview from '@/app/explore/product/[id]/review/explore-rev';

type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  productImg: string[];
  stock: number;
  location: string;
  productStatus: string;
};

export default function ProductDetails() {
  const { id } = useParams() as { id: string };
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const api_url = process.env.NEXT_PUBLIC_API_URL;
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const res = await fetch(
          `${api_url}/api/v1/product/explore/${id}`,
          {
            method: 'GET',
          }
        );

        const data = await res.json();
        if (!res.ok || data.status !== 'success') {
          toast.error(data.message ?? 'Failed to fetch product');
          return;
        }

        setProduct(data.data.product);
        setMainImage(data.data.product.productImg?.[0] ?? '/fallback.jpg');
      } catch (error) {
        toast.error('Error fetching product');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--light-bg)] text-[var(--txt-clr)]">
        <PulseLoader />
      </div>
    );

  if (!product)
    return (
      <div className="text-center py-12 text-red-500">
        Product not found. <br />
        <Link href="/explore" className="text-[var(--acc-clr)] underline block mt-2">← Back to Explore</Link>
      </div>
    );

  return (
    <div className="mx-auto p-4 sm:p-6 bg-[var(--light-bg)] text-[var(--txt-clr)] min-h-screen">
      <Link href="/explore" className="text-[var(--acc-clr)] underline mb-4 block">← Back to Explore</Link>

      <h1 className="text-2xl sm:text-3xl font-bold mb-4 pry-ff">{product.title}</h1>

      {/* Main Image */}
      <div className="relative w-full h-[300px] sm:h-[400px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md mb-4">
        <Image
          src={mainImage ?? '/fallback.jpg'}
          alt="Main product image"
          fill
          className="object-cover transition duration-300 ease-in-out"
        />
      </div>

      {/* Thumbnails */}
      {product.productImg.length > 1 && (
        <div className="flex gap-3 overflow-x-auto mb-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {product.productImg.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setMainImage(img)}
              className={`relative min-w-[80px] h-20 rounded-md overflow-hidden cursor-pointer border transition duration-200 ${
                mainImage === img ? 'border-[var(--acc-clr)]' : 'border-gray-300'
              }`}
            >
              <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* Product Details */}
      <div className="bg-white dark:bg-[var(--bg-clr)] p-6 rounded-xl mb-4 shadow border border-gray-200 dark:border-gray-700">
        <p className="text-gray-700 dark:text-gray-300 mb-4 sec-ff leading-relaxed">
          {product.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300 sec-ff">
          <p><span className="font-medium">Price:</span> ₦{product.price.toLocaleString()}</p>
          <p><span className="font-medium">Stock:</span> {product.stock}</p>
          <p><span className="font-medium">Location:</span> {product.location}</p>
          <p>
            <span className="font-medium">Status:</span>{' '}
            <span
              className={`capitalize font-semibold ${
                product.productStatus === 'approved'
                  ? 'text-green-500'
                  : product.productStatus === 'pending'
                  ? 'text-yellow-500'
                  : 'text-red-500'
              }`}
            >
              {product.productStatus}
            </span>
          </p>
        </div>
      </div>

      <div>
        <ExploreReview productId={product._id} />
      </div>
    </div>
  );
}