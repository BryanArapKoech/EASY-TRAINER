import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DepartmentsPage() {
  const supabase = await createClient()
  
  // We wrap the fetch in a very simple call
  const { data: depts, error } = await supabase
    .from('departments')
    .select('*')
    .order('name', { ascending: true })

  // VALIDATION: If there is an error, we show it clearly
  if (error) {
    return (
      <div className="p-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-red-600">Connection Error</h1>
        <p className="text-slate-500">Code: {error.code}</p>
        <p className="text-slate-500 font-mono text-xs">{error.message}</p>
        <div className="text-xs bg-slate-100 p-4 rounded">
          Check if NEXT_PUBLIC_SUPABASE_URL is set in Vercel
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-20 px-4 max-w-7xl">
      <div className="text-center space-y-4 mb-20">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">Departments</h1>
        
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {depts?.map((dept) => (
          <Link 
            key={dept.id} 
            href={`/departments/${dept.name.trim().toLowerCase().replace(/ /g, "-")}`}
            className="p-8 border rounded-[2.5rem] bg-white shadow-sm hover:shadow-lg transition-all text-center"
          >
            <h3 className="font-black text-slate-900 uppercase text-sm">{dept.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  )
}