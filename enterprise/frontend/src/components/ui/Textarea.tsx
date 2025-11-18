import React, { forwardRef } from 'react'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className={`space-y-2 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2
            text-sm ring-offset-background placeholder:text-muted-foreground
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
            focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
            transition-all duration-200 resize-y
            ${error ? 'border-destructive focus-visible:ring-destructive' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-xs text-destructive font-medium">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
