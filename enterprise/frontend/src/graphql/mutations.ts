import { gql } from '@apollo/client'

// ============================================
// AUTH MUTATIONS
// ============================================
export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        username
        firstName
        lastName
        role
        avatar
      }
    }
  }
`

export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        email
        username
        firstName
        lastName
        role
        avatar
      }
    }
  }
`

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`

// ============================================
// COURSES MUTATIONS
// ============================================
export const ENROLL_IN_COURSE = gql`
  mutation EnrollInCourse($courseId: ID!) {
    enrollInCourse(courseId: $courseId) {
      id
      enrolledAt
      completedAt
      progress
      user {
        id
        username
      }
      course {
        id
        title
      }
    }
  }
`

export const COMPLETE_LESSON = gql`
  mutation CompleteLesson($lessonId: ID!) {
    completeLesson(lessonId: $lessonId) {
      id
      completedAt
      xpEarned
    }
  }
`

// ============================================
// CHAT MUTATIONS
// ============================================
export const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
      content
      type
      createdAt
      sender {
        id
        username
        firstName
        lastName
        avatar
      }
      channel {
        id
        name
      }
    }
  }
`

export const JOIN_CHANNEL = gql`
  mutation JoinChannel($channelId: ID!) {
    joinChannel(channelId: $channelId) {
      id
      joinedAt
      role
      user {
        id
        username
      }
      channel {
        id
        name
      }
    }
  }
`

// ============================================
// CALENDAR MUTATIONS
// ============================================
export const CREATE_EVENT = gql`
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      id
      title
      description
      startDate
      endDate
      type
      location
      isAllDay
      organizer {
        id
        firstName
        lastName
      }
      createdAt
    }
  }
`

export const UPDATE_EVENT_ATTENDANCE = gql`
  mutation UpdateEventAttendance($eventId: ID!, $status: AttendanceStatus!) {
    updateEventAttendance(eventId: $eventId, status: $status) {
      id
      status
      user {
        id
        firstName
        lastName
      }
      event {
        id
        title
      }
    }
  }
`

// ============================================
// PROJECTS MUTATIONS
// ============================================
export const CREATE_PROJECT = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      name
      description
      status
      priority
      startDate
      dueDate
      createdAt
      members {
        id
        role
        user {
          id
          username
        }
      }
    }
  }
`

export const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
      description
      status
      priority
      dueDate
      createdAt
      assignee {
        id
        firstName
        lastName
      }
      project {
        id
        name
      }
    }
  }
`

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      title
      description
      status
      priority
      dueDate
      updatedAt
      assignee {
        id
        firstName
        lastName
      }
      project {
        id
        name
      }
    }
  }
`

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`

// ============================================
// POLICIES MUTATIONS
// ============================================
export const MARK_POLICY_AS_READ = gql`
  mutation MarkPolicyAsRead($policyId: ID!) {
    markPolicyAsRead(policyId: $policyId) {
      id
      readAt
      acknowledged
      user {
        id
        username
      }
      policy {
        id
        title
      }
    }
  }
`

export const ACKNOWLEDGE_POLICY = gql`
  mutation AcknowledgePolicy($policyId: ID!) {
    acknowledgPolicy(policyId: $policyId) {
      id
      readAt
      acknowledged
      user {
        id
        username
      }
      policy {
        id
        title
      }
    }
  }
`

// ============================================
// UPDATE PROFILE MUTATION
// ============================================
export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      email
      username
      firstName
      lastName
      role
      avatar
      department
      position
    }
  }
`

