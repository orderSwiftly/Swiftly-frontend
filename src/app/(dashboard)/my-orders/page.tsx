import GetOrders from '@/app/(dashboard)/my-orders/get-orders/page';

export default function MyOrdersPage() {
  return (
    <div className="min-h-screen w-full bg-[var(--light-bg)]">
      <main className="w-full pt-[70px] flex justify-center px-2">
        <div className="w-full max-w-4xl">
          <GetOrders />
        </div>
      </main>
    </div>
  );
}
