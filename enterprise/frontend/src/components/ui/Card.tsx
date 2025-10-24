import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md border border-maternar-gray-200 hover:shadow-lg transition-shadow ${className}`}>
      {children}
    </div>
  )
}