import { pgTable, uuid, varchar, text, timestamp, integer, boolean, jsonb, index } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

// Users table - Core user information
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 100 }),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  avatar: text('avatar'),
  phoneNumber: varchar('phone_number', { length: 20 }),
  locale: varchar('locale', { length: 10 }).default('en-US'),
  timezone: varchar('timezone', { length: 50 }).default('UTC'),
  isActive: boolean('is_active').default(true),
  isVerified: boolean('is_verified').default(false),
  lastLoginAt: timestamp('last_login_at'),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  usernameIdx: index('users_username_idx').on(table.username),
  activeIdx: index('users_active_idx').on(table.isActive),
}))

// User profiles - Extended user information
export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  bio: text('bio'),
  department: varchar('department', { length: 100 }),
  position: varchar('position', { length: 100 }),
  employeeId: varchar('employee_id', { length: 50 }),
  managerId: uuid('manager_id').references(() => users.id),
  startDate: timestamp('start_date'),
  birthDate: timestamp('birth_date'),
  address: jsonb('address').$type<{
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }>(),
  preferences: jsonb('preferences').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('user_profiles_user_id_idx').on(table.userId),
  departmentIdx: index('user_profiles_department_idx').on(table.department),
  employeeIdIdx: index('user_profiles_employee_id_idx').on(table.employeeId),
}))

// Roles and permissions
export const roles = pgTable('roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  description: text('description'),
  permissions: jsonb('permissions').$type<string[]>(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const userRoles = pgTable('user_roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  roleId: uuid('role_id').references(() => roles.id, { onDelete: 'cascade' }).notNull(),
  grantedBy: uuid('granted_by').references(() => users.id),
  grantedAt: timestamp('granted_at').defaultNow(),
  expiresAt: timestamp('expires_at'),
}, (table) => ({
  userIdIdx: index('user_roles_user_id_idx').on(table.userId),
  roleIdIdx: index('user_roles_role_id_idx').on(table.roleId),
}))

// Gamification system
export const xpTransactions = pgTable('xp_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  points: integer('points').notNull(),
  source: varchar('source', { length: 100 }).notNull(),
  sourceId: uuid('source_id'),
  description: text('description'),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  earnedAt: timestamp('earned_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('xp_transactions_user_id_idx').on(table.userId),
  sourceIdx: index('xp_transactions_source_idx').on(table.source),
  earnedAtIdx: index('xp_transactions_earned_at_idx').on(table.earnedAt),
}))

export const leaderboard = pgTable('leaderboard', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  totalXp: integer('total_xp').default(0),
  currentRank: integer('current_rank'),
  previousRank: integer('previous_rank'),
  period: varchar('period', { length: 20 }).default('all-time'), // all-time, monthly, weekly
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdPeriodIdx: index('leaderboard_user_period_idx').on(table.userId, table.period),
  rankIdx: index('leaderboard_rank_idx').on(table.currentRank),
  totalXpIdx: index('leaderboard_total_xp_idx').on(table.totalXp),
}))

// Training and courses
export const courses = pgTable('courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  content: jsonb('content').$type<Record<string, any>>(),
  duration: integer('duration'), // in minutes
  xpReward: integer('xp_reward').default(0),
  category: varchar('category', { length: 100 }),
  difficulty: varchar('difficulty', { length: 20 }).default('beginner'),
  isActive: boolean('is_active').default(true),
  prerequisites: jsonb('prerequisites').$type<string[]>(),
  tags: jsonb('tags').$type<string[]>(),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  titleIdx: index('courses_title_idx').on(table.title),
  categoryIdx: index('courses_category_idx').on(table.category),
  activeIdx: index('courses_active_idx').on(table.isActive),
}))

export const courseEnrollments = pgTable('course_enrollments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  courseId: uuid('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  status: varchar('status', { length: 20 }).default('enrolled'), // enrolled, in-progress, completed, dropped
  progress: integer('progress').default(0), // percentage 0-100
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  score: integer('score'),
  attempts: integer('attempts').default(0),
  enrolledAt: timestamp('enrolled_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('course_enrollments_user_id_idx').on(table.userId),
  courseIdIdx: index('course_enrollments_course_id_idx').on(table.courseId),
  statusIdx: index('course_enrollments_status_idx').on(table.status),
}))

// Chat and messaging
export const chatChannels = pgTable('chat_channels', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  type: varchar('type', { length: 20 }).default('public'), // public, private, direct
  isActive: boolean('is_active').default(true),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  nameIdx: index('chat_channels_name_idx').on(table.name),
  typeIdx: index('chat_channels_type_idx').on(table.type),
  activeIdx: index('chat_channels_active_idx').on(table.isActive),
}))

