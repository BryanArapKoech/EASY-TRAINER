import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/shared/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Easy Trainer | TVET Co-Pilot",
  description: "Generate CDACC Session Plans and Schemes of Work in seconds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased min-h-screen bg-background`}>
        <div className="relative flex min-h-screen flex-col">
          {/* Main Header */}
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center mx-auto px-4">
              <div className="mr-4 flex">
                <a className="mr-6 flex items-center space-x-2" href="/">
                  <span className="font-bold text-xl tracking-tight">Easy Trainer</span>
                </a>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Branding Footer */}
          <Footer />
        </div>
      </body>
    </html>
  );
}