import type { ReactNode } from 'react'
import { clsx } from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
}

const Card = ({ children, className }: CardProps) => (
  <div className={clsx('rounded-3xl border border-slate-800/60 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/40', className)}>
    {children}
  </div>
)

export default Card
