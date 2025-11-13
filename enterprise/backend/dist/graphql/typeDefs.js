"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.typeDefs = (0, apollo_server_express_1.gql) `
  scalar DateTime
  
  type User {
    id: ID!
    email: String!
    username: String!
    firstName: String!
    lastName: String!
    role: UserRole!
    avatar: String
    department: String
    position: String
    totalXP: Int!
    level: Int!
    weeklyXP: Int!
    currentStreak: Int!
    longestStreak: Int!
    lastActive: DateTime!
    isOnline: Boolean!
    createdAt: DateTime!
  }
  
  type AuthPayload {
    token: String!
    user: User!
  }
  
  type Course {
    id: ID!
    title: String!
    description: String!
    thumbnail: String
    category: String!
    difficulty: CourseDifficulty!
    xpReward: Int!
    estimatedTime: String!
    isActive: Boolean!
    lessons: [Lesson!]!
    enrollment: CourseEnrollment
    totalLessons: Int!
    totalEnrollments: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
  
  type Lesson {
    id: ID!
    title: String!
    content: String!
    videoUrl: String
    order: Int!
    xpReward: Int!
    isCompleted: Boolean
    course: Course!
  }
  
  type CourseEnrollment {
    id: ID!
    enrolledAt: DateTime!
    completedAt: DateTime
    progress: Int!
    user: User!
    course: Course!
  }
  
  type LessonCompletion {
    id: ID!
    completedAt: DateTime!
    xpEarned: Int!
  }
  
  type Achievement {
    id: ID!
    title: String!
    description: String!
    icon: String!
    xpReward: Int!
    type: AchievementType!
    condition: String!
  }
  
  type UserAchievement {
    id: ID!
    unlockedAt: DateTime!
    user: User!
    achievement: Achievement!
  }
  
  type Message {
    id: ID!
    content: String!
    type: MessageType!
    fileUrl: String
    fileName: String
    isEdited: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    sender: User!
    channel: Channel!
  }
  
  type Channel {
    id: ID!
    name: String!
    description: String
    type: ChannelType!
    createdAt: DateTime!
    updatedAt: DateTime!
    messages: [Message!]!
    members: [ChannelMember!]!
  }
  
  type ChannelMember {
    id: ID!
    joinedAt: DateTime!
    role: ChannelRole!
    user: User!
    channel: Channel!
  }
  
  type Event {
    id: ID!
    title: String!
    description: String
    startDate: DateTime!
    endDate: DateTime!
    type: EventType!
    location: String
    isAllDay: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    organizer: User!
    attendees: [EventAttendee!]!
  }
  
  type EventAttendee {
    id: ID!
    status: AttendanceStatus!
    user: User!
    event: Event!
  }
  
  type Project {
    id: ID!
    name: String!
    description: String
    status: ProjectStatus!
    priority: ProjectPriority!
    startDate: DateTime
    dueDate: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
    tasks: [Task!]!
    members: [ProjectMember!]!
  }
  
  type ProjectMember {
    id: ID!
    role: ProjectRole!
    joinedAt: DateTime!
    user: User!
    project: Project!
  }
  
  type Task {
    id: ID!
    title: String!
    description: String
    status: TaskStatus!
    priority: TaskPriority!
    dueDate: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
    assignee: User
    project: Project!
  }
  
  type Policy {
    id: ID!
    title: String!
    content: String!
    version: String!
    category: String!
    isActive: Boolean!
    requiresAcknowledgment: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    userRead: PolicyRead
  }
  
  type PolicyRead {
    id: ID!
    readAt: DateTime!
    acknowledged: Boolean!
    user: User!
    policy: Policy!
  }
  
  type Link {
    id: ID!
    title: String!
    url: String!
    description: String
    category: LinkCategory!
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
  
  # Enums
  enum UserRole {
    ADMIN
    MANAGER
    USER
  }
  
  enum CourseDifficulty {
    BEGINNER
    INTERMEDIATE
    ADVANCED
  }
  
  enum AchievementType {
    COURSE_COMPLETION
    XP_MILESTONE
    LOGIN_STREAK
    COMMUNITY_PARTICIPATION
    SPECIAL_EVENT
  }
  
  enum MessageType {
    TEXT
    FILE
    IMAGE
    SYSTEM
  }
  
  enum ChannelType {
    PUBLIC
    PRIVATE
    DIRECT
  }
  
  enum ChannelRole {
    ADMIN
    MODERATOR
    MEMBER
  }
  
  enum EventType {
    MEETING
    TRAINING
    DEADLINE
    HOLIDAY
    OTHER
  }
  
  enum AttendanceStatus {
    PENDING
    ACCEPTED
    DECLINED
    MAYBE
  }
  
  enum ProjectStatus {
    PLANNING
    ACTIVE
    ON_HOLD
    COMPLETED
    CANCELLED
  }
  
  enum ProjectPriority {
    LOW
    MEDIUM
    HIGH
    URGENT
  }
  
  enum ProjectRole {
    OWNER
    ADMIN
    MEMBER
    VIEWER
  }
  
  enum TaskStatus {
    TODO
    IN_PROGRESS
    REVIEW
    DONE
  }
  
  enum TaskPriority {
    LOW
    MEDIUM
    HIGH
    URGENT
  }
  
  enum LinkCategory {
    SYSTEM
    TRAINING
    SUPPORT
    EXTERNAL
  }
  
  # Input Types
  input LoginInput {
    email: String!
    password: String!
  }
  
  input RegisterInput {
    email: String!
    username: String!
    password: String!
    firstName: String!
    lastName: String!
    department: String
    position: String
  }
  
  input CreateCourseInput {
    title: String!
    description: String!
    category: String!
    difficulty: CourseDifficulty!
    xpReward: Int
    estimatedTime: String!
    thumbnail: String
  }
  
  input CreateLessonInput {
    title: String!
    content: String!
    videoUrl: String
    xpReward: Int
  }
  
  input SendMessageInput {
    content: String!
    type: MessageType
    fileUrl: String
    fileName: String
    channelId: ID!
  }
  
  input CreateEventInput {
    title: String!
    description: String
    startDate: DateTime!
    endDate: DateTime!
    type: EventType!
    location: String
    isAllDay: Boolean
  }
  
  input CreateProjectInput {
    name: String!
    description: String
    priority: ProjectPriority
    startDate: DateTime
    dueDate: DateTime
  }
  
  input CreateTaskInput {
    title: String!
    description: String
    priority: TaskPriority
    dueDate: DateTime
    assigneeId: ID
    projectId: ID!
  }
  
  input UpdateTaskInput {
    title: String
    description: String
    status: TaskStatus
    priority: TaskPriority
    dueDate: DateTime
    assigneeId: ID
  }
  
  # Queries
  type Query {
    # Auth
    me: User
    
    # Courses
    courses: [Course!]!
    course(id: ID!): Course
    myCourses: [Course!]!
    
    # Achievements
    achievements: [Achievement!]!
    myAchievements: [UserAchievement!]!
    
    # Chat
    channels: [Channel!]!
    channel(id: ID!): Channel
    messages(channelId: ID!, limit: Int, offset: Int): [Message!]!
    
    # Calendar
    events(startDate: DateTime, endDate: DateTime): [Event!]!
    event(id: ID!): Event
    
    # Projects
    projects: [Project!]!
    project(id: ID!): Project
    myProjects: [Project!]!
    
    # Policies
    policies: [Policy!]!
    policy(id: ID!): Policy
    
    # Links
    links: [Link!]!
  }
  
  # Mutations
  type Mutation {
    # Auth
    login(input: LoginInput!): AuthPayload!
    register(input: RegisterInput!): AuthPayload!
    logout: Boolean!
    
    # Courses
    enrollInCourse(courseId: ID!): CourseEnrollment!
    completeLesson(lessonId: ID!): LessonCompletion!
    createCourse(input: CreateCourseInput!): Course!
    addLessonToCourse(courseId: ID!, input: CreateLessonInput!): Lesson!
    
    # Chat
    sendMessage(input: SendMessageInput!): Message!
    joinChannel(channelId: ID!): ChannelMember!
    
    # Calendar
    createEvent(input: CreateEventInput!): Event!
    updateEventAttendance(eventId: ID!, status: AttendanceStatus!): EventAttendee!
    
    # Projects
    createProject(input: CreateProjectInput!): Project!
    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, input: UpdateTaskInput!): Task!
    deleteTask(id: ID!): Boolean!
    
    # Policies
    markPolicyAsRead(policyId: ID!): PolicyRead!
    acknowledgPolicy(policyId: ID!): PolicyRead!
  }
  
  # Subscriptions
  type Subscription {
    messageAdded(channelId: ID!): Message!
    userOnlineStatus: User!
    taskUpdated(projectId: ID!): Task!
  }
`;
