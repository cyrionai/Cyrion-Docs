import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  BookOpen,
  ChevronRight,
  ChevronDown,
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
  Code,
  FileText,
  Package,
  Settings,
  Key,
  Webhook
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import TableOfContents, { type TocHeading } from './TableOfContents'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface NavSection {
  title: string
  icon?: React.ComponentType<{ className?: string }>
  items: NavItem[]
  defaultOpen?: boolean
}

const GUIDES_NAVIGATION: NavSection[] = [
  {
    title: 'Getting Started',
    defaultOpen: true,
    items: [
      { name: 'Introduction', href: '/', icon: BookOpen },
      { name: 'Quickstart', href: '/quickstart', icon: Zap },
      { name: 'Architecture', href: '/architecture', icon: Layers },
    ]
  },
  {
    title: 'Core Features',
    defaultOpen: true,
    items: [
      { name: 'Autonomous Scans', href: '/features/scans', icon: Shield },
      { name: 'AI Agents', href: '/features/agents', icon: Cpu },
      { name: 'Vulnerability Management', href: '/features/vulnerabilities', icon: Lock },
      { name: 'Reporting', href: '/features/reports', icon: FileText },
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
]

const API_NAVIGATION: NavSection[] = [
  {
    title: 'API Reference',
    defaultOpen: true,
    items: [
      { name: 'Overview', href: '/api', icon: Code },
      { name: 'Authentication', href: '/api/authentication', icon: Key },
      { name: 'Scans', href: '/api/scans', icon: Shield },
      { name: 'Vulnerabilities', href: '/api/vulnerabilities', icon: Lock },
      { name: 'Webhooks', href: '/api/webhooks', icon: Webhook },
    ]
  },
  {
    title: 'SDKs & Tools',
    items: [
      { name: 'Python SDK', href: '/api/sdk/python', icon: Terminal },
      { name: 'JavaScript SDK', href: '/api/sdk/javascript', icon: Code },
      { name: 'CLI Reference', href: '/api/cli', icon: Terminal },
    ]
  },
]

const RELEASES_NAVIGATION: NavItem[] = [
  { name: 'v2.1.0 - Latest', href: '/releases/v2.1.0', icon: Package },
  { name: 'v2.0.0', href: '/releases/v2.0.0', icon: Package },
  { name: 'v1.5.0', href: '/releases/v1.5.0', icon: Package },
  { name: 'v1.0.0', href: '/releases/v1.0.0', icon: Package },
]

interface LayoutProps {
  children: React.ReactNode
  headings?: TocHeading[]
}

export default function Layout({ children, headings = [] }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'guides' | 'api' | 'releases'>('guides')
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Getting Started': true,
    'Core Features': true,
    'API Reference': true,
  })
  const location = useLocation()

  // Determine active tab based on current route
  React.useEffect(() => {
    if (location.pathname.startsWith('/api')) {
      setActiveTab('api')
    } else if (location.pathname.startsWith('/releases')) {
      setActiveTab('releases')
    } else {
      setActiveTab('guides')
    }
  }, [location.pathname])

  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  const renderNavSection = (section: NavSection) => {
    const isExpanded = expandedSections[section.title] ?? section.defaultOpen ?? false

    return (
      <div key={section.title} className="mb-4">
        <button
          onClick={() => toggleSection(section.title)}
          className="flex items-center justify-between w-full text-xs font-bold text-dark-300 uppercase tracking-widest mb-2 px-2 py-1 hover:text-dark-100 transition-colors"
        >
          <span>{section.title}</span>
          {isExpanded ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronRight className="w-3 h-3" />
          )}
        </button>
        {isExpanded && (
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const isActive = location.pathname === item.href
              const Icon = item.icon
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm transition-all group",
                      isActive
                        ? "bg-accent-cyan/10 text-accent-cyan font-medium"
                        : "text-dark-100 hover:text-white hover:bg-dark-800"
                    )}
                  >
                    <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-accent-cyan" : "text-dark-300 group-hover:text-dark-100")} />
                    <span className="truncate">{item.name}</span>
                    {isActive && <ChevronRight className="ml-auto w-3 h-3 flex-shrink-0" />}
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    )
  }

  const renderReleasesNav = () => (
    <div className="mb-4">
      <h5 className="text-xs font-bold text-dark-300 uppercase tracking-widest mb-2 px-2">
        Releases
      </h5>
      <ul className="space-y-0.5">
        {RELEASES_NAVIGATION.map((item) => {
          const isActive = location.pathname === item.href
          const Icon = item.icon
          return (
            <li key={item.name}>
              <Link
                to={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm transition-all group",
                  isActive
                    ? "bg-accent-cyan/10 text-accent-cyan font-medium"
                    : "text-dark-100 hover:text-white hover:bg-dark-800"
                )}
              >
                <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-accent-cyan" : "text-dark-300 group-hover:text-dark-100")} />
                <span className="truncate">{item.name}</span>
                {isActive && <ChevronRight className="ml-auto w-3 h-3 flex-shrink-0" />}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-dark-500 bg-dark-900/95 backdrop-blur-md z-50 flex items-center px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 lg:hidden hover:bg-dark-700 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="Cyrion AI" className="w-8 h-8" />
            <span className="font-bold text-xl tracking-tight hidden sm:inline-block">
              Cyrion <span className="text-accent-cyan">AI</span>
            </span>
          </Link>
        </div>

        <div className="flex-1 max-w-md mx-auto px-4 hidden md:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-300 group-focus-within:text-accent-cyan transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search documentation..."
              className="w-full bg-dark-800 border border-dark-500 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 focus:border-accent-cyan transition-all"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-dark-300 bg-dark-700 px-1.5 py-0.5 rounded border border-dark-500">
              ⌘K
            </kbd>
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

      <div className="flex pt-16">
        {/* Left Sidebar Navigation */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 w-64 border-r border-dark-500 bg-dark-900 pt-16 z-40 transition-transform duration-300 lg:translate-x-0 flex flex-col",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Tab Switcher */}
          <div className="flex border-b border-dark-500 px-2 pt-2">
            <button
              onClick={() => setActiveTab('guides')}
              className={cn(
                "flex-1 px-3 py-2 text-sm font-medium rounded-t-lg transition-colors",
                activeTab === 'guides'
                  ? "bg-dark-700 text-white border-b-2 border-accent-cyan"
                  : "text-dark-200 hover:text-white hover:bg-dark-800"
              )}
            >
              Guides
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={cn(
                "flex-1 px-3 py-2 text-sm font-medium rounded-t-lg transition-colors",
                activeTab === 'api'
                  ? "bg-dark-700 text-white border-b-2 border-accent-cyan"
                  : "text-dark-200 hover:text-white hover:bg-dark-800"
              )}
            >
              API
            </button>
            <button
              onClick={() => setActiveTab('releases')}
              className={cn(
                "flex-1 px-3 py-2 text-sm font-medium rounded-t-lg transition-colors",
                activeTab === 'releases'
                  ? "bg-dark-700 text-white border-b-2 border-accent-cyan"
                  : "text-dark-200 hover:text-white hover:bg-dark-800"
              )}
            >
              Releases
            </button>
          </div>

          {/* Navigation Content */}
          <nav className="flex-1 overflow-y-auto p-4">
            {activeTab === 'guides' && (
              <div className="space-y-2">
                {GUIDES_NAVIGATION.map(renderNavSection)}
              </div>
            )}
            {activeTab === 'api' && (
              <div className="space-y-2">
                {API_NAVIGATION.map(renderNavSection)}
              </div>
            )}
            {activeTab === 'releases' && renderReleasesNav()}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-dark-500">
            <Link
              to="/settings"
              className="flex items-center gap-2 text-sm text-dark-200 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:pl-64">
          <div className="flex">
            {/* Content Area */}
            <div className="flex-1 min-w-0 px-6 py-10 lg:px-12 max-w-4xl mx-auto">
              {children}

              {/* Footer Pagination */}
              <div className="mt-16 pt-8 border-t border-dark-500">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-300">
                    Was this page helpful?
                  </span>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 rounded-lg border border-dark-500 text-dark-200 hover:text-white hover:border-dark-400 transition-colors">
                      Yes
                    </button>
                    <button className="px-3 py-1 rounded-lg border border-dark-500 text-dark-200 hover:text-white hover:border-dark-400 transition-colors">
                      No
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Table of Contents */}
            <aside className="hidden xl:block w-56 flex-shrink-0 pr-6">
              <div className="sticky top-24 py-10">
                <TableOfContents headings={headings} />
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}
