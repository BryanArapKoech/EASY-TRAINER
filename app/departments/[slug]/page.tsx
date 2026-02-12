// app/departments/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function DepartmentDetail({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  // 1. Await the params (Required in newest Next.js versions)
  const { slug } = await params;
  const deptName = slug.replace(/-/g, " ");
  
  const supabase = await createClient()
  
  // 2. Fetch department
  const { data: dept, error: deptError } = await supabase
    .from('departments')
    .select('*')
    .ilike('name', deptName)
    .single()

  // 3. Safety Check: If dept is null, show 404 instead of crashing
  if (deptError || !dept) {
    return notFound();
  }

  // 4. Fetch courses for this dept
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('dept_id', dept.id)

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black capitalize">{dept.name}</h1>
        <p className="text-slate-500 mt-2">Explore the various courses in this department.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses && courses.length > 0 ? (
          courses.map((course) => (
            <div key={course.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
              <div className="h-48 bg-slate-100 relative">
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
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
             <p className="text-slate-400 font-bold">No courses found for this department.</p>
          </div>
        )}
      </div>
    </div>
  )
}