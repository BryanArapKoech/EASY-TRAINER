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
    if (!phoneNumber) return alert("Please enter your M-Pesa/Airtel number");
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
    <div className="flex flex-col items-center justify-center min-h-[85vh] p-6 bg-slate-50/50">
      
      {/* Search Header Section */}
      <div className="w-full max-w-2xl text-center space-y-8 mb-12">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900">
            Unit <span className="text-blue-600">Decoder</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-md mx-auto">
            Find your CDACC unit instantly and generate professional TVET documents.
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative flex items-center p-2 rounded-full bg-white shadow-2xl border border-slate-100 transition-all focus-within:ring-4 ring-blue-500/10">
          <input 
            className="flex-1 px-6 py-4 rounded-full outline-none text-lg font-medium" 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search code (e.g. ICT)..."
          />
          <button 
            disabled={loading}
            className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? '...' : 'Decode'}
          </button>
        </form>
      </div>

      {/* Modern Result Card */}
      {unit ? (
        <div className="w-full max-w-lg mx-auto p-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-500">
          <div className="bg-white rounded-[2.3rem] p-8 md:p-10">
            <div className="text-center space-y-2 mb-8">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Unit Found
              </span>
              <h3 className="text-3xl font-extrabold text-slate-900 leading-tight">
                {unit.title}
              </h3>
              <p className="font-mono text-sm text-slate-400">{unit.code}</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 ml-1">Choose Document</label>
                <div className="grid grid-cols-1 gap-2">
                  {['Session Plan', 'Learning Guide', 'Assessment Plan'].map((doc) => (
                    <label 
                      key={doc} 
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        selectedDoc === doc ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          name="docType" 
                          checked={selectedDoc === doc}
                          onChange={() => setSelectedDoc(doc)}
                          className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" 
                        />
                        <span className={`ml-3 font-bold ${selectedDoc === doc ? 'text-blue-900' : 'text-slate-600'}`}>{doc}</span>
                      </div>
                      <span className="text-sm font-black text-blue-600">KES 25</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 ml-1">Mobile Money Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold border-r pr-3">+254</span>
                  <input 
                    type="tel" 
                    placeholder="7XXXXXXXX" 
                    value={phoneNumber} 
                    onChange={e => setPhoneNumber(e.target.value)}
                    className="w-full pl-20 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700 transition-all" 
                  />
                </div>
                <p className="text-[10px] text-center text-slate-400 font-medium">
                  Supported: M-Pesa & Airtel Money Only
                </p>
              </div>
              
              <button 
                onClick={handlePayment} 
                disabled={isPaying}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-600 shadow-xl hover:shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
              >
                {isPaying ? 'Connecting...' : `Pay & Generate`}
              </button>
            </div>
          </div>
        </div>
      ) : hasSearched && !loading && (
        <div className="text-center text-slate-400 font-medium animate-in fade-in">
          Unit code not found. Try searching "ICT".
        </div>
      )}
    </div>
  )
}