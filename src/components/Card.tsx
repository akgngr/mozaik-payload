import type { ReactNode } from 'react'

export const Card = ({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) => (
  <div
    className={`rounded-3xl border border-cream-dark bg-white shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)] ${className}`}
  >
    {children}
  </div>
)
