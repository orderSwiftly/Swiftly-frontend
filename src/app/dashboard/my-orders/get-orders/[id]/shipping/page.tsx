import GetConfirmedOrders from "./confirmed-orders";

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-[var(--light-bg)] px-4 max-w-5xl mx-auto space-y-8 pt-[20px] md:pl-48">
        <GetConfirmedOrders />
    </main>
  );
}