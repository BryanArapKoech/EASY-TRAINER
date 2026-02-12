"use client"
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LearningPlanForm({ onBack }: { onBack: () => void }) {
  const [loading, setLoading] = useState(false)
  const [phone, setPhone] = useState('')
  const [config, setConfig] = useState({ weeks: 12, sessions: 2, hours: 3 })
  const [files, setFiles] = useState<{ os: File | null; curriculum: File | null }>({ os: null, curriculum: null })
  
  const supabase = createClient()

  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!files.os || !files.curriculum || !phone) return alert("Please fill all fields and upload files.")

    setLoading(true)
    try {
      // 1. Upload Files to Supabase Storage
      const uploadFile = async (file: File, prefix: string) => {
        const name = `${prefix}-${Date.now()}.pdf`
        const { data, error } = await supabase.storage.from('trainer-uploads').upload(name, file)
        if (error) throw error
        return supabase.storage.from('trainer-uploads').getPublicUrl(name).data.publicUrl
      }

      const osUrl = await uploadFile(files.os, 'os')
      const curriculumUrl = await uploadFile(files.curriculum, 'curr')

      // 2. Initiate Payment with Metadata
      const res = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          unitCode: 'CUSTOM_UPLOAD',
          docType: 'LEARNING_PLAN',
          metadata: {
            ...config,
            osUrl,
            curriculumUrl
          }
        })
      })
      const data = await res.json()
      if (data.redirect_url) window.location.href = data.redirect_url
    } catch (err: any) {
      alert("Error: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleInitiate} className="w-full max-w-lg bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <button type="button" onClick={onBack} className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-blue-600">← Back</button>
        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">Learning Plan Engine</span>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Setup Configuration</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <label className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${files.os ? 'bg-green-50 border-green-200' : 'border-slate-100 hover:bg-slate-50'}`}>
                <span className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-tighter">{files.os ? 'OS Uploaded ✓' : 'Upload OS'}</span>
                <input type="file" className="hidden" accept=".pdf" onChange={e => setFiles({...files, os: e.target.files?.[0] || null})} />
              </label>
              <label className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${files.curriculum ? 'bg-green-50 border-green-200' : 'border-slate-100 hover:bg-slate-50'}`}>
                <span className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-tighter">{files.curriculum ? 'Curr Uploaded ✓' : 'Upload Curr'}</span>
                <input type="file" className="hidden" accept=".pdf" onChange={e => setFiles({...files, curriculum: e.target.files?.[0] || null})} />
              </label>
            </div>

            <div className="grid grid-cols-3 gap-3">
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Weeks</label>
                 <input type="number" value={config.weeks} onChange={e => setConfig({...config, weeks: parseInt(e.target.value)})} className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Sess/Wk</label>
                 <input type="number" value={config.sessions} onChange={e => setConfig({...config, sessions: parseInt(e.target.value)})} className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Hrs/Sess</label>
                 <input type="number" value={config.hours} onChange={e => setConfig({...config, hours: parseInt(e.target.value)})} className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" />
               </div>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">M-Pesa Number</label>
                <input type="tel" placeholder="07XXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold" />
            </div>
          </div>
        </div>

        <button disabled={loading} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-900 transition-all shadow-xl shadow-blue-100 disabled:opacity-50">
          {loading ? "Uploading..." : "Pay KES 25 & Generate"}
        </button>
      </div>
    </form>
  )
}