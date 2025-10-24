import Redis from 'ioredis'
import { config } from '../config/index.js'
import { redisCacheConfig, getCacheKey, cacheTTL, cacheInvalidation } from '../config/redis.config.js'
import { logger } from '../utils/logger.js'

/**
 * Cache Service para Maternar Santa Mariense
 * 
 * Gerencia cache Redis para otimizar performance
 */
export class CacheService {
  private redis: Redis | null = null
  private isConnected: boolean = false

  constructor() {
    this.initialize()
  }

  private async initialize() {
    try {
      this.redis = new Redis(config.REDIS_URL, {
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000)
          return delay
        },
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        lazyConnect: true,
      })

      await this.redis.connect()

      this.redis.on('connect', () => {
        this.isConnected = true
        logger.info('Redis cache connected successfully')
      })

      this.redis.on('error', (error) => {
        logger.error('Redis error:', error)
        this.isConnected = false
      })

      this.redis.on('reconnecting', () => {
        logger.warn('Redis reconnecting...')
      })

    } catch (error) {
      logger.error('Failed to initialize Redis cache:', error)
      this.redis = null
      this.isConnected = false
    }
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected || !this.redis) {
      return null
    }

    try {
      const value = await this.redis.get(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      logger.error(`Cache get error for key ${key}:`, error)
      return null
    }
  }

  /**
   * Set value in cache
   */
  async set(key: string, value: any, ttlSeconds?: number): Promise<boolean> {
    if (!this.isConnected || !this.redis) {
      return false
    }

    try {
      const serialized = JSON.stringify(value)
      
      if (ttlSeconds) {
        await this.redis.setex(key, ttlSeconds, serialized)
      } else {
        await this.redis.set(key, serialized)
      }
      
      return true
    } catch (error) {
      logger.error(`Cache set error for key ${key}:`, error)
      return false
    }
  }

  /**
   * Delete key from cache
   */
  async delete(key: string): Promise<boolean> {
    if (!this.isConnected || !this.redis) {
      return false
    }

    try {
      await this.redis.del(key)
      return true
    } catch (error) {
      logger.error(`Cache delete error for key ${key}:`, error)
      return false
    }
  }

  /**
   * Delete multiple keys
   */
  async deleteMany(keys: string[]): Promise<boolean> {
    if (!this.isConnected || !this.redis || keys.length === 0) {
      return false
    }

    try {
      await this.redis.del(...keys)
      return true
    } catch (error) {
      logger.error(`Cache deleteMany error:`, error)
      return false
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    if (!this.isConnected || !this.redis) {
      return false
    }

    try {
      const result = await this.redis.exists(key)
      return result === 1
    } catch (error) {
      logger.error(`Cache exists error for key ${key}:`, error)
      return false
    }
  }

  /**
   * Increment counter (for rate limiting)
   */
  async increment(key: string, ttl?: number): Promise<number> {
    if (!this.isConnected || !this.redis) {
      return 0
    }

    try {
      const value = await this.redis.incr(key)
      
      if (ttl && value === 1) {
        await this.redis.expire(key, ttl)
      }
      
      return value
    } catch (error) {
      logger.error(`Cache increment error for key ${key}:`, error)
      return 0
    }
  }

  /**
   * Set with pattern (for online users)
   */
  async addToSet(setKey: string, value: string): Promise<boolean> {
    if (!this.isConnected || !this.redis) {
      return false
    }

    try {
      await this.redis.sadd(setKey, value)
      return true
    } catch (error) {
      logger.error(`Cache addToSet error:`, error)
      return false
    }
  }

  /**
   * Remove from set
   */
  async removeFromSet(setKey: string, value: string): Promise<boolean> {
    if (!this.isConnected || !this.redis) {
      return false
    }

    try {
      await this.redis.srem(setKey, value)
      return true
    } catch (error) {
      logger.error(`Cache removeFromSet error:`, error)
      return false
    }
  }

  /**
   * Get all members of a set
   */
  async getSetMembers(setKey: string): Promise<string[]> {
    if (!this.isConnected || !this.redis) {
      return []
    }

    try {
      return await this.redis.smembers(setKey)
    } catch (error) {
      logger.error(`Cache getSetMembers error:`, error)
      return []
    }
  }

  /**
   * Clear all cache (use with caution)
   */
  async clearAll(): Promise<boolean> {
    if (!this.isConnected || !this.redis) {
      return false
    }

    try {
      await this.redis.flushdb()
      logger.warn('All cache cleared')
      return true
    } catch (error) {
      logger.error('Cache clearAll error:', error)
      return false
    }
  }

  /**
   * Get cache stats
   */
  async getStats() {
    if (!this.isConnected || !this.redis) {
      return {
        connected: false,
        keys: 0,
        memory: '0B',
      }
    }

    try {
      const info = await this.redis.info('stats')
      const keys = await this.redis.dbsize()
      
      return {
        connected: true,
        keys,
        info,
      }
    } catch (error) {
      logger.error('Cache getStats error:', error)
      return {
        connected: false,
        keys: 0,
        error: String(error),
      }
    }
  }

  /**
   * Invalidate cache based on action
   */
  async invalidate(action: keyof typeof cacheInvalidation, ...args: any[]) {
    const keys = cacheInvalidation[action](...args)
    return await this.deleteMany(keys)
  }

  /**
   * Check connection status
   */
  isConnectedToRedis(): boolean {
    return this.isConnected
  }

  /**
   * Close connection
   */
  async disconnect() {
    if (this.redis) {
      await this.redis.quit()
      this.isConnected = false
      logger.info('Redis cache disconnected')
    }
  }
}

// Export singleton instance
export const cacheService = new CacheService()

