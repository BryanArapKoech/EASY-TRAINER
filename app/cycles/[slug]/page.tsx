import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Suspense } from 'react'

async function CycleContent({ params }: { params: { slug: string } }) {
  const cycleTitle = params.slug.replace(/-/g, " "); // "cycle-1" -> "cycle 1"
  const supabase = await createClient()
  
  // Fetch courses belonging to this cycle, including the department name
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*, departments(name)')
    .ilike('cycle', cycleTitle); // Case-insensitive filter

  return (
    <div className="container mx-auto py-16 px-4 max-w-6xl">
      <div className="text-center mb-16 space-y-4">
        
        <h1 className="text-5xl font-black capitalize tracking-tight text-slate-900">{cycleTitle}</h1>
        <p className="text-slate-500 max-w-lg mx-auto font-medium">
          Viewing courses available for Level L4, L5, and L6 within this training cycle.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses && courses.length > 0 ? (
          courses.map((course) => (
            <div key={course.id} className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all group">
              {/* Course Header with Image Placeholder */}
              <div className="h-44 bg-slate-100 relative flex items-center justify-center">
                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                 <span className="text-sm font-black text-white/80 z-10 uppercase tracking-widest">
                    {course.departments?.name}
                 </span>
              </div>

              <div className="p-8 text-center space-y-5">
                <h3 className="text-xl font-black text-slate-900 uppercase leading-tight min-h-[3rem]">
                  {course.title}
                </h3>
                
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-400 font-mono tracking-widest uppercase">
                    {course.course_code}
                  </p>
                  <div className="inline-block bg-slate-600 text-white text-[10px] font-black px-4 py-1.5 rounded-lg uppercase">
                    Level L{course.level} | {course.cycle}
                  </div>
                </div>

                <Link 
                  href={`/units?courseId=${course.id}`}
                  className="inline-block w-full bg-[#00C2E0] text-white py-4 rounded-2xl font-black hover:bg-slate-900 shadow-lg shadow-cyan-100 transition-all"
                >
                  View Units
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 border-2 border-dashed border-slate-100 rounded-[3rem]">
            <p className="text-slate-400 font-black uppercase tracking-widest italic">No courses currently assigned to {cycleTitle}.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div className="p-20 text-center font-black animate-pulse text-slate-200">LOADING {resolvedParams.slug.toUpperCase()}...</div>}>
      <CycleContent params={resolvedParams} />
    </Suspense>
  )
}