'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import AddToCart from './add-to-cart';
import Link from 'next/link';
import PulseLoader from '@/components/pulse-loader';

type Product = {
  title: string;
  productImg: string[];
  price: number;
  stock: number;
};

type CartItem = {
  productId: string;
  sellerId: string;
  quantity: number;
  price: number;
  addedAt: string;
  product: Product;
};

type SellerGroup = {
  seller: { _id: string; name: string };
  items: CartItem[];
};

type GroupedCart = Record<string, SellerGroup>;

export default function GetCartComp() {
  const [groupedCart, setGroupedCart] = useState<GroupedCart>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetchCart = async () => {
    try {
      const api_url = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const res = await fetch(`${api_url}/api/v1/cart/get`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? 'Failed to load cart');

      const cart = data.cart ?? {};
      if (Array.isArray(cart)) {
        setGroupedCart({});
      } else {
        setGroupedCart(cart as GroupedCart);
      }

      setError('');
    } catch (err) {
      console.error(err);
      toast.error('Error refreshing cart');
      setError('Failed to load cart.');
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      await refetchCart();
      setLoading(false);
    };
    fetchCart();
  }, []);

  const handleQuantityChange = async (productId: string, action: 'increment' | 'decrement') => {
    try {
      const api_url = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const res = await fetch(`${api_url}/api/v1/cart/update/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok || data.status !== 'success') throw new Error(data?.message || 'Failed to update cart');

      toast.success('Cart updated');
      await refetchCart();
    } catch (err) {
      console.error(err);
      toast.error('Error updating quantity');
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      const api_url = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const res = await fetch(`${api_url}/api/v1/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || data.status !== 'success') throw new Error(data?.message || 'Failed to remove item');

      toast.success('Item removed');
      await refetchCart();
    } catch (err) {
      console.error(err);
      toast.error('Error removing item');
    }
  };

  const allItems = Object.values(groupedCart).flatMap(g => g.items);
  const subtotal = allItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const isEmpty = allItems.length === 0;

  if (loading) return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <PulseLoader />
    </div>
  );

  if (error) return (
    <p className="text-red-500 text-center mt-8 pry-ff">{error}</p>
  );

  if (isEmpty) {
    return (
      <div className="text-center mt-8 pry-ff flex flex-col items-center text-[var(--sec-clr)]">
        <Image src="/cart.png" alt="Empty Cart" width={150} height={150} className="mx-auto mb-4" />
        Your cart is empty
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-8 bg-gray-50 min-h-screen pry-ff mb-20">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">Your Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* Cart Groups */}
        <div className="flex-1 w-full space-y-8">
          {Object.entries(groupedCart).map(([sellerId, group]) => (
            <div key={sellerId}>

              {/* Seller header */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Store:
                </span>
                <span className="text-sm font-semibold text-gray-700">
                  {group.seller.name}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-4">
                {group.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-white p-4 rounded-xl border border-gray-200"
                  >
                    {/* Image */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 relative rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product?.productImg?.[0] || '/fallback.jpg'}
                        alt={item.product?.title ?? 'Product'}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between w-full">
                      <div>
                        <h4 className="font-semibold text-gray-800 line-clamp-2">
                          {item.product?.title}
                        </h4>
                        <p className="text-gray-500 text-sm mt-1">
                          ₦{item.price.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3">
                        <AddToCart
                          quantity={item.quantity}
                          onIncrement={() => handleQuantityChange(item.productId, 'increment')}
                          onDecrement={() => handleQuantityChange(item.productId, 'decrement')}
                        />
                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          <p className="text-sm font-semibold text-gray-700">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </p>
                          <button
                            onClick={() => handleRemove(item.productId)}
                            className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition cursor-pointer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Seller subtotal */}
              <p className="text-right text-sm text-gray-400 mt-2">
                Seller subtotal:{' '}
                <span className="font-semibold text-gray-600">
                  ₦{group.items.reduce((acc, item) => acc + item.quantity * item.price, 0).toLocaleString()}
                </span>
              </p>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="w-full lg:w-80 lg:sticky lg:top-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-gray-800">Order Summary</h2>

            <div className="space-y-2">
              {Object.values(groupedCart).map((group) => (
                <div key={group.seller._id} className="flex justify-between text-sm text-gray-500">
                  <span className="truncate max-w-[60%]">{group.seller.name}</span>
                  <span className="font-medium text-gray-700">
                    ₦{group.items.reduce((acc, item) => acc + item.quantity * item.price, 0).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="flex justify-between text-base font-bold text-gray-800 pt-3"
              style={{ borderTop: '1px solid #e5e7eb' }}
            >
              <span>Subtotal</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>

            <Link href="/order">
              <button className="w-full mt-2 py-3 rounded-xl bg-green-600 text-white font-semibold hover:opacity-90 transition cursor-pointer text-sm">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}