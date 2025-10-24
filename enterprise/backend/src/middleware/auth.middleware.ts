import { Request, Response, NextFunction } from 'express'
import { authService } from '../services/auth.service.js'
import { logger } from '../utils/logger.js'

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string
    email: string
    role: string
  }
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({
        error: 'Token de acesso requerido'
      })
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader

    if (!token) {
      return res.status(401).json({
        error: 'Token não fornecido'
      })
    }

    // Verify token
    const payload = authService.verifyToken(token)

    // Attach user info to request
    req.user = payload

    next()
    
  } catch (error) {
    logger.error('Authentication failed:', error)
    
    return res.status(401).json({
      error: 'Token inválido ou expirado'
    })
  }
}

export const requireRole = (roles: string | string[]) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles]
  
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Usuário não autenticado'
      })
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Acesso negado - permissões insuficientes'
      })
    }
    
    next()
  }
}

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (authHeader) {
      const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : authHeader

      if (token) {
        // Verify token
        const payload = authService.verifyToken(token)
        req.user = payload
      }
    }
    
    next()
    
  } catch (error) {
    // For optional auth, we don't return error, just continue without user
    logger.warn('Optional auth failed:', error)
    next()
  }
}