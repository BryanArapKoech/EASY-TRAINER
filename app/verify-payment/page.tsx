"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function VerifyContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderTrackingId = searchParams.get('OrderTrackingId')
  
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
  
  useEffect(() => {
    let checkCount = 0;
    const interval = setInterval(async () => {
      if (!orderTrackingId || checkCount > 20) { 
        clearInterval(interval);
        if (status === 'loading') setStatus('failed');
        return;
      }

      try {
        const res = await fetch(`/api/payments/status?orderTrackingId=${orderTrackingId}`);
        const data = await res.json();
        
        if (data.isPaid) {
          setStatus('success');
          clearInterval(interval);
        }
      } catch (e) {
        console.error("Status check failed");
      }
      checkCount++;
    }, 3000);

    return () => clearInterval(interval);
  }, [orderTrackingId]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[85vh] p-6 overflow-hidden bg-slate-50/30">
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white p-10 md:p-12 rounded-[3rem] shadow-2xl text-center">
        {status === 'loading' ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="relative w-24 h-24 mx-auto">
               <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Verifying...</h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                Confirming your transaction with <span className="text-blue-600 font-bold">Pesapal</span>. 
                This usually takes a few seconds.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                    Do not refresh or close this page
                </p>
            </div>
          </div>
        ) : status === 'success' ? (
          <div className="space-y-8 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-100">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div className="space-y-2">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Success!</h2>
              <p className="text-slate-500 font-medium">
                Payment of <span className="text-slate-900 font-bold">KES 25</span> confirmed.
              </p>
            </div>

            <button 
              onClick={() => router.push('/')} 
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98]"
            >
              Start AI Generation →
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
               </svg>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">Timed Out</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                We couldn't confirm the payment in time. If you were charged, please contact Tangent Code Studios with your reference.
              </p>
            </div>

            <button 
              onClick={() => router.push('/')} 
              className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>

      {/* Centered Footnote */}
      <div className="mt-12 text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Payments Secured by Pesapal
        </p>
      </div>
    </div>
  )
}

export default function VerifyPaymentPage() {
  return (
    <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-pulse font-black text-slate-200 text-4xl italic">Easy Trainer</div>
        </div>
    }>
      <VerifyContent />
    </Suspense>
  )
}