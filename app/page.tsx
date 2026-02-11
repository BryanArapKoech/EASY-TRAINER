
// app/page.tsx
"use client"

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Home() {
  const [search, setSearch] = useState('')
  const [unit, setUnit] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [selectedDoc, setSelectedDoc] = useState('Session Plan')
  const [isPaying, setIsPaying] = useState(false)

  const supabase = createClient()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!search.trim()) return
    setLoading(true)
    setHasSearched(true)
    
    const { data } = await supabase
      .from('units')
      .select('*, departments(name)')
      .or(`code.ilike.%${search}%,title.ilike.%${search}%`)
      .limit(1)

    if (data && data.length > 0) setUnit(data[0])
    else setUnit(null)
    setLoading(false)
  }

  const handlePayment = async () => {
    if (!phoneNumber) return alert("Please enter your M-Pesa number");
    setIsPaying(true);
    try {
      const res = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNumber,
          unitCode: unit.code,
          docType: selectedDoc,
        })
      });
      const data = await res.json();
      if (data.redirect_url) window.location.href = data.redirect_url;
      else alert(data.error || "Payment failed to initialize");
    } catch (err) {
      alert("System Connection Error");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 bg-slate-50/50">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-5xl font-extrabold tracking-tighter">The Unit <span className="text-blue-600">Decoder</span></h1>
        
        <form onSubmit={handleSearch} className="flex gap-2 p-2 border rounded-full bg-white shadow-lg">
          <input 
            className="flex-1 px-6 py-3 rounded-full outline-none" 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search code (e.g. ICT)..."
          />
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold">Decode</button>
        </form>

        {unit && (
          <div className="p-8 border rounded-3xl bg-white shadow-2xl text-left animate-in fade-in slide-in-from-bottom-4">
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900">{unit.title}</h3>
                <p className="text-slate-500 font-mono text-sm uppercase">{unit.code}</p>
            </div>

            <div className="space-y-4 mb-6">
                <label className="block text-sm font-bold text-slate-700">M-Pesa Phone Number</label>
                <input 
                    type="tel" 
                    placeholder="07XXXXXXXX" 
                    value={phoneNumber} 
                    onChange={e => setPhoneNumber(e.target.value)}
                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                />
            </div>
            
            <button 
              onClick={handlePayment} 
              disabled={isPaying}
              className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isPaying ? 'Connecting to M-Pesa...' : `Pay KES 25 & Generate Plan`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}