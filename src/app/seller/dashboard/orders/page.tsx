import MyOrderPage from "./my-orders/page"

export default function OrdersPage() {
    return (
        <main>
            <h1 className="text-2xl font-bold text-center mt-8">
                Seller Orders Dashboard
            </h1>
            <MyOrderPage />
        </main>
    )
}