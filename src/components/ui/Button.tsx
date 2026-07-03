import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  children: ReactNode
}

const variants = {
  primary:
    'bg-pink-soft text-white shadow-lg shadow-pink-soft/30 hover:bg-[#f09ab5] active:scale-[0.98]',
  secondary:
    'bg-white text-text border-2 border-blush hover:bg-blush/50 active:scale-[0.98]',
  ghost: 'bg-transparent text-text hover:bg-blush/40',
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
