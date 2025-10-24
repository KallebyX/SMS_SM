import React from 'react'

interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  fallback?: string
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  name,
  size = 'md',
  className = '',
  fallback
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  }
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizes[size]} rounded-full object-cover ${className}`}
      />
    )
  }
  
  return (
    <div className={`${sizes[size]} rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-medium ${className}`}>
      {fallback ? getInitials(fallback) : name ? getInitials(name) : alt ? getInitials(alt) : '?'}
    </div>
  )
}