import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DepartmentDetail({ params }: { params: { slug: string } }) {
  const deptName = params.slug.replace(/-/g, " ")
  const supabase = await createClient()
  
  const { data: dept } = await supabase.from('departments').select('*').ilike('name', deptName).single()
  const { data: courses } = await supabase.from('courses').select('*').eq('dept_id', dept.id)

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black capitalize">{deptName}</h1>
        <p className="text-slate-500 mt-2">Explore the various courses in the departments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses?.map((course) => (
          <div key={course.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
            <div className="h-48 bg-slate-100 relative">
               {/* Placeholder for Course Image */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <div className="p-8 text-center space-y-4">
              <h3 className="text-xl font-black text-slate-900 uppercase leading-tight">
                {course.title}
              </h3>
              
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-400 font-mono tracking-widest">
                  {course.course_code}
                </p>
                <div className="inline-block bg-slate-500 text-white text-[10px] font-black px-4 py-1 rounded-md uppercase">
                  Level L{course.level} | {course.cycle}
                </div>
              </div>

              <Link 
                href={`/units?courseId=${course.id}`}
                className="inline-block w-full bg-[#00C2E0] text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-all"
              >
                View Units
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}