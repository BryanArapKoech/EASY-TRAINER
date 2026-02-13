import Link from 'next/link'

export default function TrainingResources() {
  const cycles = [
    { 
        title: "Cycle One", 
        slug: "cycle-1", 
        desc: "Curriculum materials and unitsfor Cycle 1." 
    },
    { 
        title: "Cycle Two", 
        slug: "cycle-2", 
        desc: "Curriculum materials and Units for Cycle 2." 
    },
    { 
        title: "Cycle Three", 
        slug: "cycle-3", 
        desc: "Curriculum materials and Units for Cycle 3." 
    },
  ]

  return (
    <div className="container mx-auto py-20 px-4 max-w-6xl">
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">Training Resources</h1>
        <p className="text-slate-500 max-w-xl mx-auto font-medium leading-relaxed">
          Access CDACC-compliant curriculum documents, occupational standards, and learning materials organized by modular cycles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cycles.map((cycle) => (
          <div key={cycle.slug} className="group bg-white p-10 border border-slate-100 rounded-[3rem] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 text-center flex flex-col justify-between">
            <div className="space-y-6">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                    <span className="font-black text-xl">{cycle.title.split(' ')[1][0]}</span>
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-slate-800">{cycle.title}</h2>
                    <p className="text-slate-400 text-sm leading-relaxed font-medium">{cycle.desc}</p>
                </div>
            </div>
            <Link 
              href={`/cycles/${cycle.slug}`}
              className="mt-10 inline-block w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all shadow-lg"
            >
              Explore Resource Materials
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}