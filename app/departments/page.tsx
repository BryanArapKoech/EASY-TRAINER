import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function DepartmentsPage() {
  const supabase = await createClient()
  const { data: depts } = await supabase.from('departments').select('*')

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl font-black tracking-tight">Departments</h1>
        <p className="text-slate-500 max-w-lg mx-auto">Explore various departments offering specialized TVET training programs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {depts?.map((dept) => (
          <div key={dept.id} className="group bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
            <div className="h-48 bg-slate-100 flex items-center justify-center relative overflow-hidden">
               {/* Placeholder for images you will upload later */}
               <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
               <span className="text-4xl">🏢</span>
            </div>
            <div className="p-8 text-center space-y-4">
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{dept.name}</h3>
              <Link 
                href={`/departments/${dept.name.toLowerCase().replace(/ /g, "-")}`}
                className="inline-block w-full bg-blue-50 text-blue-600 py-3 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all"
              >
                View Courses
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}