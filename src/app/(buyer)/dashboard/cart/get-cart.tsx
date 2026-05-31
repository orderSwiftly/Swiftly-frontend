'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { Trash2, InfoIcon } from 'lucide-react';
import AddToCart from './add-to-cart';
import { useRouter } from 'next/navigation';
import PulseLoader from '@/components/pulse-loader';
import {
  fetchCart,
  updateCartItemQuantity,
  removeCartItem,
  getCartTotals,
  isCartEmpty,
  type GroupedCart,
  type CartItem,
} from '@/lib/cart';
import { calculateStoreTotals, type StoreTotals } from '@/lib/checkout';

interface StoreWithTotals {
  sellerId: string;
  sellerName: string;
  isOpen: boolean;
  items: CartItem[];
  subtotal: number;
  totals: StoreTotals;
}

export default function GetCartComp() {
  const [groupedCart, setGroupedCart] = useState<GroupedCart>({});
  const [storesWithTotals, setStoresWithTotals] = useState<StoreWithTotals[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const loadCart = async () => {
    try {
      setLoading(true);
      const cart = await fetchCart();
      setGroupedCart(cart);

      const stores = await Promise.all(
        Object.entries(cart).map(async ([sellerId, group]) => {
          const subtotal = group.items.reduce(
            (acc, item) => acc + item.quantity * item.price,
            0
          );
          // Use API for totals — default to standard (non-express) for cart preview
          const totals = await calculateStoreTotals(sellerId, false);
          const isOpen = group.items[0]?.product?.seller?.is_open ?? true;

          return {
            sellerId,
            sellerName: group.seller.name,
            isOpen,
            items: group.items,
            subtotal,
            totals,
          };
        })
      );

      setStoresWithTotals(stores);
      setError('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to load cart');
      setError('Failed to load cart.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleQuantityChange = async (
    productId: string,
    action: 'increment' | 'decrement'
  ) => {
    try {
      await updateCartItemQuantity(productId, action);
      toast.success('Cart updated');
      await loadCart();
    } catch (err) {
      console.error(err);
      toast.error('Error updating quantity');
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await removeCartItem(productId);
      toast.success('Item removed');
      await loadCart();
    } catch (err) {
      console.error(err);
      toast.error('Error removing item');
    }
  };

  const handleCheckoutStore = (storeId: string) => {
    sessionStorage.setItem('checkoutStoreId', storeId);
    router.push('/order');
  };

  const { itemCount } = getCartTotals(groupedCart);
  const empty = isCartEmpty(groupedCart);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <PulseLoader />
      </div>
    );

  if (error)
    return (
      <p className="text-red-500 text-center mt-8 pry-ff">{error}</p>
    );

  if (empty) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] pry-ff text-[var(--sec-clr)]">
        <Image
          src="/cart.png"
          alt="Empty Cart"
          width={150}
          height={150}
          className="mb-4"
        />
        Your cart is empty
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-8 bg-gray-50 min-h-screen pry-ff mb-20">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">
        Your Cart ({itemCount} items)
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 w-full space-y-8">
          {storesWithTotals.map((store) => (
            <div
              key={store.sellerId}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              {/* Store header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Store:
                    </span>
                    <span className="text-base font-bold text-gray-800">
                      {store.sellerName}
                    </span>
                    <span
                      className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                        store.isOpen
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {store.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Store Subtotal</p>
                    <p className="text-lg font-bold text-gray-800">
                      ₦{store.subtotal.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="p-4 space-y-4">
                {store.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl border border-gray-100 hover:shadow-sm transition"
                  >
                    <div className="w-24 h-24 sm:w-28 sm:h-28 relative rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      <Image
                        src={item.product?.productImg?.[0] || '/fallback.jpg'}
                        alt={item.product?.title ?? 'Product'}
                        fill
                        className="object-cover"
                      />
                    </div>

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
                          onIncrement={() =>
                            handleQuantityChange(item.productId, 'increment')
                          }
                          onDecrement={() =>
                            handleQuantityChange(item.productId, 'decrement')
                          }
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

              {/* Store Order Summary & Checkout Button */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-800">
                      ₦{store.totals.subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service fee</span>
                    <span className="font-medium text-gray-800">
                      ₦{store.totals.serviceFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery fee</span>
                    <span className="font-medium text-gray-800">
                      ₦{store.totals.deliveryFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
                    <span>Total for {store.sellerName}</span>
                    <span className="text-(--wave-clr)">
                      ₦{store.totals.total.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCheckoutStore(store.sellerId)}
                    disabled={!store.isOpen}
                    className={`w-full mt-4 py-3 rounded-xl font-semibold transition cursor-pointer text-sm ${
                      store.isOpen
                        ? 'bg-(--prof-clr) text-(--txt-clr) hover:bg-(--wave-clr)'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {store.isOpen
                      ? `Proceed to Checkout - ₦${store.totals.total.toLocaleString()}`
                      : 'Store Currently Closed'}
                  </button>

                  {!store.isOpen && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                      <InfoIcon size={16} className="text-yellow-500 flex-shrink-0" />
                      <p className="text-yellow-700 text-xs font-normal flex-1">
                        This store is currently closed and not accepting orders
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}