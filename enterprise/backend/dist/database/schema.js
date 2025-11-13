"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings = exports.auditLogs = exports.notifications = exports.events = exports.tasks = exports.projects = exports.chatMessages = exports.chatChannels = exports.courseEnrollments = exports.courses = exports.leaderboard = exports.xpTransactions = exports.userRoles = exports.roles = exports.userProfiles = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
// Users table - Core user information
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).notNull().unique(),
    username: (0, pg_core_1.varchar)('username', { length: 100 }),
    firstName: (0, pg_core_1.varchar)('first_name', { length: 100 }),
    lastName: (0, pg_core_1.varchar)('last_name', { length: 100 }),
    avatar: (0, pg_core_1.text)('avatar'),
    phoneNumber: (0, pg_core_1.varchar)('phone_number', { length: 20 }),
    locale: (0, pg_core_1.varchar)('locale', { length: 10 }).default('en-US'),
    timezone: (0, pg_core_1.varchar)('timezone', { length: 50 }).default('UTC'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    isVerified: (0, pg_core_1.boolean)('is_verified').default(false),
    lastLoginAt: (0, pg_core_1.timestamp)('last_login_at'),
    metadata: (0, pg_core_1.jsonb)('metadata').$type(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
}, (table) => ({
    emailIdx: (0, pg_core_1.index)('users_email_idx').on(table.email),
    usernameIdx: (0, pg_core_1.index)('users_username_idx').on(table.username),
    activeIdx: (0, pg_core_1.index)('users_active_idx').on(table.isActive),
}));
// User profiles - Extended user information
exports.userProfiles = (0, pg_core_1.pgTable)('user_profiles', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id, { onDelete: 'cascade' }).notNull(),
    bio: (0, pg_core_1.text)('bio'),
    department: (0, pg_core_1.varchar)('department', { length: 100 }),
    position: (0, pg_core_1.varchar)('position', { length: 100 }),
    employeeId: (0, pg_core_1.varchar)('employee_id', { length: 50 }),
    managerId: (0, pg_core_1.uuid)('manager_id').references(() => exports.users.id),
    startDate: (0, pg_core_1.timestamp)('start_date'),
    birthDate: (0, pg_core_1.timestamp)('birth_date'),
    address: (0, pg_core_1.jsonb)('address').$type(),
    preferences: (0, pg_core_1.jsonb)('preferences').$type(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
}, (table) => ({
    userIdIdx: (0, pg_core_1.index)('user_profiles_user_id_idx').on(table.userId),
    departmentIdx: (0, pg_core_1.index)('user_profiles_department_idx').on(table.department),
    employeeIdIdx: (0, pg_core_1.index)('user_profiles_employee_id_idx').on(table.employeeId),
}));
// Roles and permissions
exports.roles = (0, pg_core_1.pgTable)('roles', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)('name', { length: 50 }).notNull().unique(),
    description: (0, pg_core_1.text)('description'),
    permissions: (0, pg_core_1.jsonb)('permissions').$type(),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.userRoles = (0, pg_core_1.pgTable)('user_roles', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id, { onDelete: 'cascade' }).notNull(),
    roleId: (0, pg_core_1.uuid)('role_id').references(() => exports.roles.id, { onDelete: 'cascade' }).notNull(),
    grantedBy: (0, pg_core_1.uuid)('granted_by').references(() => exports.users.id),
    grantedAt: (0, pg_core_1.timestamp)('granted_at').defaultNow(),
    expiresAt: (0, pg_core_1.timestamp)('expires_at'),
}, (table) => ({
    userIdIdx: (0, pg_core_1.index)('user_roles_user_id_idx').on(table.userId),
    roleIdIdx: (0, pg_core_1.index)('user_roles_role_id_idx').on(table.roleId),
}));
// Gamification system
exports.xpTransactions = (0, pg_core_1.pgTable)('xp_transactions', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id, { onDelete: 'cascade' }).notNull(),
    points: (0, pg_core_1.integer)('points').notNull(),
    source: (0, pg_core_1.varchar)('source', { length: 100 }).notNull(),
    sourceId: (0, pg_core_1.uuid)('source_id'),
    description: (0, pg_core_1.text)('description'),
    metadata: (0, pg_core_1.jsonb)('metadata').$type(),
    earnedAt: (0, pg_core_1.timestamp)('earned_at').defaultNow(),
}, (table) => ({
    userIdIdx: (0, pg_core_1.index)('xp_transactions_user_id_idx').on(table.userId),
    sourceIdx: (0, pg_core_1.index)('xp_transactions_source_idx').on(table.source),
    earnedAtIdx: (0, pg_core_1.index)('xp_transactions_earned_at_idx').on(table.earnedAt),
}));
exports.leaderboard = (0, pg_core_1.pgTable)('leaderboard', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id, { onDelete: 'cascade' }).notNull(),
    totalXp: (0, pg_core_1.integer)('total_xp').default(0),
    currentRank: (0, pg_core_1.integer)('current_rank'),
    previousRank: (0, pg_core_1.integer)('previous_rank'),
    period: (0, pg_core_1.varchar)('period', { length: 20 }).default('all-time'), // all-time, monthly, weekly
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
}, (table) => ({
    userIdPeriodIdx: (0, pg_core_1.index)('leaderboard_user_period_idx').on(table.userId, table.period),
    rankIdx: (0, pg_core_1.index)('leaderboard_rank_idx').on(table.currentRank),
    totalXpIdx: (0, pg_core_1.index)('leaderboard_total_xp_idx').on(table.totalXp),
}));
// Training and courses
exports.courses = (0, pg_core_1.pgTable)('courses', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    title: (0, pg_core_1.varchar)('title', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    content: (0, pg_core_1.jsonb)('content').$type(),
    duration: (0, pg_core_1.integer)('duration'), // in minutes
    xpReward: (0, pg_core_1.integer)('xp_reward').default(0),
    category: (0, pg_core_1.varchar)('category', { length: 100 }),
    difficulty: (0, pg_core_1.varchar)('difficulty', { length: 20 }).default('beginner'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    prerequisites: (0, pg_core_1.jsonb)('prerequisites').$type(),
    tags: (0, pg_core_1.jsonb)('tags').$type(),
    createdBy: (0, pg_core_1.uuid)('created_by').references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
}, (table) => ({
    titleIdx: (0, pg_core_1.index)('courses_title_idx').on(table.title),
    categoryIdx: (0, pg_core_1.index)('courses_category_idx').on(table.category),
    activeIdx: (0, pg_core_1.index)('courses_active_idx').on(table.isActive),
}));
exports.courseEnrollments = (0, pg_core_1.pgTable)('course_enrollments', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id, { onDelete: 'cascade' }).notNull(),
    courseId: (0, pg_core_1.uuid)('course_id').references(() => exports.courses.id, { onDelete: 'cascade' }).notNull(),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('enrolled'), // enrolled, in-progress, completed, dropped
    progress: (0, pg_core_1.integer)('progress').default(0), // percentage 0-100
    startedAt: (0, pg_core_1.timestamp)('started_at'),
    completedAt: (0, pg_core_1.timestamp)('completed_at'),
    score: (0, pg_core_1.integer)('score'),
    attempts: (0, pg_core_1.integer)('attempts').default(0),
    enrolledAt: (0, pg_core_1.timestamp)('enrolled_at').defaultNow(),
}, (table) => ({
    userIdIdx: (0, pg_core_1.index)('course_enrollments_user_id_idx').on(table.userId),
    courseIdIdx: (0, pg_core_1.index)('course_enrollments_course_id_idx').on(table.courseId),
    statusIdx: (0, pg_core_1.index)('course_enrollments_status_idx').on(table.status),
}));
// Chat and messaging
exports.chatChannels = (0, pg_core_1.pgTable)('chat_channels', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    type: (0, pg_core_1.varchar)('type', { length: 20 }).default('public'), // public, private, direct
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    metadata: (0, pg_core_1.jsonb)('metadata').$type(),
    createdBy: (0, pg_core_1.uuid)('created_by').references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
}, (table) => ({
    nameIdx: (0, pg_core_1.index)('chat_channels_name_idx').on(table.name),
    typeIdx: (0, pg_core_1.index)('chat_channels_type_idx').on(table.type),
    activeIdx: (0, pg_core_1.index)('chat_channels_active_idx').on(table.isActive),
}));
exports.chatMessages = (0, pg_core_1.pgTable)('chat_messages', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    channelId: (0, pg_core_1.uuid)('channel_id').references(() => exports.chatChannels.id, { onDelete: 'cascade' }).notNull(),
    authorId: (0, pg_core_1.uuid)('author_id').references(() => exports.users.id, { onDelete: 'cascade' }).notNull(),
    content: (0, pg_core_1.text)('content').notNull(),
    messageType: (0, pg_core_1.varchar)('message_type', { length: 20 }).default('text'), // text, image, file, system
    attachments: (0, pg_core_1.jsonb)('attachments').$type(),
    mentions: (0, pg_core_1.jsonb)('mentions').$type(),
    reactions: (0, pg_core_1.jsonb)('reactions').$type(),
    isEdited: (0, pg_core_1.boolean)('is_edited').default(false),
    editedAt: (0, pg_core_1.timestamp)('edited_at'),
    deletedAt: (0, pg_core_1.timestamp)('deleted_at'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
}, (table) => ({
    channelIdIdx: (0, pg_core_1.index)('chat_messages_channel_id_idx').on(table.channelId),
    authorIdIdx: (0, pg_core_1.index)('chat_messages_author_id_idx').on(table.authorId),
    createdAtIdx: (0, pg_core_1.index)('chat_messages_created_at_idx').on(table.createdAt),
}));
// Projects and tasks
exports.projects = (0, pg_core_1.pgTable)('projects', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('active'), // active, completed, archived, cancelled
    priority: (0, pg_core_1.varchar)('priority', { length: 20 }).default('medium'), // low, medium, high, urgent
    startDate: (0, pg_core_1.timestamp)('start_date'),
    endDate: (0, pg_core_1.timestamp)('end_date'),
    budget: (0, pg_core_1.integer)('budget'),
    ownerId: (0, pg_core_1.uuid)('owner_id').references(() => exports.users.id),
    teamMembers: (0, pg_core_1.jsonb)('team_members').$type(),
    tags: (0, pg_core_1.jsonb)('tags').$type(),
    metadata: (0, pg_core_1.jsonb)('metadata').$type(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
}, (table) => ({
    nameIdx: (0, pg_core_1.index)('projects_name_idx').on(table.name),
    statusIdx: (0, pg_core_1.index)('projects_status_idx').on(table.status),
    ownerIdIdx: (0, pg_core_1.index)('projects_owner_id_idx').on(table.ownerId),
}));
exports.tasks = (0, pg_core_1.pgTable)('tasks', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    projectId: (0, pg_core_1.uuid)('project_id').references(() => exports.projects.id, { onDelete: 'cascade' }),
    title: (0, pg_core_1.varchar)('title', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).default('todo'), // todo, in-progress, done, cancelled
    priority: (0, pg_core_1.varchar)('priority', { length: 20 }).default('medium'),
    assigneeId: (0, pg_core_1.uuid)('assignee_id').references(() => exports.users.id),
    reporterId: (0, pg_core_1.uuid)('reporter_id').references(() => exports.users.id),
    estimatedHours: (0, pg_core_1.integer)('estimated_hours'),
    actualHours: (0, pg_core_1.integer)('actual_hours'),
    dueDate: (0, pg_core_1.timestamp)('due_date'),
    completedAt: (0, pg_core_1.timestamp)('completed_at'),
    tags: (0, pg_core_1.jsonb)('tags').$type(),
    attachments: (0, pg_core_1.jsonb)('attachments').$type(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
}, (table) => ({
    projectIdIdx: (0, pg_core_1.index)('tasks_project_id_idx').on(table.projectId),
    statusIdx: (0, pg_core_1.index)('tasks_status_idx').on(table.status),
    assigneeIdIdx: (0, pg_core_1.index)('tasks_assignee_id_idx').on(table.assigneeId),
    dueDateIdx: (0, pg_core_1.index)('tasks_due_date_idx').on(table.dueDate),
}));
// Calendar and events
exports.events = (0, pg_core_1.pgTable)('events', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    title: (0, pg_core_1.varchar)('title', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    location: (0, pg_core_1.varchar)('location', { length: 255 }),
    startTime: (0, pg_core_1.timestamp)('start_time').notNull(),
    endTime: (0, pg_core_1.timestamp)('end_time').notNull(),
    isAllDay: (0, pg_core_1.boolean)('is_all_day').default(false),
    recurrence: (0, pg_core_1.jsonb)('recurrence').$type(),
    attendees: (0, pg_core_1.jsonb)('attendees').$type(),
    organizerId: (0, pg_core_1.uuid)('organizer_id').references(() => exports.users.id),
    visibility: (0, pg_core_1.varchar)('visibility', { length: 20 }).default('private'), // private, public, shared
    metadata: (0, pg_core_1.jsonb)('metadata').$type(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
}, (table) => ({
    startTimeIdx: (0, pg_core_1.index)('events_start_time_idx').on(table.startTime),
    organizerIdIdx: (0, pg_core_1.index)('events_organizer_id_idx').on(table.organizerId),
    visibilityIdx: (0, pg_core_1.index)('events_visibility_idx').on(table.visibility),
}));
// Notifications
exports.notifications = (0, pg_core_1.pgTable)('notifications', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id, { onDelete: 'cascade' }).notNull(),
    title: (0, pg_core_1.varchar)('title', { length: 255 }).notNull(),
    message: (0, pg_core_1.text)('message').notNull(),
    type: (0, pg_core_1.varchar)('type', { length: 50 }).notNull(), // info, success, warning, error, xp_earned, course_completed
    category: (0, pg_core_1.varchar)('category', { length: 50 }), // gamification, training, chat, calendar, system
    isRead: (0, pg_core_1.boolean)('is_read').default(false),
    actionUrl: (0, pg_core_1.varchar)('action_url', { length: 500 }),
    metadata: (0, pg_core_1.jsonb)('metadata').$type(),
    expiresAt: (0, pg_core_1.timestamp)('expires_at'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
}, (table) => ({
    userIdIdx: (0, pg_core_1.index)('notifications_user_id_idx').on(table.userId),
    typeIdx: (0, pg_core_1.index)('notifications_type_idx').on(table.type),
    isReadIdx: (0, pg_core_1.index)('notifications_is_read_idx').on(table.isRead),
    createdAtIdx: (0, pg_core_1.index)('notifications_created_at_idx').on(table.createdAt),
}));
// Audit logs
exports.auditLogs = (0, pg_core_1.pgTable)('audit_logs', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id),
    action: (0, pg_core_1.varchar)('action', { length: 100 }).notNull(),
    resource: (0, pg_core_1.varchar)('resource', { length: 100 }).notNull(),
    resourceId: (0, pg_core_1.uuid)('resource_id'),
    oldValues: (0, pg_core_1.jsonb)('old_values').$type(),
    newValues: (0, pg_core_1.jsonb)('new_values').$type(),
    ipAddress: (0, pg_core_1.varchar)('ip_address', { length: 45 }),
    userAgent: (0, pg_core_1.text)('user_agent'),
    metadata: (0, pg_core_1.jsonb)('metadata').$type(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
}, (table) => ({
    userIdIdx: (0, pg_core_1.index)('audit_logs_user_id_idx').on(table.userId),
    actionIdx: (0, pg_core_1.index)('audit_logs_action_idx').on(table.action),
    resourceIdx: (0, pg_core_1.index)('audit_logs_resource_idx').on(table.resource),
    createdAtIdx: (0, pg_core_1.index)('audit_logs_created_at_idx').on(table.createdAt),
}));
// System settings
exports.settings = (0, pg_core_1.pgTable)('settings', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    key: (0, pg_core_1.varchar)('key', { length: 255 }).notNull().unique(),
    value: (0, pg_core_1.jsonb)('value').$type(),
    description: (0, pg_core_1.text)('description'),
    category: (0, pg_core_1.varchar)('category', { length: 100 }),
    isPublic: (0, pg_core_1.boolean)('is_public').default(false),
    updatedBy: (0, pg_core_1.uuid)('updated_by').references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
}, (table) => ({
    keyIdx: (0, pg_core_1.index)('settings_key_idx').on(table.key),
    categoryIdx: (0, pg_core_1.index)('settings_category_idx').on(table.category),
}));
