import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'secondary' | 'success' | 'danger' | 'warning' | 'destructive'
  size?: 'default' | 'sm' | 'lg'
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className = '',
  variant = 'default',
  size = 'default'
}) => {
const variants = {
  default: 'bg-gray-100 text-gray-800',
  secondary: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
  danger: 'bg-red-100 text-red-800',
  warning: 'bg-yellow-100 text-yellow-800',
  destructive: 'bg-red-600 text-white'
}

const sizes = {
  default: 'px-2.5 py-0.5 text-xs',
  sm: 'px-2 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm'
}

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}