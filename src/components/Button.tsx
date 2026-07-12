import Link from 'next/link'
import type { ReactNode } from 'react'

type Props = {
  href: string
  children: ReactNode
  variant?: 'primary' | 'secondary'
  className?: string
  target?: string
}

export const Button = ({ href, children, variant = 'primary', className = '', target }: Props) => (
  <Link
    href={href}
    target={target}
    rel={target === '_blank' ? 'noopener noreferrer' : undefined}
    className={`btn-glass ${variant === 'primary' ? 'btn-primary' : 'btn-secondary'} ${className}`}
  >
    {children}
  </Link>
)
