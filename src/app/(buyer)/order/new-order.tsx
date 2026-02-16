// src/app/(buyer)/order/new-order.tsx
'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PulseLoader from '@/components/pulse-loader';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import calculateTotals from '@/lib/cartTotals';
import { initPayment } from '@/lib/payment';

interface Product {
  title: string;
  productImg: string[];
  price: number;
  stock: number;
}

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  addedAt: string;
  product?: Product;
}

interface ShippingAddress {
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export default function NewOrder() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [address, setAddress] = useState<ShippingAddress>({
    addressLine1: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  // Subtotal from cart
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price ?? 0) * (item.quantity ?? 0),
    0
  );

  // Frontend preview totals
  const totals = calculateTotals(subtotal);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const fetchCart = async () => {
    try {
      const api_url = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token');

      const res = await fetch(`${api_url}/api/v1/cart/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok && data.status === 'success') {
        // Ensure each item has a 'product' object
        const cartWithProducts = (data.cart ?? []).map((item: any) => ({
          ...item,
          product: item.product || { title: 'Unknown', productImg: ['/fallback.jpg'], price: item.price ?? 0 },
        }));
        setCartItems(cartWithProducts);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load cart items');
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const api_url = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token');

      const res = await fetch(`${api_url}/api/v1/order/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ shippingAddress: address }),
      });

      const data = await res.json();
      if (!res.ok || data.status !== 'success') {
        throw new Error(data.message || 'Checkout failed');
      }

      // 🔑 Use data.data.orderId instead of data.order._id
      const orderId = data.data.orderId;
      const { authorization_url } = await initPayment(orderId);
      window.location.href = authorization_url;

    } catch (err) {
      console.error(err);
      toast.error('Checkout failed');
      router.push('/order/failure');
    } finally {
      setSubmitting(false);
    }
  };


  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold text-[var(--acc-clr)] pry-ff">
        Checkout
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* CART SUMMARY */}
        <div className="bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
          <h3 className="text-lg font-semibold pry-ff text-[var(--pry-clr)]">
            Cart Items
          </h3>

          {cartItems.map(item => (
            <div
              key={item.productId}
              className="flex items-center justify-between gap-4 p-3 border border-white/10 rounded-lg bg-white/5"
            >
              <div className="w-14 h-14 relative shrink-0">
                <Image
                  src={item.product?.productImg?.[0] || '/fallback.jpg'}
                  alt={item.product?.title || 'Product'}
                  width={56}
                  height={56}
                  className="rounded-md object-cover"
                />
              </div>

              <div className="flex-1">
                <p className="text-sm pry-ff line-clamp-1">
                  {item.product?.title || 'Unknown Product'}
                </p>
                <p className="text-xs text-gray-400 sec-ff">
                  Qty: {item.quantity}
                </p>
              </div>

              <div className="text-sm font-semibold text-[var(--acc-clr)] sec-ff">
                ₦{((item.price ?? 0) * (item.quantity ?? 0)).toLocaleString()}
              </div>
            </div>
          ))}

          {/* TOTALS */}
          <div className="pt-4 border-t border-white/10 space-y-2 sec-ff text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₦{totals.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Service fee</span>
              <span>₦{totals.serviceFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery fee</span>
              <span>₦{totals.deliveryFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-[var(--acc-clr)] pt-2 border-t border-white/10">
              <span>Total</span>
              <span>₦{totals.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* SHIPPING */}
        <div className="bg-white/5 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
          <h3 className="text-lg font-semibold pry-ff text-[var(--pry-clr)]">
            Shipping Address
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sec-ff">
            {Object.entries(address).map(([key, val]) => (
              <input
                key={key}
                name={key}
                value={val}
                onChange={handleChange}
                placeholder={key.replace(/([A-Z])/g, ' $1')}
                className="p-3 rounded-md border border-[var(--prof-clr)] bg-transparent focus:outline-none focus:border-[var(--acc-clr)]"
              />
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full mt-4 p-3 rounded-lg bg-[var(--acc-clr)] text-[var(--bg-clr)] sec-ff font-semibold hover:opacity-90 transition disabled:opacity-50 cursor-pointer flex items-center justify-center"
          >
            {submitting ? <PulseLoader /> : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}