import type { ReactNode } from 'react'
import { clsx } from 'clsx'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'info'
  className?: string
}

const variantClasses: Record<Required<BadgeProps>['variant'], string> = {
  default: 'bg-slate-800/90 text-slate-100',
  success: 'bg-emerald-500/20 text-emerald-200',
  warning: 'bg-amber-500/20 text-amber-200',
  info: 'bg-brand-500/20 text-brand-100',
}

const Badge = ({ children, variant = 'default', className }: BadgeProps) => (
  <span
    className={clsx(
      'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide',
      variantClasses[variant],
      className,
    )}
  >
    {children}
  </span>
)

export default Badge
