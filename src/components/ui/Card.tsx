import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl shadow-pink-soft/10 backdrop-blur-sm sm:p-8 ${className}`}
    >
      {children}
    </div>
  )
}
