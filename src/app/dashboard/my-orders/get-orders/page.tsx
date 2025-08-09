'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import PulseLoader from '@/components/pulse-loader';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Truck } from 'lucide-react';
import ToggleNav from '@/components/toggle-nav';
import { ShipOrders } from '@/lib/ship';
interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  productImg?: string[];
}

interface ShippingAddress {
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalPrice: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  shippingAddress: ShippingAddress;
}

export default function GetOrders() {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [shippingLoading, setShippingLoading] = useState<string | null>(null);
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const api_url = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${api_url}/api/v1/order/get-orders`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.status === 'success') {
        const fetchedOrders = Array.isArray(data.data?.orders) ? data.data.orders : [];
        setAllOrders(fetchedOrders);
        // Initialize with pending orders
        filterOrdersByStatus('pending', fetchedOrders);
      } else {
        setAllOrders([]);
        setFilteredOrders([]);
        console.warn('Orders not found or failed response:', data.message || 'Unknown error');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setAllOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const filterOrdersByStatus = (status: string, orders: Order[] = allOrders) => {
    const filtered = orders.filter(order => order.orderStatus === status);
    setFilteredOrders(filtered);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    filterOrdersByStatus(tab);
  };

  const handleShipOrder = async (orderId: string) => {
    try {
      setShippingLoading(orderId);
      
      const response = await ShipOrders(orderId);
      
      if (response.status === 'success') {
        // Update the order status in local state
        const updatedAllOrders = allOrders.map(order => 
          order._id === orderId 
            ? { ...order, orderStatus: 'shipped' }
            : order
        );
        setAllOrders(updatedAllOrders);
        
        // Re-filter orders for current tab
        filterOrdersByStatus(activeTab, updatedAllOrders);
        
        // Optional: Show success message
        alert('Order shipped successfully!');
      }
    } catch (error: unknown) {
      console.error('Failed to ship order:', error);
      // Handle different error types
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { status?: number } }).response === 'object'
      ) {
        const response = (error as { response?: { status?: number } }).response;
        if (response?.status === 403) {
          alert('You are not authorized to ship this order.');
        } else if (response?.status === 404) {
          alert('Confirmed order not found.');
        } else {
          alert('Failed to ship order. Please try again.');
        }
      } else {
        alert('Failed to ship order. Please try again.');
      }
    } finally {
      setShippingLoading(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--light-bg)]">
        <PulseLoader />
      </div>
    );
  }

  const getEmptyMessage = () => {
    const statusMessages = {
      pending: 'You have no pending orders.',
      cancelled: 'You have no cancelled orders.',
      confirmed: 'You have no confirmed orders.',
      shipped: 'You have no shipped orders.',
      delivered: 'You have no delivered orders.',
      returned: 'You have no returned orders.'
    };
    return statusMessages[activeTab as keyof typeof statusMessages] || 'No orders found.';
  };

  return (
    <div className="min-h-screen bg-[var(--light-bg)] px-4 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold text-[var(--acc-clr)] pry-ff">My Orders</h1>
      </div>

      {/* Toggle Navigation */}
      <ToggleNav activeTab={activeTab} onTabChange={handleTabChange} />

      {filteredOrders.length === 0 ? (
        <div className="px-6 py-10 text-left">
          <p className="text-lg text-[var(--txt-clr)] sec-ff">
            {getEmptyMessage()}
          </p>
        </div>
      ) : (
        filteredOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-5"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-2">
              <p className="text-sm text-gray-400 sec-ff">
                <span className="font-medium text-white">Order ID:</span> {order._id}
              </p>
              <p className="text-sm font-semibold text-[var(--acc-clr)] capitalize sec-ff">
                {order.orderStatus}
              </p>
            </div>

            {/* Items */}
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 border border-white/10 bg-white/10 rounded-md p-3"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 relative overflow-hidden rounded-md bg-gray-100">
                    <Image
                      src={item.productImg?.[0] || '/fallback.jpg'}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[var(--txt-clr)] pry-ff line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-400 sec-ff mt-1">
                      ₦{item.price.toLocaleString()} × {item.quantity}
                    </p>
                  </div>

                  <p className="text-sm font-bold text-[var(--txt-clr)] sec-ff whitespace-nowrap">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Shipping Address */}
            <div className="flex items-start justify-between p-2">
              <p className='text-gray-400 sec-ff text-sm'>
                Shipping to: {order.shippingAddress.addressLine1}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.state}
              </p>

              <p className="text-sm font-bold text-[var(--acc-clr)] sec-ff">
                Total: ₦{order.totalPrice.toLocaleString()}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center pt-2">
              <div className="flex items-center gap-4 justify-between w-full">
                <Link
                  className='text-[var(--acc-clr)] sec-ff flex items-center gap-1 group'
                  href={`/dashboard/my-orders/get-orders/${order._id}`}>
                  <span className="hover:underline">View Order</span>
                  <ArrowRight size={16} className='transition-transform duration-150 group-hover:translate-x-1' />
                </Link>
                
                {/* Ship Order Button - Only show for confirmed orders */}
                {order.orderStatus === 'confirmed' && (
                  <button
                    onClick={() => handleShipOrder(order._id)}
                    disabled={shippingLoading === order._id}
                    className='text-[var(--bg-clr)] cursor-pointer sec-ff flex items-center gap-1 group bg-[var(--acc-clr)] px-4 py-2 rounded-lg border border-[var(--acc-clr)] hover:bg-[var(--acc-clr)]/90 transition disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {shippingLoading === order._id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Shipping...</span>
                      </>
                    ) : (
                      <>
                        <Truck size={16} />
                        <span>Ship Order</span>
                      </>
                    )}
                  </button>
                )}
                
                {/* View Shipping - Only show for shipped/delivered orders */}
                {(order.orderStatus === 'shipped' || order.orderStatus === 'delivered') && (
                  <Link
                    className='text-[var(--acc-clr)] sec-ff flex items-center gap-1 group bg-white/10 px-4 py-2 rounded-lg border border-white/20 hover:bg-white/20 transition'
                    href={`/dashboard/my-orders/get-orders/${order._id}/shipping`}>
                    <span>View Shipping</span>
                    <ArrowRight size={16} className='transition-transform duration-150 group-hover:translate-x-1' />
                  </Link>
                )}
              </div>
              {order.paymentStatus !== 'paid' && (
                <div>
                  <button
                    onClick={() => router.push(`/order/${order._id}/payment`)}
                    className="bg-[var(--acc-clr)] text-[var(--acc-clr)] font-semibold capitalize px-5 py-2 rounded-lg hover:opacity-90 sec-ff cursor-pointer transition"
                  >
                    Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      ))}
    </div>
  );
}