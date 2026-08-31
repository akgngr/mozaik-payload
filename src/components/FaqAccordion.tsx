'use client'

import React, { useState } from 'react'

export type FaqItem = {
  question: string
  answer: string
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = open === index
        return (
          <div
            key={item.question}
            className="overflow-hidden rounded-2xl border border-ocean-100 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <h3 className="font-display text-lg text-ocean-900">{item.question}</h3>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ocean-600 transition-transform duration-300 ${
                  isOpen ? 'rotate-45 bg-brand-50' : 'bg-ocean-50'
                }`}
                aria-hidden
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 leading-relaxed text-ocean-700/85">{item.answer}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
