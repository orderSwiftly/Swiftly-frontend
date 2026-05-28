// src/app/(buyer)/explore/product/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import Link from 'next/link';
import PulseLoader from '@/components/pulse-loader';
import ExploreReview from '@/app/(buyer)/explore/product/[id]/review/explore-rev';
import { ShoppingCart, Star, ChevronLeft, Minus, Plus, Store, ChevronRight } from 'lucide-react';

type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  productImg: string[];
  stock: number;
  location: string;
  averageRating?: number;
  avgRating?: number;
  rating?: number;
  reviewCount?: number;
  seller?: {
    _id: string;
    businessName: string;
    logo: string;
  };
};

export default function ProductDetails() {
  const { id } = useParams() as { id: string };
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const api_url = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(
          `${api_url}/api/v1/product/explore/product/${id}`,
          {
            method: 'GET',
          }
        );

        const data = await res.json();
        // console.log('Full API Response:', data);
        
        if (!res.ok || data.status !== 'success') {
          toast.error(data.message ?? 'Failed to fetch product');
          return;
        }

        const productData = data.data.product;
        // console.log('Product Data:', productData);
        // console.log('Average Rating value:', productData.averageRating, productData.avgRating, productData.rating);
        
        setProduct(productData);
        setMainImage(productData.productImg?.[0] ?? '/fallback.jpg');
      } catch (error) {
        toast.error('Error fetching product');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    if (!token) {
      toast.error('Please sign up or log in to add items to cart');
      router.push('/signup');
      return;
    }

    try {
      setAddingToCart(true);
      const api_url = process.env.NEXT_PUBLIC_API_URL;

      const res = await fetch(`${api_url}/api/v1/cart/add/${product._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await res.json();

      if (res.ok && data.status === 'success') {
        toast.success(`${quantity} × ${product.title} added to cart`);
      } else {
        toast.error(data?.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong!');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <PulseLoader />
      </div>
    );

  if (!product)
    return (
      <div className="text-center py-12 text-red-500">
        Product not found. <br />
        <Link href="/" className="text-green-600 underline block mt-2">← Back to Explore</Link>
      </div>
    );

  const rating = product.averageRating ?? product.avgRating ?? product.rating ?? 0;
  const reviewCount = product.reviewCount || 0;

  return (
    <div className="min-h-screen bg-gray-50 pry-ff">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 md:py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 transition-colors cursor-pointer"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
          <div className="bg-(--txt-clr) rounded-2xl shadow-lg overflow-hidden">
            <div className="relative w-full h-80 sm:h-96 lg:h-[450px] bg-gray-100">
              <Image
                src={mainImage ?? '/fallback.jpg'}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>

            {product.productImg.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto scrollbar-thin">
                {product.productImg.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`relative min-w-[70px] h-[70px] rounded-lg overflow-hidden cursor-pointer border-2 transition-all flex-shrink-0 ${
                      mainImage === img ? 'border-(--prof-clr)' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              {product.seller?.businessName && product.seller._id && (
                <Link 
                  href={`/explore/seller/${product.seller._id}`}
                  className="group/seller block mb-6"
                >
                  <div className="flex items-center justify-between p-3 -mx-3 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center">
                        <Store size={20} className="text-(--prof-clr)" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Sold by</p>
                        <div className="flex items-center gap-1">
                          <span className="text-base font-bold text-gray-800 group-hover/seller:text-(--prof-clr) transition-colors">
                            {product.seller.businessName}
                          </span>
                          <ChevronRight size={14} className="text-gray-300 group-hover/seller:text-(--prof-clr) transition-colors" />
                        </div>
                      </div>
                    </div>
                    
                  </div>
                </Link>
              )}

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {product.title}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star size={18} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold text-gray-700">
                    {rating > 0 ? rating.toFixed(1) : '0.0'}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed mb-6 sec-ff text-sm sm:text-base">
                {product.description}
              </p>

              <div className="mb-6">
                <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                  ₦{product.price.toLocaleString()}
                </span>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-lg font-semibold text-gray-900 min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <Plus size={16} />
                  </button>
                  <span className="text-sm text-gray-500 ml-2">
                    {product.stock} available
                  </span>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-(--prof-clr) text-(--txt-clr) font-semibold rounded-xl hover:bg-(--wave-clr) transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-base sm:text-lg"
              >
                <ShoppingCart size={20} />
                {addingToCart ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              {product.stock > 0 && product.stock < 10 && (
                <p className="text-xs text-orange-600 mt-4 text-center">
                  Only {product.stock} left in stock - order soon
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <ExploreReview productId={product._id} />
        </div>
      </div>
    </div>
  );
}