import type { ReactNode } from 'react'

export const GlassCard = ({
  children,
  className = '',
  strong = false,
}: {
  children: ReactNode
  className?: string
  strong?: boolean
}) => (
  <div className={`${strong ? 'glass-strong' : 'glass'} rounded-3xl ${className}`}>{children}</div>
)
