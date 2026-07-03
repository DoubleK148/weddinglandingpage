import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export function Textarea({
  label,
  error,
  id,
  className = '',
  ...props
}: TextareaProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5 text-left">
      <label htmlFor={inputId} className="text-sm font-semibold text-text">
        {label}
      </label>
      <textarea
        id={inputId}
        className={`min-h-[100px] w-full resize-y rounded-2xl border-2 border-blush/60 bg-white px-4 py-3 text-text outline-none transition-colors placeholder:text-text-muted/60 focus:border-pink-soft focus:ring-2 focus:ring-pink-soft/20 ${className}`}
        {...props}
      />
      {error ? <p className="text-sm text-rose-500">{error}</p> : null}
    </div>
  )
}
