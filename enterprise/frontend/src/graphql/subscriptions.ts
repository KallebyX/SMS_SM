import { gql } from '@apollo/client'

// ============================================
// CHAT SUBSCRIPTIONS
// ============================================
export const MESSAGE_ADDED = gql`
  subscription MessageAdded($channelId: ID!) {
    messageAdded(channelId: $channelId) {
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

// ============================================
// USER STATUS SUBSCRIPTIONS
// ============================================
export const USER_ONLINE_STATUS = gql`
  subscription UserOnlineStatus {
    userOnlineStatus {
      id
      username
      isOnline
      lastActive
    }
  }
`

// ============================================
// PROJECTS SUBSCRIPTIONS
// ============================================
export const TASK_UPDATED = gql`
  subscription TaskUpdated($projectId: ID!) {
    taskUpdated(projectId: $projectId) {
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
        avatar
      }
    }
  }
`

