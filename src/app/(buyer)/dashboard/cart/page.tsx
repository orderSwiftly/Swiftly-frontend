import type { Metadata } from "next";
import GetCartComp from "./get-cart";

export const metadata: Metadata = {
    title: 'Your Cart',
};

export default function CartPage() {
  return (
    <main className="min-h-screen w-full flex flex-col">
      <div className="flex-1 pt-10 px-4 sm:px-6">
        <GetCartComp />
      </div>
    </main>
  )
}