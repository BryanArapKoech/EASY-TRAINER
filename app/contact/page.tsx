// app/contact/page.tsx
export default function ContactPage() {
  return (
    <div className="container mx-auto py-20 px-4 text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-5xl font-black tracking-tighter">Contact Us</h1>
        <p className="text-slate-500 max-w-md mx-auto font-medium">
          Have questions about CDACC curriculums or payment? Get in touch with Tangent Code Studios.
        </p>
      </div>

      <div className="max-w-md mx-auto p-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-[2.5rem] shadow-2xl">
        <div className="bg-white rounded-[2.3rem] p-10 space-y-6">
          <div className="text-left space-y-4">
            <div>
              <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Email</p>
              <p className="text-lg font-bold text-slate-900">support@tangentcodestudios.com</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Location</p>
              <p className="text-lg font-bold text-slate-900">Nairobi, Kenya</p>
            </div>
          </div>
          <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-blue-600 transition-all">
            Send us a WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}