'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AlertTriangle, XCircle, Store, Package, Lock, Zap, Clock, ChevronDown, Loader2, ArrowLeft, ShoppingCart } from 'lucide-react';
import {
  checkoutStore,
  fetchSavedAddresses,
  saveNewAddress,
  calculateStoreTotals,
  type SavedAddress,
  type StoreTotals,
} from '@/lib/checkout';
import { fetchCart, type CartItem } from '@/lib/cart';

type DeliveryType = 'standard' | 'express';

interface StoreCheckoutData {
  storeId: string;
  storeName: string;
  isOpen: boolean;
  items: CartItem[];
  subtotal: number;
}

interface ApiErrorResponse {
  title?: string;
  status?: number;
  detail?: string;
}

export default function NewOrder() {
  const [storeData, setStoreData] = useState<StoreCheckoutData | null>(null);
  const [totals, setTotals] = useState<StoreTotals | null>(null);
  const [totalsLoading, setTotalsLoading] = useState(false);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('standard');
  const [deliveryDropdownOpen, setDeliveryDropdownOpen] = useState(false);
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
    if (!storeData) return;

    const fetchTotals = async () => {
      setTotalsLoading(true);
      try {
        const result = await calculateStoreTotals(
          storeData.storeId,
          deliveryType === 'express'
        );
        setTotals(result);
      } catch (err) {
        console.error(err);
        toast.error('Failed to calculate totals');
      } finally {
        setTotalsLoading(false);
      }
    };

    fetchTotals();
  }, [storeData, deliveryType]);

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

        const raw = localStorage.getItem('selected-campus');
        if (!raw) throw new Error('No campus selected');
        const { institutionEnum } = JSON.parse(raw);

        const cart = await fetchCart(institutionEnum);
        const storeEntry = Object.entries(cart).find(
          ([sellerId]) => sellerId === storeId
        );

        if (!storeEntry) {
          toast.error('Store not found in cart');
          router.push('/dashboard/cart');
          return;
        }

        const [sellerId, group] = storeEntry;
        const subtotal = group.items.reduce(
          (acc, item) => acc + item.quantity * item.price,
          0
        );
        const isOpen = group.items[0]?.product?.seller?.is_open ?? true;

        setStoreData({
          storeId: sellerId,
          storeName: group.seller.name,
          isOpen,
          items: group.items,
          subtotal,
        });

        const addresses = await fetchSavedAddresses(institutionEnum);
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
      const raw = localStorage.getItem('selected-campus');
      if (!raw) throw new Error('No campus selected');
      const { institutionEnum } = JSON.parse(raw);

      await saveNewAddress(building, room, institutionEnum);
      toast.success('Address saved!');

      const updatedAddresses = await fetchSavedAddresses(institutionEnum);
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
      let addressPayload: {
        addressId?: string;
        building?: string;
        room?: string;
        isExpressDelivery?: boolean;
      } = {
        isExpressDelivery: deliveryType === 'express',
      };

      if (!useManual && selectedAddressId) {
        addressPayload = { ...addressPayload, addressId: selectedAddressId };
      } else if (useManual && building.trim() && room.trim()) {
        addressPayload = { ...addressPayload, building, room };
      } else {
        toast.error('Please select or enter a delivery address');
        setSubmitting(false);
        return;
      }

      const { authorization_url } = await checkoutStore(
        storeData.storeId,
        addressPayload
      );
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

  const handleGoBack = () => {
    router.push('/dashboard/cart');
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 flex justify-center items-center min-h-[400px]">
        <Loader2 className="animate-spin text-[var(--prof-clr)]" size={32} />
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
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Back Button */}
      <button
        onClick={handleGoBack}
        className="flex items-center gap-2 text-[var(--sec-clr)] hover:text-[var(--prof-clr)] transition-colors sec-ff text-sm"
      >
        <ArrowLeft size={18} />
        Back to Cart
      </button>

      {/* Header with Store Name and Cart Icon */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--prof-clr)] pry-ff">
            Checkout
          </h2>
          <p className="text-sm text-[var(--sec-clr)] sec-ff mt-1">
            {storeData.storeName}
          </p>
        </div>
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors sec-ff text-sm"
        >
          <ShoppingCart size={16} />
          Cart
        </button>
      </div>

      {/* Store Closed Warning Banner */}
      {!storeData.isOpen && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3 pry-ff">
          <AlertTriangle size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-yellow-700 font-semibold pry-ff text-sm">
              Store Currently Closed
            </p>
            <p className="text-yellow-600 text-xs mt-1">
              {storeData.storeName} is not accepting orders right now. Please
              check back later or shop from other stores.
            </p>
          </div>
        </div>
      )}

      {/* Delivery Type Selector */}
      <div className="relative">
        <p className="text-sm font-semibold text-gray-500 pry-ff mb-2 uppercase tracking-wide">
          Delivery Type
        </p>
        <button
          onClick={() => setDeliveryDropdownOpen((prev) => !prev)}
          disabled={!storeData.isOpen}
          className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition pry-ff text-sm font-medium ${
            storeData.isOpen
              ? 'border-gray-200 bg-white hover:border-[var(--prof-clr)] cursor-pointer'
              : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center gap-3">
            {deliveryType === 'express' ? (
              <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <Zap size={16} className="text-orange-500" />
              </span>
            ) : (
              <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Clock size={16} className="text-blue-500" />
              </span>
            )}
            <div className="text-left">
              <p className="font-semibold text-gray-800">
                {deliveryType === 'express' ? 'Express Delivery' : 'Standard Delivery'}
              </p>
              <p className="text-xs text-gray-400 font-normal">
                {deliveryType === 'express'
                  ? 'Instant - arrives as fast as possible'
                  : 'Scheduled - delivered at the next available slot'}
              </p>
            </div>
          </div>
          <ChevronDown
            size={18}
            className={`text-gray-400 transition-transform flex-shrink-0 ${
              deliveryDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {deliveryDropdownOpen && (
          <div className="absolute z-10 mt-1 w-full bg-[var(--txt-clr)] border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            <button
              onClick={() => {
                setDeliveryType('standard');
                setDeliveryDropdownOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition hover:bg-gray-50 cursor-pointer pry-ff ${
                deliveryType === 'standard' ? 'bg-blue-50' : ''
              }`}
            >
              <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Clock size={16} className="text-blue-500" />
              </span>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Standard Delivery</p>
                <p className="text-xs text-gray-400 font-normal">
                  Scheduled - delivered at the next available slot
                </p>
              </div>
              {deliveryType === 'standard' && (
                <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
              )}
            </button>

            <button
              onClick={() => {
                setDeliveryType('express');
                setDeliveryDropdownOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition hover:bg-gray-50 cursor-pointer pry-ff border-t border-gray-100 ${
                deliveryType === 'express' ? 'bg-orange-50' : ''
              }`}
            >
              <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <Zap size={16} className="text-orange-500" />
              </span>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Express Delivery</p>
                <p className="text-xs text-gray-400 font-normal">
                  Instant - arrives as fast as possible
                </p>
              </div>
              {deliveryType === 'express' && (
                <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
              )}
            </button>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6 sec-ff">
        {/* CART SUMMARY */}
        <div className="bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold pry-ff text-[var(--pry-clr)]">
              Cart Items
            </h3>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                storeData.isOpen
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
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
                <p className="text-sm pry-ff line-clamp-1">
                  {item.product?.title || 'Unknown Product'}
                </p>
                <p className="text-xs text-gray-400 sec-ff">
                  Qty: {item.quantity}
                </p>
              </div>
              <div className="text-sm font-semibold text-[var(--prof-clr)] sec-ff">
                ₦{((item.price ?? 0) * (item.quantity ?? 0)).toLocaleString()}
              </div>
            </div>
          ))}

          {/* Totals */}
          <div className="pt-4 border-t border-white/10 space-y-2 sec-ff text-sm">
            {totalsLoading ? (
              <div className="flex justify-center py-3">
                <Loader2 className="animate-spin text-[var(--prof-clr)]" />
              </div>
            ) : totals ? (
              <>
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
                <div className="flex justify-between font-bold text-[var(--prof-clr)] pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span>₦{totals.total.toLocaleString()}</span>
                </div>
              </>
            ) : null}
          </div>
        </div>

        {/* SHIPPING ADDRESS SECTION */}
        <div className="bg-white/5 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
          <h3 className="text-lg font-semibold pry-ff text-[var(--pry-clr)]">
            Delivery Address
          </h3>

          {savedAddresses.length > 0 && !useManual && (
            <div className="space-y-2">
              <p className="text-sm text-gray-400 sec-ff">
                Select a saved address
              </p>
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
                className="w-full p-2 rounded-lg bg-(--prof-clr) border border-[var(--prof-clr)] text-[var(--txt-clr)] sec-ff text-sm font-medium hover:bg-[var(--wave-clr)] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingAddress ? 'Saving...' : 'Save address for future use'}
              </button>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting || !storeData.isOpen || totalsLoading || !totals}
            className={`w-full mt-4 p-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 sec-ff ${
              storeData.isOpen && !totalsLoading && totals
                ? 'bg-[var(--prof-clr)] text-[var(--txt-clr)] hover:bg-[var(--wave-clr)] cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {submitting ? (
              <Loader2 className="animate-spin text-[var(--txt-clr)]" />
            ) : storeData.isOpen ? (
              totals
                ? `Place Order - ₦${totals.total.toLocaleString()}`
                : 'Loading...'
            ) : (
              <>
                <XCircle size={18} />
                Store Closed
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}