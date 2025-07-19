import NotificationsList from './get-notifications';

export default function NotificationsPage() {
  return (
    <main className="min-h-screen w-full bg-[var(--light-bg)] pt-[70px] md:pl-72 flex justify-between px-2 space-y-6">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-4 text-[var(--acc-clr)] pry-ff">Notifications</h1>
        <NotificationsList />
      </div>
    </main>
  );
}