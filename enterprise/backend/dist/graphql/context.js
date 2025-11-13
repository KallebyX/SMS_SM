"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = void 0;
const auth_service_js_1 = require("../services/auth.service.js");
const createContext = async ({ req }) => {
    const context = {};
    try {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.startsWith('Bearer ')
                ? authHeader.slice(7)
                : authHeader;
            if (token) {
                // Verify token
                const payload = auth_service_js_1.authService.verifyToken(token);
                context.user = payload;
            }
        }
    }
    catch (error) {
        // For GraphQL context, we don't throw here, just leave user undefined
        // Individual resolvers will check authentication as needed
    }
    return context;
};
exports.createContext = createContext;
