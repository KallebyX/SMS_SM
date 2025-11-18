import React from 'react'
import { Check } from 'lucide-react'

interface CheckboxProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  label?: string
  className?: string
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onCheckedChange,
  disabled = false,
  label,
  className = ''
}) => {
  return (
    <label className={`inline-flex items-center gap-2 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onCheckedChange(!checked)}
        className={`
          h-5 w-5 shrink-0 rounded border border-input ring-offset-background
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
          focus-visible:ring-offset-2 transition-all duration-200
          ${checked ? 'bg-primary border-primary text-primary-foreground' : 'bg-background'}
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {checked && <Check className="h-4 w-4" strokeWidth={3} />}
      </button>
      {label && (
        <span className="text-sm font-medium text-foreground">
          {label}
        </span>
      )}
    </label>
  )
}

Checkbox.displayName = 'Checkbox'
