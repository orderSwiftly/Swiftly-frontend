'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PulseLoader from '@/components/pulse-loader';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Type definitions
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
  product: Product;
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

  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const fetchCart = async () => {
    try {
      const api_url = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No token found');
      }
      const res = await fetch(`${api_url}/api/v1/cart/get`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setCartItems(data.cart);
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

      if (!token) {
        throw new Error('No token found');
      }
      const res = await fetch(`${api_url}/api/v1/order/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ shippingAddress: address }),
      });

      const data = await res.json();
      if (!res.ok || data.status !== 'success') {
        throw new Error(data.message ?? 'Checkout failed');
      }

      toast.success('Order placed successfully');
      router.push('/order/success'); // ✅ Redirect to success page
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
      router.push('/order/failure'); // ✅ Redirect to failure page
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold text-[var(--acc-clr)] pry-ff">Checkout</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Cart Summary */}
        <div className="bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
          <h3 className="text-lg font-semibold pry-ff text-[var(--txt-clr)]">Cart Items</h3>

          {Object.values(
  cartItems.reduce((acc, item) => {
    const id = item.productId;
    if (!acc[id]) {
      acc[id] = { ...item }; // first time
    } else {
      acc[id].quantity += item.quantity; // merge quantity
    }
    return acc;
  }, {} as Record<string, CartItem>)
).map((item) => (
  <div
    key={item.productId}
    className="flex items-center justify-between gap-4 p-3 border border-white/10 rounded-lg bg-white/5"
  >
    <div className="w-14 h-14 relative shrink-0">
      <Image
        src={item.product.productImg?.[0] || '/fallback.jpg'}
        alt={item.product.title}
        width={56}
        height={56}
        className="rounded-md object-cover w-full h-full"
      />
    </div>

    <div className="flex-1">
      <p className="text-sm text-[var(--txt-clr)] font-medium pry-ff line-clamp-1">
        {item.product.title}
      </p>
      <p className="text-xs text-gray-400 mt-1 sec-ff">Qty: {item.quantity}</p>
    </div>

    <div className="text-sm font-semibold text-[var(--acc-clr)] sec-ff whitespace-nowrap">
      ₦{(item.price * item.quantity).toLocaleString()}
    </div>
  </div>
))}


          <div className="text-right font-bold text-[var(--acc-clr)] sec-ff">
            Subtotal: ₦{subtotal.toLocaleString()}
          </div>
        </div>

        {/* Shipping Form */}
        <div className="bg-white/5 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
          <h3 className="text-lg font-semibold mb-2 pry-ff text-[var(--txt-clr)]">Shipping Address</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sec-ff">
            {Object.entries(address).map(([key, val]) => (
              <input
                key={key}
                name={key}
                value={val}
                onChange={handleChange}
                placeholder={key.replace(/([A-Z])/g, ' $1')}
                className="p-3 rounded-md border border-white/20 focus:outline-none focus:border-[var(--acc-clr)] bg-transparent text-[var(--txt-clr)]"
              />
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full mt-4 p-3 rounded-lg bg-[var(--acc-clr)] text-[var(--bg-clr)] sec-ff text-base font-semibold cursor-pointer hover:opacity-90 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? <PulseLoader /> : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}