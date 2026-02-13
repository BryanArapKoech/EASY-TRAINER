// components/shared/Footer.tsx
export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 bg-slate-50/30">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center">
        <p className="text-[10px] md:text-xs font-black text-slate-400 tracking-[0.2em] leading-loose">
          © {currentYear}. Easy Trainer. All rights reserved. A craft of{" "}
          <a
          href="https://tangentcodestudios.vercel.app"
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:text-blue-700 transition-colors"
          >
         Tangent Code Studios
          </a>
        </p>

      </div>
    </footer>
  );
}