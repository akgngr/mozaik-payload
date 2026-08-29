'use client'

import React, { useEffect, useRef, useState, type ReactNode } from 'react'

type AnimVariant =
  | 'fade-up'
  | 'fade-in'
  | 'fade-left'
  | 'fade-right'
  | 'scale-up'
  | 'stagger-children'

interface Props {
  children: ReactNode
  variant?: AnimVariant
  delay?: number          // ms
  duration?: number       // ms
  className?: string
  threshold?: number      // 0-1
  once?: boolean
  as?: keyof React.JSX.IntrinsicElements
}

const variantStyles: Record<AnimVariant, { hidden: string; visible: string }> = {
  'fade-up': {
    hidden:  'opacity-0 translate-y-10',
    visible: 'opacity-100 translate-y-0',
  },
  'fade-in': {
    hidden:  'opacity-0',
    visible: 'opacity-100',
  },
  'fade-left': {
    hidden:  'opacity-0 -translate-x-10',
    visible: 'opacity-100 translate-x-0',
  },
  'fade-right': {
    hidden:  'opacity-0 translate-x-10',
    visible: 'opacity-100 translate-x-0',
  },
  'scale-up': {
    hidden:  'opacity-0 scale-95',
    visible: 'opacity-100 scale-100',
  },
  'stagger-children': {
    hidden:  'opacity-0 translate-y-8',
    visible: 'opacity-100 translate-y-0',
  },
}

export function Animated({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 600,
  className = '',
  threshold = 0.15,
  once = true,
}: Omit<Props, 'as'>) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once])

  const { hidden, visible: vis } = variantStyles[variant]

  return (
    <div
      ref={ref}
      className={`transition-all ${className} ${visible ? vis : hidden}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </div>
  )
}


/** Stagger wrapper — each direct child animates in with increasing delay */
export function StaggerGroup({
  children,
  className = '',
  baseDelay = 0,
  staggerMs = 100,
  variant = 'fade-up',
  threshold = 0.1,
}: {
  children: ReactNode[]
  className?: string
  baseDelay?: number
  staggerMs?: number
  variant?: AnimVariant
  threshold?: number
}) {
  return (
    <div className={className}>
      {(children as ReactNode[]).map((child, i) => (
        <Animated
          key={i}
          variant={variant}
          delay={baseDelay + i * staggerMs}
          threshold={threshold}
        >
          {child}
        </Animated>
      ))}
    </div>
  )
}
