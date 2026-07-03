import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function Input({ label, error, id, className = '', ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5 text-left">
      <label htmlFor={inputId} className="text-sm font-semibold text-text">
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full rounded-2xl border-2 border-blush/60 bg-white px-4 py-3 text-text outline-none transition-colors placeholder:text-text-muted/60 focus:border-pink-soft focus:ring-2 focus:ring-pink-soft/20 ${className}`}
        {...props}
      />
      {error ? <p className="text-sm text-rose-500">{error}</p> : null}
    </div>
  )
}
