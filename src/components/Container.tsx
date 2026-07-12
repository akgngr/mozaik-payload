import type { ReactNode } from 'react'

export const Container = ({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) => <div className={`mx-auto w-11/12 max-w-6xl md:w-10/12 ${className}`}>{children}</div>
