import { z } from 'zod'

// User Validation Schemas
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres')
})

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  username: z.string().min(3, 'Nome de usuário deve ter no mínimo 3 caracteres'),
  password: z.string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter no mínimo 2 caracteres'),
  department: z.string().optional(),
  position: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
})

export const profileUpdateSchema = z.object({
  firstName: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  bio: z.string().max(500, 'Biografia deve ter no máximo 500 caracteres').optional()
})

// Project Validation Schemas
export const createProjectSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  status: z.enum(['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED']).optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional()
}).refine((data) => {
  if (data.startDate && data.dueDate) {
    return new Date(data.startDate) <= new Date(data.dueDate)
  }
  return true
}, {
  message: 'Data de término deve ser posterior à data de início',
  path: ['dueDate']
})

export const createTaskSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']).optional(),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional(),
  projectId: z.string()
})

// Event Validation Schemas
export const createEventSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  description: z.string().optional(),
  type: z.enum(['MEETING', 'TRAINING', 'DEADLINE', 'HOLIDAY', 'OTHER']),
  location: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  isAllDay: z.boolean().optional()
}).refine((data) => {
  return new Date(data.startDate) <= new Date(data.endDate)
}, {
  message: 'Data de término deve ser posterior à data de início',
  path: ['endDate']
})

// Course Validation Schemas
export const createCourseSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  category: z.string(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  xpReward: z.number().min(0).optional(),
  estimatedTime: z.string(),
  thumbnail: z.string().url('URL inválida').optional()
})

// Link Validation Schemas
export const createLinkSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  url: z.string().url('URL inválida'),
  description: z.string().optional(),
  category: z.enum(['SYSTEM', 'TRAINING', 'SUPPORT', 'EXTERNAL'])
})

// Policy Validation Schemas
export const createPolicySchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  content: z.string().min(10, 'Conteúdo deve ter no mínimo 10 caracteres'),
  version: z.string(),
  category: z.string(),
  requiresAcknowledgment: z.boolean().optional()
})

// Message Validation Schemas
export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Mensagem não pode estar vazia').max(2000, 'Mensagem muito longa'),
  type: z.enum(['TEXT', 'FILE', 'IMAGE', 'SYSTEM']).optional(),
  channelId: z.string(),
  fileUrl: z.string().optional(),
  fileName: z.string().optional()
})

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>
export type CreateProjectFormData = z.infer<typeof createProjectSchema>
export type CreateTaskFormData = z.infer<typeof createTaskSchema>
export type CreateEventFormData = z.infer<typeof createEventSchema>
export type CreateCourseFormData = z.infer<typeof createCourseSchema>
export type CreateLinkFormData = z.infer<typeof createLinkSchema>
export type CreatePolicyFormData = z.infer<typeof createPolicySchema>
export type SendMessageFormData = z.infer<typeof sendMessageSchema>

