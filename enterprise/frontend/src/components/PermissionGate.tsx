import React from 'react'
import { useAuth } from './providers/AuthProvider'

interface PermissionGateProps {
  children: React.ReactNode
  requiredRole?: ('ADMIN' | 'MANAGER' | 'USER')[]
  requiredPermission?: string[]
  fallback?: React.ReactNode
  hideIfNoAccess?: boolean
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  requiredRole,
  requiredPermission,
  fallback,
  hideIfNoAccess = false
}) => {
  const { user } = useAuth()

  // Check role-based access
  const hasRoleAccess = () => {
    if (!requiredRole || requiredRole.length === 0) return true
    if (!user) return false
    return requiredRole.includes(user.role as any)
  }

  // Check permission-based access (for future implementation)
  const hasPermissionAccess = () => {
    if (!requiredPermission || requiredPermission.length === 0) return true
    // TODO: Implement permission checking logic
    return true
  }

  const hasAccess = hasRoleAccess() && hasPermissionAccess()

  if (!hasAccess) {
    if (hideIfNoAccess) return null
    if (fallback) return <>{fallback}</>
    
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Você não tem permissão para acessar este recurso.</p>
      </div>
    )
  }

  return <>{children}</>
}

// HOC for protecting components
export const withPermission = <P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: ('ADMIN' | 'MANAGER' | 'USER')[]
) => {
  return (props: P) => (
    <PermissionGate requiredRole={requiredRole}>
      <Component {...props} />
    </PermissionGate>
  )
}

// Hook for permission checking
export const usePermissions = () => {
  const { user } = useAuth()

  const hasRole = (roles: ('ADMIN' | 'MANAGER' | 'USER')[]) => {
    if (!user) return false
    return roles.includes(user.role as any)
  }

  const isAdmin = () => user?.role === 'ADMIN'
  const isManager = () => user?.role === 'MANAGER' || user?.role === 'ADMIN'
  const isUser = () => !!user

  return {
    hasRole,
    isAdmin: isAdmin(),
    isManager: isManager(),
    isUser: isUser(),
    user
  }
}

