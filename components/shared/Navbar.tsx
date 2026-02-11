"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

const departments = [
  "Electrical and Electronics engineering",
  "Building and Civil engineering",
  "Hospitality",
  "Business",
  "Computing and Informatics",
  "Agriculture",
  "Cosmetology",
  "Applied Science",
  "Health Science",
  "Liberal studies",
  "Automotive and Mechanical Engineering",
  "Fashion Design",
]

const cycles = ["Cycle 1", "Cycle 2", "Cycle 3"]

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-blue-600" />
          <span className="font-black text-xl tracking-tighter text-slate-900">
            Easy Trainer
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              {/* Home / Cycles */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-bold text-slate-600">Home</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-2 p-4">
                    <li className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-2">Modular Courses</li>
                    {cycles.map((cycle) => (
                      <li key={cycle}>
                        <NavigationMenuLink asChild>
                          <Link href={`/cycles/${cycle.toLowerCase().replace(" ", "-")}`} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 hover:text-blue-600 font-bold text-sm">
                            {cycle}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Departments */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-bold text-slate-600">Departments</NavigationMenuTrigger>
                
                <NavigationMenuContent>
  <ul className="grid w-[600px] grid-cols-2 gap-3 p-6 max-h-[80vh] overflow-y-auto">
    {departments.map((dept) => (
      <li key={dept}>
        <NavigationMenuLink asChild>
          <Link href={`/departments/${dept.toLowerCase().replace(/ /g, "-")}`} className="...">
            {dept}
          </Link>
        </NavigationMenuLink>
      </li>
    ))}
  </ul>
</NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/contact" className="px-4 py-2 font-bold text-slate-600 text-sm hover:text-blue-600 transition-colors">
                  Contact Us
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Navigation (Sheet) */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-900">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] overflow-y-auto">
              <SheetHeader className="text-left mb-8">
                <SheetTitle className="font-black text-2xl tracking-tighter">Menu</SheetTitle>
              </SheetHeader>
              
              <nav className="flex flex-col space-y-6">
                {/* Mobile Cycles */}
                <div className="space-y-3">
                  <p className="font-black text-[10px] uppercase tracking-[0.2em] text-blue-600">Modular Cycles</p>
                  <div className="grid grid-cols-1 gap-2">
                    {cycles.map(cycle => (
                      <Link key={cycle} href="/" onClick={() => setIsOpen(false)} className="text-lg font-bold text-slate-900 hover:text-blue-600">
                        {cycle}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Mobile Departments */}
                <div className="space-y-3">
                  <p className="font-black text-[10px] uppercase tracking-[0.2em] text-blue-600">Departments</p>
                  <div className="grid grid-cols-1 gap-4">
                    {departments.map(dept => (
                      <Link key={dept} href="/" onClick={() => setIsOpen(false)} className="text-sm font-bold text-slate-600 hover:text-blue-600 leading-tight">
                        {dept}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link href="/contact" onClick={() => setIsOpen(false)} className="text-lg font-black text-slate-900 border-t pt-4">
                  Contact Us
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}