"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const index_js_1 = require("../config/index.js");
const logger_js_1 = require("../utils/logger.js");
const prisma = new client_1.PrismaClient();
class AuthService {
    async login(credentials) {
        try {
            const { email, password } = credentials;
            // Find user by email
            const user = await prisma.user.findUnique({
                where: { email },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    password: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    avatar: true,
                    department: true,
                    position: true,
                    totalXP: true,
                    level: true,
                    lastActive: true
                }
            });
            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            // Verify password
            const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
            if (!isValidPassword) {
                throw new Error('Senha incorreta');
            }
            // Update last active
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    lastActive: new Date(),
                    isOnline: true
                }
            });
            // Generate JWT token
            const token = this.generateToken({
                userId: user.id,
                email: user.email,
                role: user.role
            });
            // Return user data without password
            const { password: _, ...userWithoutPassword } = user;
            logger_js_1.logger.info(`User ${user.email} logged in successfully`);
            return {
                token,
                user: userWithoutPassword
            };
        }
        catch (error) {
            logger_js_1.logger.error('Login failed:', error);
            throw error;
        }
    }
    async register(data) {
        try {
            const { email, username, password, firstName, lastName, department, position } = data;
            // Check if user already exists
            const existingUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { email },
                        { username }
                    ]
                }
            });
            if (existingUser) {
                if (existingUser.email === email) {
                    throw new Error('Email já está em uso');
                }
                if (existingUser.username === username) {
                    throw new Error('Nome de usuário já está em uso');
                }
            }
            // Hash password
            const hashedPassword = await bcryptjs_1.default.hash(password, 12);
            // Create user
            const user = await prisma.user.create({
                data: {
                    email,
                    username,
                    password: hashedPassword,
                    firstName,
                    lastName,
                    department,
                    position,
                    role: 'USER'
                },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    avatar: true,
                    department: true,
                    position: true,
                    totalXP: true,
                    level: true,
                    createdAt: true
                }
            });
            // Generate JWT token
            const token = this.generateToken({
                userId: user.id,
                email: user.email,
                role: user.role
            });
            logger_js_1.logger.info(`New user registered: ${user.email}`);
            return {
                token,
                user
            };
        }
        catch (error) {
            logger_js_1.logger.error('Registration failed:', error);
            throw error;
        }
    }
    async logout(userId) {
        try {
            await prisma.user.update({
                where: { id: userId },
                data: { isOnline: false }
            });
            logger_js_1.logger.info(`User ${userId} logged out`);
        }
        catch (error) {
            logger_js_1.logger.error('Logout failed:', error);
            throw error;
        }
    }
    generateToken(payload) {
        return jsonwebtoken_1.default.sign(payload, index_js_1.config.JWT_SECRET, {
            expiresIn: index_js_1.config.JWT_EXPIRES_IN
        });
    }
    verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, index_js_1.config.JWT_SECRET);
        }
        catch (error) {
            throw new Error('Token inválido');
        }
    }
    async getUserById(userId) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    avatar: true,
                    department: true,
                    position: true,
                    totalXP: true,
                    level: true,
                    weeklyXP: true,
                    lastActive: true,
                    isOnline: true,
                    createdAt: true
                }
            });
            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            return user;
        }
        catch (error) {
            logger_js_1.logger.error('Get user by ID failed:', error);
            throw error;
        }
    }
    async refreshToken(oldToken) {
        try {
            const payload = this.verifyToken(oldToken);
            // Verify user still exists
            const user = await this.getUserById(payload.userId);
            // Generate new token
            const newToken = this.generateToken({
                userId: user.id,
                email: user.email,
                role: user.role
            });
            return {
                token: newToken,
                user
            };
        }
        catch (error) {
            logger_js_1.logger.error('Token refresh failed:', error);
            throw error;
        }
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
