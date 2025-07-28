export default function DashboardPage() {

  return (
    <main className="min-h-screen w-full bg-[var(--txt-clr)] flex flex-col">
      {/* <Header /> */}
      <div className="flex flex-col min-h-screen items-center justify-center bg-[var(--txt-clr)] p-4 pt-[70px]">
        <h1 className="text-2xl font-bold mb-4 pry-ff">
          Welcome to your Dashboard
        </h1>
        <p className="text-[var(--light-bg)] sec-ff">
          Here’s a quick overview of your activity.
        </p>
      </div>
    </main>
  );
}
