import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: Partial<User> & { password: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate checking for existing auth token
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('userData')
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Failed to parse user data:', error)
        localStorage.removeItem('authToken')
        localStorage.removeItem('userData')
      }
    } else {
      // Auto-login para desenvolvimento/teste
      const mockUser: User = {
        id: '1',
        name: 'Ana Costa',
        email: 'ana.costa@sms.com',
        role: 'admin',
        department: 'Enfermagem'
      }
      
      const mockToken = 'mock-jwt-token'
      localStorage.setItem('authToken', mockToken)
      localStorage.setItem('userData', JSON.stringify(mockUser))
      setUser(mockUser)
    }
    
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data
      const mockUser: User = {
        id: '1',
        name: 'Ana Costa',
        email: email,
        role: 'Enfermeira Chefe',
        department: 'Enfermagem'
      }
      
      const mockToken = 'mock-jwt-token'
      
      localStorage.setItem('authToken', mockToken)
      localStorage.setItem('userData', JSON.stringify(mockUser))
      setUser(mockUser)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: Partial<User> & { password: string }) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || '',
        department: userData.department || ''
      }
      
      const mockToken = 'mock-jwt-token'
      
      localStorage.setItem('authToken', mockToken)
      localStorage.setItem('userData', JSON.stringify(newUser))
      setUser(newUser)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}