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

interface SavedAddress {
  _id: string;
  building: string;
  room: string;
}

export default function NewOrder() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [building, setBuilding] = useState('');
  const [room, setRoom] = useState('');
  const [useManual, setUseManual] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const api_url = process.env.NEXT_PUBLIC_API_URL;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price ?? 0) * (item.quantity ?? 0),
    0
  );
  const totals = calculateTotals(subtotal);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token');
      const res = await fetch(`${api_url}/api/v1/cart/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        const cart = data.cart ?? {};
        const flatItems: CartItem[] = Array.isArray(cart)
  ? cart
  : (Object.values(cart) as { seller: unknown; items: CartItem[] }[]).flatMap(g => g.items);
        const cartWithProducts = flatItems.map((item) => ({
          ...item,
          product: item.product || {
            title: 'Unknown',
            productImg: ['/fallback.jpg'],
            price: item.price ?? 0,
            stock: 0,
          },
        }));
        setCartItems(cartWithProducts);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load cart items');
    }
  };

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${api_url}/api/v1/user/address`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setSavedAddresses(data.data.address ?? []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNewAddress = async () => {
    if (!building.trim() || !room.trim()) {
      toast.error('Please fill in both building and room fields');
      return;
    }

    setSavingAddress(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${api_url}/api/v1/user/add-address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ building, room }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message ?? 'Failed to save address');
        return;
      }

      toast.success('Address saved!');

      // Re-fetch to get the real server _id, then auto-select the new one
      const refreshRes = await fetch(`${api_url}/api/v1/user/address`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const refreshData = await refreshRes.json();
      if (refreshRes.ok && refreshData.status === 'success') {
        const updated: SavedAddress[] = refreshData.data.address ?? [];
        setSavedAddresses(updated);
        const newAddr = updated[updated.length - 1];
        if (newAddr) setSelectedAddressId(newAddr._id);
      }

      setBuilding('');
      setRoom('');
      setUseManual(false);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token');

      let body: Record<string, string> = {};

      if (!useManual && selectedAddressId) {
        // Using a saved (or just-saved) address
        body = { addressId: selectedAddressId };
      } else if (useManual && building.trim() && room.trim()) {
        // Using the new address directly without saving
        body = { building, room };
      } else {
        toast.error('Please select or enter a delivery address');
        setSubmitting(false);
        return;
      }

      const res = await fetch(`${api_url}/api/v1/order/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok || data.status !== 'success') {
        throw new Error(data.message || 'Checkout failed');
      }

      const orderId = data.data.orderId;
      const { authorization_url } = await initPayment(orderId);
      window.location.href = authorization_url;
    } catch (err: unknown) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Checkout failed');
      router.push('/order/failure');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchAddresses();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold text-[var(--acc-clr)] pry-ff">Checkout</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* CART SUMMARY */}
        <div className="bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
          <h3 className="text-lg font-semibold pry-ff text-[var(--pry-clr)]">Cart Items</h3>

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
                <p className="text-sm pry-ff line-clamp-1">{item.product?.title || 'Unknown Product'}</p>
                <p className="text-xs text-gray-400 sec-ff">Qty: {item.quantity}</p>
              </div>
              <div className="text-sm font-semibold text-[var(--acc-clr)] sec-ff">
                ₦{((item.price ?? 0) * (item.quantity ?? 0)).toLocaleString()}
              </div>
            </div>
          ))}

          {/* TOTALS */}
          <div className="pt-4 border-t border-white/10 space-y-2 sec-ff text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>₦{totals.subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Service fee</span><span>₦{totals.serviceFee.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Delivery fee</span><span>₦{totals.deliveryFee.toLocaleString()}</span></div>
            <div className="flex justify-between font-bold text-[var(--acc-clr)] pt-2 border-t border-white/10">
              <span>Total</span><span>₦{totals.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* SHIPPING */}
        <div className="bg-white/5 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
          <h3 className="text-lg font-semibold pry-ff text-[var(--pry-clr)]">Delivery Address</h3>

          {/* Saved addresses */}
          {savedAddresses.length > 0 && !useManual && (
            <div className="space-y-2">
              <p className="text-sm text-gray-400 sec-ff">Select a saved address</p>
              {savedAddresses.map((addr) => (
                <div
                  key={addr._id}
                  onClick={() => setSelectedAddressId(addr._id)}
                  className={`p-3 rounded-lg border cursor-pointer transition sec-ff text-sm ${selectedAddressId === addr._id
                      ? 'border-[var(--acc-clr)] bg-[var(--acc-clr)]/10'
                      : 'border-gray-300 dark:border-gray-600'
                    }`}
                >
                  <p className="font-medium">{addr.building}</p>
                  <p className="text-gray-400">{addr.room}</p>
                </div>
              ))}
              <button
                onClick={() => { setUseManual(true); setSelectedAddressId(''); }}
                className="text-sm text-[var(--acc-clr)] underline mt-1 cursor-pointer pry-ff"
              >
                + Add a new address
              </button>
            </div>
          )}

          {/* New address form */}
          {(useManual || savedAddresses.length === 0) && (
            <div className="space-y-3">
              {savedAddresses.length > 0 && (
                <button
                  onClick={() => { setUseManual(false); setBuilding(''); setRoom(''); }}
                  className="text-sm text-[var(--acc-clr)] underline cursor-pointer pry-ff"
                >
                  ← Use saved address
                </button>
              )}
              <input
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                placeholder="Building / Hall Name"
                className="w-full p-3 rounded-md border border-[var(--prof-clr)] bg-transparent focus:outline-none focus:border-[var(--acc-clr)] sec-ff"
              />
              <input
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Room / Office"
                className="w-full p-3 rounded-md border border-[var(--prof-clr)] bg-transparent focus:outline-none focus:border-[var(--acc-clr)] sec-ff"
              />

              {/* Optional: save for future use */}
              <button
                onClick={handleSaveNewAddress}
                disabled={savingAddress}
                className="w-full p-2 rounded-lg border border-[var(--acc-clr)] text-[var(--acc-clr)] sec-ff text-sm font-medium hover:bg-[var(--acc-clr)]/10 transition disabled:opacity-50 cursor-pointer"
              >
                {savingAddress ? 'Saving...' : 'Save address for future use'}
              </button>
            </div>
          )}

          {/* Place Order — works with a saved address OR a new one typed in */}
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