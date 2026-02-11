"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function VerifyContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderTrackingId = searchParams.get('OrderTrackingId')
  
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    let checkCount = 0;
    const interval = setInterval(async () => {
      if (!orderTrackingId || checkCount > 20) { // Stop after 1 minute
        clearInterval(interval);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/payments/status?orderTrackingId=${orderTrackingId}`);
        const data = await res.json();
        
        if (data.isPaid) {
          setSuccess(true);
          setLoading(false);
          clearInterval(interval);
        }
      } catch (e) {
        console.error("Error checking status");
      }
      checkCount++;
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [orderTrackingId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      {loading ? (
        <div className="space-y-6">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-solid mx-auto"></div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Confirming Payment...</h2>
            <p className="text-slate-500 max-w-sm">
              We are verifying your M-Pesa/Airtel Money transaction. Please don't close this page.
            </p>
          </div>
        </div>
      ) : success ? (
        <div className="space-y-6 animate-in zoom-in duration-300">
          <div className="bg-green-100 text-green-600 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Payment Received!</h2>
            <p className="text-slate-500">Your CDACC Session Plan is being prepared.</p>
          </div>
          <button 
            onClick={() => router.push('/dashboard/generator')}
            className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-700"
          >
            Start AI Generation →
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-red-100 text-red-600 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </div>
          <h2 className="text-2xl font-bold">Verification Timed Out</h2>
          <p className="text-slate-500">If you have paid but see this, please contact support with your M-Pesa code.</p>
          <button onClick={() => router.push('/')} className="text-blue-600 font-bold underline">Go Back Home</button>
        </div>
      )}
    </div>
  )
}

export default function VerifyPaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  )
}