'use client'

import React, { useState } from 'react'

export function CopyButton({ value, className = '' }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Kopieren"
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-ocean-100 bg-white px-2.5 py-1.5 text-xs font-bold text-ocean-600 transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600 ${className}`}
    >
      {copied ? (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V6a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2h-1M4 8h8a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2z"
          />
        </svg>
      )}
      {copied ? 'Kopiert!' : 'Kopieren'}
    </button>
  )
}