export const chatMessages = pgTable('chat_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  channelId: uuid('channel_id').references(() => chatChannels.id, { onDelete: 'cascade' }).notNull(),
  authorId: uuid('author_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  content: text('content').notNull(),
  messageType: varchar('message_type', { length: 20 }).default('text'), // text, image, file, system
  attachments: jsonb('attachments').$type<Array<{
    id: string
    name: string
    url: string
    type: string
    size: number
  }>>(),
  mentions: jsonb('mentions').$type<string[]>(),
  reactions: jsonb('reactions').$type<Record<string, string[]>>(),
  isEdited: boolean('is_edited').default(false),
  editedAt: timestamp('edited_at'),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  channelIdIdx: index('chat_messages_channel_id_idx').on(table.channelId),
  authorIdIdx: index('chat_messages_author_id_idx').on(table.authorId),
  createdAtIdx: index('chat_messages_created_at_idx').on(table.createdAt),
}))

// Projects and tasks
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 20 }).default('active'), // active, completed, archived, cancelled
  priority: varchar('priority', { length: 20 }).default('medium'), // low, medium, high, urgent
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  budget: integer('budget'),
  ownerId: uuid('owner_id').references(() => users.id),
  teamMembers: jsonb('team_members').$type<string[]>(),
  tags: jsonb('tags').$type<string[]>(),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  nameIdx: index('projects_name_idx').on(table.name),
  statusIdx: index('projects_status_idx').on(table.status),
  ownerIdIdx: index('projects_owner_id_idx').on(table.ownerId),
}))

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 20 }).default('todo'), // todo, in-progress, done, cancelled
  priority: varchar('priority', { length: 20 }).default('medium'),
  assigneeId: uuid('assignee_id').references(() => users.id),
  reporterId: uuid('reporter_id').references(() => users.id),
  estimatedHours: integer('estimated_hours'),
  actualHours: integer('actual_hours'),
  dueDate: timestamp('due_date'),
  completedAt: timestamp('completed_at'),
  tags: jsonb('tags').$type<string[]>(),
  attachments: jsonb('attachments').$type<Array<{
    id: string
    name: string
    url: string
    type: string
    size: number
  }>>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  projectIdIdx: index('tasks_project_id_idx').on(table.projectId),
  statusIdx: index('tasks_status_idx').on(table.status),
  assigneeIdIdx: index('tasks_assignee_id_idx').on(table.assigneeId),
  dueDateIdx: index('tasks_due_date_idx').on(table.dueDate),
}))

// Calendar and events
export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  location: varchar('location', { length: 255 }),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  isAllDay: boolean('is_all_day').default(false),
  recurrence: jsonb('recurrence').$type<{
    pattern: string
    interval: number
    endDate?: string
    count?: number
  }>(),
  attendees: jsonb('attendees').$type<string[]>(),
  organizerId: uuid('organizer_id').references(() => users.id),
  visibility: varchar('visibility', { length: 20 }).default('private'), // private, public, shared
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  startTimeIdx: index('events_start_time_idx').on(table.startTime),
  organizerIdIdx: index('events_organizer_id_idx').on(table.organizerId),
  visibilityIdx: index('events_visibility_idx').on(table.visibility),
}))

// Notifications
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  type: varchar('type', { length: 50 }).notNull(), // info, success, warning, error, xp_earned, course_completed
  category: varchar('category', { length: 50 }), // gamification, training, chat, calendar, system
  isRead: boolean('is_read').default(false),
  actionUrl: varchar('action_url', { length: 500 }),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('notifications_user_id_idx').on(table.userId),
  typeIdx: index('notifications_type_idx').on(table.type),
  isReadIdx: index('notifications_is_read_idx').on(table.isRead),
  createdAtIdx: index('notifications_created_at_idx').on(table.createdAt),
}))

// Audit logs
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(),
  resource: varchar('resource', { length: 100 }).notNull(),
  resourceId: uuid('resource_id'),
  oldValues: jsonb('old_values').$type<Record<string, any>>(),
  newValues: jsonb('new_values').$type<Record<string, any>>(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('audit_logs_user_id_idx').on(table.userId),
  actionIdx: index('audit_logs_action_idx').on(table.action),
  resourceIdx: index('audit_logs_resource_idx').on(table.resource),
  createdAtIdx: index('audit_logs_created_at_idx').on(table.createdAt),
}))

// System settings
export const settings = pgTable('settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: varchar('key', { length: 255 }).notNull().unique(),
  value: jsonb('value').$type<any>(),
  description: text('description'),
  category: varchar('category', { length: 100 }),
  isPublic: boolean('is_public').default(false),
  updatedBy: uuid('updated_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  keyIdx: index('settings_key_idx').on(table.key),
  categoryIdx: index('settings_category_idx').on(table.category),
}))

// Export all table types for TypeScript inference
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type UserProfile = typeof userProfiles.$inferSelect
export type NewUserProfile = typeof userProfiles.$inferInsert
export type Role = typeof roles.$inferSelect
export type NewRole = typeof roles.$inferInsert
export type XpTransaction = typeof xpTransactions.$inferSelect
export type NewXpTransaction = typeof xpTransactions.$inferInsert
export type Course = typeof courses.$inferSelect
export type NewCourse = typeof courses.$inferInsert
export type ChatMessage = typeof chatMessages.$inferSelect
export type NewChatMessage = typeof chatMessages.$inferInsert
export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert
export type Event = typeof events.$inferSelect
export type NewEvent = typeof events.$inferInsert
export type Notification = typeof notifications.$inferSelect
export type NewNotification = typeof notifications.$inferInsert