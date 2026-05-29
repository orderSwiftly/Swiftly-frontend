'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PulseLoader from '@/components/pulse-loader';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Info, XCircle, Store, Package, Lock } from 'lucide-react';
import { checkoutStore, fetchSavedAddresses, saveNewAddress, calculateStoreTotals, type SavedAddress } from '@/lib/checkout';
import { fetchCart, type CartItem } from '@/lib/cart';

interface StoreCheckoutData {
  storeId: string;
  storeName: string;
  isOpen: boolean;
  items: CartItem[];
  subtotal: number;
  totals: {
    subtotal: number;
    serviceFee: number;
    deliveryFee: number;
    total: number;
  };
}

// Error response type from backend
interface ApiErrorResponse {
  title?: string;
  status?: number;
  detail?: string;
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

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const storeId = sessionStorage.getItem('checkoutStoreId');
        if (!storeId) {
          toast.error('No store selected for checkout');
          router.push('/dashboard/cart');
          return;
        }

        const cart = await fetchCart();
        const storeEntry = Object.entries(cart).find(([sellerId]) => sellerId === storeId);

        if (!storeEntry) {
          toast.error('Store not found in cart');
          router.push('/dashboard/cart');
          return;
        }

        const [sellerId, group] = storeEntry;
        const subtotal = group.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
        const totals = await calculateStoreTotals(subtotal);
        
        // Extract is_open from the first item's product.seller
        // Since all items in a store should have the same seller status
        const isOpen = group.items[0]?.product?.seller?.is_open ?? true;

        setStoreData({
          storeId: sellerId,
          storeName: group.seller.name,
          isOpen: isOpen, // Use the extracted value
          items: group.items,
          subtotal,
          totals,
        });

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

      const updatedAddresses = await fetchSavedAddresses();
      setSavedAddresses(updatedAddresses);

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

  // Parse error from backend response
  const parseCheckoutError = (error: unknown): { title: string; message: string } => {
    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as { response?: { data?: ApiErrorResponse } };
      if (apiError.response?.data?.title && apiError.response?.data?.detail) {
        return {
          title: apiError.response.data.title,
          message: apiError.response.data.detail,
        };
      }
    }
    
    return {
      title: 'Checkout Failed',
      message: error instanceof Error ? error.message : 'Something went wrong',
    };
  };

  const handleSubmit = async () => {
    if (!storeData) {
      toast.error('No store data available');
      return;
    }

    if (!storeData.isOpen) {
      toast.error(`${storeData.storeName} is currently closed and not accepting orders`, {
        duration: 5000,
        icon: <Lock size={18} />,
      });
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

      const { authorization_url } = await checkoutStore(storeData.storeId, addressPayload);
      sessionStorage.removeItem('checkoutStoreId');
      window.location.href = authorization_url;
    } catch (err: unknown) {
      console.error('Checkout error:', err);
      
      const { title, message } = parseCheckoutError(err);
      
      if (title === 'Store Closed') {
        toast.error(message, {
          duration: 6000,
          icon: <Store size={18} />,
        });
        setTimeout(() => {
          router.push('/dashboard/cart');
        }, 2000);
      } else if (title === 'Insufficient Stock') {
        toast.error(message, {
          duration: 6000,
          icon: <Package size={18} />,
        });
        setTimeout(() => {
          router.push('/dashboard/cart');
        }, 2000);
      } else {
        toast.error(message);
        router.push('/order/failure');
      }
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
      <div className="max-w-5xl mx-auto p-6 text-center sec-ff">
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
      <h2 className="text-2xl font-bold text-[var(--prof-clr)] pry-ff">
        Checkout - {storeData.storeName}
      </h2>

      {/* Store Closed Warning Banner */}
      {!storeData.isOpen && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
          <AlertTriangle size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-yellow-700 font-semibold pry-ff text-sm">
              Store Currently Closed
            </p>
            <p className="text-yellow-600 text-xs mt-1">
              {storeData.storeName} is not accepting orders right now. Please check back later or shop from other stores.
            </p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 sec-ff">
        {/* CART SUMMARY */}
        <div className="bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold pry-ff text-[var(--pry-clr)]">Cart Items</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              storeData.isOpen 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {storeData.isOpen ? 'Open' : 'Closed'}
            </span>
          </div>

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
              <div className="text-sm font-semibold text-[var(--prof-clr)] sec-ff">
                ₦{((item.price ?? 0) * (item.quantity ?? 0)).toLocaleString()}
              </div>
            </div>
          ))}

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
            <div className="flex justify-between font-bold text-[var(--prof-clr)] pt-2 border-t border-white/10">
              <span>Total</span>
              <span>₦{storeData.totals.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* SHIPPING ADDRESS SECTION */}
        <div className="bg-white/5 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
          <h3 className="text-lg font-semibold pry-ff text-[var(--pry-clr)]">Delivery Address</h3>

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
                disabled={!storeData.isOpen}
                className="w-full p-3 rounded-md border border-[var(--prof-clr)] bg-transparent focus:outline-none focus:border-[var(--acc-clr)] sec-ff disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <input
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Room / Office"
                disabled={!storeData.isOpen}
                className="w-full p-3 rounded-md border border-[var(--prof-clr)] bg-transparent focus:outline-none focus:border-[var(--acc-clr)] sec-ff disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSaveNewAddress}
                disabled={savingAddress || !storeData.isOpen}
                className="w-full p-2 rounded-lg border border-[var(--prof-clr)] text-[var(--txt-clr)] sec-ff text-sm font-medium hover:bg-[var(--prof-clr)]/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingAddress ? 'Saving...' : 'Save address for future use'}
              </button>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting || !storeData.isOpen}
            className={`w-full mt-4 p-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 sec-ff ${
              storeData.isOpen
                ? 'bg-[var(--prof-clr)] text-[var(--txt-clr)] hover:opacity-90 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {submitting ? (
              <PulseLoader />
            ) : storeData.isOpen ? (
              'Place Order'
            ) : (
              <>
                <XCircle size={18} />
                Store Closed
              </>
            )}
          </button>

          {/* Info note about store closure */}
          {!storeData.isOpen && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
              <Info size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
              <p className="text-yellow-700 text-xs flex-1">
                This store is currently closed. You cannot place orders until the store reopens.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}