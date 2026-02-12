// app/trainerai/page.tsx
"use client"

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TRAINERAI() {
  const [search, setSearch] = useState('')
  const [unit, setUnit] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const supabase = createClient()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data } = await supabase.from('units').select('*, departments(name)').ilike('code', `%${search}%`).limit(1)
    if (data && data.length > 0) setUnit(data[0])
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center py-20 px-4 min-h-screen bg-slate-50/50">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-black tracking-tighter text-slate-900">
            TVET <span className="text-blue-600">AI</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-md mx-auto">
            Input a unit code below to decode standards and generate session plans instantly.
          </p>
        </div>

        {/* Search Bar & Result Card (Keep your existing Unit Decoder UI here) */}
        <form onSubmit={handleSearch} className="relative flex items-center p-2 rounded-full bg-white shadow-2xl border border-slate-100">
          <input 
            className="flex-1 px-6 py-4 rounded-full outline-none text-lg" 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search code (e.g. ICT)..."
          />
          <button className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold">Decode</button>
        </form>

        {unit && (
            <div className="w-full mt-10 p-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-500">
                <div className="bg-white rounded-[2.3rem] p-10 text-left">
                    <h3 className="text-3xl font-black text-slate-900 mb-2">{unit.title}</h3>
                    <p className="font-mono text-slate-400 mb-8 tracking-widest">{unit.unit_code || unit.code}</p>
                    
                    <div className="space-y-4 pt-6 border-t border-slate-100">
                        <label className="text-sm font-bold text-slate-700">Mobile Money Number</label>
                        <input 
                            type="tel" 
                            placeholder="7XXXXXXXX" 
                            value={phoneNumber} 
                            onChange={e => setPhoneNumber(e.target.value)}
                            className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" 
                        />
                        <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg">
                            Pay KES 25 & Generate
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  )
}