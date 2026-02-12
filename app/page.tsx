// app/page.tsx
import Link from 'next/link'

export default function Home() {
  const cycles = [
    { title: "Cycle One", slug: "cycle-1", desc: "Information about Cycle One training programs." },
    { title: "Cycle Two", slug: "cycle-2", desc: "Information about Cycle Two training programs." },
    { title: "Cycle Three", slug: "cycle-3", desc: "Information about Cycle Three training programs." },
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 bg-slate-50/30">
      <div className="max-w-6xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black tracking-tight text-slate-900">Easy Trainer</h1>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium">
            This is the home page of the Easy Trainer application. Here you can find the latest news and updates related to TVET training.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cycles.map((cycle) => (
            <div key={cycle.slug} className="bg-white p-10 border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all text-center space-y-6">
              <h2 className="text-3xl font-black text-slate-800">{cycle.title}</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                {cycle.desc}
              </p>
              <Link 
                href={`/cycles/${cycle.slug}`}
                className="inline-block px-8 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-slate-900 transition-all"
              >
                Learn More
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}