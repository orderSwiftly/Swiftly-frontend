'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import PulseLoader from '@/components/pulse-loader';
import AddToCart from './add-to-cart';
import RemoveCart from './remove';
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

    if (!token) {
      throw new Error("no token found");
    }

    const res = await fetch(`${api_url}/api/v1/cart/get`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message ?? "Failed to load cart");
    }

    // ✅ If cart is missing or empty, just set it to []
    setCartItems(data.cart ?? []);
    setError(""); // clear any previous error
  } catch (err) {
    console.error(err);
    toast.error("Error refreshing cart");
    setError("Failed to load cart."); // only real errors go here
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

      if (!token) {
        throw new Error ('no token found')
      }
      const res = await fetch(`${api_url}/api/v1/cart/update/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();

      if (!res.ok || data.status !== 'success') {
        throw new Error(data?.message || 'Failed to update cart');
      }

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

      if (!token) {
        throw new Error ('no token found')
      }
      const res = await fetch(`${api_url}/api/v1/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      const data = await res.json();

      if (!res.ok || data.status !== 'success') {
        throw new Error(data?.message || 'Failed to remove item');
      }

      toast.success('Item removed from cart');
      await refetchCart();
    } catch (err) {
      console.error(err);
      toast.error('Error removing item from cart');
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--light-bg)]">
        <PulseLoader />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center mt-8">{error}</p>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-screen bg-[var(--light-bg)]">
        <Image src="/empty-cart.jpg" alt="Empty Cart" width={200} height={200} className="mx-auto" />
        <p className="mt-4 text-lg text-[var(--txt-clr)] sec-ff">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-[var(--light-bg)] min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-[var(--txt-clr)] pry-ff">Your Cart</h1>

      <div className="space-y-6">
        {cartItems.map((item, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-white/5 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition"
          >
            {/* Image */}
            <div className="w-full sm:w-28 h-28 relative rounded-lg overflow-hidden shrink-0">
              <Image
                src={item.product.productImg?.[0] || '/fallback.jpg'}
                alt={item.product.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Info & Controls */}
            <div className="flex-1 w-full flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-semibold text-[var(--txt-clr)] pry-ff">{item.product.title}</h4>
                <p className="text-sm text-gray-400 mt-1 sec-ff">
                  ₦{item.price.toLocaleString()} × {item.quantity}
                </p>
                <p className="text-sm text-[var(--txt-clr)] mt-2 font-medium sec-ff">
                  Total: ₦{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <AddToCart
                  quantity={item.quantity}
                  onIncrement={() => handleQuantityChange(item.productId, 'increment')}
                  onDecrement={() => handleQuantityChange(item.productId, 'decrement')}
                />

                <RemoveCart onRemove={() => handleRemove(item.productId)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-end">
        <div className="w-full sm:w-[60%] md:w-[45%] lg:w-[35%] text-left space-y-4 bg-white/5 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-[var(--acc-clr)] sec-ff">Cart Summary</h2>
          <p className="text-lg font-semibold text-[var(--txt-clr)] sec-ff">
            Subtotal: ₦{subtotal.toLocaleString()}
          </p>
          <Link href="/order" className="w-full">
          <button className="w-full py-3 rounded-lg bg-[var(--acc-clr)] text-[var(--bg-clr)] sec-ff text-base font-semibold cursor-pointer hover:opacity-90 transition">
            Check out
          </button>
          </Link>
        </div>
      </div>

    </div>
  );
}