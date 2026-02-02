'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { ChevronDown } from 'lucide-react'

const sections = [
  { id: 'hook', label: 'Intro' },
  { id: 'symptoms', label: 'The Problem' },
  { id: 'log-problem', label: 'Logs' },
  { id: 'futile-search', label: 'Search' },
  { id: 'ai-analysis', label: 'AI Analysis' },
  { id: 'log-sorting', label: 'Sorting' },
  { id: 'grok-demo', label: 'Parsing' },
  { id: 'significant-events', label: 'Events' },
  { id: 'contrast', label: 'Comparison' },
  { id: 'cta', label: 'Try It' },
]

export function SectionNav() {
  const [currentSection, setCurrentSection] = useState(0)
  const isScrollingRef = useRef(false)

  // Track current section with Intersection Observer
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    sections.forEach((section, index) => {
      const element = document.getElementById(section.id)
      if (!element) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
              // Only update if not programmatically scrolling
              if (!isScrollingRef.current) {
                setCurrentSection(index)
              }
            }
          })
        },
        { threshold: [0.3, 0.5, 0.7] }
      )

      observer.observe(element)
      observers.push(observer)
    })

    return () => {
      observers.forEach((obs) => obs.disconnect())
    }
  }, [])

  const scrollToNext = useCallback(() => {
    const nextIndex = Math.min(currentSection + 1, sections.length - 1)
    const nextSection = document.getElementById(sections[nextIndex].id)
    if (nextSection) {
      isScrollingRef.current = true
      nextSection.scrollIntoView({ behavior: 'smooth' })
      // Unlock after scroll animation completes (~500-800ms on most browsers)
      setTimeout(() => {
        isScrollingRef.current = false
        setCurrentSection(nextIndex)
      }, 800)
    }
  }, [currentSection])

  const isLastSection = currentSection >= sections.length - 1

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && !isLastSection) {
        scrollToNext()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLastSection, scrollToNext])

  return (
    <>
      {/* Desktop: Floating navigation */}
      <div className="hidden md:flex fixed bottom-6 right-6 z-50 flex-col items-center gap-3">
        {/* Progress dots */}
        <div className="flex flex-col gap-1.5 bg-terminal-surface/90 backdrop-blur-sm border border-terminal-border rounded-full py-3 px-2">
          {sections.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                const element = document.getElementById(sections[index].id)
                if (element) {
                  isScrollingRef.current = true
                  element.scrollIntoView({ behavior: 'smooth' })
                  setTimeout(() => {
                    isScrollingRef.current = false
                    setCurrentSection(index)
                  }, 800)
                }
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSection
                  ? 'bg-terminal-accent scale-125'
                  : index < currentSection
                  ? 'bg-terminal-muted'
                  : 'bg-terminal-border'
              }`}
              title={sections[index].label}
            />
          ))}
        </div>

        {/* Next button */}
        {!isLastSection && (
          <button
            onClick={scrollToNext}
            className="flex items-center gap-1 px-4 py-2 bg-terminal-accent text-terminal-bg font-medium rounded-full hover:bg-terminal-accent/90 transition-colors shadow-lg"
          >
            Next
            <ChevronDown className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Mobile: Bottom bar navigation */}
      {!isLastSection && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-terminal-bg/95 backdrop-blur-sm border-t border-terminal-border">
          <div className="flex items-center justify-between gap-4">
            {/* Progress indicator */}
            <div className="flex items-center gap-2">
              <span className="text-terminal-muted text-sm">
                {currentSection + 1} / {sections.length}
              </span>
              <div className="flex gap-1">
                {sections.slice(0, 5).map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      index === currentSection
                        ? 'bg-terminal-accent'
                        : index < currentSection
                        ? 'bg-terminal-muted'
                        : 'bg-terminal-border'
                    }`}
                  />
                ))}
                {sections.length > 5 && (
                  <span className="text-terminal-muted text-xs ml-1">...</span>
                )}
              </div>
            </div>

            {/* Next button */}
            <button
              onClick={scrollToNext}
              className="flex items-center gap-2 px-6 py-3 bg-terminal-accent text-terminal-bg font-medium rounded-lg hover:bg-terminal-accent/90 transition-colors shadow-lg"
            >
              Next
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
