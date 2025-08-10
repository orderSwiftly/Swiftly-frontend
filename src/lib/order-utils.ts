import { Order } from '@/types/order';

export const checkCanShipOrder = (order: Order, currentUserId: string | null): boolean => {
  if (!currentUserId) return false;
  return order.items.some(item => item.productOwnerId === currentUserId);
};

export const filterOrdersByStatus = (
  status: string,
  orders: Order[],
  currentUserId?: string | null
): Order[] => {
  if (status === 'ready-to-ship' && currentUserId) {
    return orders.filter(order =>
      order.orderStatus === 'confirmed' && checkCanShipOrder(order, currentUserId)
    );
  }
  return orders.filter(order => order.orderStatus === status);
};

export const getEmptyMessage = (status: string) => {
  const messages: Record<string, string> = {
    pending: 'You have no pending orders.',
    cancelled: 'You have no cancelled orders.',
    confirmed: 'You have no confirmed orders.',
    'ready-to-ship': 'You have no orders ready to ship.',
    shipped: 'You have no shipped orders.',
    delivered: 'You have no delivered orders.',
    returned: 'You have no returned orders.'
  };
  return messages[status] || 'No orders found.';
};
