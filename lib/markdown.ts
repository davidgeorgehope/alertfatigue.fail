/**
 * Markdown generator for alertfatigue.fail
 * Generates well-structured Markdown with YAML frontmatter
 */

import {
  siteMetadata,
  sections,
  hasFaqs,
  hasLinks,
  hasContent2,
  Section,
} from './content'

function generateFrontmatter(): string {
  return `---
title: "${siteMetadata.title}"
description: "${siteMetadata.description}"
url: "${siteMetadata.url}"
author:
  name: "${siteMetadata.author.name}"
  title: "${siteMetadata.author.title}"
  company: "${siteMetadata.author.company}"
  url: "${siteMetadata.author.companyUrl}"
datePublished: "${siteMetadata.datePublished}"
dateModified: "${siteMetadata.dateModified}"
alternateFormats:
  html: "${siteMetadata.url}"
  markdown: "${siteMetadata.url}/index.md"
---`
}

function generateSectionContent(section: Section): string {
  const lines: string[] = []
  const anchor = section.id

  // Section header with anchor
  lines.push(`## ${section.title} {#${anchor}}`)
  lines.push('')

  // Main content paragraphs
  for (const paragraph of section.content) {
    lines.push(paragraph)
    lines.push('')
  }

  // Bullet points if present
  if (section.bullets && section.bullets.length > 0) {
    for (const bullet of section.bullets) {
      lines.push(`- ${bullet}`)
    }
    lines.push('')
  }

  // Additional content after bullets
  if (hasContent2(section) && section.content2) {
    for (const paragraph of section.content2) {
      lines.push(paragraph)
      lines.push('')
    }
  }

  // Interactive section description
  if (section.interactive) {
    lines.push(`*[Interactive Demo: ${siteMetadata.url}/#${anchor}]*`)
    lines.push('')
    lines.push(section.interactive.description)
    lines.push('')
    lines.push('**Key insights from this demo:**')
    lines.push('')
    for (const insight of section.interactive.keyInsights) {
      lines.push(`- ${insight}`)
    }
    lines.push('')
  }

  // Stats if present
  if (section.stats && section.stats.length > 0) {
    for (const stat of section.stats) {
      lines.push(`- **${stat.label}**: ${stat.value}`)
    }
    lines.push('')
  }

  // FAQs for principles section
  if (hasFaqs(section) && section.faqs) {
    for (const faq of section.faqs) {
      lines.push(`### ${faq.question}`)
      lines.push('')
      lines.push(faq.answer)
      lines.push('')
    }
  }

  // Links for CTA section
  if (hasLinks(section) && section.links) {
    lines.push('### Get Started')
    lines.push('')
    for (const link of section.links) {
      lines.push(`- [${link.label}](${link.url})`)
    }
    lines.push('')
    if (section.author) {
      lines.push('---')
      lines.push('')
      lines.push(`**About the author**: ${section.author.name}, ${section.author.title}. ${section.author.tagline}`)
      lines.push('')
    }
  }

  return lines.join('\n')
}

function generateTableOfContents(): string {
  const lines: string[] = []
  lines.push('## Table of Contents')
  lines.push('')

  for (const section of sections) {
    const title = section.title.replace(/[*`]/g, '')
    lines.push(`- [${title}](#${section.id})`)
  }

  lines.push('')
  return lines.join('\n')
}

function generateIntro(): string {
  return `# ${siteMetadata.title}

${siteMetadata.description}

> **Note**: This page includes interactive demos best experienced at [${siteMetadata.url}](${siteMetadata.url}). This Markdown version provides the full textual content and key insights from each demo.

`
}

function generateFooter(): string {
  return `---

## About This Document

This Markdown version of [alertfatigue.fail](${siteMetadata.url}) is provided for AI agents, readers, and accessibility tools. The interactive demos are described in prose with their key insights included.

- **HTML version**: [${siteMetadata.url}](${siteMetadata.url})
- **Markdown version**: [${siteMetadata.url}/index.md](${siteMetadata.url}/index.md)

Built with Next.js. Content generated from structured data.

*Last updated: ${siteMetadata.dateModified}*
`
}

/**
 * Generates the complete Markdown document
 */
export function generateMarkdown(): string {
  const parts: string[] = []

  // Frontmatter
  parts.push(generateFrontmatter())
  parts.push('')

  // Introduction
  parts.push(generateIntro())

  // Table of contents
  parts.push(generateTableOfContents())

  // All sections
  for (const section of sections) {
    parts.push(generateSectionContent(section))
  }

  // Footer
  parts.push(generateFooter())

  return parts.join('\n')
}

/**
 * Gets the content type for Markdown responses
 */
export function getMarkdownContentType(): string {
  return 'text/markdown; charset=utf-8'
}
