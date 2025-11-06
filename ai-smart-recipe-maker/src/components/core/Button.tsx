import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-gradient-to-r from-brand-500 to-indigo-500 text-white hover:shadow-glow',
  secondary: 'bg-slate-800/80 text-slate-100 hover:bg-slate-700/80',
  ghost: 'bg-transparent text-slate-200 hover:bg-slate-800/60',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

const Button = ({ variant = 'primary', size = 'md', icon, className, children, ...props }: ButtonProps) => (
  <button
    className={clsx(
      'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/70 disabled:cursor-not-allowed disabled:opacity-50',
      variantClasses[variant],
      sizeClasses[size],
      className,
    )}
    {...props}
  >
    {icon}
    {children}
  </button>
)

export default Button
