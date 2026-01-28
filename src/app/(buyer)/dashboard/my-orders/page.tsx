"use client";

import { useState } from "react";
import OrdersHeader from "./components/orders-header";
import CartOrderItem, { CartItem } from "./components/cart-order-item";
import ActiveOrderItemCard, {
  ActiveOrderItem,
} from "./components/active-order-item";
import PassiveOrderItemCard, {
  PassiveOrderItem,
} from "./components/passive-order-item";
import EmptyOrdersState from "./components/empty-orders-state";
import DeleteOrderModal from "./components/delete-order-modal";
import PaymentMethodModal from "./components/payment-method-modal";
import PaymentSuccessModal from "./components/payment-success-modal";
import PaymentErrorModal from "./components/payment-error-modal";

export default function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "active" | "passive">(
    "orders",
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      _id: "1",
      productId: "p1",
      title: "Jollof spaghetti (1 Egg & 2 Sausages)",
      quantity: 3,
      price: 7000,
      productImg: ["/placeholder-food.jpg"],
    },
    {
      _id: "2",
      productId: "p2",
      title: "Jollof spaghetti (1 Egg & 2 Sausages)",
      quantity: 3,
      price: 7000,
      productImg: ["/placeholder-food.jpg"],
    },
    {
      _id: "3",
      productId: "p3",
      title: "Jollof spaghetti (1 Egg & 2 Sausages)",
      quantity: 3,
      price: 7000,
      productImg: ["/placeholder-food.jpg"],
    },
  ]);

  const [activeOrders] = useState<ActiveOrderItem[]>([
    {
      _id: "a1",
      productId: "p1",
      title: "Jollof spaghetti (1 Egg & 2 Sausages)",
      quantity: 3,
      price: 7000,
      productImg: ["/placeholder-food.jpg"],
      estimatedTime: "30 MINS",
      paymentMethod: "Cash",
      status: "Vendor Has accepted your order",
      riderName: "John Doe",
      riderPhone: "08123456890",
    },
    {
      _id: "a2",
      productId: "p2",
      title: "Jollof spaghetti (1 Egg & 2 Sausages)",
      quantity: 3,
      price: 7000,
      productImg: ["/placeholder-food.jpg"],
      estimatedTime: "30 MINS",
      paymentMethod: "Transfer",
      status: "Rider is waiting to pick up your order",
    },
    {
      _id: "a3",
      productId: "p3",
      title: "Jollof spaghetti (1 Egg & 2 Sausages)",
      quantity: 3,
      price: 7000,
      productImg: ["/placeholder-food.jpg"],
      estimatedTime: "30 MINS",
      paymentMethod: "Card",
      status: "Your order is being Prepared",
    },
  ]);

  const [passiveOrders] = useState<PassiveOrderItem[]>([
    {
      _id: "p1",
      productId: "p1",
      title: "Jollof spaghetti (1 Egg & 2 Sausages)",
      quantity: 3,
      price: 7000,
      productImg: ["/placeholder-food.jpg"],
      date: "23/06/26",
      paymentMethod: "Transfer",
      status: "completed",
    },
    {
      _id: "p2",
      productId: "p2",
      title: "Jollof spaghetti (1 Egg & 2 Sausages)",
      quantity: 3,
      price: 7000,
      productImg: ["/placeholder-food.jpg"],
      date: "23/06/26",
      paymentMethod: "Cash",
      status: "canceled",
    },
    {
      _id: "p3",
      productId: "p3",
      title: "Jollof spaghetti (1 Egg & 2 Sausages)",
      quantity: 3,
      price: 7000,
      productImg: ["/placeholder-food.jpg"],
      date: "23/06/26",
      paymentMethod: "Card",
      status: "completed",
    },
  ]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingHandling = 19.99;
  const tax = 4.0;
  const total = subtotal + shippingHandling + tax;

  const handleDeleteItem = (itemId: string) => {
    const item = cartItems.find((i) => i._id === itemId);
    setSelectedItem(itemId);
    setShowDeleteModal(true);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    setCartItems(
      cartItems.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const confirmDelete = () => {
    setCartItems(cartItems.filter((item) => item._id !== selectedItem));
    setShowDeleteModal(false);
    setSelectedItem("");
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = (method: "card" | "transfer" | "cash") => {
    setShowPaymentModal(false);
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      const success = Math.random() > 0.3;
      if (success) {
        setShowSuccessModal(true);
      } else {
        setShowErrorModal(true);
      }
    }, 1500);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setCartItems([]);
    setActiveTab("active");
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 pry-ff">
      <OrdersHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="pb-32">
        {activeTab === "orders" && (
          <>
            {cartItems.length === 0 ? (
              <EmptyOrdersState />
            ) : (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white">
                  {cartItems.map((item) => (
                    <CartOrderItem
                      key={item._id}
                      item={item}
                      onDelete={handleDeleteItem}
                      onQuantityChange={handleQuantityChange}
                    />
                  ))}
                </div>

                <div className="bg-white mt-4 p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">
                      ₦{subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping & Handling</span>
                    <span className="text-gray-900">
                      ₦{shippingHandling.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">₦{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-200">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">₦{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-4">
                  <button
                    disabled={isProcessingPayment || cartItems.length === 0}
                    className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessingPayment ? "Processing..." : "Checkout"}
                    {!isProcessingPayment && (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7 10L13 10M13 10L10 7M13 10L10 13"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "active" && (
          <div className="max-w-2xl mx-auto p-4 space-y-4">
            {activeOrders.length === 0 ? (
              <EmptyOrdersState />
            ) : (
              activeOrders.map((order) => (
                <ActiveOrderItemCard
                  key={order._id}
                  order={order}
                  onClick={() => {
                    console.log("Order clicked:", order._id);
                  }}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "passive" && (
          <div className="max-w-2xl mx-auto p-4 space-y-4">
            {passiveOrders.length === 0 ? (
              <EmptyOrdersState />
            ) : (
              passiveOrders.map((order) => (
                <PassiveOrderItemCard
                  key={order._id}
                  order={order}
                  onClick={() => {
                    console.log("Passive order clicked:", order._id);
                  }}
                />
              ))
            )}
          </div>
        )}
      </main>

      {showDeleteModal && (
        <DeleteOrderModal
          itemName="Jollof spaghetti ( 1 Egg & 2 Sausages )"
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
        />
      )}

      {showPaymentModal && (
        <PaymentMethodModal
          onClose={() => setShowPaymentModal(false)}
          onConfirm={handlePaymentConfirm}
        />
      )}

      {showSuccessModal && <PaymentSuccessModal onClose={handleSuccessClose} />}

      {showErrorModal && (
        <PaymentErrorModal onClose={() => setShowErrorModal(false)} />
      )}
    </div>
  );
}
