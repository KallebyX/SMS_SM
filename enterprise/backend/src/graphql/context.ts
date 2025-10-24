import { AuthenticationError } from 'apollo-server-express'
import { authService } from '../services/auth.service.js'

export interface Context {
  user?: {
    userId: string
    email: string
    role: string
  }
}

export const createContext = async ({ req }: { req: any }): Promise<Context> => {
  const context: Context = {}
  
  try {
    const authHeader = req.headers.authorization
    
    if (authHeader) {
      const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : authHeader
      
      if (token) {
        // Verify token
        const payload = authService.verifyToken(token)
        context.user = payload
      }
    }
  } catch (error) {
    // For GraphQL context, we don't throw here, just leave user undefined
    // Individual resolvers will check authentication as needed
  }
  
  return context
}