'use client';

import { useEffect, useState } from 'react';
import PulseLoader from '@/components/pulse-loader';
import ToggleNav from '@/components/toggle-nav';
import OrderCard from '../components/order-card';
import { Order } from '@/types/order';
import { fetchOrders } from '@/lib/orders-api';
import { checkCanShipOrder, filterOrdersByStatus, getEmptyMessage } from '@/lib/order-utils';
import { ShipOrders } from '@/lib/ship';

export default function GetOrders() {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [shippingLoading, setShippingLoading] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>(''); // Always a string

  // Get userId from localStorage or token payload
  useEffect(() => {
    let userId = localStorage.getItem('userId') || '';
    if (!userId) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userId = payload.userId || payload.id || payload.sub || '';
        } catch {}
      }
    }
    setCurrentUserId(userId);
  }, []);

  // Fetch orders when currentUserId is available
  useEffect(() => {
    if (!currentUserId) return;

    const loadOrders = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const orders = await fetchOrders(token);
      const withOwnership = orders.map(o => ({
        ...o,
        canShip: checkCanShipOrder(o, currentUserId)
      }));

      setAllOrders(withOwnership);
      setFilteredOrders(filterOrdersByStatus(activeTab, withOwnership, currentUserId));
      setLoading(false);
    };

    loadOrders();
  }, [currentUserId]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setFilteredOrders(filterOrdersByStatus(tab, allOrders, currentUserId));
  };

  const handleShipOrder = async (orderId: string) => {
    try {
      setShippingLoading(orderId);
      const res = await ShipOrders(orderId);
      if (res.status === 'success') {
        const updatedOrders = allOrders.map(o =>
          o._id === orderId ? { ...o, orderStatus: 'shipped' } : o
        );
        setAllOrders(updatedOrders);
        setFilteredOrders(filterOrdersByStatus(activeTab, updatedOrders, currentUserId));
      }
    } finally {
      setShippingLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--light-bg)]">
        <PulseLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--light-bg)] px-4 max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-[var(--acc-clr)] pry-ff">My Orders</h1>
      <ToggleNav activeTab={activeTab} onTabChange={handleTabChange} />
      {filteredOrders.length === 0 ? (
        <p className="text-lg text-[var(--txt-clr)] sec-ff">{getEmptyMessage(activeTab)}</p>
      ) : (
        filteredOrders.map(order => (
          <OrderCard
            key={order._id}
            order={order}
            currentUserId={currentUserId}
            shippingLoading={shippingLoading}
            handleShipOrder={handleShipOrder}
          />
        ))
      )}
    </div>
  );
}
