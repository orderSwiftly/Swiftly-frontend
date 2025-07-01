import GetOrders from '@/app/dashboard/my-orders/get-orders/page';

export default function MyOrdersPage() {
  return (
    <main className="min-h-screen w-full bg-[var(--light-bg)] dark:bg-[var(--dark-bg)] pt-[70px] flex justify-center px-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-4 text-[var(--acc-clr)] pry-ff">My Orders</h1>
        <GetOrders />
      </div>
    </main>
  );
}