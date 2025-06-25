export default function DashboardHome() {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-[var(--light-bg)] p-4">
        <h1 className="text-2xl font-bold mb-4 text-[var(--acc-clr)] pry-ff">Welcome to your Dashboard</h1>
        <p className="text-[var(--txt-clr)] sec-ff">Here’s a quick overview of your activity.</p>
      </div>
    );
}