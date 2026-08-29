'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

type Slide = { url: string; alt: string }

export const Slideshow = ({ slides }: { slides: Slide[] }) => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (slides.length < 2) return
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000)
    return () => clearInterval(id)
  }, [slides.length])

  if (slides.length === 0) {
    return <div className="h-full w-full bg-cream-dark" />
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {slides.map((slide, i) => (
        <Image
          key={slide.url}
          src={slide.url}
          alt={slide.alt}
          fill
          priority={i === 0}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`absolute inset-0 object-cover transition-opacity duration-1000 ease-in-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-white/80 px-3 py-2 backdrop-blur-sm">
          {slides.map((slide, i) => (
            <button
              key={slide.url}
              aria-label={`Bild ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-6 bg-brand-500' : 'w-2 bg-ocean-900/25'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
