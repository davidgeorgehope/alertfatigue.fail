'use client'

import { Hook } from '@/components/sections/Hook'
import { Symptoms } from '@/components/sections/Symptoms'
import { LogProblem } from '@/components/sections/LogProblem'
import { FutileSearch } from '@/components/sections/FutileSearch'
import { AIAnalysis } from '@/components/sections/AIAnalysis'
import { LogSorting } from '@/components/sections/LogSorting'
import { GrokDemo } from '@/components/sections/GrokDemo'
import { SignificantEvents } from '@/components/sections/SignificantEvents'
import { Contrast } from '@/components/sections/Contrast'
import { CTA } from '@/components/sections/CTA'
import { SectionNav } from '@/components/SectionNav'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hook />
      <Symptoms />
      <LogProblem />
      <FutileSearch />
      <AIAnalysis />
      <LogSorting />
      <GrokDemo />
      <SignificantEvents />
      <Contrast />
      <CTA />
      <SectionNav />
    </main>
  )
}
