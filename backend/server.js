const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

// ✅ Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ CORS Configuration
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// ✅ Request Logging Middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

// ✅ Import Routes
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

// ✅ Load Routes with Error Handling
try {
    app.use('/api/admin', adminRoutes);
    console.log('✅ Admin routes loaded');
} catch (error) {
    console.log('❌ Error loading admin routes:', error.message);
}

try {
    app.use('/api/auth', authRoutes);
    console.log('✅ Auth routes loaded');
} catch (error) {
    console.log('❌ Error loading auth routes:', error.message);
}

try {
    app.use('/api/doctors', doctorRoutes);
    console.log('✅ Doctor routes loaded');
} catch (error) {
    console.log('❌ Error loading doctor routes:', error.message);
}

try {
    app.use('/api/appointments', appointmentRoutes);
    console.log('✅ Appointment routes loaded');
} catch (error) {
    console.log('❌ Error loading appointment routes:', error.message);
}

// ✅ Root Route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Patient-Doctor Appointment System API',
        version: '2.0',
        status: 'running',
        timestamp: new Date().toISOString()
    });
});

// ✅ Health Check Route
app.get('/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;

        res.json({
            success: true,
            status: 'healthy',
            database: 'connected',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 'unhealthy',
            database: 'disconnected',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// ✅ Database Info Route
app.get('/db-info', async (req, res) => {
    try {
        const userCount = await prisma.user.count();
        const doctorCount = await prisma.user.count({ where: { role: 'DOCTOR' } });
        const patientCount = await prisma.user.count({ where: { role: 'PATIENT' } });
        const appointmentCount = await prisma.appointment.count();

        res.json({
            success: true,
            database: {
                status: 'connected',
                provider: 'postgresql',
                orm: 'prisma'
            },
            statistics: {
                totalUsers: userCount,
                doctors: doctorCount,
                patients: patientCount,
                appointments: appointmentCount
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Database info error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch database information',
            error: error.message
        });
    }
});

// ✅ Simple 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Endpoint ${req.method} ${req.originalUrl} not found`,
        availableEndpoints: [
            'GET /',
            'GET /health',
            'GET /db-info',
            'POST /api/auth/register',
            'POST /api/auth/login',
            'GET /api/doctors',
            'GET /api/doctors/:id',
            'GET /api/appointments/my-appointments',
            'POST /api/appointments/book'
        ]
    });
});

// ✅ Global Error Handler
app.use((error, req, res, next) => {
    console.error('🚨 Global Error Handler:', error);

    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? {
            stack: error.stack,
            details: error
        } : undefined
    });
});

// ✅ Server Startup
const PORT = process.env.PORT || 4000;

const startServer = async () => {
    try {
        await prisma.$connect();
        console.log('✅ PostgreSQL connected successfully via Prisma');

        app.listen(PORT, () => {
            console.log('\n🚀 ==============================================');
            console.log('   PATIENT-DOCTOR APPOINTMENT SYSTEM API v2.0');
            console.log('  ==============================================');
            console.log(`   📍 Port: ${PORT}`);
            console.log(`   🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`   🔗 URL: http://localhost:${PORT}`);
            console.log('   💾 Database: PostgreSQL + Prisma ORM\n');

            console.log('📋 Available Endpoints:');
            console.log('   GET  /              - Server status');
            console.log('   GET  /health        - Health check + DB status');
            console.log('   GET  /db-info       - Database information');
            console.log('   POST /api/auth/register     - User registration');
            console.log('   POST /api/auth/login        - User login');
            console.log('   GET  /api/doctors           - Get all doctors');
            console.log('   GET  /api/doctors/:id       - Get doctor by ID');
            console.log('   POST /api/appointments/book - Book appointment');
            console.log('   GET  /api/appointments/my-appointments - Get my appointments\n');

            console.log('🔗 Quick Tests:');
            console.log(`   curl http://localhost:${PORT}`);
            console.log(`   curl http://localhost:${PORT}/health`);
            console.log(`   curl http://localhost:${PORT}/db-info\n`);

            console.log('🔧 Development:');
            console.log('   Press Ctrl+C to stop the server');
            console.log('   Server will auto-reload on file changes');
            console.log('   PostgreSQL + Prisma for data persistence\n');
            console.log('==============================================\n');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🔄 Shutting down server gracefully...');
    await prisma.$disconnect();
    console.log('✅ Database disconnected');
    process.exit(0);
});

startServer();

module.exports = app;
