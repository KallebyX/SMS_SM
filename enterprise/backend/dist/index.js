"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const apollo_server_express_1 = require("apollo-server-express");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const client_1 = require("@prisma/client");
const index_js_1 = require("./config/index.js");
const logger_js_1 = require("./utils/logger.js");
const typeDefs_js_1 = require("./graphql/typeDefs.js");
const resolvers_js_1 = require("./graphql/resolvers.js");
const context_js_1 = require("./graphql/context.js");
const socket_service_js_1 = require("./services/socket.service.js");
const auth_middleware_js_1 = require("./middleware/auth.middleware.js");
const auth_service_js_1 = require("./services/auth.service.js");
// Initialize Prisma
const prisma = new client_1.PrismaClient();
class SMSEnterpriseServer {
    constructor() {
        this.dbConnected = false;
        this.app = (0, express_1.default)();
        this.server = (0, http_1.createServer)(this.app);
        this.setupMiddleware();
        this.setupRoutes();
        this.setupApollo();
        this.setupSocket();
    }
    setupMiddleware() {
        // Trust proxy for rate limiting
        this.app.set('trust proxy', 1);
        // Security middleware
        this.app.use((0, helmet_1.default)({
            contentSecurityPolicy: false,
            crossOriginEmbedderPolicy: false
        }));
        // CORS - Permitir qualquer origem em desenvolvimento
        this.app.use((0, cors_1.default)({
            origin: (origin, callback) => {
                // Em desenvolvimento, permitir qualquer origem
                if (index_js_1.config.NODE_ENV === 'development') {
                    callback(null, true);
                    return;
                }
                // Em produção, verificar origem
                if (!origin || index_js_1.config.CORS_ORIGINS.includes(origin)) {
                    callback(null, true);
                }
                else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));
        // Compression
        this.app.use((0, compression_1.default)());
        // Rate limiting
        const limiter = (0, express_rate_limit_1.default)({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 1000, // limit each IP to 1000 requests per windowMs
            message: 'Muitas requisições deste IP, tente novamente em 15 minutos'
        });
        this.app.use(limiter);
        // Body parsing
        this.app.use(express_1.default.json({ limit: '10mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
        // Logging
        this.app.use((req, res, next) => {
            logger_js_1.logger.info(`${req.method} ${req.path}`, {
                ip: req.ip,
                userAgent: req.get('User-Agent')
            });
            next();
        });
    }
    setupRoutes() {
        // Root endpoint
        this.app.get('/', (req, res) => {
            res.json({
                name: 'Maternar Santa Mariense Backend',
                version: '2.0.0',
                status: 'running',
                endpoints: {
                    health: '/health',
                    api: '/api',
                    graphql: '/graphql',
                    auth: '/api/auth'
                },
                documentation: index_js_1.config.NODE_ENV === 'development' ? '/graphql' : null
            });
        });
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'ok',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                environment: index_js_1.config.NODE_ENV
            });
        });
        // API Info
        this.app.get('/api', (req, res) => {
            res.json({
                name: 'Maternar Santa Mariense Backend',
                version: '2.0.0',
                graphql: '/graphql',
                playground: index_js_1.config.NODE_ENV === 'development' ? '/graphql' : null
            });
        });
        // Auth routes
        this.app.post('/api/auth/login', async (req, res) => {
            try {
                const result = await auth_service_js_1.authService.login(req.body);
                res.json(result);
            }
            catch (error) {
                logger_js_1.logger.error('Login failed:', error);
                res.status(401).json({ error: error.message });
            }
        });
        this.app.post('/api/auth/register', async (req, res) => {
            try {
                const result = await auth_service_js_1.authService.register(req.body);
                res.json(result);
            }
            catch (error) {
                logger_js_1.logger.error('Registration failed:', error);
                res.status(400).json({ error: error.message });
            }
        });
        this.app.post('/api/auth/logout', auth_middleware_js_1.authMiddleware, async (req, res) => {
            try {
                await auth_service_js_1.authService.logout(req.user.userId);
                res.json({ success: true });
            }
            catch (error) {
                logger_js_1.logger.error('Logout failed:', error);
                res.status(500).json({ error: error.message });
            }
        });
        this.app.get('/api/auth/me', auth_middleware_js_1.authMiddleware, async (req, res) => {
            try {
                const user = await auth_service_js_1.authService.getUserById(req.user.userId);
                res.json(user);
            }
            catch (error) {
                logger_js_1.logger.error('Get user failed:', error);
                res.status(404).json({ error: error.message });
            }
        });
        // 404 handler
        this.app.use('*', (req, res) => {
            res.status(404).json({
                error: 'Endpoint não encontrado',
                path: req.originalUrl
            });
        });
    }
    async setupApollo() {
        this.apolloServer = new apollo_server_express_1.ApolloServer({
            typeDefs: typeDefs_js_1.typeDefs,
            resolvers: resolvers_js_1.resolvers,
            context: context_js_1.createContext,
            introspection: index_js_1.config.NODE_ENV === 'development',
            formatError: (error) => {
                logger_js_1.logger.error('GraphQL Error:', error);
                return error;
            }
        });
        await this.apolloServer.start();
        this.apolloServer.applyMiddleware({
            app: this.app,
            path: '/graphql',
            cors: false // Already handled by express cors
        });
    }
    setupSocket() {
        this.socketService = new socket_service_js_1.SocketService(this.server);
    }
    async start() {
        try {
            // Test database connection - must succeed
            await prisma.$connect();
            this.dbConnected = true;
            logger_js_1.logger.info('✅ Database connected successfully');
            // Start server
            this.server.listen(index_js_1.config.PORT, () => {
                logger_js_1.logger.info(`� Server running on port ${index_js_1.config.PORT}`);
                logger_js_1.logger.info(`� GraphQL endpoint: http://localhost:${index_js_1.config.PORT}/graphql`);
                logger_js_1.logger.info(`� WebSocket server ready`);
                logger_js_1.logger.info(`� Environment: ${index_js_1.config.NODE_ENV}`);
            });
        }
        catch (error) {
            logger_js_1.logger.error('Failed to start server:', error);
            process.exit(1);
        }
    }
    async stop() {
        try {
            await this.apolloServer.stop();
            await prisma.$disconnect();
            this.server.close();
            logger_js_1.logger.info('Server stopped gracefully');
        }
        catch (error) {
            logger_js_1.logger.error('Error stopping server:', error);
        }
    }
    getSocketService() {
        return this.socketService;
    }
}
// Start server
const server = new SMSEnterpriseServer();
server.start();
// Graceful shutdown
process.on('SIGTERM', async () => {
    logger_js_1.logger.info('SIGTERM received, shutting down gracefully');
    await server.stop();
    process.exit(0);
});
process.on('SIGINT', async () => {
    logger_js_1.logger.info('SIGINT received, shutting down gracefully');
    await server.stop();
    process.exit(0);
});
exports.default = server;
