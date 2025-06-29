'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import PulseLoader from '@/components/pulse-loader';
import AddToCart from './add-to-cart';

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

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/cart/get`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();

        if (!res.ok || data.status !== 'success') {
          throw new Error(data?.message ?? 'Failed to load cart');
        }

        setCartItems(data.cart ?? []);
      } catch (err) {
        console.error(err);
        toast.error('Error loading cart');
        setError('Failed to load cart.');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/cart/update/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ quantity: newQuantity }),
      });

      const data = await res.json();

      if (!res.ok || data.status !== 'success') {
        throw new Error(data?.message || 'Failed to update cart');
      }

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      console.error(err);
      toast.error('Error updating quantity');
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
            className="flex flex-col sm:flex-row items-start gap-4 bg-white/5 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="w-full sm:w-28 h-28 relative rounded-lg overflow-hidden">
              <Image
                src={item.product.productImg?.[0] || '/fallback.jpg'}
                alt={item.product.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 text-left">
              <h4 className="text-lg font-semibold text-[var(--txt-clr)] pry-ff">{item.product.title}</h4>
              <p className="text-sm text-gray-400 mt-1 sec-ff">
                ₦{item.price.toLocaleString()} × {item.quantity}
              </p>
              <p className="text-sm text-[var(--txt-clr)] mt-2 font-medium sec-ff">
                Total: ₦{(item.price * item.quantity).toLocaleString()}
              </p>

              <AddToCart
                quantity={item.quantity}
                onIncrement={() => handleQuantityChange(item.productId, item.quantity + 1)}
                onDecrement={() => handleQuantityChange(item.productId, Math.max(1, item.quantity - 1))}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-right text-lg font-bold text-[var(--acc-clr)] sec-ff">
        Subtotal: ₦{subtotal.toLocaleString()}
      </div>
    </div>
  );
}