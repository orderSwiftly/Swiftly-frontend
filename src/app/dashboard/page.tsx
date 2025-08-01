export default function DashboardPage() {
  return (
    <main className="min-h-screen w-full bg-[var(--light-bg)] flex flex-col">
  <div className="flex flex-col items-center justify-center p-4 pt-[70px]">
    <h1 className="text-2xl font-bold mb-4 pry-ff text-[var(--txt-clr)]">
      Welcome to your Dashboard
    </h1>
    <p className="text-[var(--txt-clr)] sec-ff">
      Here’s a quick overview of your activity.
    </p>
  </div>
</main>

  );
}