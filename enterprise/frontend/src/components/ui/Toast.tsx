import React, { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void
  hideToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(7)
    const newToast = { ...toast, id }
    
    setToasts((prev) => [...prev, newToast])

    // Auto remove after duration
    setTimeout(() => {
      hideToast(id)
    }, toast.duration || 5000)
  }, [])

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const getIcon = (type: ToastType) => {
    const icons = {
      success: CheckCircle,
      error: XCircle,
      warning: AlertCircle,
      info: Info
    }
    return icons[type]
  }

  const getColors = (type: ToastType) => {
    const colors = {
      success: 'bg-green-50 border-green-200 text-green-900',
      error: 'bg-red-50 border-red-200 text-red-900',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
      info: 'bg-blue-50 border-blue-200 text-blue-900'
    }
    return colors[type]
  }

  const getIconColors = (type: ToastType) => {
    const colors = {
      success: 'text-green-600',
      error: 'text-red-600',
      warning: 'text-yellow-600',
      info: 'text-blue-600'
    }
    return colors[type]
  }

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      
      <div className="fixed top-4 right-4 z-[9999] space-y-2 max-w-md">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = getIcon(toast.type)
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.95 }}
                className={`${getColors(toast.type)} border rounded-lg shadow-lg p-4 flex items-start space-x-3`}
              >
                <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${getIconColors(toast.type)}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{toast.title}</p>
                  {toast.message && (
                    <p className="text-sm mt-1 opacity-90">{toast.message}</p>
                  )}
                </div>
                <button
                  onClick={() => hideToast(toast.id)}
                  className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                  aria-label="Fechar notificação"
                  title="Fechar"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

// Helper hooks for common toast types
export const useSuccessToast = () => {
  const { showToast } = useToast()
  return useCallback((title: string, message?: string) => {
    showToast({ type: 'success', title, message })
  }, [showToast])
}

export const useErrorToast = () => {
  const { showToast } = useToast()
  return useCallback((title: string, message?: string) => {
    showToast({ type: 'error', title, message })
  }, [showToast])
}

export const useWarningToast = () => {
  const { showToast } = useToast()
  return useCallback((title: string, message?: string) => {
    showToast({ type: 'warning', title, message })
  }, [showToast])
}

export const useInfoToast = () => {
  const { showToast } = useToast()
  return useCallback((title: string, message?: string) => {
    showToast({ type: 'info', title, message })
  }, [showToast])
}

