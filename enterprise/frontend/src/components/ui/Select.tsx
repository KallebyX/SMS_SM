import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  fullWidth?: boolean
  className?: string
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Selecione...',
  label,
  error,
  disabled = false,
  fullWidth = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(opt => opt.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue)
    setIsOpen(false)
  }

  return (
    <div className={`space-y-2 ${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div ref={selectRef} className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            flex h-10 w-full items-center justify-between rounded-md border border-input
            bg-background px-3 py-2 text-sm ring-offset-background
            placeholder:text-muted-foreground focus:outline-none focus:ring-2
            focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed
            disabled:opacity-50 transition-all duration-200
            ${error ? 'border-destructive focus:ring-destructive' : ''}
          `}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={selectedOption ? 'text-foreground' : 'text-muted-foreground'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={`h-4 w-4 opacity-50 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-lg"
            >
              <ul
                role="listbox"
                className="max-h-60 overflow-auto p-1 scrollbar-thin"
              >
                {options.map((option) => (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={value === option.value}
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    className={`
                      relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5
                      text-sm outline-none transition-colors
                      ${option.disabled
                        ? 'pointer-events-none opacity-50'
                        : 'hover:bg-accent hover:text-accent-foreground'
                      }
                      ${value === option.value ? 'bg-accent text-accent-foreground' : ''}
                    `}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        value === option.value ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    {option.label}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && (
        <p className="text-xs text-destructive font-medium">{error}</p>
      )}
    </div>
  )
}

Select.displayName = 'Select'
