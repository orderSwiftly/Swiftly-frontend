import NotificationsList from './get-notifications';

export default function NotificationsPage() {
  return (
    <main className="min-h-screen w-full bg-[var(--light-bg)] p-4 pt-[70px] flex justify-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-4 text-[var(--acc-clr)] pry-ff">Notifications</h1>
        <NotificationsList />
      </div>
    </main>
  );
}