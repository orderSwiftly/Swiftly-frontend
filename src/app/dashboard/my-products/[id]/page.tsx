'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import PulseLoader from '@/components/pulse-loader';

type Review = {
  _id: string;
  user: { fullName: string };
  rating: number;
  comment: string;
  createdAt: string;
};

type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  productImg: string[];
  stock: number;
  location: string;
  productStatus: string;
  averageRating?: number;
};

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
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
          `${api_url}/api/v1/product/get-product/${id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            }
        });

        const data = await res.json();
        if (!res.ok || data.status !== 'success') {
          toast.error(data.message ?? 'Failed to fetch product');
          return;
        }

        setProduct(data.data.product);
        setMainImage(data.data.product.productImg?.[0] ?? '/fallback.jpg');
        setReviews(data.data.reviews ?? []);
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

  if (!product) return <p className="text-center py-10 text-red-500">Product not found.</p>;

  return (
    <div className="mx-auto p-4 sm:p-6 bg-[var(--light-bg)] text-[var(--txt-clr)] pt-[70px] md:pl-72">
      {/* Title */}
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
      <div className="bg-[var(--light-bg)] dark:bg-[var(--bg-clr)] p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700 mb-6">
        <p className="text-gray-700 dark:text-gray-300 mb-4 sec-ff leading-relaxed">
          {product.description}
        </p>

        {typeof product.averageRating === 'number' && (
          <div className="text-yellow-500 text-sm mb-4 sec-ff">
            <span className="font-medium">{product.averageRating.toFixed(1)}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">/5 rating</span>
          </div>
        )}

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

      {/* Reviews Section */}
      <div className="bg-white dark:bg-[var(--bg-clr)] p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold mb-4 pry-ff">Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500 sec-ff">No reviews yet for this product.</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li key={review._id} className="border-b pb-4">
                <p className="font-semibold text-[var(--txt-clr)]">{review.user.fullName}</p>
                <div className="text-yellow-500 text-sm mb-1">
                  {'★'.repeat(review.rating)}{' '}
                  {'☆'.repeat(5 - review.rating)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{review.comment}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}