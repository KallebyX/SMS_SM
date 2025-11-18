import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  className?: string
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 200,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect()
        setCoords({
          x: rect.left + rect.width / 2,
          y: rect.top
        })
      }
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const positions = {
    top: '-translate-x-1/2 -translate-y-full -top-2',
    bottom: '-translate-x-1/2 translate-y-full top-full mt-2',
    left: '-translate-y-1/2 -translate-x-full -left-2 top-1/2',
    right: '-translate-y-1/2 translate-x-full left-full ml-2 top-1/2'
  }

  const arrows = {
    top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-t-popover',
    bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-full border-b-popover',
    left: 'right-0 top-1/2 -translate-y-1/2 translate-x-full border-l-popover',
    right: 'left-0 top-1/2 -translate-y-1/2 -translate-x-full border-r-popover'
  }

  return (
    <div
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className={`
              absolute z-[100] px-3 py-1.5 text-xs font-medium text-popover-foreground
              bg-popover border border-border rounded-md shadow-md whitespace-nowrap
              ${positions[position]}
              ${className}
            `}
            role="tooltip"
          >
            {content}
            <div
              className={`absolute w-0 h-0 border-4 border-transparent ${arrows[position]}`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

Tooltip.displayName = 'Tooltip'
