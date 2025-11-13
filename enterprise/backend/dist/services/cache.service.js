"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheService = exports.CacheService = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const index_js_1 = require("../config/index.js");
const redis_config_js_1 = require("../config/redis.config.js");
const logger_js_1 = require("../utils/logger.js");
/**
 * Cache Service para Maternar Santa Mariense
 *
 * Gerencia cache Redis para otimizar performance
 */
class CacheService {
    constructor() {
        this.redis = null;
        this.isConnected = false;
        this.initialize();
    }
    async initialize() {
        try {
            this.redis = new ioredis_1.default(index_js_1.config.REDIS_URL, {
                retryStrategy: (times) => {
                    const delay = Math.min(times * 50, 2000);
                    return delay;
                },
                maxRetriesPerRequest: 3,
                enableReadyCheck: true,
                lazyConnect: true,
            });
            await this.redis.connect();
            this.redis.on('connect', () => {
                this.isConnected = true;
                logger_js_1.logger.info('Redis cache connected successfully');
            });
            this.redis.on('error', (error) => {
                logger_js_1.logger.error('Redis error:', error);
                this.isConnected = false;
            });
            this.redis.on('reconnecting', () => {
                logger_js_1.logger.warn('Redis reconnecting...');
            });
        }
        catch (error) {
            logger_js_1.logger.error('Failed to initialize Redis cache:', error);
            this.redis = null;
            this.isConnected = false;
        }
    }
    /**
     * Get value from cache
     */
    async get(key) {
        if (!this.isConnected || !this.redis) {
            return null;
        }
        try {
            const value = await this.redis.get(key);
            return value ? JSON.parse(value) : null;
        }
        catch (error) {
            logger_js_1.logger.error(`Cache get error for key ${key}:`, error);
            return null;
        }
    }
    /**
     * Set value in cache
     */
    async set(key, value, ttlSeconds) {
        if (!this.isConnected || !this.redis) {
            return false;
        }
        try {
            const serialized = JSON.stringify(value);
            if (ttlSeconds) {
                await this.redis.setex(key, ttlSeconds, serialized);
            }
            else {
                await this.redis.set(key, serialized);
            }
            return true;
        }
        catch (error) {
            logger_js_1.logger.error(`Cache set error for key ${key}:`, error);
            return false;
        }
    }
    /**
     * Delete key from cache
     */
    async delete(key) {
        if (!this.isConnected || !this.redis) {
            return false;
        }
        try {
            await this.redis.del(key);
            return true;
        }
        catch (error) {
            logger_js_1.logger.error(`Cache delete error for key ${key}:`, error);
            return false;
        }
    }
    /**
     * Delete multiple keys
     */
    async deleteMany(keys) {
        if (!this.isConnected || !this.redis || keys.length === 0) {
            return false;
        }
        try {
            await this.redis.del(...keys);
            return true;
        }
        catch (error) {
            logger_js_1.logger.error(`Cache deleteMany error:`, error);
            return false;
        }
    }
    /**
     * Check if key exists
     */
    async exists(key) {
        if (!this.isConnected || !this.redis) {
            return false;
        }
        try {
            const result = await this.redis.exists(key);
            return result === 1;
        }
        catch (error) {
            logger_js_1.logger.error(`Cache exists error for key ${key}:`, error);
            return false;
        }
    }
    /**
     * Increment counter (for rate limiting)
     */
    async increment(key, ttl) {
        if (!this.isConnected || !this.redis) {
            return 0;
        }
        try {
            const value = await this.redis.incr(key);
            if (ttl && value === 1) {
                await this.redis.expire(key, ttl);
            }
            return value;
        }
        catch (error) {
            logger_js_1.logger.error(`Cache increment error for key ${key}:`, error);
            return 0;
        }
    }
    /**
     * Set with pattern (for online users)
     */
    async addToSet(setKey, value) {
        if (!this.isConnected || !this.redis) {
            return false;
        }
        try {
            await this.redis.sadd(setKey, value);
            return true;
        }
        catch (error) {
            logger_js_1.logger.error(`Cache addToSet error:`, error);
            return false;
        }
    }
    /**
     * Remove from set
     */
    async removeFromSet(setKey, value) {
        if (!this.isConnected || !this.redis) {
            return false;
        }
        try {
            await this.redis.srem(setKey, value);
            return true;
        }
        catch (error) {
            logger_js_1.logger.error(`Cache removeFromSet error:`, error);
            return false;
        }
    }
    /**
     * Get all members of a set
     */
    async getSetMembers(setKey) {
        if (!this.isConnected || !this.redis) {
            return [];
        }
        try {
            return await this.redis.smembers(setKey);
        }
        catch (error) {
            logger_js_1.logger.error(`Cache getSetMembers error:`, error);
            return [];
        }
    }
    /**
     * Clear all cache (use with caution)
     */
    async clearAll() {
        if (!this.isConnected || !this.redis) {
            return false;
        }
        try {
            await this.redis.flushdb();
            logger_js_1.logger.warn('All cache cleared');
            return true;
        }
        catch (error) {
            logger_js_1.logger.error('Cache clearAll error:', error);
            return false;
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
            };
        }
        try {
            const info = await this.redis.info('stats');
            const keys = await this.redis.dbsize();
            return {
                connected: true,
                keys,
                info,
            };
        }
        catch (error) {
            logger_js_1.logger.error('Cache getStats error:', error);
            return {
                connected: false,
                keys: 0,
                error: String(error),
            };
        }
    }
    /**
     * Invalidate cache based on action
     */
    async invalidate(action, ...args) {
        const keys = redis_config_js_1.cacheInvalidation[action](...args);
        return await this.deleteMany(keys);
    }
    /**
     * Check connection status
     */
    isConnectedToRedis() {
        return this.isConnected;
    }
    /**
     * Close connection
     */
    async disconnect() {
        if (this.redis) {
            await this.redis.quit();
            this.isConnected = false;
            logger_js_1.logger.info('Redis cache disconnected');
        }
    }
}
exports.CacheService = CacheService;
// Export singleton instance
exports.cacheService = new CacheService();
