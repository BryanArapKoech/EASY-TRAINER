import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar"; // Import the new Navbar

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
      <body className={`${inter.className} antialiased min-h-screen bg-white`}>
        <div className="relative flex min-h-screen flex-col">
          
          {/* Use the new Mobile-Responsive Navbar instead of the old header */}
          <Navbar />

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