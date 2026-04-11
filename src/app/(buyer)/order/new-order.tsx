'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PulseLoader from '@/components/pulse-loader';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { initPayment } from '@/lib/payment';
import { checkoutStore, fetchSavedAddresses, saveNewAddress, calculateStoreTotals, type SavedAddress } from '@/lib/checkout';
import { fetchCart, type CartItem } from '@/lib/cart';

interface StoreCheckoutData {
  storeId: string;
  storeName: string;
  items: CartItem[];
  subtotal: number;
  totals: {
    subtotal: number;
    serviceFee: number;
    deliveryFee: number;
    total: number;
  };
}

export default function NewOrder() {
  const [storeData, setStoreData] = useState<StoreCheckoutData | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [building, setBuilding] = useState('');
  const [room, setRoom] = useState('');
  const [useManual, setUseManual] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load cart and addresses for the specific store
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Get the store ID from sessionStorage
        const storeId = sessionStorage.getItem('checkoutStoreId');
        if (!storeId) {
          toast.error('No store selected for checkout');
          router.push('/dashboard/cart');
          return;
        }
        
        // Fetch cart (already grouped by seller)
        const cart = await fetchCart();
        
        // Find the specific store
        const storeEntry = Object.entries(cart).find(([sellerId]) => sellerId === storeId);
        
        if (!storeEntry) {
          toast.error('Store not found in cart');
          router.push('/dashboard/cart');
          return;
        }
        
        const [sellerId, group] = storeEntry;
        const subtotal = group.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
        const totals = await calculateStoreTotals(subtotal);
        
        setStoreData({
          storeId: sellerId,
          storeName: group.seller.name,
          items: group.items,
          subtotal,
          totals,
        });
        
        // Fetch saved addresses
        const addresses = await fetchSavedAddresses();
        setSavedAddresses(addresses);
        
      } catch (err) {
        console.error(err);
        toast.error(err instanceof Error ? err.message : 'Failed to load data');
        router.push('/dashboard/cart');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [router]);

  const handleSaveNewAddress = async () => {
    if (!building.trim() || !room.trim()) {
      toast.error('Please fill in both building and room fields');
      return;
    }

    setSavingAddress(true);
    try {
      await saveNewAddress(building, room);
      toast.success('Address saved!');

      // Refresh addresses
      const updatedAddresses = await fetchSavedAddresses();
      setSavedAddresses(updatedAddresses);
      
      // Auto-select the newly added address (last one)
      const newAddr = updatedAddresses[updatedAddresses.length - 1];
      if (newAddr) setSelectedAddressId(newAddr._id);

      setBuilding('');
      setRoom('');
      setUseManual(false);
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleSubmit = async () => {
    if (!storeData) {
      toast.error('No store data available');
      return;
    }

    setSubmitting(true);
    try {
      let addressPayload: { addressId?: string; building?: string; room?: string } = {};

      if (!useManual && selectedAddressId) {
        addressPayload = { addressId: selectedAddressId };
      } else if (useManual && building.trim() && room.trim()) {
        addressPayload = { building, room };
      } else {
        toast.error('Please select or enter a delivery address');
        setSubmitting(false);
        return;
      }

      // Checkout the selected store
      const result = await checkoutStore(storeData.storeId, addressPayload);
      
      // Clear the selected store from sessionStorage
      sessionStorage.removeItem('checkoutStoreId');
      
      const orderId = result.data.orderId;
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

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 flex justify-center items-center min-h-[400px]">
        <PulseLoader />
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center">
        <p className="text-gray-400 sec-ff">No store selected for checkout</p>
        <button
          onClick={() => router.push('/dashboard/cart')}
          className="mt-4 px-6 py-2 bg-[var(--acc-clr)] text-[var(--bg-clr)] rounded-lg sec-ff"
        >
          Go to Cart
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold text-[var(--acc-clr)] pry-ff">
        Checkout - {storeData.storeName}
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* CART SUMMARY */}
        <div className="bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
          <h3 className="text-lg font-semibold pry-ff text-[var(--pry-clr)]">
            Cart Items
          </h3>

          {storeData.items.map((item) => (
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
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₦{storeData.totals.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Service fee</span>
              <span>₦{storeData.totals.serviceFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery fee</span>
              <span>₦{storeData.totals.deliveryFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-[var(--acc-clr)] pt-2 border-t border-white/10">
              <span>Total</span>
              <span>₦{storeData.totals.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* SHIPPING ADDRESS SECTION */}
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
                  className={`p-3 rounded-lg border cursor-pointer transition sec-ff text-sm ${
                    selectedAddressId === addr._id
                      ? 'border-[var(--acc-clr)] bg-[var(--acc-clr)]/10'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <p className="font-medium">{addr.building}</p>
                  <p className="text-gray-400">{addr.room}</p>
                </div>
              ))}
              <button
                onClick={() => {
                  setUseManual(true);
                  setSelectedAddressId('');
                }}
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
                  onClick={() => {
                    setUseManual(false);
                    setBuilding('');
                    setRoom('');
                  }}
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

              <button
                onClick={handleSaveNewAddress}
                disabled={savingAddress}
                className="w-full p-2 rounded-lg border border-[var(--acc-clr)] text-[var(--acc-clr)] sec-ff text-sm font-medium hover:bg-[var(--acc-clr)]/10 transition disabled:opacity-50 cursor-pointer"
              >
                {savingAddress ? 'Saving...' : 'Save address for future use'}
              </button>
            </div>
          )}

          {/* Place Order Button */}
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