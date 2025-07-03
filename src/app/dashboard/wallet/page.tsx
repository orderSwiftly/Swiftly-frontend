import CreateSubaccount from './create-subaccount';

export default function WalletPage() {
  return (
    <main className="min-h-screen w-full bg-[var(--light-bg)] dark:bg-[var(--dark-bg)]
    flex items-center justify-center p-6">
      <CreateSubaccount />
    </main>
  );
}