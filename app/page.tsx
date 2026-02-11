"use client" // Required for the search bar logic

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Home() {
  const [search, setSearch] = useState('')
  const [unit, setUnit] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  
  const supabase = createClient()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!search.trim()) return
    
    setLoading(true)
    setHasSearched(true)
    
    // Search for the unit by code
    const { data, error } = await supabase
      .from('units')
      .select('*, departments(name)')
      .ilike('code', `%${search}%`)
      .limit(1)
      .maybeSingle()

    if (data) {
      setUnit(data)
    } else {
      setUnit(null)
    }
    
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 bg-slate-50/50">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-slate-900">
            The Unit <span className="text-blue-600">Decoder</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            The lead magnet for Kenyan trainers. Enter a CDACC code to instantly see unit details.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="relative flex items-center p-2 rounded-full bg-white shadow-xl border border-slate-200 focus-within:ring-2 ring-blue-500/20 transition-all">
          <input
            type="text"
            placeholder="Search code (e.g. ICT or CU/01)"
            className="flex-1 px-6 py-4 rounded-full outline-none text-lg bg-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button 
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition-all disabled:opacity-50 active:scale-95 flex items-center"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Decoding...
              </span>
            ) : 'Decode Now'}
          </button>
        </form>

        {/* Results Area */}
        <div className="min-h-[250px] mt-12">
          {unit ? (
            <div className="p-8 border border-blue-100 rounded-3xl bg-white shadow-2xl text-left animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="flex justify-between items-start mb-6">
                <div className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase">
                  Level {unit.level}
                </div>
                <span className="text-slate-400 font-mono text-sm tracking-tight">{unit.code}</span>
              </div>
              
              <h3 className="text-3xl font-bold text-slate-900 mb-3">{unit.title}</h3>
              
              <div className="flex items-center gap-2 text-slate-600 mb-8">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-sm font-medium">{unit.departments?.name}</span>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl active:scale-[0.98]">
                  Generate Session Plan for this Unit →
                </button>
              </div>
            </div>
          ) : hasSearched && !loading ? (
            <div className="p-12 border-2 border-dashed border-slate-200 rounded-3xl bg-white/50 text-slate-400 font-medium">
              Unit code not found. Try searching "ICT".
            </div>
          ) : (
             <div className="flex flex-col items-center text-slate-300">
                <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p>Search results will appear here</p>
             </div>
          )}
        </div>
      </div>
    </div>
  )

  const handlePayment = async () => {
  setLoading(true);
  try {
    const res = await fetch('/api/payments/initiate', {
      method: 'POST',
      body: JSON.stringify({
        phone: phoneNumber,
        unitCode: unit.code,
        docType: selectedDoc,
      })
    });
    const data = await res.json();
    if (data.redirect_url) {
      window.location.href = data.redirect_url; // Send user to Pesapal
    }
  } catch (err) {
    alert("Payment failed to initialize");
  } finally {
    setLoading(false);
  }
};
}