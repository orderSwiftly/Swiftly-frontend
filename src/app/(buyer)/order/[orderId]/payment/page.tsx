'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { initPayment } from '@/lib/payment'
import toast from 'react-hot-toast'
import PulseLoader from '@/components/pulse-loader'
import { CreditCard, ShieldCheck } from 'lucide-react'

export default function HandleTransaction() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const params = useParams()
  const orderId = params.orderId as string

  // Guard clause with redirect if no orderId
  useEffect(() => {
    if (!orderId) {
      toast.error('Invalid order ID')
      router.push('/orders')
    }
  }, [orderId, router])

  const handlePayment = async () => {
    setLoading(true)
    try {
      const { authorization_url } = await initPayment(orderId)
      window.location.href = authorization_url
    } catch (error: unknown) {
      console.error('Payment error:', error)
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to initialize payment')
      } else {
        toast.error('Failed to initialize payment')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-6 bg-[var(--light-bg)] min-h-screen flex flex-col items-center justify-center text-center">
      <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-10 max-w-md w-full shadow-xl space-y-6">
        <div className="flex items-center justify-center text-[var(--acc-clr)]">
          <CreditCard className="w-10 h-10" />
        </div>

        <h1 className="text-2xl font-semibold text-[var(--acc-clr)] pry-ff">Complete Your Payment</h1>

        <p className="text-sm text-gray-400 sec-ff">
          You are one step away from confirming your order. Click the button below to continue to Paystack.
        </p>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-[var(--acc-clr)] transition text-[var(--bg-clr)] sec-ff flex items-center justify-center gap-2 px-4 py-2 font-semibold cursor-pointer rounded-lg disabled:opacity-50"
        >
          {loading ? (
            <PulseLoader />
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              Pay Now
            </>
          )}
        </button>
      </div>
    </main>
  )
}
