"use client"
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SessionPlanForm({ onBack }: { onBack: () => void }) {
  const [loading, setLoading] = useState(false)
  const [phone, setPhone] = useState('')
  const [config, setConfig] = useState({ week: 1, sessionNo: 1, lastSessionContext: '' })
  const [lpFile, setLpFile] = useState<File | null>(null)
  
  const supabase = createClient()

  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!lpFile || !phone) return alert("Please upload your Learning Plan.")

    setLoading(true)
    try {
      const name = `lp-${Date.now()}.pdf`
      const { data: uploadData, error } = await supabase.storage.from('trainer-uploads').upload(name, lpFile)
      if (error) throw error
      const lpUrl = supabase.storage.from('trainer-uploads').getPublicUrl(name).data.publicUrl

      const res = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          unitCode: 'SESSION_GEN',
          docType: 'SESSION_PLAN',
          metadata: { ...config, lpUrl }
        })
      })
      const data = await res.json()
      if (data.redirect_url) window.location.href = data.redirect_url
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleInitiate} className="w-full max-w-lg bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <button type="button" onClick={onBack} className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-blue-600">← Back</button>
        <span className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-tighter">Session Engine</span>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Generate Session Plan</h2>
        
        <label className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-3xl cursor-pointer transition-all ${lpFile ? 'bg-green-50 border-green-200' : 'border-slate-100 hover:bg-slate-50'}`}>
           <span className="text-sm font-bold text-slate-400">{lpFile ? 'Plan Ready ✓' : 'Upload Learning Plan (PDF)'}</span>
           <input type="file" className="hidden" accept=".pdf" onChange={e => setLpFile(e.target.files?.[0] || null)} />
        </label>

        <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="Week No." className="p-4 bg-slate-50 rounded-2xl outline-none font-bold" onChange={e => setConfig({...config, week: parseInt(e.target.value)})} />
            <input type="number" placeholder="Session No." className="p-4 bg-slate-50 rounded-2xl outline-none font-bold" onChange={e => setConfig({...config, sessionNo: parseInt(e.target.value)})} />
        </div>

        <input type="text" placeholder="Previous Session Context" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" onChange={e => setConfig({...config, lastSessionContext: e.target.value})} />

        <input type="tel" placeholder="07XXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-4 bg-slate-900 text-white rounded-2xl outline-none font-bold placeholder:text-slate-500" />

        <button disabled={loading} className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-600 transition-all shadow-xl shadow-green-100 disabled:opacity-50">
          {loading ? "Processing..." : "Pay KES 25 & Generate"}
        </button>
      </div>
    </form>
  )
}