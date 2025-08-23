const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

// Authenticate user and add user info to request
const authUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true
            }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. User not found.'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated.'
            });
        }

        req.user = {
            ...user,
            role: user.role.toLowerCase()
        };
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token.',
            error: error.message
        });
    }
};

// Authorize specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. Authentication required.'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. ${roles.join(' or ')} role required.`
            });
        }

        next();
    };
};

// Check if user is doctor
const authDoctor = async (req, res, next) => {
    try {
        await authUser(req, res, () => {
            if (req.user.role !== 'doctor') {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. Doctor role required.'
                });
            }
            next();
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Authentication failed.',
            error: error.message
        });
    }
};

// Check if user is admin
const authAdmin = async (req, res, next) => {
    try {
        await authUser(req, res, () => {
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. Admin role required.'
                });
            }
            next();
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Authentication failed.',
            error: error.message
        });
    }
};

module.exports = {
    authUser,
    authorize,
    authDoctor,
    authAdmin
};
