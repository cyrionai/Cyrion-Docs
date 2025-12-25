import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  BookOpen, 
  ChevronRight, 
  Search, 
  Menu, 
  X,
  Shield,
  Zap,
  Terminal,
  Cpu,
  Lock,
  Globe,
  Smartphone,
  Cloud,
  Layers,
  Database,
  Code
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const NAVIGATION = [
  {
    title: 'Getting Started',
    items: [
      { name: 'Introduction', href: '/', icon: BookOpen },
      { name: 'Quickstart', href: '/quickstart', icon: Zap },
      { name: 'Architecture', href: '/architecture', icon: Layers },
    ]
  },
  {
    title: 'Core Features',
    items: [
      { name: 'Autonomous Scans', href: '/features/scans', icon: Shield },
      { name: 'AI Agents', href: '/features/agents', icon: Cpu },
      { name: 'Vulnerability Management', href: '/features/vulnerabilities', icon: Lock },
      { name: 'Reporting', href: '/features/reports', icon: Database },
    ]
  },
  {
    title: 'Platform Specifics',
    items: [
      { name: 'Web Security', href: '/platforms/web', icon: Globe },
      { name: 'Mobile Security', href: '/platforms/mobile', icon: Smartphone },
      { name: 'Cloud Security', href: '/platforms/cloud', icon: Cloud },
    ]
  },
  {
    title: 'Technical Reference',
    items: [
      { name: 'API Reference', href: '/reference/api', icon: Code },
      { name: 'Sandbox Environment', href: '/reference/sandbox', icon: Terminal },
      { name: 'Authentication', href: '/reference/auth', icon: Lock },
    ]
  }
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-dark-500 bg-dark-900/80 backdrop-blur-md z-50 flex items-center px-4 md:px-8">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 md:hidden hover:bg-dark-700 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-accent-cyan rounded-lg flex items-center justify-center">
              <Shield className="text-dark-900 w-5 h-5 fill-current" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:inline-block">
              Cyrion <span className="text-accent-cyan">Docs</span>
            </span>
          </Link>
        </div>

        <div className="flex-1 max-w-xl mx-auto px-4 hidden md:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-300 group-focus-within:text-accent-cyan transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search documentation..."
              className="w-full bg-dark-800 border border-dark-500 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 focus:border-accent-cyan transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a href="https://github.com/cyrionai/cyrionai" target="_blank" rel="noreferrer" className="text-sm font-medium text-dark-100 hover:text-white transition-colors hidden sm:block">
            GitHub
          </a>
          <Link to="https://app.cyrion.ai" className="px-4 py-2 bg-accent-cyan text-dark-900 text-sm font-semibold rounded-lg hover:bg-accent-cyan/90 transition-all shadow-lg shadow-accent-cyan/10">
            Go to App
          </Link>
        </div>
      </header>

      <div className="flex pt-16 h-screen">
        {/* Sidebar Navigation */}
        <aside 
          className={cn(
            "fixed inset-y-0 left-0 w-72 border-r border-dark-500 bg-dark-900 pt-16 z-40 transition-transform duration-300 md:translate-x-0 overflow-y-auto",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <nav className="p-6 space-y-8">
            {NAVIGATION.map((section) => (
              <div key={section.title}>
                <h5 className="text-xs font-bold text-dark-300 uppercase tracking-widest mb-4 px-2">
                  {section.title}
                </h5>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.href
                    const Icon = item.icon
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          onClick={() => setIsSidebarOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                            isActive 
                              ? "bg-accent-cyan/10 text-accent-cyan" 
                              : "text-dark-100 hover:text-white hover:bg-dark-800"
                          )}
                        >
                          <Icon className={cn("w-4 h-4", isActive ? "text-accent-cyan" : "text-dark-300 group-hover:text-dark-100")} />
                          {item.name}
                          {isActive && <ChevronRight className="ml-auto w-3 h-3" />}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:pl-72 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-12 md:px-12">
            {children}
            
            {/* Footer Pagination */}
            <div className="mt-16 pt-8 border-t border-dark-500 flex justify-between">
              {/* Add next/prev links here if needed */}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
