// app/units/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Suspense } from 'react'

async function UnitsContent({ searchParams }: any) {
  const { courseId } = searchParams
  const supabase = await createClient()
  
  const { data: units } = await supabase.from('units').select('*').eq('course_id', courseId)

  return (
    <div className="container mx-auto py-16 px-4 max-w-6xl">
      {units?.map((unit) => (
        <div key={unit.id} className="mb-20 space-y-8">
          {/* Unit Header Card */}
          <div className="bg-white border border-slate-100 p-8 rounded-3xl text-center shadow-sm">
            <h2 className="text-3xl font-black text-slate-800">{unit.title}</h2>
            <p className="text-slate-500 font-mono font-bold mt-1 tracking-tighter">
              Unit Code: {unit.unit_code}
            </p>
          </div>

          {/* Download Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Curriculum Card */}
            <div className="bg-white p-10 border border-slate-100 rounded-3xl shadow-sm text-center space-y-6 group">
              <div className="w-16 h-20 bg-slate-50 border-2 border-slate-200 rounded-lg mx-auto flex items-center justify-center font-bold text-slate-300">DOC</div>
              <div>
                <h4 className="font-black text-slate-900">{unit.title} CU</h4>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Curriculum</p>
              </div>
              <a href={unit.curriculum_url} className="block w-full bg-blue-600 text-white py-4 rounded-xl font-black hover:bg-blue-700 transition-all">
                Download
              </a>
            </div>

            {/* OS Card */}
            <div className="bg-white p-10 border border-slate-100 rounded-3xl shadow-sm text-center space-y-6 group">
              <div className="w-16 h-20 bg-slate-50 border-2 border-slate-200 rounded-lg mx-auto flex items-center justify-center font-bold text-slate-300">DOC</div>
              <div>
                <h4 className="font-black text-slate-900">{unit.title} OS</h4>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Occupational Standards</p>
              </div>
              <a href={unit.os_url} className="block w-full bg-blue-600 text-white py-4 rounded-xl font-black hover:bg-blue-700 transition-all">
                Download
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function UnitsPage({ searchParams }: any) {
  return (
    <Suspense fallback={<div>Loading Units...</div>}>
      <UnitsContent searchParams={searchParams} />
    </Suspense>
  )
}