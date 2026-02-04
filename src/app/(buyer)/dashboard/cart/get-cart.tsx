'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import AddToCart from './add-to-cart';
import Link from 'next/link';

type Product = {
  title: string;
  productImg: string[];
  price: number;
  stock: number;
};

type CartItem = {
  productId: string;
  quantity: number;
  price: number;
  addedAt: string;
  product: Product;
};

export default function GetCartComp() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetchCart = async () => {
    try {
      const api_url = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No token found");

      const res = await fetch(`${api_url}/api/v1/cart/get`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? "Failed to load cart");

      setCartItems(data.cart ?? []);
      setError('');
    } catch (err) {
      console.error(err);
      toast.error("Error refreshing cart");
      setError("Failed to load cart.");
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
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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

  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  if (loading) return <p className="text-center mt-8 pry-ff">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-8 pry-ff">{error}</p>;
  if (cartItems.length === 0) {
    return (
      <div className="text-center mt-8 pry-ff flex flex-col items-center text-[var(--sec-clr)]">
        <Image
          src="/cart.png"
          alt="Empty Cart"
          width={150}
          height={150}
          className="mx-auto mb-4"
        />
        Your cart is empty
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen pry-ff">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.productId}
            className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 bg-white p-4 rounded-lg border border-gray-200"
          >
            {/* Product Image */}
            <div className="w-28 h-28 relative rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={item.product.productImg?.[0] || '/fallback.jpg'}
                alt={item.product.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Title & Quantity */}
            <div className="flex-1 flex flex-col justify-between w-full mt-2 sm:mt-0">
              <div>
                <h4 className="font-semibold text-gray-800 truncate">{item.product.title}</h4>
                <p className="text-gray-500 text-sm mt-1">₦{item.price.toLocaleString()}</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                <AddToCart
                  quantity={item.quantity}
                  onIncrement={() => handleQuantityChange(item.productId, 'increment')}
                  onDecrement={() => handleQuantityChange(item.productId, 'decrement')}
                />

                {/* Remove button */}
                <button
                  onClick={() => handleRemove(item.productId)}
                  className="p-2 rounded-full hover:bg-gray-200 text-gray-600 cursor-pointer mt-2 sm:mt-0"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Subtotal & Checkout */}
      <div className="mt-8 flex justify-end">
        <div className="w-full sm:w-[60%] md:w-[45%] lg:w-[35%] p-6 bg-white rounded-lg border border-gray-200">
          <p className="text-lg font-semibold">Subtotal: ₦{subtotal.toLocaleString()}</p>
          <Link href="/order" className="w-full mt-4 py-3 rounded-lg bg-green-600 text-white font-semibold hover:opacity-90 transition">
            <button className="w-full mt-4 py-3 rounded-lg bg-green-600 text-white font-semibold hover:opacity-90 transition cursor-pointer">
              Check Out
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
