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
  default: 'bg-maternar-gray-100 text-maternar-gray-800',
  secondary: 'bg-maternar-blue-100 text-maternar-blue-800',
  success: 'bg-maternar-green-100 text-maternar-green-800',
  danger: 'bg-maternar-pink-100 text-maternar-pink-800',
  warning: 'bg-yellow-100 text-yellow-800',
  destructive: 'bg-maternar-pink-600 text-white'
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