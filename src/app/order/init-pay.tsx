import { useState } from "react";
// import { useRouter } from "next/navigation";
import { initPayment } from "@/lib/payment";
import toast from "react-hot-toast";
import PulseLoader from "@/components/pulse-loader";

export default function HandleTransaction() {
    const [loading, setLoading] = useState(false);
    // const router = useRouter();

    const handlePayment = async () => {
        setLoading(true);

        try {
            const orderId = 'your-order-id'; // Replace with actual order ID
            const { authorization_url } = await initPayment(orderId)
            
            // Redirect to the payment URL
            window.location.href = authorization_url
        } catch (error: unknown) {
            console.error('Payment error:', error);
            if (error instanceof Error) {
                toast.error(error.message || 'Failed to initialize payment');
            } else {
                toast.error('Failed to initialize payment');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
    <main className="p-6 bg-[var(--light-bg)] min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl mb-4">Complete Your Payment</h1>
      <button
        onClick={handlePayment}
        disabled={loading}
        className="bg-[var(--acc-clr)] text-[var(--bg-clr)] sec-ff flex items-center justify-center px-4 py-2 rounded"
      >
        {loading ? <PulseLoader /> : 'Pay Now'}
      </button>
    </main>
  )
}