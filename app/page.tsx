"use client"

import { useState } from 'react'
import { FileText, Calendar, Zap } from "lucide-react"
import LearningPlanForm from '@/components/trainerai/LearningPlanForm'
import SessionPlanForm from '@/components/trainerai/SessionPlanForm'

export default function Home() {
  const [activeForm, setActiveForm] = useState<'learning' | 'session' | null>(null)

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] p-6 bg-slate-50/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-3xl -z-10" />

      {!activeForm ? (
        <div className="max-w-2xl w-full text-center space-y-10 animate-in fade-in zoom-in duration-500">
          <div className="space-y-4">
            
            {/* Reduced Font Sizes */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Get professional learning <br/> and session plans.
            </h1>
            <p className="text-sm md:text-base text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
              Get CDACC-compliant documents in seconds for your specific unit.
            </p>
          </div>

          {/* Centered CTA Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
            <button 
              onClick={() => setActiveForm('learning')}
              className="group p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all text-center space-y-4"
            >
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-black text-lg text-slate-900 uppercase tracking-tight">Get Learning Plan</h3>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Create your training roadmap for a specific unit</p>
            </button>

            <button 
              onClick={() => setActiveForm('session')}
              className="group p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all text-center space-y-4"
            >
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-black text-lg text-slate-900 uppercase tracking-tight">Get Session Plan</h3>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Create your training roadmap for training sessions</p>
            </button>
          </div>
        </div>
      ) : activeForm === 'learning' ? (
        <LearningPlanForm onBack={() => setActiveForm(null)} />
      ) : (
        <SessionPlanForm onBack={() => setActiveForm(null)} />
      )}
    </div>
  )
}