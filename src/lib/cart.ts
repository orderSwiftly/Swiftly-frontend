// lib/cart.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Product {
  title: string;
  productImg: string[];
  price: number;
  stock: number;
}

export interface CartItem {
  productId: string;
  sellerId: string;
  quantity: number;
  price: number;
  addedAt: string;
  product: Product;
}

export interface SellerGroup {
  seller: { _id: string; name: string };
  items: CartItem[];
}

export interface GroupedCart {
  [sellerId: string]: SellerGroup;
}

export interface CartResponse {
  status: string;
  message: string;
  cart: GroupedCart | [];
}

// Fetch cart items (already grouped by seller)
export async function fetchCart(): Promise<GroupedCart> {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const res = await fetch(`${API_URL}/api/v1/cart/get`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const data: CartResponse = await res.json();

    if (!res.ok || data.status !== 'success') {
      throw new Error(data.message || 'Failed to fetch cart');
    }

    const cart = data.cart ?? {};
    
    // If cart is empty array, return empty object
    if (Array.isArray(cart)) {
      return {};
    }

    return cart as GroupedCart;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
}

// Update cart item quantity
export async function updateCartItemQuantity(
  productId: string, 
  action: 'increment' | 'decrement'
): Promise<void> {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const res = await fetch(`${API_URL}/api/v1/cart/update/${productId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action }),
    });

    const data = await res.json();

    if (!res.ok || data.status !== 'success') {
      throw new Error(data.message || 'Failed to update cart');
    }
  } catch (error) {
    console.error('Error updating cart:', error);
    throw error;
  }
}

// Remove item from cart
export async function removeCartItem(productId: string): Promise<void> {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const res = await fetch(`${API_URL}/api/v1/cart/remove/${productId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (!res.ok || data.status !== 'success') {
      throw new Error(data.message || 'Failed to remove item');
    }
  } catch (error) {
    console.error('Error removing cart item:', error);
    throw error;
  }
}

// Clear entire cart
export async function clearCart(): Promise<void> {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const res = await fetch(`${API_URL}/api/v1/cart/clear`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (!res.ok || data.status !== 'success') {
      throw new Error(data.message || 'Failed to clear cart');
    }
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
}

// Get cart totals
export function getCartTotals(groupedCart: GroupedCart) {
  const allItems = Object.values(groupedCart).flatMap(g => g.items);
  const subtotal = allItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const itemCount = allItems.reduce((acc, item) => acc + item.quantity, 0);
  const storeCount = Object.keys(groupedCart).length;

  return {
    subtotal,
    itemCount,
    storeCount,
    allItems,
  };
}

// Check if cart is empty
export function isCartEmpty(groupedCart: GroupedCart): boolean {
  return Object.keys(groupedCart).length === 0;
}