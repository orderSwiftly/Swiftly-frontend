import GetCartComp from "./get-cart"

export default function CartPage() {
  return (
    <main className="min-h-screen w-full bg-[var(--light-bg)] flex flex-col">
      <div className="flex-1 pt-24 px-4 sm:px-6">
        <GetCartComp />
      </div>
    </main>
  )
}