"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const socket_io_1 = require("socket.io");
const auth_service_js_1 = require("../services/auth.service.js");
const logger_js_1 = require("../utils/logger.js");
const index_js_1 = require("../config/index.js");
class SocketService {
    constructor(server) {
        this.connectedUsers = new Map(); // userId -> socketId
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: index_js_1.config.CORS_ORIGINS,
                methods: ["GET", "POST"],
                credentials: true
            }
        });
        this.setupMiddleware();
        this.setupEventHandlers();
    }
    setupMiddleware() {
        // Authentication middleware
        this.io.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
                if (!token) {
                    throw new Error('Token não fornecido');
                }
                // Verify token
                const payload = auth_service_js_1.authService.verifyToken(token);
                socket.userId = payload.userId;
                socket.userEmail = payload.email;
                socket.userRole = payload.role;
                next();
            }
            catch (error) {
                logger_js_1.logger.error('Socket authentication failed:', error);
                next(new Error('Autenticação falhou'));
            }
        });
    }
    setupEventHandlers() {
        this.io.on('connection', (socket) => {
            logger_js_1.logger.info(`User ${socket.userEmail} connected with socket ${socket.id}`);
            // Store user connection
            this.connectedUsers.set(socket.userId, socket.id);
            // Join user to their personal room
            socket.join(`user:${socket.userId}`);
            // Handle joining channels
            socket.on('join-channel', (channelId) => {
                socket.join(`channel:${channelId}`);
                logger_js_1.logger.info(`User ${socket.userId} joined channel ${channelId}`);
            });
            // Handle leaving channels
            socket.on('leave-channel', (channelId) => {
                socket.leave(`channel:${channelId}`);
                logger_js_1.logger.info(`User ${socket.userId} left channel ${channelId}`);
            });
            // Handle joining projects
            socket.on('join-project', (projectId) => {
                socket.join(`project:${projectId}`);
                logger_js_1.logger.info(`User ${socket.userId} joined project ${projectId}`);
            });
            // Handle leaving projects
            socket.on('leave-project', (projectId) => {
                socket.leave(`project:${projectId}`);
                logger_js_1.logger.info(`User ${socket.userId} left project ${projectId}`);
            });
            // Handle typing indicators for chat
            socket.on('typing-start', ({ channelId }) => {
                socket.to(`channel:${channelId}`).emit('user-typing', {
                    userId: socket.userId,
                    userEmail: socket.userEmail,
                    channelId
                });
            });
            socket.on('typing-stop', ({ channelId }) => {
                socket.to(`channel:${channelId}`).emit('user-stopped-typing', {
                    userId: socket.userId,
                    userEmail: socket.userEmail,
                    channelId
                });
            });
            // Handle disconnect
            socket.on('disconnect', (reason) => {
                logger_js_1.logger.info(`User ${socket.userEmail} disconnected: ${reason}`);
                this.connectedUsers.delete(socket.userId);
                // Broadcast user offline status
                this.broadcastUserStatus(socket.userId, false);
            });
            // Broadcast user online status
            this.broadcastUserStatus(socket.userId, true);
        });
    }
    // Public methods for broadcasting events
    broadcastMessage(channelId, message) {
        this.io.to(`channel:${channelId}`).emit('message-added', message);
    }
    broadcastTaskUpdate(projectId, task) {
        this.io.to(`project:${projectId}`).emit('task-updated', task);
    }
    broadcastUserStatus(userId, isOnline) {
        this.io.emit('user-status-changed', {
            userId,
            isOnline,
            timestamp: new Date()
        });
    }
    sendNotificationToUser(userId, notification) {
        this.io.to(`user:${userId}`).emit('notification', notification);
    }
    broadcastEventUpdate(event) {
        this.io.emit('event-updated', event);
    }
    broadcastAchievementUnlocked(userId, achievement) {
        this.io.to(`user:${userId}`).emit('achievement-unlocked', achievement);
    }
    getConnectedUsers() {
        return Array.from(this.connectedUsers.keys());
    }
    isUserConnected(userId) {
        return this.connectedUsers.has(userId);
    }
}
exports.SocketService = SocketService;
