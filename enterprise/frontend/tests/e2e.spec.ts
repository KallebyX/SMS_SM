import { test, expect } from '@playwright/test'

test.describe('SMS-SM Enterprise Platform E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the application
    await page.goto('/')
  })

  test('should display login page for unauthenticated users', async ({ page }) => {
    await expect(page).toHaveTitle(/SMS-SM Enterprise Platform/)
    await expect(page.locator('h1')).toContainText('Login')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('should allow user to login with valid credentials', async ({ page }) => {
    // Fill login form
    await page.fill('input[type="email"]', 'admin@sms-sm.health')
    await page.fill('input[type="password"]', 'AdminPassword123!')
    
    // Click login button
    await page.click('button[type="submit"]')
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.locator('h1')).toContainText('Dashboard')
  })

  test('should navigate between main sections', async ({ page }) => {
    // Login first
    await page.fill('input[type="email"]', 'admin@sms-sm.health')
    await page.fill('input[type="password"]', 'AdminPassword123!')
    await page.click('button[type="submit"]')
    
    // Wait for dashboard to load
    await expect(page).toHaveURL(/\/dashboard/)
    
    // Navigate to Gamification
    await page.click('nav a[href="/gamification"]')
    await expect(page).toHaveURL(/\/gamification/)
    await expect(page.locator('h1')).toContainText('Gamification')
    
    // Navigate to Training
    await page.click('nav a[href="/training"]')
    await expect(page).toHaveURL(/\/training/)
    await expect(page.locator('h1')).toContainText('Training')
    
    // Navigate to Chat
    await page.click('nav a[href="/chat"]')
    await expect(page).toHaveURL(/\/chat/)
    await expect(page.locator('h1')).toContainText('Chat')
    
    // Navigate to Calendar
    await page.click('nav a[href="/calendar"]')
    await expect(page).toHaveURL(/\/calendar/)
    await expect(page.locator('h1')).toContainText('Calendar')
  })

  test('should display user profile information', async ({ page }) => {
    // Login
    await page.fill('input[type="email"]', 'admin@sms-sm.health')
    await page.fill('input[type="password"]', 'AdminPassword123!')
    await page.click('button[type="submit"]')
    
    // Navigate to profile
    await page.click('button[aria-label="User menu"]')
    await page.click('a[href="/profile"]')
    
    await expect(page).toHaveURL(/\/profile/)
    await expect(page.locator('h1')).toContainText('Profile')
    
    // Check profile information is displayed
    await expect(page.locator('[data-testid="user-email"]')).toBeVisible()
    await expect(page.locator('[data-testid="user-name"]')).toBeVisible()
  })

  test('should handle gamification features', async ({ page }) => {
    // Login
    await page.fill('input[type="email"]', 'user@sms-sm.health')
    await page.fill('input[type="password"]', 'UserPassword123!')
    await page.click('button[type="submit"]')
    
    // Navigate to gamification
    await page.click('nav a[href="/gamification"]')
    
    // Check leaderboard is displayed
    await expect(page.locator('[data-testid="leaderboard"]')).toBeVisible()
    
    // Check user XP is displayed
    await expect(page.locator('[data-testid="user-xp"]')).toBeVisible()
    
    // Check ranking is displayed
    await expect(page.locator('[data-testid="user-rank"]')).toBeVisible()
  })

  test('should allow completing a training course', async ({ page }) => {
    // Login
    await page.fill('input[type="email"]', 'user@sms-sm.health')
    await page.fill('input[type="password"]', 'UserPassword123!')
    await page.click('button[type="submit"]')
    
    // Navigate to training
    await page.click('nav a[href="/training"]')
    
    // Click on a course
    await page.click('[data-testid="course-card"]:first-child button')
    
    // Training modal should open
    await expect(page.locator('[data-testid="training-modal"]')).toBeVisible()
    
    // Scroll through content
    await page.locator('[data-testid="training-content"]').scroll({ top: 1000 })
    
    // Wait for completion requirements
    await page.waitForTimeout(5000)
    
    // Complete button should be enabled
    await expect(page.locator('[data-testid="complete-course-btn"]')).toBeEnabled()
    
    // Click complete
    await page.click('[data-testid="complete-course-btn"]')
    
    // Should show success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
  })

  test('should handle chat functionality', async ({ page }) => {
    // Login
    await page.fill('input[type="email"]', 'user@sms-sm.health')
    await page.fill('input[type="password"]', 'UserPassword123!')
    await page.click('button[type="submit"]')
    
    // Navigate to chat
    await page.click('nav a[href="/chat"]')
    
    // Send a message
    const message = 'Hello, this is a test message!'
    await page.fill('[data-testid="chat-input"]', message)
    await page.click('[data-testid="send-message-btn"]')
    
    // Message should appear in chat
    await expect(page.locator('[data-testid="chat-messages"]')).toContainText(message)
    
    // Input should be cleared
    await expect(page.locator('[data-testid="chat-input"]')).toHaveValue('')
  })

  test('should manage calendar events', async ({ page }) => {
    // Login
    await page.fill('input[type="email"]', 'user@sms-sm.health')
    await page.fill('input[type="password"]', 'UserPassword123!')
    await page.click('button[type="submit"]')
    
    // Navigate to calendar
    await page.click('nav a[href="/calendar"]')
    
    // Add new event
    await page.fill('[data-testid="event-title"]', 'Test Meeting')
    await page.fill('[data-testid="event-date"]', '2025-12-25')
    await page.fill('[data-testid="event-time"]', '14:00')
    await page.click('[data-testid="add-event-btn"]')
    
    // Event should appear in the list
    await expect(page.locator('[data-testid="event-list"]')).toContainText('Test Meeting')
    
    // Should be able to delete event
    await page.click('[data-testid="delete-event-btn"]:first-child')
    
    // Confirm deletion
    await page.click('button:has-text("Yes")')
    
    // Event should be removed
    await expect(page.locator('[data-testid="event-list"]')).not.toContainText('Test Meeting')
  })

  test('should handle project management', async ({ page }) => {
    // Login
    await page.fill('input[type="email"]', 'user@sms-sm.health')
    await page.fill('input[type="password"]', 'UserPassword123!')
    await page.click('button[type="submit"]')
    
    // Navigate to projects
    await page.click('nav a[href="/projects"]')
    
    // Add new task
    const taskDescription = 'Complete project documentation'
    await page.fill('[data-testid="task-input"]', taskDescription)
    await page.click('[data-testid="add-task-btn"]')
    
    // Task should appear in To Do column
    await expect(page.locator('[data-testid="todo-column"]')).toContainText(taskDescription)
    
    // Drag task to In Progress (simulate drag and drop)
    const task = page.locator(`[data-testid="task-card"]:has-text("${taskDescription}")`)
    const inProgressColumn = page.locator('[data-testid="inprogress-column"]')
    
    await task.dragTo(inProgressColumn)
    
    // Task should now be in In Progress column
    await expect(inProgressColumn).toContainText(taskDescription)
  })

  test('should display policies and links', async ({ page }) => {
    // Login
    await page.fill('input[type="email"]', 'admin@sms-sm.health')
    await page.fill('input[type="password"]', 'AdminPassword123!')
    await page.click('button[type="submit"]')
    
    // Navigate to policies
    await page.click('nav a[href="/policies"]')
    
    // Should display policy list
    await expect(page.locator('[data-testid="policy-list"]')).toBeVisible()
    await expect(page.locator('[data-testid="policy-list"]')).toContainText('Política Nacional de Atenção Básica')
    
    // Navigate to links
    await page.click('nav a[href="/links"]')
    
    // Should display external links
    await expect(page.locator('[data-testid="links-list"]')).toBeVisible()
    await expect(page.locator('[data-testid="links-list"]')).toContainText('e-SUS AB')
  })

  test('should handle responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Login
    await page.fill('input[type="email"]', 'user@sms-sm.health')
    await page.fill('input[type="password"]', 'UserPassword123!')
    await page.click('button[type="submit"]')
    
    // Mobile menu should be visible
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible()
    
    // Click mobile menu
    await page.click('[data-testid="mobile-menu-button"]')
    
    // Navigation should be visible
    await expect(page.locator('[data-testid="mobile-navigation"]')).toBeVisible()
    
    // Should be able to navigate
    await page.click('[data-testid="mobile-nav-gamification"]')
    await expect(page).toHaveURL(/\/gamification/)
  })

  test('should handle dark mode toggle', async ({ page }) => {
    // Login
    await page.fill('input[type="email"]', 'user@sms-sm.health')
    await page.fill('input[type="password"]', 'UserPassword123!')
    await page.click('button[type="submit"]')
    
    // Toggle dark mode
    await page.click('[data-testid="theme-toggle"]')
    
    // Check if dark mode is applied
    await expect(page.locator('html')).toHaveClass(/dark/)
    
    // Toggle back to light mode
    await page.click('[data-testid="theme-toggle"]')
    
    // Check if light mode is applied
    await expect(page.locator('html')).not.toHaveClass(/dark/)
  })

  test('should handle language switching', async ({ page }) => {
    // Login
    await page.fill('input[type="email"]', 'user@sms-sm.health')
    await page.fill('input[type="password"]', 'UserPassword123!')
    await page.click('button[type="submit"]')
    
    // Open language selector
    await page.click('[data-testid="language-selector"]')
    
    // Select Portuguese
    await page.click('[data-testid="lang-pt-BR"]')
    
    // Check if content is in Portuguese
    await expect(page.locator('h1')).toContainText('Painel')
    
    // Switch back to English
    await page.click('[data-testid="language-selector"]')
    await page.click('[data-testid="lang-en-US"]')
    
    // Check if content is in English
    await expect(page.locator('h1')).toContainText('Dashboard')
  })
})