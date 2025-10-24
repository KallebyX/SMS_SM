import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { config } from '../config/index.js'
import { logger } from '../utils/logger.js'

const prisma = new PrismaClient()

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  username: string
  password: string
  firstName: string
  lastName: string
  department?: string
  position?: string
}

export class AuthService {
  
  async login(credentials: LoginCredentials) {
    try {
      const { email, password } = credentials
      
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          username: true,
          password: true,
          firstName: true,
          lastName: true,
          role: true,
          avatar: true,
          department: true,
          position: true,
          totalXP: true,
          level: true,
          lastActive: true
        }
      })
      
      if (!user) {
        throw new Error('Usuário não encontrado')
      }
      
      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        throw new Error('Senha incorreta')
      }
      
      // Update last active
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          lastActive: new Date(),
          isOnline: true
        }
      })
      
      // Generate JWT token
      const token = this.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role
      })
      
      // Return user data without password
      const { password: _, ...userWithoutPassword } = user
      
      logger.info(`User ${user.email} logged in successfully`)
      
      return {
        token,
        user: userWithoutPassword
      }
      
    } catch (error) {
      logger.error('Login failed:', error)
      throw error
    }
  }
  
  async register(data: RegisterData) {
    try {
      const { email, username, password, firstName, lastName, department, position } = data
      
      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { username }
          ]
        }
      })
      
      if (existingUser) {
        if (existingUser.email === email) {
          throw new Error('Email já está em uso')
        }
        if (existingUser.username === username) {
          throw new Error('Nome de usuário já está em uso')
        }
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12)
      
      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          firstName,
          lastName,
          department,
          position,
          role: 'USER'
        },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          avatar: true,
          department: true,
          position: true,
          totalXP: true,
          level: true,
          createdAt: true
        }
      })
      
      // Generate JWT token
      const token = this.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role
      })
      
      logger.info(`New user registered: ${user.email}`)
      
      return {
        token,
        user
      }
      
    } catch (error) {
      logger.error('Registration failed:', error)
      throw error
    }
  }
  
  async logout(userId: string) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { isOnline: false }
      })
      
      logger.info(`User ${userId} logged out`)
      
    } catch (error) {
      logger.error('Logout failed:', error)
      throw error
    }
  }
  
  generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN
    })
  }
  
  verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, config.JWT_SECRET) as JWTPayload
    } catch (error) {
      throw new Error('Token inválido')
    }
  }
  
  async getUserById(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          avatar: true,
          department: true,
          position: true,
          totalXP: true,
          level: true,
          weeklyXP: true,
          lastActive: true,
          isOnline: true,
          createdAt: true
        }
      })
      
      if (!user) {
        throw new Error('Usuário não encontrado')
      }
      
      return user
      
    } catch (error) {
      logger.error('Get user by ID failed:', error)
      throw error
    }
  }
  
  async refreshToken(oldToken: string) {
    try {
      const payload = this.verifyToken(oldToken)
      
      // Verify user still exists
      const user = await this.getUserById(payload.userId)
      
      // Generate new token
      const newToken = this.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role
      })
      
      return {
        token: newToken,
        user
      }
      
    } catch (error) {
      logger.error('Token refresh failed:', error)
      throw error
    }
  }
}

export const authService = new AuthService()