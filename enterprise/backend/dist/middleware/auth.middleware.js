"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.requireRole = exports.authMiddleware = void 0;
const auth_service_js_1 = require("../services/auth.service.js");
const logger_js_1 = require("../utils/logger.js");
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                error: 'Token de acesso requerido'
            });
        }
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.slice(7)
            : authHeader;
        if (!token) {
            return res.status(401).json({
                error: 'Token não fornecido'
            });
        }
        // Verify token
        const payload = auth_service_js_1.authService.verifyToken(token);
        // Attach user info to request
        req.user = payload;
        next();
    }
    catch (error) {
        logger_js_1.logger.error('Authentication failed:', error);
        return res.status(401).json({
            error: 'Token inválido ou expirado'
        });
    }
};
exports.authMiddleware = authMiddleware;
const requireRole = (roles) => {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Usuário não autenticado'
            });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Acesso negado - permissões insuficientes'
            });
        }
        next();
    };
};
exports.requireRole = requireRole;
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.startsWith('Bearer ')
                ? authHeader.slice(7)
                : authHeader;
            if (token) {
                // Verify token
                const payload = auth_service_js_1.authService.verifyToken(token);
                req.user = payload;
            }
        }
        next();
    }
    catch (error) {
        // For optional auth, we don't return error, just continue without user
        logger_js_1.logger.warn('Optional auth failed:', error);
        next();
    }
};
exports.optionalAuth = optionalAuth;
