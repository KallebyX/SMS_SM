import React from 'react'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  count?: number
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  count = 1
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full'
      case 'rectangular':
        return 'rounded-md'
      case 'text':
      default:
        return 'rounded'
    }
  }

  const getDefaultSize = () => {
    switch (variant) {
      case 'circular':
        return { width: '40px', height: '40px' }
      case 'rectangular':
        return { width: '100%', height: '200px' }
      case 'text':
      default:
        return { width: '100%', height: '1em' }
    }
  }

  const defaultSize = getDefaultSize()
  const style = {
    width: width || defaultSize.width,
    height: height || defaultSize.height
  }

  const skeletonElement = (
    <div
      className={`animate-pulse bg-gray-200 ${getVariantClass()} ${className}`}
      style={style}
    />
  )

  if (count > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index}>{skeletonElement}</div>
        ))}
      </div>
    )
  }

  return skeletonElement
}

// Skeleton Card
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="animate-pulse space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton variant="circular" width={48} height={48} />
          <div className="flex-1 space-y-2">
            <Skeleton width="60%" height={16} />
            <Skeleton width="40%" height={14} />
          </div>
        </div>
        <Skeleton variant="rectangular" height={100} />
        <div className="space-y-2">
          <Skeleton height={12} />
          <Skeleton height={12} width="90%" />
          <Skeleton height={12} width="80%" />
        </div>
      </div>
    </div>
  )
}

// Skeleton Table
export const SkeletonTable: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index} className="px-6 py-3">
                <Skeleton height={16} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  <Skeleton height={16} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Skeleton List
export const SkeletonList: React.FC<{ items?: number }> = ({ items = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow">
          <Skeleton variant="circular" width={48} height={48} />
          <div className="flex-1 space-y-2">
            <Skeleton width="70%" height={16} />
            <Skeleton width="40%" height={14} />
          </div>
          <Skeleton width={80} height={32} />
        </div>
      ))}
    </div>
  )
}

