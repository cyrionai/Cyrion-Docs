import { useEffect, useState } from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface TocHeading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  headings: TocHeading[]
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-80px 0% -80% 0%',
        threshold: 0
      }
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [headings])

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  if (headings.length === 0) {
    return null
  }

  return (
    <nav className="space-y-1">
      <h5 className="text-xs font-bold text-dark-300 uppercase tracking-widest mb-4 px-2">
        On this page
      </h5>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <button
              onClick={() => handleClick(heading.id)}
              className={cn(
                "block w-full text-left text-sm py-1 px-2 rounded transition-colors",
                heading.level === 2 && "pl-2",
                heading.level === 3 && "pl-4",
                heading.level === 4 && "pl-6",
                activeId === heading.id
                  ? "text-accent-cyan bg-accent-cyan/10"
                  : "text-dark-200 hover:text-white hover:bg-dark-800"
              )}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// Utility function to extract headings from markdown content
export function extractHeadings(content: string): TocHeading[] {
  const headings: TocHeading[] = []
  const lines = content.split('\n')

  lines.forEach((line) => {
    const match = line.match(/^(#{2,4})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const text = match[2].trim()
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')

      headings.push({ id, text, level })
    }
  })

  return headings
}
